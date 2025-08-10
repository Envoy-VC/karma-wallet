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
import { Bar, BarChart, XAxis, YAxis } from "recharts";

export const description = "A stacked bar chart with a legend";

const chartData = [
  { date: "2024-07-15", gasSaved: 300, gasSpent: 450, total: 850 },
  { date: "2024-07-16", gasSaved: 420, gasSpent: 380, total: 800 },
  { date: "2024-07-17", gasSaved: 120, gasSpent: 520, total: 640 },
  { date: "2024-07-18", gasSaved: 550, gasSpent: 140, total: 690 },
  { date: "2024-07-19", gasSaved: 350, gasSpent: 600, total: 950 },
  { date: "2024-07-20", gasSaved: 400, gasSpent: 480, total: 880 },
];

const chartConfig = {
  activities: {
    label: "Savings",
  },
  gasSaved: {
    color: "var(--chart-2)",
    label: "Gas Saved",
  },
  gasSpent: {
    color: "var(--chart-1)",
    label: "Gas Spent",
  },
} satisfies ChartConfig;

export const WeeklySavingsChart = () => {
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
            className="flex min-w-full items-center justify-center"
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
              label="Total"
              tickFormatter={(value) => {
                return `$${value.toLocaleString()}`;
              }}
              tickLine={true}
              tickMargin={10}
            />
            <Bar
              dataKey="gasSpent"
              fill="var(--color-gasSpent)"
              radius={[0, 0, 16, 16]}
              stackId="a"
            />
            <Bar
              dataKey="gasSaved"
              fill="var(--color-gasSaved)"
              radius={[16, 16, 0, 0]}
              stackId="a"
            />
            <ChartTooltip
              content={
                <ChartTooltipContent indicator="line" labelKey="activities" />
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
