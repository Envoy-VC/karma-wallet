import { useCallback, useEffect, useState } from "react";

import { createWalletKit } from "@/lib/walletkit";

import { useWalletConnect } from "./use-wc";

let startedInit = false;
export const useInitialize = () => {
  const [initialized, setInitialized] = useState(false);
  const { setWalletKit } = useWalletConnect();

  const onInitialize = useCallback(async () => {
    if (startedInit) {
      return;
    }
    startedInit = true;
    try {
      const walletKit = await createWalletKit();
      console.log("walletKit", walletKit);
      setWalletKit(walletKit);
      setInitialized(true);
    } catch (error) {
      console.error(error);
    } finally {
      startedInit = false;
    }
  }, [setWalletKit]);

  useEffect(() => {
    if (!initialized) {
      onInitialize();
    }
  }, [initialized, onInitialize]);

  return initialized;
};
