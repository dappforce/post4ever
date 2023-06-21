// SPDX-License-Identifier: GPL-3.0-or-later.
// Copyright (C) 2022-2023 DAPPFORCE PTE. LTD., aleksandr.siman@gmail.com.
// Full Notice is available in the root folder.

import { PolkadotjsWallet, SubWallet, TalismanWallet } from "@talismn/connect-wallets";
import { WalletSelect } from "@talismn/connect-components";
import { useWalletStore } from "src/store";

type WalletSelectModalProps = {
  open: boolean;
  onClose: () => void;
};

const LinksOnFooter = () => {
  return (
    <div className="flex items-center justify-center">
      <a key={"#"} className="link mr-1 text-[#8c8c8c] no-underline hover:text-base-pink">
        Privacy Policy
      </a>
      {" · "}
      <a key={"#"} className="link ml-1 text-[#8c8c8c] no-underline hover:text-base-pink">
        Terms of Use
      </a>
    </div>
  );
};

const WalletSelectModal = ({ open, onClose }: WalletSelectModalProps) => {
  const { setAccount, setAccounts } = useWalletStore(state => ({
    setAccount: state.setAccount,
    setAccounts: state.setAccounts,
  }));

  const handleClose = () => {
    onClose && onClose();
  };

  return (
    <WalletSelect
      // [Required] The dapp name
      dappName="Post4ever"
      walletList={[new TalismanWallet(), new SubWallet(), new PolkadotjsWallet()]}
      // Use if the dapp is controlling the modal toggle.
      open={open}
      // Override the default header
      header={<h1>Select your wallet</h1>}
      // If `showAccountsList={true}`, then account selection modal will show up after selecting the a wallet. Default is `false`.
      showAccountsList={true}
      // Callback when the WalletSelect Modal is closed
      onWalletConnectClose={handleClose}
      // Callback when the subscribed accounts for a selected wallet are updated
      onUpdatedAccounts={accounts => setAccounts(accounts)}
      // Callback when an account is selected on the WalletSelect Account Modal. Only relevant when `showAccountsList=true`
      onAccountSelected={account => setAccount(account)}
      // Callback when an error occurs. Also clears the error on Modal actions:
      // `onWalletConnectOpen`, `onWalletSelected`, `onAccountSelected` and `onWalletConnectClose`,
      onError={error => console.warn({ error })}
    />
  );
};

export default WalletSelectModal;
