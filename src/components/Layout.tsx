import React, { useState } from "react";
import clsx from "clsx";
import { useWalletStore } from "src/store";

import type { WalletAccount } from "@talismn/connect-wallets";

import ReactIdenticon from "src/components/ReactIdenticon";
import Post4Ever from "public/images/Post4Ever.svg";
import P4 from "public/images/P4.svg";
import Sidebar from "./Sidebar";

import { useRouter } from "next/router";
import { sidePadding } from "styles/common";
import ConnectButton from "./wallet-connect/ConnectButton";
import Link from "./Link";

type LayoutProps = {
  account?: WalletAccount | null;
  accounts?: WalletAccount[] | null;
  onConnect?: () => void;
  children?: React.ReactNode;
};

const getLinks = (address: string): { text: string; href: string; openInNewTab?: boolean }[] => {
  const savedTweetLink = `https://polkaverse.com/accounts/${address}#tweets`;
  return [
    { text: "Cross-post a tweet", href: "/crosspost" },
    { text: "My Saved Tweets", href: savedTweetLink, openInNewTab: true },
  ];
};

const Layout = ({ onConnect, account, accounts, children }: LayoutProps) => {
  const { setAccount } = useWalletStore(state => ({
    setAccount: state.setAccount,
  }));
  const router = useRouter();
  const { pathname } = router;

  const [isOpen, setIsOpen] = useState(false);

  const handleConnect = () => {
    onConnect && onConnect();
  };

  const handleChangeAccount = (account: WalletAccount | null) => {
    setAccount(account);

    setIsOpen(false);
  };

  const linksList = getLinks(account?.address ?? "");

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
                    <Post4Ever className="h-4" />
                  </div>
                  <div className="md:hidden">
                    <P4 />
                  </div>
                </span>
              </button>
            </div>
            <div className="navbar-center flex items-center gap-8">
              {linksList.map(({ href, text, openInNewTab }) => {
                const activeClassName = "font-semibold text-dark-blue";
                const inactiveClassName = "!font-normal text-gray-800";
                const isActive = pathname === href;
                return (
                  <Link
                    href={href}
                    openInNewTab={openInNewTab}
                    withArrowIcon={openInNewTab}
                    className={isActive ? activeClassName : inactiveClassName}
                    key={href}>
                    {text}
                  </Link>
                );
              })}
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
