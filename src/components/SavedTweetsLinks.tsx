import React, { HTMLProps } from "react";
import { useWalletStore } from "src/store";
import Link from "./Link";
import clsx from "clsx";

export type SavedTweetsLinksProps = HTMLProps<HTMLDivElement>;

const getLinks = (
  address: string,
): { text: string; href: string; openInNewTab?: boolean; authOnly?: boolean }[] => {
  const savedTweetLink = `https://polkaverse.com/accounts/${address}#tweets`;
  return [
    { text: "Post4Ever Tweets", href: "https://polkaverse.com", openInNewTab: true },
    { text: "My Saved Tweets", href: savedTweetLink, openInNewTab: true, authOnly: true },
  ];
};

export default function SavedTweetsLinks(props: SavedTweetsLinksProps) {
  const { address } = useWalletStore(state => ({
    address: state.account?.address.toString(),
  }));

  const linksList = getLinks(address ?? "");

  return (
    <div {...props} className={clsx("flex gap-6", props.className)}>
      {linksList.map(({ href, text, openInNewTab }) => {
        return (
          <Link
            href={href}
            openInNewTab={openInNewTab}
            withArrowIcon={openInNewTab}
            className="!font-normal text-base-blue"
            key={href}>
            {text}
          </Link>
        );
      })}
    </div>
  );
}
