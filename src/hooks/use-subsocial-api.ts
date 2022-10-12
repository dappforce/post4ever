import initializeApi from "src/lib/SubsocialApi";
import type { SubsocialApi } from "@subsocial/api";
import { useState } from "react";
import { IpfsContent } from "@subsocial/api/substrate/wrappers";
import { Keyring } from "@polkadot/keyring";
import { waitReady } from "@polkadot/wasm-crypto";

export const useSubSocialApiHook = () => {
  const [subsocialApi, setSubsocialApi] = useState<SubsocialApi | null>(null);

  const initApi = async (mnemonic: string): Promise<void> => {
    const api = await initializeApi(mnemonic);
    setSubsocialApi(api);
  };

  //TODO: need to add postContent payload
  const postTransaction = async (mnemonic: string) => {
    const keyring = new Keyring({ type: "sr25519" });
    const pair = keyring.addFromMnemonic(mnemonic);
    const spaceId = "9960";

    const ipfs = subsocialApi?.subsocial.ipfs;

    try {
      await waitReady();

      let cid = await ipfs?.saveContent({
        about:
          "Subsocial is an open protocol for decentralized social networks and marketplaces. It`s built with Substrate and IPFS",
        image: "Qmasp4JHhQWPkEpXLHFhMAQieAH1wtfVRNHWZ5snhfFeBe", // ipfsImageCid = await api.subsocial.ipfs.saveFile(file)
        name: "Subsocial",
        tags: ["subsocial"],
      });

      const substrateApi = await subsocialApi?.substrateApi;

      //Then we createPost
      //TODO: needs to be populated with postContent above
      cid = await ipfs?.saveContent({
        title: "What is Subsocial?",
        image: null,
        tags: ["Hello world", "FAQ"],
        body: "Subsocial is an open protocol for decentralized social networks and marketplaces. It`s built with Substrate and IPFS.",
      });

      const postTx = substrateApi?.tx.posts.createPost(
        spaceId,
        { RegularPost: null },
        IpfsContent(cid)
      );

      postTx?.signAndSend(pair, async (result) => {
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
