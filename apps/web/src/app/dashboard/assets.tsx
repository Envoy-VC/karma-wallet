import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/assets")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/dashboard/assets"!</div>;
}
