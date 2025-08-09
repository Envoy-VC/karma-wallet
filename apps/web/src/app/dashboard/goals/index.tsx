import { createFileRoute } from "@tanstack/react-router";

import { CreateGoalForm } from "../-components/create-goal";

export const Route = createFileRoute("/dashboard/goals/")({
  component: SendPage,
});

function SendPage() {
  return (
    <div className="relative h-full">
      <div className="py-8">
        <CreateGoalForm />
      </div>
    </div>
  );
}
