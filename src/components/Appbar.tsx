import React, { useState } from "react";
import Link from "next/link";
import { useWalletStore } from "src/store";

import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";

type AppbarProps = {
  children?: React.ReactNode;
};

const Appbar = ({ children }: AppbarProps) => {
  const { account, setAccount } = useWalletStore((state) => ({
    account: state.account,
    setAccount: state.setAccount,
  }));

  const [walletAuthorized, setWalletAuthorized] = useState(false);
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [selectedAccount, setSelectedAccount] =
    useState<InjectedAccountWithMeta | null>(null);

  const getAccounts = async () => {
    const extensions = await web3Enable("Perma-Tweeter dapp");
    if (extensions.length === 0) {
      return;
    }
    setWalletAuthorized(true);
    const allAccounts = await web3Accounts();
    setAccounts(allAccounts);
    setSelectedAccount(allAccounts[0]);
    setAccount(allAccounts[0]);
  };

  const handleConnect = () => {
    getAccounts();
  };

  const handleChangeAccount = (event: React.MouseEvent<HTMLButtonElement>) => {
    const target = event.target as HTMLButtonElement;
    const address = target.value;

    const found = accounts.find((account) => account.address === address);

    setSelectedAccount(found!);
    setAccount(found!);
  };

  const trimMiddleString = (text?: string, numberStringsKept = 5) => {
    if (!text) return "";
    const temp = `${text.slice(0, numberStringsKept)}...${text.slice(
      text.length - numberStringsKept
    )}`;

    return temp;
  };

  return (
    <div>
      <div className="flex flex-row p-2 justify-start items-center border-b-2 border-b-gray-500">
        <div className="mr-auto text-blue-500 text-2xl font-bold">
          Perma-Tweeter
        </div>

        <ul className="flex">
          <li className="mr-6">
            <Link href="/tweets" legacyBehavior>
              <a className="text-blue-500 hover:text-blue-800 text-lg font-semibold">
                Timeline
              </a>
            </Link>
          </li>
          <li className="mr-6">
            <Link href="/crosspost" legacyBehavior>
              <a className="text-blue-500 hover:text-blue-800 text-lg font-semibold">
                Cross-post tweet
              </a>
            </Link>
          </li>
        </ul>

        {walletAuthorized && accounts.length ? (
          <div className="group inline-block relative">
            <button
              id="connect-button-with-address"
              className="bg-orange-500 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded inline-flex items-center"
            >
              <span className="mr-1">
                {trimMiddleString(selectedAccount?.address)}
              </span>
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />{" "}
              </svg>
            </button>
            <ul className="absolute hidden text-white pt-1 group-hover:block">
              {accounts.map(({ address }) => (
                <li
                  key={address}
                  className="first:rounded-t last:rounded-b bg-orange-500 hover:bg-orange-700"
                >
                  <button
                    className="py-2 px-4 block whitespace-no-wrap"
                    value={address}
                    onClick={handleChangeAccount}
                  >
                    {trimMiddleString(address)}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <button
            id="connect-button"
            onClick={handleConnect}
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
          >
            Connect Polkadot.js
          </button>
        )}
      </div>
      {children}
    </div>
  );
};

export default Appbar;
