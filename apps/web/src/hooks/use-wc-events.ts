import { useCallback, useEffect } from "react";

import type { SignClientTypes } from "@walletconnect/types";
import { buildApprovedNamespaces } from "@walletconnect/utils";
import { useChains } from "wagmi";

import { useSmartAccount } from "./use-account";
import { useWalletConnect } from "./use-wc";

export const useWalletConnectEvents = (initialized: boolean) => {
  const { walletKit } = useWalletConnect();
  const { address } = useSmartAccount();
  const chains = useChains();
  // ===========================================================================
  //                           Session Proposal
  // ===========================================================================
  const onSessionProposal = useCallback(
    async (proposal: SignClientTypes.EventArguments["session_proposal"]) => {
      console.log("session_proposal", proposal);
      const { id, params } = proposal;
      if (!walletKit) return;

      const eipChains = chains.map((c) => `eip155:11155111`);
      const eipAccounts = chains.map((c) => `eip155:11155111:${address}`);

      console.log("eipChains", eipChains);
      console.log("eipAccounts", eipAccounts);

      const approvedNamespaces = buildApprovedNamespaces({
        proposal: params,
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
      await walletKit.approveSession({
        id: id,
        namespaces: approvedNamespaces,
      });
      console.log("Session approved");
    },
    [walletKit, address, chains],
  );

  // ===========================================================================
  //                           Session Request
  // ===========================================================================
  const onSessionRequest = useCallback(
    (requestEvent: SignClientTypes.EventArguments["session_request"]) => {
      console.log("session_request", requestEvent);
    },
    [],
  );

  // ===========================================================================
  //                           Session Authenticate
  // ===========================================================================
  const onSessionAuthenticate = useCallback(
    (authRequest: SignClientTypes.EventArguments["session_authenticate"]) => {
      console.log("session_authenticate", authRequest);
    },
    [],
  );

  const refreshSessionsList = () => {
    if (!walletKit) return;
    const sessions = walletKit.getActiveSessions();
    console.log("sessions", sessions);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: safe
  useEffect(() => {
    if (initialized && walletKit) {
      //sign
      walletKit.on("session_proposal", onSessionProposal);
      walletKit.on("session_request", onSessionRequest);
      // TODOs
      walletKit.engine.signClient.events.on("session_ping", (data) =>
        console.log("ping", data),
      );
      walletKit.on("session_delete", (data) => {
        console.log("session_delete event received", data);
        refreshSessionsList();
      });
      walletKit.on("session_authenticate", onSessionAuthenticate);
      // load sessions on init
      refreshSessionsList();
    }
  }, [initialized, onSessionAuthenticate, onSessionProposal, onSessionRequest]);
};
