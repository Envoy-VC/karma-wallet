import { useEffect } from "react";

import { createFileRoute, useSearch } from "@tanstack/react-router";
import { z } from "zod/v4";

import { useWalletConnect } from "@/hooks";

import { WalletConnectCard } from "./-components";

const walletConnectSchema = z.object({
  requestId: z.number().optional(),
  sessionTopic: z.string().optional(),
  uri: z.string().optional(),
});

const WalletConnectPage = () => {
  const searchParams = useSearch({
    from: "/dashboard/wc",
    shouldThrow: false,
  });
  const { setConnectionString, setActiveScreen } = useWalletConnect();

  useEffect(() => {
    if (searchParams?.uri) {
      setConnectionString(searchParams.uri);
      setActiveScreen("connect");
    }
  }, [searchParams, setConnectionString, setActiveScreen]);

  return (
    <div className="relative h-full">
      <div className="absolute top-[10%] right-1/2 translate-x-1/2">
        <WalletConnectCard />
      </div>
    </div>
  );
};

export const Route = createFileRoute("/dashboard/wc")({
  component: WalletConnectPage,
  validateSearch: (search) => walletConnectSchema.parse(search),
});
