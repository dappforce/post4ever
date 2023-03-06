import { SubsocialApi } from "@subsocial/api";
import { networkConfig, CRUST_TEST_AUTH_HEADER } from "src/configs/sdk-network-config";

let cachedApi: Promise<SubsocialApi> | undefined = undefined;
const initializeApi = async () => {
  if (cachedApi) return cachedApi;
  const api = await SubsocialApi.create(networkConfig);

  api.ipfs.setWriteHeaders({
    authorization: "Basic " + CRUST_TEST_AUTH_HEADER,
  });

  cachedApi = Promise.resolve(api);

  return api;
};

export default initializeApi;
