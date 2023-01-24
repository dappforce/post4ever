import create from "zustand";
import produce from "immer";
import { persist } from "zustand/middleware";
import type { WalletAccount } from "@talismn/connect-wallets";

interface WalletState {
  account: WalletAccount | null;
  setAccount: (newAccount: WalletAccount | null) => void;
  accounts: WalletAccount[];
  setAccounts: (newAccounts: WalletAccount[] | undefined) => void;
}

interface TwitterUserState {
  user: TwitterUserProps;
  setNewUser: (newUser: TwitterUserProps) => void;
}

type TwitterUserProps = {
  id: string;
  name: string;
  profile_image_url: string;
  username: string;
};

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
  setNewUser: (newUser: TwitterUserProps) =>
    set(
      produce((state: TwitterUserState) => {
        (state.user.id = newUser.id),
          (state.user.name = newUser.name),
          (state.user.profile_image_url = newUser.profile_image_url),
          (state.user.username = newUser.username);
      }),
    ),
}));
