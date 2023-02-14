import React, { HTMLProps } from "react";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { UrlObject } from "url";
import clsx from "clsx";

export type LinkProps = HTMLProps<HTMLAnchorElement> & {
  href: string | UrlObject;
  openInNewTab?: boolean;
  nextLinkProps?: Omit<NextLinkProps, "href">;
};

export default function Link({ nextLinkProps, openInNewTab, href, ...props }: LinkProps) {
  let anchorProps: HTMLProps<HTMLAnchorElement> = {};
  if (openInNewTab) {
    anchorProps = {
      target: "_blank",
      rel: "noopener noreferrer",
    };
  }
  return (
    <NextLink {...nextLinkProps} href={href} legacyBehavior>
      <a
        {...props}
        {...anchorProps}
        className={clsx("font-bold text-base-pink", props.className)}
      />
    </NextLink>
  );
}
