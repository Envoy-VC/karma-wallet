import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@karma-wallet/ui/components/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@karma-wallet/ui/components/chart";
import { useLiveQuery } from "dexie-react-hooks";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

import { getLastWeekChartData } from "@/db";
import { humanizeNumber } from "@/lib/utils";

export const description = "A stacked bar chart with a legend";

const chartConfig = {
  gasSaved: {
    color: "var(--chart-2)",
    label: "Gas Saved",
  },
  gasSpent: {
    color: "var(--chart-1)",
    label: "Gas Spent",
  },
  savings: {
    label: "Savings",
  },
} satisfies ChartConfig;

export const WeeklySavingsChart = () => {
  const chartData = useLiveQuery(async () => await getLastWeekChartData());

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base md:text-xl">
          Weekly Savings Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer className="max-h-[20rem] w-full" config={chartConfig}>
          <BarChart
            accessibilityLayer={true}
            className="flex w-full items-center justify-center"
            data={chartData}
          >
            <XAxis
              axisLine={false}
              dataKey="date"
              tickFormatter={(value) => {
                return new Date(value).toLocaleDateString("en-US", {
                  weekday: "short",
                });
              }}
              tickLine={false}
              tickMargin={10}
            />
            <YAxis
              axisLine={true}
              className="hidden md:block"
              dataKey="total"
              tickFormatter={(value) => {
                return humanizeNumber(value);
              }}
              tickLine={true}
              tickMargin={10}
            />
            <Bar
              dataKey="gasSpent"
              fill="var(--color-gasSpent)"
              label="Gas Spent"
              radius={[0, 0, 16, 16]}
              stackId="a"
            />
            <Bar
              dataKey="gasSaved"
              fill="var(--color-gasSaved)"
              label="Gas Saved"
              radius={[16, 16, 0, 0]}
              stackId="a"
            />
            <ChartTooltip
              content={
                <ChartTooltipContent indicator="line" labelKey="savings" />
              }
              cursor={false}
              defaultIndex={1}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
