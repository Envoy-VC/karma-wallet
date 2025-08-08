import { KarmaLogo } from "@karma-wallet/ui/icons";
import { AnimatePresence, motion } from "motion/react";
import { useAccount } from "wagmi";

import { ConnectWallet } from "./connect";
import { CreateAccountButton } from "./create-button";

export const CreateAccount = () => {
  const { address } = useAccount();
  return (
    <div className="relative flex w-full max-w-sm flex-col gap-6 rounded-2xl">
      <div className="flex items-center justify-center">
        <KarmaLogo fill="#04B4BB" size={64} />
      </div>

      <div className="flex flex-col items-center justify-center gap-[2px]">
        <div className="font-semibold text-xl">Welcome to Karma</div>
        <div className="text-base text-neutral-500">
          Connect your wallet to get started.
        </div>
      </div>
      <ConnectWallet />
      <AnimatePresence>
        {address && (
          <motion.div
            animate="visible"
            className="-bottom-16 absolute w-full"
            exit="hidden"
            initial="hidden"
            transition={{
              bounce: 0.25,
              type: "spring",
            }}
            variants={{
              hidden: { opacity: 0, scale: 0.9, y: 20 },
              visible: { opacity: 1, scale: 1, y: 0 },
            }}
          >
            <CreateAccountButton />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
