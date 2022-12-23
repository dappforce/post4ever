import { MediaObjectV2, TweetAttachmentV2 } from "twitter-api-v2";

export type PostProps = ExpandedTweetProps & {
  image?: string;
  tags?: string[];
  body?: string;
};

export enum MediaType {
  ANIMATED_GIF = "animated_gif",
  PHOTO = "photo",
  VIDEO = "video",
}

export type TweetProps = {
  edit_history_tweet_ids: string[];
  id: string;
  text: string;
  attachments?: TweetAttachmentV2;
  medias?: MediaObjectV2[];
};

export type TweetUserProps = {
  id: string;
  name: string;
  profile_image_url: string;
  username: string;
};

export type TweetMediaProps = {
  height: number;
  width: number;
  media_key: string;
  type: string;
  url: string;
  alt_text: string;
  preview_image_url?: string;
};

export type TweetWithAuthorProps = TweetProps & {
  author_id: string;
  users?: TweetUserProps[];
  media?: TweetMediaProps[];
};

export type ExpandedTweetProps = TweetWithAuthorProps & {
  url?: string;
};

export type TweetsProps = {
  tweets: TweetProps[];
};

export type AuthenticatedPageProps = {
  tweets: TweetsProps;
  user: TweetUserProps;
};
