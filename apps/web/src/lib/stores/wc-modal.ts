import { create } from "zustand";

export type WcScreen = "default" | "connect";

export type WalletConnectModalState = {
  activeScreen: WcScreen;
};

export type WalletConnectModalActions = {
  setActiveScreen: (screen: WcScreen) => void;
};

export const useWcModalStore = create<
  WalletConnectModalState & WalletConnectModalActions
>()((set) => ({
  activeScreen: "default",
  setActiveScreen: (screen: WcScreen) => set({ activeScreen: screen }),
}));
