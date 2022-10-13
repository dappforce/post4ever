import initializeApi from "src/lib/SubsocialApi";
import type { SubsocialApi } from "@subsocial/api";

import { useState } from "react";
import { IpfsContent } from "@subsocial/api/substrate/wrappers";
import { Keyring } from "@polkadot/keyring";
import { cryptoWaitReady } from "@polkadot/util-crypto";
import { PostProps } from "src/types/common";

type PostTransactionProps = {
  savedPosts: PostProps[];
  mnemonic: string;
};

export const useSubSocialApiHook = () => {
  const [subsocialApi, setSubsocialApi] = useState<SubsocialApi | null>(null);

  const initApi = async (mnemonic: string): Promise<void> => {
    const api = await initializeApi(mnemonic);
    setSubsocialApi(api);
  };

  const postTransaction = async ({
    savedPosts,
    mnemonic,
  }: PostTransactionProps) => {
    try {
      await cryptoWaitReady();

      const keyring = new Keyring({ type: "sr25519" });
      const pair = keyring.addFromMnemonic(mnemonic);

      //Use already made space by current pair
      const spaceId = "9960";

      const ipfs = subsocialApi?.subsocial.ipfs;

      const substrateApi = await subsocialApi?.substrateApi;

      if (!substrateApi) return new Error("Error when calling substrateApi");

      //Init creating batchTx for posts
      let result: any[] = [];

      savedPosts.forEach(async (savedPost) => {
        const cid = await ipfs?.saveContent({
          title: "My exported tweets",
          //TODO: able to add image
          image: null,
          tags: ["exported tweet", "perma-tweet"],
          body: savedPost.text,
        });
        result.push([spaceId, { RegularPost: null }, IpfsContent(cid)]);
      });

      const submittablePosts = result.map((args) =>
        // @ts-ignore
        substrateApi.tx.posts.createPost(...args)
      );
      const batchTx = substrateApi.tx.utility.batch(submittablePosts);

      batchTx?.signAndSend(pair, async (result) => {
        const { status } = result;

        if (!result || !status) {
          return;
        }

        if (status.isFinalized || status.isInBlock) {
          const blockHash = status.isFinalized
            ? status.asFinalized
            : status.asInBlock;

          console.log(
            `✅ createPostTx finalized. Block hash: ${blockHash.toString()}`
          );
        } else if (result.isError) {
          console.log(JSON.stringify(result));
        } else {
          console.log(`⏱ Current tx status: ${status.type}`);
        }
      });
    } catch (err) {
      console.log({ err });
    }
  };

  return {
    subsocialApi,
    initApi,
    postTransaction,
  };
};
