import type { PropsWithChildren } from "react";

import { QueryProvider } from "./query";
import { WagmiProvider } from "./wagmi";

export const ProviderTree = ({ children }: PropsWithChildren) => {
  return (
    <WagmiProvider>
      <QueryProvider>{children}</QueryProvider>
    </WagmiProvider>
  );
};
