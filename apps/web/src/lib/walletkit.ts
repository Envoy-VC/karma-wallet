import { WalletKit } from "@reown/walletkit";
import { Core } from "@walletconnect/core";

import { env } from "@/env";

export const createWalletKit = async () => {
  const core = new Core({
    customStoragePrefix: `karma-wallet`,
    projectId: env.VITE_REOWN_PROJECT_ID,
  });

  return await WalletKit.init({
    core,
    metadata: {
      description: "Demo Client as Wallet/Peer",
      icons: [],
      name: "Demo app",
      url: "https://karmawallet.com",
    },
  });
};
