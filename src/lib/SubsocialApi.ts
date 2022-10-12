import { SubsocialApi, generateCrustAuthToken } from "@subsocial/api";

import { cryptoWaitReady } from "@polkadot/util-crypto";

const initializeApi = async (mnemonic: string) => {
  const authHeader = generateCrustAuthToken(mnemonic);

  await cryptoWaitReady();

  const api = await SubsocialApi.create({
    substrateNodeUrl: "wss://rco-para.subsocial.network",
    ipfsNodeUrl: "https://crustwebsites.net",
    offchainUrl: "http://127.0.0.1:3001",
  });

  api.ipfs.setWriteHeaders({
    authorization: "Basic " + authHeader,
  });

  return api;
};

export default initializeApi;
