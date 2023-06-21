// SPDX-License-Identifier: GPL-3.0-or-later.
// Copyright (C) 2022-2023 DAPPFORCE PTE. LTD., aleksandr.siman@gmail.com.
// Full Notice is available in the root folder.

import NewLogoPolkadot from "public/images/NewLogoPolkadot.svg";
import { useSendGaUserEvent } from "src/utils/ga/events";

type ConnectButtonProps = {
  onConnect: () => void;
};

const ConnectButton = ({ onConnect }: ConnectButtonProps) => {
  const sendGaEvent = useSendGaUserEvent();
  const handleConnect = () => {
    sendGaEvent("Click on connect wallet button");
    onConnect();
  };

  return (
    <button
      id="connect-button"
      onClick={handleConnect}
      className="btn-gradient btn gap-2 border-0 normal-case">
      <NewLogoPolkadot />
      Connect wallet
    </button>
  );
};

export default ConnectButton;
