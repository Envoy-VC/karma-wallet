import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { createConfig, http } from "wagmi";
import { anvil, type Chain } from "wagmi/chains";

import { env } from "@/env";

const projectId = env.VITE_REOWN_PROJECT_ID;

const networks = [anvil] as [Chain];

const metadata = {
  description: "Smart Wallet which rewards you for your Karma",
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
  name: "Karma Wallet",
  url: "http://localhost:3000",
};

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: false,
});

createAppKit({
  adapters: [wagmiAdapter],
  features: {
    analytics: true,
  },
  metadata,
  networks,
  projectId,
});

export const wagmiConfig = createConfig({
  chains: [anvil],
  transports: {
    [anvil.id]: http(),
  },
});
