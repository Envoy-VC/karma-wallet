import type { IWalletKit } from "@reown/walletkit";
import { create } from "zustand";

interface WalletConnectStore {
  walletKit: IWalletKit | undefined;
  setWalletKit: (walletKit: IWalletKit) => void;
}

const useWalletConnectStore = create<WalletConnectStore>((set) => ({
  setWalletKit: (walletKit) => set({ walletKit }),
  walletKit: undefined,
}));

export const useWalletConnect = () => {
  const { walletKit, setWalletKit } = useWalletConnectStore();

  return { setWalletKit, walletKit };
};
