import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { textToMarkdownParser } from "src/utils/string";

type TweetBodyProps = {
  text: string;
};

const TweetBody = ({ text }: TweetBodyProps) => {
  const parsedMD = useMemo(() => {
    const result = textToMarkdownParser(text);
    return result;
  }, [text]);

  return (
    <ReactMarkdown
      linkTarget="_blank"
      className="whitespace-pre-line"
      components={{
        a: ({ node, ...props }) => <a className="text-link-blue" {...props} />,
      }}
      remarkPlugins={[remarkGfm]}>
      {parsedMD}
    </ReactMarkdown>
  );
};

export default TweetBody;
