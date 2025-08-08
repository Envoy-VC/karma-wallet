import { Button } from "@karma-wallet/ui/components/button";
import { Input } from "@karma-wallet/ui/components/input";
import { ArrowDownIcon } from "lucide-react";

import { useSend } from "@/hooks";

import { SelectToken } from "./select-token";

export const SendContainer = () => {
  const {
    amount,
    receiver,
    onAmountChange,
    onReceiverChange,
    amountInUsd,
    currentTokenBalance,
    onMax,
    buttonStatus,
  } = useSend();

  return (
    <div className="flex w-full max-w-sm flex-col gap-4 rounded-2xl">
      <div className="relative flex flex-col gap-1">
        <div className="-translate-y-1/2 absolute top-1/2 right-1/2 translate-x-1/2">
          <div className="flex size-8 items-center justify-center rounded-lg border border-neutral-200/50 bg-neutral-100">
            <ArrowDownIcon className="text-neutral-400" size={16} />
          </div>
        </div>
        <div className="flex h-[6rem] flex-col items-center gap-2 rounded-3xl border border-neutral-200 bg-neutral-50/50 px-4 py-4 hover:bg-neutral-50">
          <div className="flex flex-row items-center">
            <Input
              className="!text-3xl border-none text-neutral-600 shadow-none outline-none placeholder:text-3xl placeholder:text-neutral-400 focus-visible:border-none focus-visible:ring-0"
              min={0}
              onChange={(e) => onAmountChange(Number(e.target.value))}
              placeholder="0"
              type="number"
              value={amount}
            />
            <SelectToken />
          </div>
          <div className="flex w-full flex-row items-center justify-between text-neutral-600">
            <div>${amountInUsd.toLocaleString()}</div>
            <div className="flex flex-row items-center gap-[2px]">
              <div className="text-sm">{currentTokenBalance()}</div>
              <Button
                className="!text-xs !p-0 !m-0 h-6 w-10 text-primary hover:text-primary"
                onClick={onMax}
                size="sm"
                variant="ghost"
              >
                Max
              </Button>
            </div>
          </div>
        </div>
        <div className="flex h-[6rem] flex-col items-center justify-center gap-2 rounded-3xl border border-neutral-200 bg-neutral-50/50 px-4 py-4 hover:bg-neutral-50">
          <Input
            autoCorrect="off"
            className="!text-xl border-none text-neutral-600 shadow-none outline-none placeholder:text-neutral-400 placeholder:text-xl focus-visible:border-none focus-visible:ring-0"
            onChange={(e) => onReceiverChange(e.target.value)}
            placeholder="Receiver Address"
            value={receiver}
          />
        </div>
      </div>
      <Button className="w-full" disabled={buttonStatus !== undefined}>
        {buttonStatus ?? "Send"}
      </Button>
    </div>
  );
};
