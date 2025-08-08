import { createFileRoute } from "@tanstack/react-router";

import { SendContainer } from "./-components/send";

export const Route = createFileRoute("/dashboard/send")({
  component: SendPage,
});

function SendPage() {
  return (
    <div className="relative h-full">
      <div className="absolute top-1/3 right-1/2 w-full max-w-sm translate-x-1/2">
        <SendContainer />
      </div>
    </div>
  );
}
