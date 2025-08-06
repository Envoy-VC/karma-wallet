import { useState } from "react";

import { Button } from "@karma-wallet/ui/components/button";
import { Input } from "@karma-wallet/ui/components/input";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { buildApprovedNamespaces } from "@walletconnect/utils";
import { z } from "zod/v4";

import { walletKit } from "@/lib/walletkit";

const walletConnectSchema = z.object({
  requestId: z.string().optional(),
  sessionTopic: z.string().optional(),
  uri: z.string().optional(),
});

export const Route = createFileRoute("/wc")({
  component: RouteComponent,
  validateSearch: (search) => walletConnectSchema.parse(search),
});

function RouteComponent() {
  const [uri, setUri] = useState<string>("");
  const searchParams = useSearch({
    from: "/wc",
    shouldThrow: false,
  });

  walletKit.on("session_request", (args) => {
    console.log("Got Request", args);
  });

  walletKit.on("session_proposal", ({ id, params }) => {
    console.log("Got Proposal", { id, params });
    const approvedNamespaces = buildApprovedNamespaces({
      proposal: params,
      supportedNamespaces: {
        eip155: {
          accounts: ["eip155:1:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb"],
          chains: ["eip155:1"],
          events: ["accountsChanged", "chainChanged"],
          methods: ["eth_sendTransaction", "personal_sign"],
        },
      },
    });
    walletKit.approveSession({
      id: id,
      namespaces: approvedNamespaces,
    });
  });

  const onPair = async (uri: string) => {
    try {
      await walletKit.pair({ uri: uri });
    } catch (error) {
      console.log(error);
    }
  };

  walletKit.on("session_request", (args) => console.log(args));
  return (
    <div className="flex flex-col gap-3">
      <div>Search params: {JSON.stringify(searchParams, null, 2)}</div>
      <div className="flex flex-row items-center gap-2">
        <Input
          onChange={(e) => setUri(e.target.value)}
          placeholder="wc:304d7c26..."
          value={uri}
        />
        <Button onClick={async () => onPair(uri)}>Connect</Button>
      </div>
    </div>
  );
}
