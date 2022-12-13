import React from "react";
import { Button } from "@material-tailwind/react";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";

type SidebarProps = {
  checked: boolean;
  accounts: InjectedAccountWithMeta[];
  onCheck: () => void;
  onChangeAccount: (account: InjectedAccountWithMeta | null) => void;
  children?: React.ReactNode;
};

const Sidebar = ({ accounts, checked, onCheck, onChangeAccount, children }: SidebarProps) => {
  const handleChangeAccount = (account: InjectedAccountWithMeta | null) => {
    onChangeAccount(account);
  };

  const handleDisconnect = () => {
    handleChangeAccount(null);
  };

  return (
    <div className="drawer drawer-end h-screen">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" checked={checked} />
      <div className="drawer-content bg-light-gray">{children}</div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-4" className="drawer-overlay h-screen" onClick={onCheck}></label>

        <ul className="menu w-80 bg-base-100 text-base-content">
          <span className="text-normal font-bold text-gray-700 bg-gray-100 py-[2px] pl-4">
            Select an account
          </span>
          <li className="mb-4 overflow-y-auto w-full h-[25vh] block border-b-2 border-gray-100">
            {accounts.map(account => (
              <button
                key={account.address}
                className="block text-left w-full"
                onClick={() => handleChangeAccount(account)}>
                {account.meta.name}
              </button>
            ))}
          </li>
          <li className="w-full flex items-center">
            <Button
              onClick={handleDisconnect}
              variant="text"
              size="sm"
              className="group text-sm text-gray-500 hover:text-red-500 hover:bg-transparent normal-case transition-all duration-300 ease-in-out">
              <span className="bg-left-bottom bg-gradient-to-r from-red-500 to-red-500 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
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
