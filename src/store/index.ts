// SPDX-License-Identifier: GPL-3.0-or-later.
// Copyright (C) 2022-2023 DAPPFORCE PTE. LTD., aleksandr.siman@gmail.com.
// Full Notice is available in the root folder.

import { create } from "zustand";
import produce from "immer";
import { persist } from "zustand/middleware";
import type { WalletAccount } from "@talismn/connect-wallets";
import { TweetUserProps } from "src/types/common";

interface WalletState {
  account: WalletAccount | null;
  setAccount: (newAccount: WalletAccount | null) => void;
  accounts: WalletAccount[];
  setAccounts: (newAccounts: WalletAccount[] | undefined) => void;
}

interface TwitterUserState {
  user: TweetUserProps;
  setNewUser: (newUser: TweetUserProps) => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    set => ({
      account: null,
      setAccount: newAccount => set({ account: newAccount }),
      accounts: [],
      setAccounts: newAccounts => set({ accounts: newAccounts }),
    }),
    {
      name: "wallet-storage", // name of item in the storage (must be unique)
    },
  ),
);

export const useTwitterUserStore = create<TwitterUserState>()(set => ({
  user: {
    id: "",
    name: "",
    profile_image_url: "",
    username: "",
  },
  setNewUser: (newUser: TweetUserProps) =>
    set(
      produce((state: TwitterUserState) => {
        (state.user.id = newUser.id),
          (state.user.name = newUser.name),
          (state.user.profile_image_url = newUser.profile_image_url),
          (state.user.username = newUser.username);
      }),
    ),
}));
