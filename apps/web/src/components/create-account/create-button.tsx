import { useMemo, useState } from "react";

import { Button } from "@karma-wallet/ui/components/button";
import { PlusIcon } from "@karma-wallet/ui/icons";
import { useNavigate } from "@tanstack/react-router";
import { CircleCheckIcon, Loader2Icon, XCircleIcon } from "lucide-react";
import { toSimpleSmartAccount } from "permissionless/accounts";
import { useLocalStorage } from "usehooks-ts";
import { entryPoint07Address } from "viem/account-abstraction";
import { usePublicClient, useWalletClient } from "wagmi";

import { ContractAddress } from "@/data/address";
import { sleep } from "@/lib/utils";

export const CreateAccountButton = () => {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const navigate = useNavigate();

  const [karmaAddress, setKarmaAddress] = useLocalStorage<string | null>(
    "karmaAccount",
    null,
  );

  const [creatingState, setCreatingState] = useState<
    "idle" | "creating" | "created" | "error"
  >("idle");

  const onCreateWallet = async () => {
    try {
      setCreatingState("creating");
      if (!(publicClient && walletClient)) {
        throw new Error("Wallet not connected");
      }
      if (karmaAddress) {
        throw new Error("Account already created");
      }
      const karmaAccount = await toSimpleSmartAccount({
        client: publicClient,
        entryPoint: {
          address: entryPoint07Address,
          version: "0.7",
        },
        factoryAddress: ContractAddress.karamaccountFactory,
        owner: walletClient,
      });

      setKarmaAddress(karmaAccount.address);
      setCreatingState("created");
      await sleep("2s");
      setCreatingState("idle");

      navigate({ to: "/dashboard" });
    } catch (error: unknown) {
      setCreatingState("error");
      console.error(error);
      await sleep("2s");
      setCreatingState("idle");
    }
  };

  const icon = useMemo(() => {
    if (creatingState === "idle")
      return <PlusIcon size={20} stroke="currentColor" strokeWidth={2} />;
    else if (creatingState === "creating")
      return (
        <Loader2Icon
          className="animate-spin-fast will-change-transform"
          size={20}
          stroke="currentColor"
          strokeWidth={2}
        />
      );
    else if (creatingState === "created")
      return (
        <CircleCheckIcon
          className="fill-success text-white outline-success"
          size={20}
          strokeWidth={2}
        />
      );
    else if (creatingState === "error")
      return <XCircleIcon size={20} stroke="currentColor" strokeWidth={2} />;
  }, [creatingState]);

  const variant = useMemo(() => {
    if (creatingState === "idle") return "duotone-primary";
    else if (creatingState === "creating") return "duotone-warning";
    else if (creatingState === "created") return "duotone-success";
    else if (creatingState === "error") return "duotone-destructive";
  }, [creatingState]);

  const text = useMemo(() => {
    if (creatingState === "idle") return "Create Account";
    else if (creatingState === "creating") return "Creating...";
    else if (creatingState === "created") return "Account Created";
    else if (creatingState === "error") return "Error";
  }, [creatingState]);

  return (
    <Button
      animateKey={creatingState}
      className="!w-full"
      icon={icon}
      iconKey={creatingState}
      onClick={onCreateWallet}
      variant={variant}
    >
      {text}
    </Button>
  );
};
