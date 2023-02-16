import React, { HTMLProps } from "react";
import { useWalletStore } from "src/store";
import Link from "./Link";
import clsx from "clsx";
import { p4eSpace } from "src/configs/spaces";

export type SavedTweetsLinksProps = HTMLProps<HTMLDivElement>;

const getLinks = (
  address: string,
): { text: string; href: string; openInNewTab?: boolean; authOnly?: boolean }[] => {
  const savedTweetLink = `https://polkaverse.com/accounts/${address}#tweets`;
  const p4eSpaceLink = `https://polkaverse.com/${p4eSpace}`;
  return [
    { text: "Twitter Backups", href: p4eSpaceLink, openInNewTab: true },
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
