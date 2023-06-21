// SPDX-License-Identifier: GPL-3.0-or-later.
// Copyright (C) 2022-2023 DAPPFORCE PTE. LTD., aleksandr.siman@gmail.com.
// Full Notice is available in the root folder.

import { PostProps, TweetWithIncludesProps } from "src/types/common";
import type { WalletAccount } from "@talismn/connect-wallets";

export type PostTransactionProps = {
  savedPosts: PostProps[];
  account: WalletAccount;
};

export type CreateSpaceProps = {
  account: WalletAccount;
  content: TweetWithIncludesProps;
  successCallback?: (props: SuccessPayloadProps) => void;
};

export type CreatePostWithSpaceIdProps = {
  spaceId: string;
  account: WalletAccount;
  content: TweetWithIncludesProps;
  successCallback?: (props: SuccessPayloadProps) => void;
};

export type SuccessPayloadProps = {
  postId: string;
  spaceId: string;
};
