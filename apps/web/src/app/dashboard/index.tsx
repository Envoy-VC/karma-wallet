import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { FuelIcon, HandCoinsIcon } from "lucide-react";

import { getLastWeekStatistics } from "@/db";
import { useBalances } from "@/hooks";
import { humanizeNumber } from "@/lib/utils";

import { DashboardCard, SavingsTable, WeeklySavingsChart } from "./-components";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardPage,
});

function DashboardPage() {
  const balances = useBalances();
  const stats = useLiveQuery(
    async () => await getLastWeekStatistics(balances.ethPrice),
  );
  return (
    <div className="mx-auto h-full max-w-screen-xl space-y-4 px-2 py-4 md:py-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          color="#7DD3FC"
          icon={HandCoinsIcon}
          subtitle={{
            text: "Since last week",
            value: stats?.totalSavings.change ?? 0,
          }}
          title="Total Savings"
          value={`$${stats?.totalSavings.usd ?? 0}`}
        />
        <DashboardCard
          color="#FBCFE8"
          icon={FuelIcon}
          subtitle={{
            text: "Since last week",
            value: stats?.totalGasSpent.change ?? 0,
          }}
          title="Total Gas Spent"
          value={`${humanizeNumber(stats?.totalGasSpent.wei ?? 0)} wei`}
        />
        <DashboardCard
          color="#FDE68A"
          icon={HandCoinsIcon}
          subtitle={{
            text: "Since last week",
            value: stats?.totalSavings.change ?? 0,
          }}
          title="Total Gas Saved"
          value={`${humanizeNumber(stats?.totalSavings.gwei ?? 0)} Gwei`}
        />
      </div>
      <WeeklySavingsChart />
      <SavingsTable />
    </div>
  );
}
