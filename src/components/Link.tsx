// SPDX-License-Identifier: GPL-3.0-or-later.
// Copyright (C) 2022-2023 DAPPFORCE PTE. LTD., aleksandr.siman@gmail.com.
// Full Notice is available in the root folder.

import React, { HTMLProps } from "react";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { UrlObject } from "url";
import clsx from "clsx";
import { HiArrowUpRight } from "react-icons/hi2";

export type LinkProps = HTMLProps<HTMLAnchorElement> & {
  href: string | UrlObject;
  openInNewTab?: boolean;
  nextLinkProps?: Omit<NextLinkProps, "href">;
  withArrowIcon?: boolean;
};

export default function Link({
  nextLinkProps,
  openInNewTab,
  href,
  withArrowIcon,
  ...props
}: LinkProps) {
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
        className={clsx("gap-1 font-bold text-base-pink", props.className)}>
        {props.children} {withArrowIcon && <HiArrowUpRight className="inline" />}
      </a>
    </NextLink>
  );
}
