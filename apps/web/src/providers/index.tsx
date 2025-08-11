import type { PropsWithChildren } from "react";

import { QueryProvider } from "./query";
import { WagmiProvider } from "./wagmi";
import { WalletConnectProvider } from "./wc";

export const ProviderTree = ({ children }: PropsWithChildren) => {
  return (
    <WagmiProvider>
      <QueryProvider>
        <WalletConnectProvider>{children}</WalletConnectProvider>
      </QueryProvider>
    </WagmiProvider>
  );
};
