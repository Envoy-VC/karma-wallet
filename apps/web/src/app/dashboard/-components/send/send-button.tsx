import { useMemo } from "react";

import { Button } from "@karma-wallet/ui/components/button";
import { PlusIcon } from "@karma-wallet/ui/icons";
import { CircleCheckIcon, Loader2Icon, XCircleIcon } from "lucide-react";
import { type Hex, parseEther } from "viem";

import { useSend, useSmartAccount } from "@/hooks";
import { sleep } from "@/lib/utils";

export const SendButton = () => {
  const { sendEth } = useSmartAccount();
  const { amount, receiver, buttonStatus, sendingState, setSendingState } =
    useSend();

  const onSend = async () => {
    try {
      setSendingState("sending");
      await sendEth(receiver as Hex, parseEther(amount.toString()));
      setSendingState("sent");
      await sleep("2s");
      setSendingState("idle");
    } catch (error: unknown) {
      setSendingState("error");
      console.error(error);
      await sleep("2s");
      setSendingState("idle");
    }
  };

  const icon = useMemo(() => {
    if (buttonStatus) return null;
    if (sendingState === "idle")
      return <PlusIcon size={20} stroke="currentColor" strokeWidth={2} />;
    else if (sendingState === "sending")
      return (
        <Loader2Icon
          className="animate-spin-fast will-change-transform"
          size={20}
          stroke="currentColor"
          strokeWidth={2}
        />
      );
    else if (sendingState === "sent")
      return (
        <CircleCheckIcon
          className="fill-success text-white outline-success"
          size={20}
          strokeWidth={2}
        />
      );
    else if (sendingState === "error")
      return <XCircleIcon size={20} stroke="currentColor" strokeWidth={2} />;
  }, [sendingState, buttonStatus]);

  const variant = useMemo(() => {
    if (sendingState === "idle") return "duotone-primary";
    else if (sendingState === "sending") return "duotone-warning";
    else if (sendingState === "sent") return "duotone-success";
    else if (sendingState === "error") return "duotone-destructive";
  }, [sendingState]);

  const text = useMemo(() => {
    if (buttonStatus) return buttonStatus;
    if (sendingState === "idle") return "Send";
    else if (sendingState === "sending") return "Sending...";
    else if (sendingState === "sent") return "Sent";
    else if (sendingState === "error") return "Error";
  }, [sendingState, buttonStatus]);

  return (
    <Button
      animateKey={sendingState}
      className="!w-full"
      disabled={buttonStatus !== undefined}
      icon={icon}
      iconKey={sendingState}
      onClick={onSend}
      variant={variant}
    >
      {text}
    </Button>
  );
};
