import { AnimateChangeInHeight } from "@/components";
import { useWalletConnect } from "@/hooks";

import { ConnectScreen, DappConnectScreen, DefaultScreen } from "./screens";

const Comp = () => {
  const { activeScreen } = useWalletConnect();
  if (activeScreen === "connect") {
    return <ConnectScreen />;
  } else if (activeScreen === "default") {
    return <DefaultScreen />;
  } else if (activeScreen === "dapp-connect") {
    return <DappConnectScreen />;
  } else {
    return <DefaultScreen />;
  }
};

export const WalletConnectCard = () => {
  return (
    <AnimateChangeInHeight>
      <div className="mx-auto max-w-sm space-y-2 rounded-[1.5rem] border shadow">
        <Comp />
      </div>
    </AnimateChangeInHeight>
  );
};
