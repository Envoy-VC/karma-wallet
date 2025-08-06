import { WalletKit } from "@reown/walletkit";
import { Core } from "@walletconnect/core";

import { env } from "@/env";

const core = new Core({
  projectId: env.VITE_REOWN_PROJECT_ID,
});

export const walletKit = await WalletKit.init({
  core,
  metadata: {
    description: "Demo Client as Wallet/Peer",
    icons: [],
    name: "Demo app",
    url: "https://reown.com/walletkit",
  },
});
