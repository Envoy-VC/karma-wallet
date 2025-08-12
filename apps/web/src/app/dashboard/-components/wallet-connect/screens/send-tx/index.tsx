import { useMemo } from "react";

import { Button } from "@karma-wallet/ui/components/button";
import { BadgePlusIcon, CopyIcon } from "lucide-react";
import { toast } from "sonner";
import { formatEther, hexToBigInt } from "viem";
import * as chains from "viem/chains";

import { useWalletConnect } from "@/hooks";
import {
  parseSendTransactionRequest,
  parseSession,
  truncateEthAddress,
} from "@/lib/utils";

import { SendTxButton } from "./send-tx-button";

export const SendTxScreen = () => {
  const { currentSession, currentRequest } = useWalletConnect();

  const metadata = useMemo(() => {
    return parseSession(currentSession);
  }, [currentSession]);

  const request = useMemo(() => {
    if (!currentRequest) return null;
    return parseSendTransactionRequest(currentRequest);
  }, [currentRequest]);

  const chain = useMemo(() => {
    const chainId = Number(
      (currentRequest?.params.chainId ?? "eip155:1").split(":")[1] ?? "1",
    );
    return Object.values(chains).find((c) => Number(c.id) === chainId);
  }, [currentRequest]);

  return (
    <div>
      <div className="flex flex-row items-start gap-2 border-neutral-300 border-b p-4 text-primary">
        <div className="flex size-10 min-w-10 items-center justify-center rounded-full bg-primary/10">
          <BadgePlusIcon className="size-6" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="font-medium text-neutral-700 text-xl">
            Send Transaction
          </div>
          <div className="font-medium text-neutral-400 text-sm">
            Send a transaction using your Karma Smart Account
          </div>
        </div>
      </div>
      <div className="border-neutral-300 border-b p-3">
        <div className="w-full space-y-2 rounded-2xl bg-neutral-100 px-6 py-3">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-2">
              <div className="font-medium text-neutral-500 text-sm">
                App Name
              </div>
            </div>
            <div className="flex flex-row items-center gap-2">
              <img
                alt={metadata.name}
                className="size-6 rounded-lg"
                src={metadata.icon}
              />
              <div className="font-medium text-neutral-500 text-sm">
                {metadata.name}
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-2">
              <div className="font-medium text-neutral-500 text-sm">
                Network
              </div>
            </div>
            <div className="flex flex-row items-center gap-2">
              <div className="font-medium text-neutral-500 text-sm">
                {chain?.name}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-2 border-neutral-300 border-b p-3">
        <div className="w-full space-y-2 rounded-2xl bg-neutral-100 px-6 py-3">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-2">
              <div className="font-medium text-neutral-500 text-sm">To</div>
            </div>
            <div className="flex flex-row items-center">
              <div className="font-medium text-neutral-500 text-sm">
                {truncateEthAddress(request?.params.to)}
              </div>
              <Button
                className="text-neutral-500"
                onClick={async () => {
                  await navigator.clipboard.writeText(request?.params.to ?? "");
                  toast.success("Copied to clipboard");
                }}
                size="icon"
                variant="ghost"
              >
                <CopyIcon className="size-3" strokeWidth={2.5} />
              </Button>
            </div>
          </div>
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-2">
              <div className="font-medium text-neutral-500 text-sm">Value</div>
            </div>
            <div className="flex flex-row items-center">
              <div className="font-medium text-neutral-500 text-sm">
                {formatEther(hexToBigInt(request?.params.value ?? "0x0"))} ETH
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center gap-2">
              <div className="font-medium text-neutral-500 text-sm">Data</div>
            </div>
            <div className="flex flex-row items-center">
              <div className="break-all font-medium text-neutral-500 text-sm">
                {request?.params.data ?? "0x0"}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center gap-2 p-3">
        <SendTxButton />
        <Button className="basis-1/2" variant="outline">
          Cancel
        </Button>
      </div>
    </div>
  );
};
