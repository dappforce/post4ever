// SPDX-License-Identifier: GPL-3.0-or-later.
// Copyright (C) 2022-2023 DAPPFORCE PTE. LTD., aleksandr.siman@gmail.com.
// Full Notice is available in the root folder.

import { TwitterApi } from "twitter-api-v2";

const instantiateClient = (token: string) => {
  // Instantiate with desired auth type (here's Bearer v2 auth)
  //
  const twitterClient = new TwitterApi(token);

  // Tell typescript it's a readonly app
  const readOnlyClient = twitterClient.readOnly;

  return readOnlyClient;
};

export default instantiateClient;
