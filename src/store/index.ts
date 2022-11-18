import create from "zustand";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";

interface WalletState {
  account: InjectedAccountWithMeta | null;
  setAccount: (newAccount: InjectedAccountWithMeta) => void;
}

export const useWalletStore = create<WalletState>()((set) => ({
  account: null,
  setAccount: (newAccount) => set((state) => ({ account: newAccount })),
}));
