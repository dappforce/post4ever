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
