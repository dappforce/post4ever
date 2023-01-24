import { PostProps, TweetWithAuthorProps } from "src/types/common";
import type { WalletAccount } from "@talismn/connect-wallets";

export type PostTransactionProps = {
  savedPosts: PostProps[];
  account: WalletAccount;
};

export type CreateSpaceProps = {
  account: WalletAccount;
  content: TweetWithAuthorProps;
  successCallback?: (props: SuccessPayloadProps) => void;
};

export type CreatePostWithSpaceIdProps = {
  spaceId: string;
  account: WalletAccount;
  content: TweetWithAuthorProps;
  successCallback?: (props: SuccessPayloadProps) => void;
};

export type SuccessPayloadProps = {
  postId: string;
  spaceId: string;
};
