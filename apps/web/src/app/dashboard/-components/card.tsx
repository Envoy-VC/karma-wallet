import { cn } from "@karma-wallet/ui/lib/utils";
import type { BowArrowIcon } from "lucide-react";

type DashboardCardProps = {
  icon: typeof BowArrowIcon;
  color: string;
  title: string;
  value: string;
  subtitle: {
    text: string;
    value: number;
  };
};

export const DashboardCard = ({
  icon: IconComp,
  color,
  title,
  value,
  subtitle,
}: DashboardCardProps) => {
  return (
    <div
      className="relative flex aspect-video w-full flex-col justify-between gap-2 rounded-3xl p-4"
      style={{
        backgroundColor: `${color}40`,
        border: `1px solid ${color}`,
      }}
    >
      <div
        className="absolute top-3 right-4 flex size-8 items-center justify-center rounded-lg p-1"
        style={{
          backgroundColor: `${color}40`,
        }}
      >
        <IconComp className="size-5 text-neutral-600" />
      </div>
      <div className="font-medium text-lg text-neutral-700">{title}</div>
      <div className="font-medium text-5xl">{value}</div>
      <div className="flex flex-row items-center gap-2">
        <div className="text-neutral-400">{subtitle.text}</div>
        <div
          className={cn(
            "rounded-full border px-2 py-[2px] text-xs",
            subtitle.value >= 0
              ? "border-green-500 bg-green-100 text-green-600"
              : "border-red-500 bg-red-100 text-red-500",
          )}
        >
          {subtitle.value >= 0 ? "+" : "-"}
          {subtitle.value} %
        </div>
      </div>
    </div>
  );
};
