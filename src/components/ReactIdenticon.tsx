// SPDX-License-Identifier: GPL-3.0-or-later.
// Copyright (C) 2022-2023 DAPPFORCE PTE. LTD., aleksandr.siman@gmail.com.
// Full Notice is available in the root folder.

import Identicon from "@polkadot/react-identicon";
import { IconTheme } from "@polkadot/react-identicon/types";
import React from "react";

type ReactIdenticonProps = {
  address: string;
  size?: number;
  theme?: IconTheme;
};

const ReactIdenticon = (props: ReactIdenticonProps) => {
  const { address, size = 32, theme = "substrate" } = props;

  return (
    <Identicon
      value={address}
      size={size}
      theme={theme}
      className="!cursor-pointer rounded-full border border-[#d8d8d9]"
    />
  );
};

export default ReactIdenticon;
