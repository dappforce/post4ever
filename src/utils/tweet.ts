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

export const removeTrailingUrl = (text: string) => {
  const textInArray = text.split(" ");
  let result: string | undefined;

  const STRING_TO_MATCH = new RegExp("^(http|https)://", "i");

  result = STRING_TO_MATCH.test(textInArray[textInArray.length - 1])
    ? textInArray.slice(0, -1).join(" ")
    : text;

  return result;
};
