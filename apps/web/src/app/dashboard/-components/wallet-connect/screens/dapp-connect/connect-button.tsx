import { useMemo } from "react";

import { Button } from "@karma-wallet/ui/components/button";
import { CircleCheckIcon, Loader2Icon, XCircleIcon } from "lucide-react";
import { toast } from "sonner";

import { useWalletConnect } from "@/hooks";
import { parseErrorMessage, sleep } from "@/lib/utils";

export const ConnectDappButton = () => {
  const {
    connectionStatus,
    setConnectionStatus,
    acceptPendingProposal,
    setActiveScreen,
    setPendingProposal,
  } = useWalletConnect();

  const onCreateWallet = async () => {
    try {
      setConnectionStatus("connecting");
      await acceptPendingProposal();
      setConnectionStatus("connected");
      toast.success("Connection Successful");
      await sleep("2s");
      setConnectionStatus("idle");
      await sleep("1s");
      setActiveScreen("default");
      setPendingProposal(undefined);
    } catch (error: unknown) {
      setConnectionStatus("error");
      console.error(error);
      toast.error(parseErrorMessage(error));
      await sleep("2s");
      setConnectionStatus("idle");
      await sleep("1s");
      setActiveScreen("default");
    }
  };

  const icon = useMemo(() => {
    if (connectionStatus === "idle") return null;
    else if (connectionStatus === "connecting")
      return (
        <Loader2Icon
          className="animate-spin-fast will-change-transform"
          size={20}
          stroke="currentColor"
          strokeWidth={2}
        />
      );
    else if (connectionStatus === "connected")
      return (
        <CircleCheckIcon className="text-white" size={20} strokeWidth={2} />
      );
    else if (connectionStatus === "error")
      return <XCircleIcon size={20} stroke="currentColor" strokeWidth={2} />;
  }, [connectionStatus]);

  const text = useMemo(() => {
    if (connectionStatus === "idle") return "Connect";
    else if (connectionStatus === "connecting") return "Connecting...";
    else if (connectionStatus === "connected") return "Connected";
    else if (connectionStatus === "error") return "Error";
  }, [connectionStatus]);

  return (
    <Button
      animateKey={connectionStatus}
      className="!w-full"
      disabled={connectionStatus !== "idle"}
      icon={icon}
      iconKey={connectionStatus}
      onClick={onCreateWallet}
      variant="default"
    >
      {text}
    </Button>
  );
};
