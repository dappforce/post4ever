import { SuccessPayloadProps } from "src/hooks/subsocial-api.types";

export const SUBSOCIAL_TWITTER_URL = "https://twitter.com/SubsocialChain";

export const SUBSOCIAL_HASHTAG_TWITTER_URL =
  "https://twitter.com/search?q=%23Subsocial&src=typeahead_click";

export const TWITTER_URL = "https://twitter.com";

export const polkaverseContentURL = (contentId: SuccessPayloadProps | undefined) =>
  `\nhttps://polkaverse.com/${contentId?.spaceId}/${contentId?.postId}`;

export const appBaseUrl = process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:3000";
