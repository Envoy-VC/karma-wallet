import { createFileRoute } from "@tanstack/react-router";

import { SendContainer } from "../-components/send";

export const Route = createFileRoute("/dashboard/send/")({
  component: SendPage,
});

function SendPage() {
  return (
    <div className="h-full">
      <div className="translate-y-1/4 md:translate-y-1/2">
        <SendContainer />
      </div>
    </div>
  );
}
