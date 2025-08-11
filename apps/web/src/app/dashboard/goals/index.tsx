import { buttonVariants } from "@karma-wallet/ui/components/button";
import { cn } from "@karma-wallet/ui/lib/utils";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";

import { db } from "@/db";
import { useSmartAccount } from "@/hooks";

import { GoalCard } from "../-components/goal-card";

export const Route = createFileRoute("/dashboard/goals/")({
  component: GoalsPage,
});

function GoalsPage() {
  const { address } = useSmartAccount();
  const goals = useLiveQuery(
    async () => await db.goals.where({ account: address }).toArray(),
  );
  return (
    <div className="mx-auto h-full max-w-screen-lg py-8">
      <div className="flex flex-row items-center justify-between gap-2">
        <div className="font-medium text-3xl">Goals</div>
        <Link
          className={cn(buttonVariants({ variant: "default" }))}
          to="/dashboard/goals/create"
        >
          Create Goal
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 py-12 md:grid-cols-3">
        {goals?.map((goal) => {
          return <GoalCard goal={goal} key={goal.name} />;
        })}
      </div>
    </div>
  );
}
