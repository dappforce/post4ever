import React, { useState } from "react";
import clsx from "clsx";
import { useWalletStore } from "src/store";

import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";

import ReactIdenticon from "src/components/ReactIdenticon";
import Post4Ever from "public/images/Post4Ever.svg";
import P4 from "public/images/P4.svg";
import NewLogoPolkadot from "public/images/NewLogoPolkadot.svg";
import Sidebar from "./Sidebar";

import { useRouter } from "next/router";
import { sidePadding } from "styles/common";

type LayoutProps = {
  children?: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const {
    account,
    setAccount,
    readyAccounts,
    setAccounts: setReadyAccounts,
  } = useWalletStore(state => ({
    account: state.account,
    setAccount: state.setAccount,
    readyAccounts: state.accounts,
    setAccounts: state.setAccounts,
  }));

  const router = useRouter();

  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>(readyAccounts);
  const [selectedAccount, setSelectedAccount] = useState<InjectedAccountWithMeta | null>(account);
  const [isOpen, setIsOpen] = useState(false);

  const getAccounts = async () => {
    const extensions = await web3Enable("EverPost dapp");
    if (extensions.length === 0) {
      return;
    }
    const allAccounts = await web3Accounts();
    setAccounts(allAccounts);
    setReadyAccounts(allAccounts);

    setSelectedAccount(allAccounts[0]);
    setAccount(allAccounts[0]);
  };

  const handleConnect = () => {
    getAccounts();
  };

  const handleChangeAccount = (account: InjectedAccountWithMeta | null) => {
    setSelectedAccount(account);
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
              <button onClick={() => router.push("/")}>
                <span className="text-2xl font-medium text-primary">
                  <div className="hidden md:inline">
                    <Post4Ever />
                  </div>
                  <div className="md:hidden">
                    <P4 />
                  </div>
                </span>
              </button>
            </div>
            <div className="navbar-end">
              {accounts && accounts.length && selectedAccount ? (
                <button
                  className="btn-ghost rounded-lg p-0 text-base font-normal normal-case hover:bg-transparent"
                  onClick={() => setIsOpen(!isOpen)}>
                  <div className="flex items-center justify-center gap-2">
                    <ReactIdenticon address={selectedAccount.address} />
                    <div className="hidden md:block">{account?.meta.name}</div>
                  </div>
                </button>
              ) : (
                <button
                  id="connect-button"
                  onClick={handleConnect}
                  className="btn-gradient btn gap-2 border-0 normal-case">
                  <NewLogoPolkadot />
                  Connect wallet
                </button>
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
