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
