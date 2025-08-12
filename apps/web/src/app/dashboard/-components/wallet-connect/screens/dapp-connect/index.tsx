import { useMemo } from "react";

import { ExternalLinkIcon } from "lucide-react";

import { useWalletConnect } from "@/hooks";

import { ConnectDappButton } from "./connect-button";

export const DappConnectScreen = () => {
  const { pendingProposal } = useWalletConnect();

  const metadata = useMemo(() => {
    const name = pendingProposal?.params.proposer.metadata.name ?? "Instadapp";
    const url =
      pendingProposal?.params.proposer.metadata.url ?? "http://localhost:3000";
    const icon =
      pendingProposal?.params.proposer.metadata.icons[0] ??
      "https://images.mirror-media.xyz/publication-images/Lx_fohJ8ttprQ3DmDKU9N.png?height=2048&width=2048";

    const x = pendingProposal?.params.requiredNamespaces;
    console.log("REQUIRED NAMESPACES", x);
    return { icon, name, url };
  }, [pendingProposal]);

  //   if (!pendingProposal) return null;

  return (
    <div>
      <div className="flex flex-row items-start gap-2 border-neutral-300 border-b p-4 text-primary">
        <div className="flex size-10 items-center justify-center rounded-full">
          <img
            alt={metadata.name}
            className="size-8 rounded-lg"
            src={metadata.icon}
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="font-medium text-neutral-700 text-xl">
            {metadata.name} wants to Connect
          </div>
          <div className="flex flex-col">
            <div className="font-medium text-neutral-400 text-xs">
              Do not close this window while connecting.
            </div>

            <a
              className="flex flex-row items-center gap-2 text-xs"
              href={metadata.url}
              rel="noreferrer"
              target="_blank"
              title={metadata.url}
            >
              {metadata.url}
              <ExternalLinkIcon className="size-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1 p-4">
        <ConnectDappButton />
      </div>
    </div>
  );
};
