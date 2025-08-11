import { useState } from "react";

import { Button } from "@karma-wallet/ui/components/button";
import { Input } from "@karma-wallet/ui/components/input";
import { ScanIcon } from "@karma-wallet/ui/icons";
import { Scanner } from "@yudiel/react-qr-scanner";

import { QrScannerOverlay } from "@/components";

export const DefaultScreen = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [connectionString, setConnectionString] = useState("");

  return (
    <div className="mx-auto w-full max-w-xs space-y-2">
      <div className="pb-2 text-center font-medium text-2xl text-neutral-600">
        Connect
      </div>
      {isScanning ? (
        <div className="relative flex aspect-square w-full items-center justify-center rounded-[2.125rem] border-2 border-primary">
          <QrScannerOverlay
            borderColor="var(--primary)"
            borderWidth={2}
            glowLength={20}
            holeRadius={20}
            holeSize={180}
            lineThickness={4}
            minMargin={32}
            outerRadius={32}
            overlayOpacity={0.65}
          />
          <Scanner
            classNames={{
              container: "aspect-square w-full rounded-[2rem] !z-[1]",
              video: "rounded-[2rem]  !z-[1]",
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
      ) : (
        <div className="flex aspect-square w-full items-center justify-center rounded-[2rem] border-2 border-primary border-dashed">
          <div className="flex flex-col items-center gap-4">
            <ScanIcon className="size-16 text-primary" strokeWidth={1.5} />
            <Button onClick={() => setIsScanning(true)}>Scan QR</Button>
          </div>
        </div>
      )}
      <div className="flex flex-row items-center gap-2 text-zinc-400">
        <div className="w-full rounded-2xl border border-zinc-300" />
        <div className="font-medium">OR</div>
        <div className="w-full rounded-2xl border border-zinc-300" />
      </div>
      <Input
        className="!rounded-lg"
        onChange={(e) => setConnectionString(e.target.value)}
        placeholder="wc:bed21aa4c..."
        value={connectionString}
      />
      <Button className="w-full">Connect</Button>
    </div>
  );
};
