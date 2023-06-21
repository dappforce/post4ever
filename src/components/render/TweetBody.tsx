// SPDX-License-Identifier: GPL-3.0-or-later.
// Copyright (C) 2022-2023 DAPPFORCE PTE. LTD., aleksandr.siman@gmail.com.
// Full Notice is available in the root folder.

import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { parseTwitterTextToMarkdown } from "@subsocial/utils";

type TweetBodyProps = {
  text: string;
};

const TweetBody = ({ text }: TweetBodyProps) => {
  const parsedMD = useMemo(() => {
    const result = parseTwitterTextToMarkdown(text);
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
