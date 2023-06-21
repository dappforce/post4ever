// SPDX-License-Identifier: GPL-3.0-or-later.
// Copyright (C) 2022-2023 DAPPFORCE PTE. LTD., aleksandr.siman@gmail.com.
// Full Notice is available in the root folder.

import { SubsocialApi } from "@subsocial/api";
import { networkConfig, CRUST_TEST_AUTH_HEADER } from "src/configs/sdk-network-config";

const initializeApi = async () => {
  const api = await SubsocialApi.create(networkConfig);

  api.ipfs.setWriteHeaders({
    authorization: "Basic " + CRUST_TEST_AUTH_HEADER,
  });

  return api;
};

export default initializeApi;
