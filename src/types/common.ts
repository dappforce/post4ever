export type PostProps = TweetProps & {
  image?: string;
  tags?: string[];
  body?: string;
};

export enum MediaType {
  ANIMATED_GIF = "animated_gif",
  PHOTO = "photo",
  VIDEO = "video",
}

export type MediaProps = {
  media_key: string;
  type: MediaType;
  url: string;
};

export type TweetProps = {
  attachments: {
    media_keys: string[];
  };
  edit_history_tweet_ids: string[];
  id: string;
  text: string;
  medias?: MediaProps[];
};

export type TweetsProps = {
  tweets: TweetProps[];
};
