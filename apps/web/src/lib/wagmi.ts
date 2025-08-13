import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { createPimlicoClient } from "permissionless/clients/pimlico";
import { createPublicClient } from "viem";
import { entryPoint07Address } from "viem/account-abstraction";
import { http } from "wagmi";
import { type Chain, morphHolesky } from "wagmi/chains";

import { env } from "@/env";

const projectId = env.VITE_REOWN_PROJECT_ID;
const bundlerUrl = env.VITE_BUNDLER_URL;

export const chain = morphHolesky;

const networks = [chain] as [Chain];

export const publicClient = createPublicClient({
  chain: chain,
  transport: http(),
});

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

export const pimlicoClient = createPimlicoClient({
  entryPoint: {
    address: entryPoint07Address,
    version: "0.7",
  },
  transport: http(bundlerUrl),
});

createAppKit({
  adapters: [wagmiAdapter],
  features: {
    analytics: true,
    email: false,
    socials: false,
    swaps: false,
  },
  metadata,
  networks,
  projectId,
  themeMode: "light",
  themeVariables: {
    "--w3m-accent": "#000",
    "--w3m-border-radius-master": "4px",
  },
});
