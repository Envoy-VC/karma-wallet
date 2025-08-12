import { useCallback } from "react";

import { formatJsonRpcResult } from "@json-rpc-tools/utils";
import type { IWalletKit } from "@reown/walletkit";
import { useRouter } from "@tanstack/react-router";
import type { SessionTypes } from "@walletconnect/types";
import { buildApprovedNamespaces } from "@walletconnect/utils";
import { hexToBigInt } from "viem";
import {
  useAccount,
  useChains,
  useSendTransaction,
  useSignMessage,
  useSignTypedData,
} from "wagmi";
import { create } from "zustand";

import { useWcModalStore } from "@/lib/stores";
import {
  parseSendTransactionRequest,
  parseSignMessageRequest,
  parseSignTypedDataRequest,
} from "@/lib/utils";

// import { useSmartAccount } from "./use-account";

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
  const router = useRouter();
  const wcStore = useWalletConnectStore();
  const modalStore = useWcModalStore();
  const chains = useChains();
  // const { address } = useSmartAccount();
  const { address } = useAccount();

  // TODO: Temporary
  const { signMessageAsync } = useSignMessage();
  const { signTypedDataAsync } = useSignTypedData();
  const { sendTransactionAsync } = useSendTransaction();

  const removeSearchParams = () => {
    router.navigate({ search: {}, to: "/dashboard/wc" });
  };

  const handleRedirect = useCallback((session: SessionTypes.Struct) => {
    console.log(session.peer.metadata.url);
    if (window.opener) {
      window.opener.location.href = session.peer.metadata.url;
      window.close();
    }
  }, []);

  const acceptPendingProposal = async () => {
    if (!wcStore.walletKit) {
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
    const session = await wcStore.walletKit.approveSession({
      id: modalStore.pendingProposal.id,
      namespaces: approvedNamespaces,
    });
    handleRedirect(session);
    removeSearchParams();
  };

  const signMessage = async () => {
    if (!wcStore.walletKit) {
      throw new Error("WalletKit not initialized");
    }
    if (!modalStore.currentRequest) {
      throw new Error("Sign request not found");
    }
    const request = parseSignMessageRequest(modalStore.currentRequest);
    const now = Math.floor(Date.now() / 1000);
    if (request.expiryTimestamp && now > request.expiryTimestamp) {
      throw new Error("Request expired");
    }
    const signature = await signMessageAsync({
      message: { raw: request.params.message },
    });
    const res = formatJsonRpcResult(request.id, signature);
    await wcStore.walletKit.respondSessionRequest({
      response: res,
      topic: modalStore.currentRequest.topic,
    });
  };

  const signTypedData = async () => {
    if (!wcStore.walletKit) {
      throw new Error("WalletKit not initialized");
    }
    if (!modalStore.currentRequest) {
      throw new Error("Sign request not found");
    }
    const request = parseSignTypedDataRequest(modalStore.currentRequest);
    const now = Math.floor(Date.now() / 1000);
    if (request.expiryTimestamp && now > request.expiryTimestamp) {
      throw new Error("Request expired");
    }
    const signature = await signTypedDataAsync(request.params.data);
    const res = formatJsonRpcResult(request.id, signature);
    await wcStore.walletKit.respondSessionRequest({
      response: res,
      topic: modalStore.currentRequest.topic,
    });
  };

  const sendTx = async () => {
    if (!wcStore.walletKit) {
      throw new Error("WalletKit not initialized");
    }
    if (!modalStore.currentRequest) {
      throw new Error("Sign request not found");
    }
    const request = parseSendTransactionRequest(modalStore.currentRequest);
    const now = Math.floor(Date.now() / 1000);
    if (request.expiryTimestamp && now > request.expiryTimestamp) {
      throw new Error("Request expired");
    }
    const hash = await sendTransactionAsync({
      data: request.params.data,
      to: request.params.to,
      value: hexToBigInt(request.params.value ?? "0x0"),
    });
    const res = formatJsonRpcResult(request.id, hash);
    await wcStore.walletKit.respondSessionRequest({
      response: res,
      topic: modalStore.currentRequest.topic,
    });
  };

  return {
    acceptPendingProposal,
    handleRedirect,
    removeSearchParams,
    sendTx,
    signMessage,
    signTypedData,
    ...wcStore,
    ...modalStore,
  };
};
