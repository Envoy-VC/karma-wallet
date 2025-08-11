import { createFileRoute, useSearch } from "@tanstack/react-router";
import { z } from "zod/v4";

import { WalletConnectCard } from "./-components";

const walletConnectSchema = z.object({
  requestId: z.number().optional(),
  sessionTopic: z.string().optional(),
  uri: z.string().optional(),
});

export const Route = createFileRoute("/dashboard/wc")({
  component: WalletConnectPage,
  validateSearch: (search) => walletConnectSchema.parse(search),
});

function WalletConnectPage() {
  const searchParams = useSearch({
    from: "/dashboard/wc",
    shouldThrow: false,
  });

  return (
    <div className="h-full">
      <div className="translate-y-1/4 md:translate-y-1/2">
        <WalletConnectCard />
      </div>
    </div>
  );
}
