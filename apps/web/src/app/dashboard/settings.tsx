import { Button } from "@karma-wallet/ui/components/button";
import { createFileRoute } from "@tanstack/react-router";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";
import { useAccount } from "wagmi";

import { truncateEthAddress } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  const { address } = useAccount();
  return (
    <div className="mx-auto h-full max-w-screen-lg py-8">
      <div className="font-medium text-3xl">Settings</div>
      <div className="space-y-1 py-12">
        <div className="flex w-full flex-row items-center justify-between font-medium">
          <div className="text-lg">Account Address</div>

          <Button
            className="h-8 rounded-full text-neutral-500"
            onClick={async () => {
              await navigator.clipboard.writeText(address ?? "");
              toast.success("Copied to clipboard");
            }}
            variant="outline"
          >
            <div className="flex flex-row items-center gap-2">
              <div>{truncateEthAddress(address)}</div>
              <CopyIcon className="size-5 cursor-pointer text-neutral-500" />
            </div>
          </Button>
        </div>
        <div className="flex w-full flex-row items-center justify-between font-medium">
          <div className="text-lg">Connected Wallet</div>
          <Button
            className="h-8 rounded-full text-neutral-500"
            onClick={async () => {
              await navigator.clipboard.writeText(address ?? "");
              toast.success("Copied to clipboard");
            }}
            variant="outline"
          >
            <div className="flex flex-row items-center gap-2">
              <div>{truncateEthAddress(address)}</div>
              <CopyIcon className="size-5 cursor-pointer text-neutral-500" />
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
