import type { SignClientTypes } from "@walletconnect/types";
import { create } from "zustand";

export type WcScreen = "default" | "connect" | "dapp-connect";
type ConnectionStatus = "idle" | "connecting" | "connected" | "error";

export type WalletConnectModalState = {
  activeScreen: WcScreen;
  connectionString: string | undefined;
  pendingProposal:
    | SignClientTypes.EventArguments["session_proposal"]
    | undefined;
  connectionStatus: ConnectionStatus;
};

export type WalletConnectModalActions = {
  setActiveScreen: (screen: WcScreen) => void;
  setConnectionString: (connectionString: string | undefined) => void;
  setPendingProposal: (
    proposal: SignClientTypes.EventArguments["session_proposal"] | undefined,
  ) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
};

export const useWcModalStore = create<
  WalletConnectModalState & WalletConnectModalActions
>()((set) => ({
  activeScreen: "default",
  connectionStatus: "idle",
  connectionString: undefined,
  pendingProposal: undefined,
  setActiveScreen: (screen: WcScreen) => set({ activeScreen: screen }),
  setConnectionStatus: (status: ConnectionStatus) =>
    set({ connectionStatus: status }),
  setConnectionString: (connectionString: string | undefined) =>
    set({ connectionString }),
  setPendingProposal: (
    proposal: SignClientTypes.EventArguments["session_proposal"] | undefined,
  ) => set({ pendingProposal: proposal }),
}));
