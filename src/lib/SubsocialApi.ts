import { SubsocialApi, generateCrustAuthToken } from "@subsocial/api";

const initializeApi = async (mnemonic: string) => {
  //const authHeader = generateCrustAuthToken(mnemonic);
  const authHeader = process.env.NEXT_PUBLIC_AUTH_HEADER;

  const mainnetConfig = {
    substrateNodeUrl: "wss://para.f3joule.space",
    ipfsNodeUrl: "https://gw.crustfiles.app",
  };

  const testnetConfig = {
    substrateNodeUrl: "wss://rco-para.subsocial.network",
    ipfsNodeUrl: "https://crustwebsites.net",
  };

  const api = await SubsocialApi.create(mainnetConfig);

  api.ipfs.setWriteHeaders({
    authorization: "Basic " + authHeader,
  });

  return api;
};

export default initializeApi;
