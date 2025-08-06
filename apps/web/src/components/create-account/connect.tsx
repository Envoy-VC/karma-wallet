import { useEffect, useState } from "react";

import { Button } from "@karma-wallet/ui/components/button";
import { useAppKit, useAppKitEvents, useDisconnect } from "@reown/appkit/react";
import { LogOutIcon } from "lucide-react";
import { useAccount } from "wagmi";

import { truncateEthAddress } from "@/lib/utils";

export const ConnectWallet = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useAppKit();

  const events = useAppKitEvents();

  const onConnect = () => {
    if (address) return;
    setIsConnecting(true);
    open();
  };

  const onDisconnect = async () => {
    await disconnect();
    setIsConnecting(false);
  };

  useEffect(() => {
    if (events.data.event === "MODAL_CLOSE") {
      setIsConnecting(false);
    }
  }, [events]);

  if (address)
    return (
      <div className="flex h-9 items-center justify-between rounded-2xl border-[1.5px] border-neutral-400 px-3 text-neutral-400">
        <div>{truncateEthAddress(address)}</div>
        <Button onClick={onDisconnect} size="icon" variant="link">
          <LogOutIcon className="text-neutral-400" strokeWidth={2} />
        </Button>
      </div>
    );

  return (
    <Button className="!w-full" onClick={onConnect} variant="default">
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
};
