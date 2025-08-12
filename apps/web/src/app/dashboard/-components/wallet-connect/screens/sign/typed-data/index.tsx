import { useMemo } from "react";

import { Button } from "@karma-wallet/ui/components/button";
import { SignatureIcon } from "lucide-react";
import * as chains from "viem/chains";

signTypedData;

import { signTypedData } from "viem/accounts";

import { useWalletConnect } from "@/hooks";
import { parseSession, parseSignTypedDataRequest } from "@/lib/utils";

import { SignTypedDataButton } from "./sign-typed-data-button";

export const SignTypedDataScreen = () => {
  const { currentSession, currentRequest } = useWalletConnect();

  const metadata = useMemo(() => {
    return parseSession(currentSession);
  }, [currentSession]);

  const request = useMemo(() => {
    if (!currentRequest) return null;
    return parseSignTypedDataRequest(currentRequest);
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
          <SignatureIcon className="size-6" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="font-medium text-neutral-700 text-xl">
            Sign Typed Data
          </div>
          <div className="font-medium text-neutral-400 text-sm">
            Sign a typed data using your Karma Smart Account
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
        <div className="px-2 font-medium text-neutral-600 text-sm">
          Typed Data
        </div>
        <div className="w-full space-y-2 overflow-auto whitespace-pre-wrap rounded-2xl bg-neutral-100 px-6 py-3 text-neutral-600">
          {JSON.stringify(request?.params.data.message, null, 2)}
        </div>
      </div>
      <div className="flex flex-row items-center gap-2 p-3">
        <SignTypedDataButton />
        <Button className="basis-1/2" variant="outline">
          Cancel
        </Button>
      </div>
    </div>
  );
};
