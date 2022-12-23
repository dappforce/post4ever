import { SubsocialApi } from "@subsocial/api";
import { mainnetConfig, CRUST_TEST_AUTH_HEADER } from "src/configs/sdk-network-config";

const initializeApi = async () => {
  const api = await SubsocialApi.create(mainnetConfig);

  api.ipfs.setWriteHeaders({
    authorization: "Basic " + CRUST_TEST_AUTH_HEADER,
  });

  return api;
};

export default initializeApi;
