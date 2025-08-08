import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/savings")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/dashboard/savings"!</div>;
}
