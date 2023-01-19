import NewLogoPolkadot from "public/images/NewLogoPolkadot.svg";

type ConnectButtonProps = {
  onConnect: () => void;
};

const ConnectButton = ({ onConnect }: ConnectButtonProps) => {
  const handleConnect = () => {
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
