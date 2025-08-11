import type { PropsWithChildren } from "react";
import { useEffect } from "react";

import { RELAYER_EVENTS } from "@walletconnect/core";

import {
  useInitialize,
  useWalletConnect,
  useWalletConnectEvents,
} from "@/hooks";

export const WalletConnectProvider = ({ children }: PropsWithChildren) => {
  const initialized = useInitialize();
  useWalletConnectEvents(initialized);
  const { walletKit } = useWalletConnect();

  useEffect(() => {
    if (!initialized) return;
    walletKit?.core.relayer.on(RELAYER_EVENTS.connect, () => {
      console.log("Network connection is restored!");
    });

    walletKit?.core.relayer.on(RELAYER_EVENTS.disconnect, () => {
      console.log("Network connection is lost!");
    });
  }, [initialized, walletKit]);
  return <>{children}</>;
};
