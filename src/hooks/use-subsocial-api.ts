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

type InitApiProps = {
  mnemonic?: string;
};

export const useSubSocialApiHook = () => {
  const [subsocialApi, setSubsocialApi] = useState<SubsocialApi | null>(null);
  const [loading, setLoading] = useState(false);

  const initApi = async ({ mnemonic }: InitApiProps): Promise<void> => {
    if (mnemonic) {
      const api = await initializeApi(mnemonic);
      setSubsocialApi(api);
    } else {
      //TODO: initApi using wallet
    }
  };

  const postTransaction = async ({
    savedPosts,
    mnemonic,
  }: PostTransactionProps) => {
    setLoading(true);
    try {
      await cryptoWaitReady();

      const keyring = new Keyring({ type: "sr25519" });
      const pair = keyring.addFromMnemonic(mnemonic);

      //Use already made space by current pair
      const spaceId = "9960";

      const ipfs = subsocialApi?.subsocial.ipfs;

      //if (!subsocialApi) throw new Error("No subsocialApi instantiated!");

      const substrateApi = await subsocialApi?.blockchain.api;

      if (!substrateApi) return new Error("Error when calling substrateApi");

      if (!ipfs) return new Error("IPFS instance not ready!");

      if (savedPosts.length === 1) {
        //Init creating single post tx
        const singlePostCid = await ipfs.saveContent({
          title: "My exported tweet",
          image: null,
          tags: ["exported tweet", "perma-tweet"],
          body: savedPosts[0].text,
          //TODO: add tweet link as canonical
        });

        const postTx = substrateApi.tx.posts.createPost(
          spaceId,
          { RegularPost: null },
          IpfsContent(singlePostCid)
        );

        postTx.signAndSend(pair, async (result) => {
          const { status } = result;

          if (!result || !status) {
            return;
          }

          if (status.isFinalized || status.isInBlock) {
            const blockHash = status.isFinalized
              ? status.asFinalized
              : status.asInBlock;

            console.log(
              `✅ singleCreatePostTx finalized. Block hash: ${blockHash.toString()}`
            );
          } else if (result.isError) {
            console.log(JSON.stringify(result));
          } else {
            console.log(`⏱ Current tx status: ${status.type}`);
          }
        });
      } else {
        //Init creating batchTx for posts
        let result: any[] = [];

        for (const savedPost of savedPosts) {
          const cid = await ipfs.saveContent({
            title: "My exported tweets",
            //TODO: able to add image
            image: null,
            tags: ["exported tweet", "perma-tweet"],
            body: savedPost.text,
          });
          result.push([spaceId, { RegularPost: null }, IpfsContent(cid)]);
        }

        const submittablePosts: any[] = [];

        for (const element of result) {
          const [spaceId, regularPost, content] = element;
          const tx = substrateApi.tx.posts.createPost(
            spaceId,
            regularPost,
            content
          );
          submittablePosts.push(tx);
        }

        const batchTx = substrateApi.tx.utility.batch(submittablePosts);

        if (!batchTx) throw new Error("batchTx creation error!");

        batchTx.signAndSend(pair, async (result) => {
          const { status } = result;

          if (!result || !status) {
            return;
          }

          if (status.isFinalized || status.isInBlock) {
            const blockHash = status.isFinalized
              ? status.asFinalized
              : status.asInBlock;

            console.log(
              `✅ batchCreatePostTx finalized. Block hash: ${blockHash.toString()}`
            );
          } else if (result.isError) {
            console.log(JSON.stringify(result));
          } else {
            console.log(`⏱ Current tx status: ${status.type}`);
          }
        });
      }
    } catch (err) {
      console.log({ err });
    } finally {
      setLoading(false);
    }
  };

  return {
    subsocialApi,
    loading,
    initApi,
    postTransaction,
  };
};
