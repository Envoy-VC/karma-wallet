import { Button } from "@karma-wallet/ui/components/button";
import { KarmaLogo } from "@karma-wallet/ui/icons";
import { Link } from "@tanstack/react-router";
import {
  ExternalLinkIcon,
  FuelIcon,
  GlobeIcon,
  TargetIcon,
} from "lucide-react";

import { useWalletConnect } from "@/hooks";

export const DefaultScreen = () => {
  const { setActiveScreen } = useWalletConnect();

  return (
    <div>
      <div className="flex flex-row items-start gap-2 border-neutral-300 border-b p-4 text-primary">
        <div className="flex size-10 items-center justify-center rounded-full">
          <KarmaLogo className="size-8" fill="currentColor" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="font-medium text-neutral-700 text-xl">
            Welcome to Karma Wallet
          </div>
          <div className="font-medium text-neutral-400 text-sm">
            Save on every transaction.
          </div>
        </div>
      </div>
      <div className="space-y-4 border-neutral-300 border-b p-4">
        <div className="flex w-full flex-row items-start gap-2">
          <div className="flex size-8 min-h-8 min-w-8 items-center justify-center rounded-full bg-primary/10">
            <GlobeIcon className="size-4 text-primary" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="font-medium text-base">Control using your EOA</div>
            <div className="font-medium text-neutral-400 text-xs">
              Your Karma Smart Wallet will be controlled by your EOA which
              supports al EVM chains.
            </div>
          </div>
        </div>
        <div className="flex w-full flex-row items-start gap-2">
          <div className="flex size-8 min-h-8 min-w-8 items-center justify-center rounded-full bg-primary/10">
            <FuelIcon className="size-4 text-primary" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="font-medium text-base">
              Save on every transaction
            </div>
            <div className="font-medium text-neutral-400 text-xs">
              Every Transaction the Smart Account will save to the nearest Gas
              fees used by the Network.
            </div>
          </div>
        </div>
        <div className="flex w-full flex-row items-start gap-2">
          <div className="flex size-8 min-h-8 min-w-8 items-center justify-center rounded-full bg-primary/10">
            <TargetIcon className="size-4 text-primary" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="font-medium text-base">Create Goals</div>
            <div className="font-medium text-neutral-400 text-xs">
              Create Goals and targets for your savings and track your progress.
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1 p-4">
        <Button
          className="!rounded-full w-full"
          onClick={() => {
            setActiveScreen("connect");
          }}
        >
          Connect
        </Button>
        <Button className="mx-auto text-sm" variant="link">
          <Link className="flex flex-row items-center gap-2" to="/">
            Learn more about Karma Wallet
            <ExternalLinkIcon className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};
