import { useCallback } from "react";

import type { IWalletKit } from "@reown/walletkit";
import type { SessionTypes } from "@walletconnect/types";
import { buildApprovedNamespaces } from "@walletconnect/utils";
import { useChains } from "wagmi";
import { create } from "zustand";

import { useWcModalStore } from "@/lib/stores";

import { useSmartAccount } from "./use-account";

interface WalletConnectStore {
  walletKit: IWalletKit | undefined;
  activeSessions: Record<string, SessionTypes.Struct>;
  setWalletKit: (walletKit: IWalletKit) => void;
  setActiveSessions: (sessions: Record<string, SessionTypes.Struct>) => void;
}

const useWalletConnectStore = create<WalletConnectStore>((set) => ({
  activeSessions: {},
  setActiveSessions: (sessions) => set({ activeSessions: sessions }),
  setWalletKit: (walletKit) => set({ walletKit }),
  walletKit: undefined,
}));

export const useWalletConnect = () => {
  const { walletKit, setWalletKit, setActiveSessions } =
    useWalletConnectStore();
  const modalStore = useWcModalStore();
  const chains = useChains();
  const { address } = useSmartAccount();

  const handleRedirect = useCallback((session: SessionTypes.Struct) => {
    console.log(session.peer.metadata.url);
    if (window.opener) {
      window.opener.location.href = session.peer.metadata.url;
      window.close();
    }
  }, []);

  const acceptPendingProposal = useCallback(async () => {
    if (!walletKit) {
      throw new Error("WalletKit not initialized");
    }
    if (!modalStore.pendingProposal) {
      throw new Error("No pending proposal found");
    }

    const eipChains = chains.map((c) => `eip155:11155111`);
    const eipAccounts = chains.map((c) => `eip155:11155111:${address}`);

    const approvedNamespaces = buildApprovedNamespaces({
      proposal: modalStore.pendingProposal.params,
      supportedNamespaces: {
        eip155: {
          accounts: eipAccounts,
          chains: eipChains,
          events: [
            "chainChanged",
            "accountsChanged",
            "message",
            "disconnect",
            "connect",
          ],
          methods: [
            "eth_accounts",
            "eth_requestAccounts",
            "eth_sendRawTransaction",
            "eth_sign",
            "eth_signTransaction",
            "eth_signTypedData",
            "eth_signTypedData_v3",
            "eth_signTypedData_v4",
            "eth_sendTransaction",
            "personal_sign",
            "wallet_switchEthereumChain",
            "wallet_addEthereumChain",
            "wallet_getPermissions",
            "wallet_requestPermissions",
            "wallet_registerOnboarding",
            "wallet_watchAsset",
            "wallet_scanQRCode",
            "wallet_sendCalls",
            "wallet_getCallsStatus",
            "wallet_showCallsStatus",
            "wallet_getCapabilities",
          ],
        },
      },
    });
    const session = await walletKit.approveSession({
      id: modalStore.pendingProposal.id,
      namespaces: approvedNamespaces,
    });
    modalStore.setPendingProposal(undefined);
    handleRedirect(session);
  }, [
    walletKit,
    address,
    chains,
    modalStore.pendingProposal,
    handleRedirect,
    modalStore.setPendingProposal,
  ]);

  return {
    handleRedirect,
    setActiveSessions,
    setWalletKit,
    walletKit,
    ...modalStore,
    acceptPendingProposal,
  };
};
