import { TweetWithIncludesProps } from "src/types/common";

export const getAuthor = (tweet: TweetWithIncludesProps) => {
  const author = tweet.users?.find(user => user.id === tweet.author_id);
  if (author) {
    const { id, profile_image_url, name, username } = author;
    return { id, profile_image_url, name, username };
  } else {
    return null;
  }
};
