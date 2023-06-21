// SPDX-License-Identifier: GPL-3.0-or-later.
// Copyright (C) 2022-2023 DAPPFORCE PTE. LTD., aleksandr.siman@gmail.com.
// Full Notice is available in the root folder.

import clsx from "clsx";
import React, { HTMLProps } from "react";

export type GradientTextProps = HTMLProps<HTMLSpanElement>;

export default function GradientText(props: GradientTextProps) {
  return (
    <span
      {...props}
      style={{
        WebkitTextFillColor: "transparent",
      }}
      className={clsx("bg-primary-gradient bg-clip-text", "text-base-pink", props.className)}
    />
  );
}
