import React, { useState } from "react";
import clsx from "clsx";
import { useWalletStore } from "src/store";

import type { WalletAccount } from "@talismn/connect-wallets";

import ReactIdenticon from "src/components/ReactIdenticon";
import Post4Ever from "public/images/Post4Ever.svg";
import P4 from "public/images/P4.svg";
import Sidebar from "./Sidebar";

import { sidePadding } from "styles/common";
import ConnectButton from "./wallet-connect/ConnectButton";
import Link from "./Link";

type LayoutProps = {
  account?: WalletAccount | null;
  accounts?: WalletAccount[] | null;
  onConnect?: () => void;
  children?: React.ReactNode;
};

const Layout = ({ onConnect, account, accounts, children }: LayoutProps) => {
  const { setAccount } = useWalletStore(state => ({
    setAccount: state.setAccount,
  }));

  const [isOpen, setIsOpen] = useState(false);

  const handleConnect = () => {
    onConnect && onConnect();
  };

  const handleChangeAccount = (account: WalletAccount | null) => {
    setAccount(account);

    setIsOpen(false);
  };

  return (
    <>
      <Sidebar
        checked={isOpen}
        onCheck={() => setIsOpen(false)}
        accounts={accounts ?? []}
        onChangeAccount={handleChangeAccount}>
        <div>
          <div
            className={clsx(
              "navbar sticky top-0 z-10 max-h-[70px] bg-base-100 !py-[14px] lg:px-8",
              sidePadding,
            )}>
            <div className="navbar-start">
              <Link href="/" className="text-2xl font-medium text-primary">
                <span className="hidden md:inline">
                  <Post4Ever className="h-4" />
                </span>
                <span className="md:hidden">
                  <P4 />
                </span>
              </Link>
            </div>
            <div className="navbar-end">
              {accounts && accounts.length && account ? (
                <button
                  className="btn-ghost rounded-lg p-0 text-base font-normal normal-case hover:bg-transparent"
                  onClick={() => setIsOpen(!isOpen)}>
                  <div className="flex items-center justify-center gap-2">
                    <ReactIdenticon address={account.address} />
                    <div className="hidden md:block">{account.name}</div>
                  </div>
                </button>
              ) : (
                <ConnectButton onConnect={handleConnect} />
              )}
            </div>
          </div>
          <main className="relative">{children}</main>
        </div>
      </Sidebar>
    </>
  );
};

export default Layout;
