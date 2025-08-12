import { useCallback } from "react";

import type { IWalletKit } from "@reown/walletkit";
import type { SessionTypes } from "@walletconnect/types";
import { create } from "zustand";

import { useWcModalStore } from "@/lib/stores";

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
  const modalStore = useWcModalStore();

  const handleRedirect = useCallback((session: SessionTypes.Struct) => {
    console.log(session.peer.metadata.url);
    if (window.opener) {
      window.opener.location.href = session.peer.metadata.url;
      window.close();
    }
  }, []);

  return { handleRedirect, setWalletKit, walletKit, ...modalStore };
};
