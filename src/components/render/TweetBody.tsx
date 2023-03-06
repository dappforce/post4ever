import React, { useMemo } from "react";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";

import { parseTwitterTextToMarkdown } from "@subsocial/utils";

type TweetBodyProps = {
  text: string;
};

const TweetBody = ({ text }: TweetBodyProps) => {
  const parsedMD = useMemo(() => parseTwitterTextToMarkdown(text), [text]);
  return <span>{parsedMD}</span>;
};

export default TweetBody;
