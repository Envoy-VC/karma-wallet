import type { PropsWithChildren } from "react";

import { WagmiProvider as WagmiProviderCore } from "wagmi";

import { wagmiAdapter } from "@/lib/wagmi";

export const WagmiProvider = ({ children }: PropsWithChildren) => {
  return (
    <WagmiProviderCore config={wagmiAdapter.wagmiConfig}>
      {children}
    </WagmiProviderCore>
  );
};
