import { useCallback, useEffect } from "react";

import type { SignClientTypes } from "@walletconnect/types";

import { useWalletConnect } from "./use-wc";

export const useWalletConnectEvents = (initialized: boolean) => {
  const {
    walletKit,
    setPendingProposal,
    setActiveScreen,
    setActiveSessions,
    setCurrentSession,
    setCurrentRequest,
  } = useWalletConnect();
  // ===========================================================================
  //                           Session Proposal
  // ===========================================================================
  const onSessionProposal = useCallback(
    (proposal: SignClientTypes.EventArguments["session_proposal"]) => {
      console.log("session_proposal", proposal);

      // Handle the session proposal
      setPendingProposal(proposal);
      setActiveScreen("dapp-connect");
    },
    [setActiveScreen, setPendingProposal],
  );

  // ===========================================================================
  //                           Session Request
  // ===========================================================================
  const onSessionRequest = useCallback(
    (requestEvent: SignClientTypes.EventArguments["session_request"]) => {
      console.log("session_request", requestEvent);

      const { topic, params } = requestEvent;
      const { request } = params;
      const requestSession = walletKit?.engine.signClient.session.get(topic);
      setCurrentSession(requestSession);
      setCurrentRequest(requestEvent);

      if (["eth_sign", "personal_sign"].includes(request.method)) {
        setActiveScreen("sign-message");
      } else if (request.method === "eth_signTypedData_v4") {
        setActiveScreen("sign-typed-data");
      } else if (request.method === "eth_sendTransaction") {
        setActiveScreen("send-tx");
      }
    },
    [setActiveScreen, setCurrentRequest, setCurrentSession, walletKit],
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
    console.log("SESSIONS", sessions);
    setActiveSessions(sessions);
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
