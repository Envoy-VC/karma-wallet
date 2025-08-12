import { useMemo, useState } from "react";

import { Button } from "@karma-wallet/ui/components/button";
import { CircleCheckIcon, Loader2Icon, XCircleIcon } from "lucide-react";
import { toast } from "sonner";

import { useWalletConnect } from "@/hooks";
import { parseErrorMessage, sleep } from "@/lib/utils";

export const SignMessageButton = () => {
  const { setActiveScreen, signMessage, setCurrentRequest } =
    useWalletConnect();

  const [status, setStatus] = useState<
    "idle" | "in-progress" | "success" | "error"
  >("idle");

  const onSignMessage = async () => {
    try {
      setStatus("in-progress");
      await signMessage();
      setStatus("success");
      toast.success("Message Signed Successfully");
      await sleep("2s");
      setStatus("idle");
      await sleep("1s");
      setActiveScreen("default");
      setCurrentRequest(undefined);
    } catch (error: unknown) {
      setStatus("error");
      console.error(error);
      toast.error(parseErrorMessage(error));
      await sleep("2s");
      setStatus("idle");
      await sleep("1s");
      setActiveScreen("default");
    }
  };

  const icon = useMemo(() => {
    if (status === "idle") return null;
    else if (status === "in-progress")
      return (
        <Loader2Icon
          className="animate-spin-fast will-change-transform"
          size={20}
          stroke="currentColor"
          strokeWidth={2}
        />
      );
    else if (status === "success")
      return (
        <CircleCheckIcon className="text-white" size={20} strokeWidth={2} />
      );
    else if (status === "error")
      return <XCircleIcon size={20} stroke="currentColor" strokeWidth={2} />;
  }, [status]);

  const text = useMemo(() => {
    if (status === "idle") return "Sign";
    else if (status === "in-progress") return "Signing...";
    else if (status === "success") return "Success";
    else if (status === "error") return "Error";
  }, [status]);

  return (
    <Button
      animateKey={status}
      className="basis-1/2"
      disabled={status !== "idle"}
      icon={icon}
      iconKey={status}
      onClick={onSignMessage}
      variant="default"
    >
      {text}
    </Button>
  );
};
