import type { SessionTypes, SignClientTypes } from "@walletconnect/types";
import { create } from "zustand";

export type WcScreen =
  | "default"
  | "connect"
  | "dapp-connect"
  | "sign-message"
  | "sign-typed-message";
type ConnectionStatus = "idle" | "connecting" | "connected" | "error";
type Request = SignClientTypes.EventArguments["session_request"];

export type WalletConnectModalState = {
  activeScreen: WcScreen;
  connectionString: string | undefined;
  pendingProposal:
    | SignClientTypes.EventArguments["session_proposal"]
    | undefined;
  connectionStatus: ConnectionStatus;
  currentSession: SessionTypes.Struct | undefined;
  currentRequest: Request | undefined;
};

export type WalletConnectModalActions = {
  setActiveScreen: (screen: WcScreen) => void;
  setConnectionString: (connectionString: string | undefined) => void;
  setPendingProposal: (
    proposal: SignClientTypes.EventArguments["session_proposal"] | undefined,
  ) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  setCurrentSession: (session: SessionTypes.Struct | undefined) => void;
  setCurrentRequest: (request: Request | undefined) => void;
};

export const useWcModalStore = create<
  WalletConnectModalState & WalletConnectModalActions
>()((set) => ({
  activeScreen: "default",
  connectionStatus: "idle",
  connectionString: undefined,
  currentRequest: undefined,
  currentSession: undefined,
  pendingProposal: undefined,
  setActiveScreen: (screen: WcScreen) => set({ activeScreen: screen }),
  setConnectionStatus: (status: ConnectionStatus) =>
    set({ connectionStatus: status }),
  setConnectionString: (connectionString: string | undefined) =>
    set({ connectionString }),
  setCurrentRequest: (request: Request | undefined) =>
    set({ currentRequest: request }),
  setCurrentSession: (session: SessionTypes.Struct | undefined) =>
    set({ currentSession: session }),
  setPendingProposal: (
    proposal: SignClientTypes.EventArguments["session_proposal"] | undefined,
  ) => set({ pendingProposal: proposal }),
}));
