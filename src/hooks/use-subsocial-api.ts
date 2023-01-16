import initializeApi from "src/lib/SubsocialApi";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import type { SubsocialApi } from "@subsocial/api";
import { bnsToIds, idToBn } from "@subsocial/utils";
import type { SpaceData } from "@subsocial/api/types";
import type { Signer } from "@polkadot/api/types";
import { SubmittableExtrinsic } from "@polkadot/api/promise/types";
import { getNewIdsFromEvent } from "@subsocial/api/utils";

import { useState } from "react";
import { IpfsContent } from "@subsocial/api/substrate/wrappers";
import toast from "react-hot-toast";

import {
  PostTransactionProps,
  CreateSpaceProps,
  CreatePostWithSpaceIdProps,
  SuccessPayloadProps,
} from "./subsocial-api.types";

import { TweetUserProps, TweetWithAuthorProps } from "src/types/common";
import { SubmittableResult } from "@polkadot/api";
import { parseTextToMarkdown } from "src/utils/string";
import { TWITTER_URL } from "src/configs/urls";

type SavePostContentProps = {
  author: TweetUserProps;
  content: TweetWithAuthorProps;
  subsocialApi: SubsocialApi;
};

type SuccessCallback = (props: SuccessPayloadProps) => void;

type SendSignedTxProps = {
  extrinsic: SubmittableExtrinsic;
  address: string;
  signer: Signer | undefined;
  toastId: string;
  spaceId?: string;
  successCallback?: SuccessCallback;
};

type SpaceId = string;

