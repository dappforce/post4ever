import React, { useMemo } from "react";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";

import { parseTextToMarkdown } from "src/utils/string";

type TweetBodyProps = {
  text: string;
};

const TweetBody = ({ text }: TweetBodyProps) => {
  const parsedMD = useMemo(() => {
    const result = parseTextToMarkdown(text);
    return result;
  }, [text]);

  return <span>{parsedMD}</span>;
};

export default TweetBody;
