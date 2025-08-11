import { useEffect, useState } from "react";

import { Button } from "@karma-wallet/ui/components/button";
import { Input } from "@karma-wallet/ui/components/input";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { z } from "zod/v4";

import { useWalletConnect } from "@/hooks";

const walletConnectSchema = z.object({
  requestId: z.number().optional(),
  sessionTopic: z.string().optional(),
  uri: z.string().optional(),
});

export const Route = createFileRoute("/wc")({
  component: WalletConnectPage,
  validateSearch: (search) => walletConnectSchema.parse(search),
});

function WalletConnectPage() {
  const { walletKit } = useWalletConnect();
  const [uri, setUri] = useState<string>("");
  const searchParams = useSearch({
    from: "/wc",
    shouldThrow: false,
  });

  const onPair = async (uri: string) => {
    try {
      if (!walletKit) {
        console.warn("WalletKit not initialized");
        return;
      }
      await walletKit.pair({ uri: uri });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (searchParams?.uri) {
      setUri(searchParams.uri);
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col gap-3">
      {/* <div>Search params: {JSON.stringify(searchParams, null, 2)}</div> */}
      <div className="flex flex-col items-center gap-2">
        <Input
          onChange={(e) => setUri(e.target.value)}
          placeholder="wc:304d7c26..."
          value={uri}
        />
        URI: {uri}
        <Button onClick={async () => await onPair(uri)}>Connect</Button>
      </div>
    </div>
  );
}