export const useSubSocialApiHook = () => {
  const [subsocialApi, setSubsocialApi] = useState<SubsocialApi | null>(null);
  const [spaces, setSpaces] = useState<SpaceData[] | null>(null);
  const [loadingSpaces, setLoadingSpaces] = useState(false);
  const [loadingCreatePost, setLoadingCreatePost] = useState(false);

  // Needed for confirmation after tx submitted
  const [successTx, setSuccessTx] = useState<string | null>(null);

  const initApi = async (): Promise<void> => {
    const api = await initializeApi();
    setSubsocialApi(api);
  };

  const savePostContent = async ({ author, content, subsocialApi }: SavePostContentProps) => {
    try {
      const mdContent = parseTextToMarkdown(content.text);

      const contentPayload = {
        body: mdContent,
        tweet: `${TWITTER_URL}/${author.username}/status/${content.id}`,
        ...(content.media && { image: content.media[0].url }),
      };

      const cid = await subsocialApi.ipfs.saveContentToOffchain(contentPayload);

      return cid;
    } catch (error) {
      console.warn({ error });
    }
  };

  const onSuccessCallback = async (
    result: SubmittableResult,
    toastId: string,
    successCallback?: any,
    spaceId?: string,
  ) => {
    const { status } = result;

    if (!result || !status) {
      return;
    }

    if (status.isFinalized || status.isInBlock) {
      const blockHash = status.isFinalized ? status.asFinalized : status.asInBlock;

      setLoadingCreatePost(false);
      setSuccessTx(blockHash.toString());
      console.log(`✅ Tx finalized. Block hash: ${blockHash.toString()}`);

      const ids = getNewIdsFromEvent(result);
      const postId = bnsToIds(ids)[0];

      spaceId &&
        successCallback &&
        successCallback({
          postId,
          spaceId,
        });
    } else if (result.isError) {
      console.log(JSON.stringify(result));
    } else {
      console.log(`⏱ Current tx status: ${status.type}`);
      toast(`⏱ Current tx status: ${status.type}`, {
        id: toastId,
      });
    }
  };

  const sendSignedTx = async ({
    extrinsic,
    address,
    signer,
    toastId,
    spaceId,
    successCallback,
  }: SendSignedTxProps) => {
    if (!signer) throw new Error("No signer provided");

    try {
      const tx = await extrinsic.signAsync(address, { signer });
      const unsub = await tx.send(result =>
        onSuccessCallback(result, toastId, successCallback, spaceId),
      );
    } catch (error) {
      if (error instanceof Error && error.message === "Cancelled") {
        toast("Cancelled!", {
          id: toastId,
        });
        setLoadingCreatePost(false);
      }
      console.warn({ error });
    }
  };

  const createSpaceWithTweet = async ({ account, content }: CreateSpaceProps) => {
    setLoadingCreatePost(true);

    const toastId = toast("Loading...");

    try {
      const { web3Enable, web3FromSource } = await import("@polkadot/extension-dapp");

      const extensions = await web3Enable("EverPost dapp");

      const injector = await web3FromSource(account.meta.source);

      const author = content.users?.find(user => user.id === content.author_id);

      if (!extensions || !subsocialApi || !author) return null;

      const cid = await savePostContent({ author, content, subsocialApi });

      const substrateApi = await subsocialApi.blockchain.api;

      if (!substrateApi) return new Error("Error when calling substrateApi");

      const extrinsic = substrateApi.tx.spaces.createSpace(IpfsContent(cid), null);

      sendSignedTx({
        extrinsic,
        address: account.address,
        signer: injector.signer,
        toastId,
      });
    } catch (error) {
      console.warn({ error });
    }
  };

  const checkSpacesWithMyPermissions = async (myAddress: string) => {
    try {
      const subsocialApi = await initializeApi();

      if (!subsocialApi) return null;

      const spaceIds: SpaceId[] =
        (await subsocialApi.blockchain.getSpaceIdsWithRolesByAccount(myAddress)) || [];

      const promises = spaceIds.map(async spaceId => {
        const permissions =
          (await subsocialApi.blockchain.getSpacePermissionsByAccount(
            myAddress,
            idToBn(spaceId),
          )) || [];

        return {
          spaceId,
          permissions,
        };
      });

      return Promise.all(promises);
    } catch (error) {
      console.warn({ error });
    }
  };

  const checkSpaceOwnedBy = async (account: InjectedAccountWithMeta) => {
    setLoadingSpaces(true);

    try {
      const subsocialApi = await initializeApi();

      const spacesWithMyPermissions = await checkSpacesWithMyPermissions(account.address);

      if (!subsocialApi) return null;

      const editableSpaceIds = spacesWithMyPermissions?.map(space => space.spaceId);
      const myOwnSpaceIds = await subsocialApi.blockchain.spaceIdsByOwner(account.address);

      if (!myOwnSpaceIds && !editableSpaceIds) return null;

      const convertedAllSpaceIds = [...bnsToIds(myOwnSpaceIds), ...(editableSpaceIds || [])];

      const spaces = await subsocialApi.findPublicSpaces(convertedAllSpaceIds);
      if (spaces) {
        setSpaces(spaces);
      }

      if (spaces && !spaces.length) {
        setSpaces(null);
      }
    } catch (error) {
      console.warn({ error });
    } finally {
      setLoadingSpaces(false);
    }
  };

  const createPostWithSpaceId = async ({
    content,
    spaceId,
    account,
    successCallback,
  }: CreatePostWithSpaceIdProps) => {
    const toastId = toast("Loading...");

    setLoadingCreatePost(true);

    try {
      const { web3Enable, web3FromSource } = await import("@polkadot/extension-dapp");

      const extensions = await web3Enable("EverPost dapp");

      const subsocialApi = await initializeApi();

      const injector = await web3FromSource(account.meta.source);

      const author = content.users?.find(user => user.id === content.author_id);

      if (!extensions || !subsocialApi || !author) return null;

      const cid = await savePostContent({ author, content, subsocialApi });

      const substrateApi = await subsocialApi.blockchain.api;

      if (!substrateApi) return new Error("Error when calling substrateApi");

      const extrinsic = substrateApi.tx.posts.createPost(
        spaceId,
        { RegularPost: null },
        IpfsContent(cid),
      );

      sendSignedTx({
        extrinsic,
        address: account.address,
        signer: injector.signer,
        spaceId,
        toastId,
        successCallback,
      });
    } catch (error) {
      console.warn({ error });
    }
  };

  const postTransaction = async ({ savedPosts, account }: PostTransactionProps) => {
    setLoadingCreatePost(true);

    const toastId = toast("Loading...");
    try {
      const { web3Enable, web3FromSource } = await import("@polkadot/extension-dapp");

      const extensions = await web3Enable("EverPost dapp");

      const injector = await web3FromSource(account.meta.source);

      //Use already made space by current pair
      const spaceId = "1018";

      // only one author because of own tweets
      const savedPost = savedPosts[0];
      const author = savedPost.users?.find(user => user.id === savedPost.author_id);

      if (!extensions || !subsocialApi || !author) return null;

      const substrateApi = await subsocialApi.blockchain.api;

      if (!substrateApi) return new Error("Error when calling substrateApi");

      if (savedPosts.length === 1) {
        // Send only one post
        const singlePostCid = await savePostContent({ author, content: savedPost, subsocialApi });

        const extrinsic = substrateApi.tx.posts.createPost(
          spaceId,
          { RegularPost: null },
          IpfsContent(singlePostCid),
        );

        sendSignedTx({
          extrinsic,
          address: account.address,
          signer: injector.signer,
          toastId,
        });
      } else {
        //Init creating batchTx for posts
        let result: any[] = [];

        for (const savedPost of savedPosts) {
          const batchCid = await savePostContent({ author, content: savedPost, subsocialApi });
          result.push([spaceId, { RegularPost: null }, IpfsContent(batchCid)]);
        }

        const submittablePosts: any[] = [];

        for (const element of result) {
          const [spaceId, regularPost, content] = element;
          const tx = substrateApi.tx.posts.createPost(spaceId, regularPost, content);
          submittablePosts.push(tx);
        }

        const extrinsic = substrateApi.tx.utility.batch(submittablePosts);

        if (!extrinsic) throw new Error("batchTx creation error!");

        sendSignedTx({
          extrinsic,
          address: account.address,
          signer: injector.signer,
          toastId,
        });
      }
    } catch (err) {
      console.warn({ err });
    }
  };

  return {
    subsocialApi,
    initApi,
    createSpaceWithTweet,
    createPostWithSpaceId,
    successTx,
    spaces,
    loadingSpaces,
    loadingCreatePost,
    checkSpaceOwnedBy,
    postTransaction,
  };
};
