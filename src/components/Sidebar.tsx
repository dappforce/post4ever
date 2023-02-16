import React from "react";
import { Button } from "@material-tailwind/react";
import { useWalletStore } from "src/store";
import type { WalletAccount } from "@talismn/connect-wallets";
import { useSendGaUserEvent } from "src/utils/ga/events";

type SidebarProps = {
  checked: boolean;
  accounts: WalletAccount[];
  onCheck: () => void;
  onChangeAccount: (account: WalletAccount | null) => void;
  children?: React.ReactNode;
};

const Sidebar = ({ accounts, checked, onCheck, onChangeAccount, children }: SidebarProps) => {
  const sendGaEvent = useSendGaUserEvent();
  const { setAccounts } = useWalletStore(state => ({
    setAccounts: state.setAccounts,
  }));

  const handleChangeAccount = (account: WalletAccount | null) => {
    sendGaEvent(`Change account to ${account?.name}`);
    onChangeAccount(account);
  };

  const handleDisconnect = () => {
    sendGaEvent("Disconnect wallet");
    setAccounts(undefined);
    handleChangeAccount(null);
  };

  return (
    <div className="drawer drawer-end h-screen">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" checked={checked} />
      <div className="drawer-content bg-light-gray">{children}</div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-4" className="drawer-overlay h-screen" onClick={onCheck}></label>

        <ul className="menu w-80 bg-base-100 text-base-content">
          <span className="text-normal bg-gray-100 py-4 pl-4 font-bold text-gray-700">
            Select an account
          </span>
          <li className="block max-h-[calc(100vh-108px)] w-full overflow-y-auto border-b-2 border-gray-100">
            {accounts.map(account => (
              <button
                key={account.address}
                className="flex w-full items-center text-left"
                onClick={() => handleChangeAccount(account)}>
                {account.name}
              </button>
            ))}
          </li>
          <li className="flex w-full items-center">
            <Button
              onClick={handleDisconnect}
              variant="text"
              size="sm"
              className="group py-4 text-sm normal-case text-gray-500 transition-all duration-300 ease-in-out hover:bg-transparent hover:text-red-500">
              <span className="bg-gradient-to-r from-red-500 to-red-500 bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-all duration-500 ease-out group-hover:bg-[length:100%_2px]">
                Disconnect
              </span>
            </Button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
