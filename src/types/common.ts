import { MediaObjectV2, ReferencedTweetV2, TweetAttachmentV2 } from "twitter-api-v2";

export type TweetContentProps = {
  body: string;
  image?: string;
  tweet: {
    id: string;
    edit_history_tweet_ids: string[];
    username: string;
    created_at?: string;
    author_id?: string;
    conversation_id?: string;
    in_reply_to_user_id?: string;
    referenced_tweets?: ReferencedTweetV2[];
    attachments?: TweetAttachmentV2;
    lang?: string;
  };
};

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

export type BaseTweetProps = {
  id: string;
  edit_history_tweet_ids: string[];
  text: string;
  in_reply_to_user_id?: string;
  lang?: string;
  attachments?: TweetAttachmentV2;
  referenced_tweets?: ReferencedTweetV2[];
  created_at?: string;
  author_id?: string;
  conversation_id?: string;
};

export type TweetUserProps = {
  id: string;
  name: string;
  profile_image_url: string;
  username: string;
};

export type TweetWithIncludesProps = BaseTweetProps & {
  users?: TweetUserProps[];
  media?: MediaObjectV2[];
  tweets?: BaseTweetProps[];
};

export type ExpandedTweetProps = TweetWithIncludesProps & {
  url?: string;
};

export type TweetsProps = {
  tweets: BaseTweetProps[];
};

export type AuthenticatedPageProps = {
  tweets: TweetsProps;
  user: TweetUserProps;
};
