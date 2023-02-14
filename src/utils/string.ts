export const trimMiddleString = (text?: string, numberStringsKept = 5) => {
  if (!text) return "";
  const result = `${text.slice(0, numberStringsKept)}...${text.slice(
    text.length - numberStringsKept,
  )}`;

  return result;
};

export const parseHashtag = (text: string) => {
  const result = text.replace(
    /(\s#)(\w+[a-zA-Z0-9]+)/g,
    " [#$2](https://twitter.com/hashtag/$2?src=hashtag_click)",
  );

  return result;
};

export const parseUsername = (text: string) => {
  const result = text.replace(/(?<!\w)@([a-zA-Z0-9_]+){1,15}/g, "[@$1](https://twitter.com/$1)");

  return result;
};

export const parseTextToMarkdown = (text: string) => {
  const hashtagParsed = parseHashtag(text);
  const markdownWithLinks = parseUsername(hashtagParsed);

  return markdownWithLinks;
};

export const urlMatcher = (text: string, urlToMatch: string) => {
  let isMatch = false;

  if (text.length) {
    isMatch = text.startsWith(urlToMatch);
  }

  return isMatch;
};
