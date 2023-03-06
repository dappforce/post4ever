export const trimMiddleString = (text?: string, numberStringsKept = 5) => {
  if (!text) return "";
  const result = `${text.slice(0, numberStringsKept)}...${text.slice(
    text.length - numberStringsKept,
  )}`;

  return result;
};

export const urlMatcher = (text: string, urlToMatch: string) => {
  let isMatch = false;

  if (text.length) {
    isMatch = text.startsWith(urlToMatch);
  }

  return isMatch;
};
