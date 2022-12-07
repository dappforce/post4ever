import React from "react";
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

  return (
    <div className="drawer drawer-end h-screen">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" checked={checked} />
      <div className="drawer-content">{children}</div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-4" className="drawer-overlay h-screen" onClick={onCheck}></label>

        <ul className="menu p-4 w-80 bg-base-100 text-base-content">
          <span className="text-normal text-gray-700 bg-gray-100">Change your accounts</span>
          <li className="mb-4 border border-gray-500 overflow-y-auto w-full h-[25vh] block">
            {accounts.map(account => (
              <button
                key={account.address}
                className="block text-left w-full"
                onClick={() => handleChangeAccount(account)}>
                {account.meta.name}
              </button>
            ))}
          </li>
          <li className="border rounded-lg border-gray-500 hover:border-red-500">
            <button
              onClick={() => handleChangeAccount(null)}
              className="justify-center hover:text-red-500 hover:font-normal hover:bg-transparent">
              Disconnect
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
