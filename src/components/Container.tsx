// SPDX-License-Identifier: GPL-3.0-or-later.
// Copyright (C) 2022-2023 DAPPFORCE PTE. LTD., aleksandr.siman@gmail.com.
// Full Notice is available in the root folder.

import clsx from "clsx";
import { HTMLProps } from "react";

export type ContainerProps = HTMLProps<HTMLDivElement>;

export default function Container({ className, ...props }: ContainerProps) {
  return (
    <div
      {...props}
      className={clsx(
        "relative w-full",
        "xl:container 2xl:max-w-screen-xl",
        "mx-auto",
        "px-4 md:px-6",
        className,
      )}
    />
  );
}
