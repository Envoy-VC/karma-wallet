import { createFileRoute } from "@tanstack/react-router";
import { FuelIcon, HandCoinsIcon } from "lucide-react";

import { DashboardCard, WeeklySavingsChart } from "./-components";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div className="mx-auto h-full max-w-screen-xl space-y-4 px-2 py-4 md:py-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          color="#7DD3FC"
          icon={HandCoinsIcon}
          subtitle={{
            text: "Since last week",
            value: 1.65,
          }}
          title="Total Savings"
          value="$12.87"
        />
        <DashboardCard
          color="#FBCFE8"
          icon={FuelIcon}
          subtitle={{
            text: "Since last week",
            value: 1.65,
          }}
          title="Total Gas Spent"
          value="123k Gwei"
        />
        <DashboardCard
          color="#FDE68A"
          icon={HandCoinsIcon}
          subtitle={{
            text: "Since last week",
            value: 1.65,
          }}
          title="Total Gas Saved"
          value="$12.87"
        />
      </div>
      <div className="h-[24rem]">
        <WeeklySavingsChart />
      </div>
    </div>
  );
}
