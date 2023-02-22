import React, { HTMLProps } from "react";
import { useWalletStore } from "src/store";
import Link from "./Link";
import clsx from "clsx";
import { getP4ESpace } from "src/configs/spaces";
import { useSendGaUserEvent } from "src/utils/ga/events";

export type SavedTweetsLinksProps = HTMLProps<HTMLDivElement>;

const getLinks = (
  address: string,
): {
  text: string;
  href: string;
  openInNewTab?: boolean;
  authOnly?: boolean;
  gaEvent?: string;
}[] => {
  const savedTweetLink = `https://polkaverse.com/accounts/${address}#tweets`;
  const p4eSpaceLink = `https://polkaverse.com/${getP4ESpace()}`;
  return [
    {
      text: "My Saved Tweets",
      href: savedTweetLink,
      openInNewTab: true,
      authOnly: true,
      gaEvent: "Go to My Saved Tweets",
    },
    {
      text: "Public Twitter Backups",
      href: p4eSpaceLink,
      openInNewTab: true,
      gaEvent: "Go to Public Twitter Backups Space",
    },
  ];
};

export default function SavedTweetsLinks(props: SavedTweetsLinksProps) {
  const sendGaEvent = useSendGaUserEvent();
  const { address } = useWalletStore(state => ({
    address: state.account?.address.toString(),
  }));

  const linksList = getLinks(address ?? "");

  return (
    <div {...props} className={clsx("flex gap-6", props.className)}>
      {linksList.map(({ href, text, openInNewTab, gaEvent, authOnly }) => {
        if (authOnly && !address) return null;
        return (
          <Link
            href={href}
            openInNewTab={openInNewTab}
            withArrowIcon={openInNewTab}
            className="text-base !font-normal text-base-blue"
            onClick={() => gaEvent && sendGaEvent(gaEvent)}
            key={href}>
            {text}
          </Link>
        );
      })}
    </div>
  );
}
