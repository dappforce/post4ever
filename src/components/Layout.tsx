import React, { useState } from "react";
import Link from "next/link";
import { useWalletStore } from "src/store";
import SubTweet from "public/SubTweet.svg";

import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";

import { Button } from "react-daisyui";
import PolkadotIcon from "./PolkadotIcon";
import Identicon from "./Identicon";
import Sidebar from "./Sidebar";

import { useRouter } from "next/router";

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
    const extensions = await web3Enable("SubTweet dapp");
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
          <header className="sticky top-0 z-30 shadow px-4 backdrop-filter bg-white text-grey-600">
            <div className="flex justify-between items-center h-16 md:justify-center">
              <button onClick={() => router.push("/crosspost")}>
                <span className="text-primary text-2xl font-medium text-[#6A8CEC]">
                  <SubTweet />
                </span>
              </button>
              <ul className="items-stretch hidden space-x-3 mx-auto md:flex">
                <li className="flex">
                  <Link
                    href="/tweets"
                    legacyBehavior
                    className="flex items-center px-4 py-4 -mb-1 border-b-2 dark:border-transparent">
                    <a
                      rel="noopener noreferrer"
                      href="#"
                      className={`flex items-center px-4 py-4 -mb-1 border-b-2 border-transparent hover:text-accent ${
                        router.pathname === "/tweets" ? "text-accent border-[#5C1EDC]" : ""
                      }`}>
                      Feeds
                    </a>
                  </Link>
                </li>
                <li className="flex hover:text-grey-500">
                  <Link
                    href="/crosspost"
                    legacyBehavior
                    className="flex items-center px-4 py-4 -mb-1 border-b-2 dark:border-transparent">
                    <a
                      rel="noopener noreferrer"
                      href="#"
                      className={`flex items-center px-4 py-4 -mb-1 border-b-2 border-transparent hover:text-accent ${
                        router.pathname === "/crosspost" ? "text-accent border-[#5C1EDC]" : ""
                      }`}>
                      Cross-post a tweet
                    </a>
                  </Link>
                </li>
              </ul>
              {accounts && accounts.length && selectedAccount ? (
                <Button
                  className="gap-2 normal-case font-normal text-base btn btn-ghost"
                  onClick={() => setIsOpen(!isOpen)}>
                  <Identicon />
                  <div>{account?.meta.name}</div>
                </Button>
              ) : (
                <Button
                  id="connect-button"
                  onClick={handleConnect}
                  className="normal-case border-0 bg-gradient-to-r from-primary to-secondary">
                  <PolkadotIcon />
                  Connect wallet
                </Button>
              )}
            </div>
          </header>
        </div>
        <main>{children}</main>
      </Sidebar>
    </>
  );
};

export default Layout;
