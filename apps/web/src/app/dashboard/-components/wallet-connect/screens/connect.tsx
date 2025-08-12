import { useState } from "react";

import { Button } from "@karma-wallet/ui/components/button";
import { Input } from "@karma-wallet/ui/components/input";
import { ScanIcon } from "@karma-wallet/ui/icons";
import { Scanner } from "@yudiel/react-qr-scanner";

import { QrScannerOverlay } from "@/components";
import { useWalletConnect } from "@/hooks";

export const ConnectScreen = () => {
  const { connectionString, setConnectionString, walletKit } =
    useWalletConnect();
  const [isScanning, setIsScanning] = useState(false);

  return (
    <div>
      <div className="flex flex-row items-start gap-2 border-neutral-300 border-b p-4 text-primary">
        <div className="flex size-10 items-center justify-center rounded-full">
          <img
            alt="Wallet Connect"
            className="size-8 rounded-lg"
            src="https://images.mirror-media.xyz/publication-images/Lx_fohJ8ttprQ3DmDKU9N.png?height=2048&width=2048"
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="font-medium text-neutral-700 text-xl">
            Connect With WalletConnect
          </div>
          <div className="font-medium text-neutral-400 text-sm">
            Do not close this window while connecting your wallet.
          </div>
        </div>
      </div>
      <div className="space-y-4 p-4">
        {isScanning && (
          <div className="relative flex aspect-square w-full items-center justify-center rounded-[1.5rem] border-2 border-primary">
            <QrScannerOverlay
              borderColor="var(--primary)"
              borderWidth={2}
              glowLength={20}
              holeRadius={20}
              holeSize={180}
              lineThickness={4}
              minMargin={32}
              outerRadius={22}
              overlayOpacity={0.65}
            />
            <Scanner
              classNames={{
                container: "aspect-square w-full rounded-[1.5rem] !z-[1]",
              }}
              components={{
                finder: false,
              }}
              onScan={(res) => {
                const first = res[0];
                if (!first) return;
                setConnectionString(first.rawValue);
                setIsScanning(false);
              }}
            />
          </div>
        )}
        <div className="relative">
          <Input
            className="!rounded-full h-10 pr-12"
            onChange={(e) => setConnectionString(e.target.value)}
            placeholder="QR code of link"
            value={connectionString}
          />
          <div className="-translate-y-1/2 absolute top-1/2 right-4">
            <Button
              className="!size-6 text-neutral-500"
              onClick={() => setIsScanning(true)}
              size="icon"
              type="button"
              variant="ghost"
            >
              <ScanIcon className="size-4" strokeWidth={2.25} />
            </Button>
          </div>
        </div>
        <Button
          className="w-full rounded-full"
          onClick={async () => {
            if (!connectionString) return;
            await walletKit?.pair({ uri: connectionString });
            setConnectionString(undefined);
          }}
        >
          Connect
        </Button>
      </div>
    </div>
  );
};
