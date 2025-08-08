import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@karma-wallet/ui/components/select";
import { cn } from "@karma-wallet/ui/lib/utils";

import { TokenAddress } from "@/data/address";
import { useSend } from "@/hooks";
import type { TokenType } from "@/lib/stores";

export const SelectToken = () => {
  const { token, onTokenChange } = useSend();
  return (
    <Select
      onValueChange={(value: TokenType) => onTokenChange(value)}
      value={token}
    >
      <SelectTrigger
        className={cn(
          "hover:!bg-primary/[0.15] !text-primary focus-visible:!outline-none !border-primary/10 min-w-[7rem] items-center justify-center rounded-full bg-primary/[0.125] text-sm shadow-none focus-visible:ring-0 focus-visible:ring-primary/20",
        )}
      >
        <SelectValue placeholder="Select Token" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(TokenAddress["2810"]).map(([symbol, data]) => {
          return (
            <SelectItem key={symbol} value={symbol}>
              <div className="flex flex-row items-center gap-2 text-base">
                <img alt={symbol} className="size-6" src={data.icon} />

                <div>{data.name}</div>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
