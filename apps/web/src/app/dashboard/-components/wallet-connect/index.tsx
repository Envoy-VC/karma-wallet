import { AnimateChangeInHeight } from "@/components";
import { useWalletConnect } from "@/hooks";

import { ConnectScreen, DefaultScreen } from "./screens";

const Comp = () => {
  const { activeScreen } = useWalletConnect();
  if (activeScreen === "connect") {
    return <ConnectScreen />;
  } else if (activeScreen === "default") {
    return <DefaultScreen />;
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
