import type React from "react";
import { useState } from "react";

import { cn } from "@karma-wallet/ui/lib/utils";
import { motion } from "motion/react";

export const AnimateChangeInHeight = (
  props: React.ComponentPropsWithRef<typeof motion.div> & {
    children: React.ReactNode;
  },
) => {
  const [height, setHeight] = useState<number | "auto">("auto");

  return (
    <motion.div
      animate={{ height }}
      style={{ height }}
      transition={{ duration: 0.3 }}
      {...props}
      className={cn(props.className, "overflow-hidden")}
    >
      <div
        ref={(ref) => {
          const resizeObserver = new ResizeObserver(([entry]) => {
            // biome-ignore lint/style/noNonNullAssertion: safe
            const observedHeight = entry!.contentRect.height;
            setHeight(observedHeight);
          });

          if (ref) {
            resizeObserver.observe(ref);
          }

          return () => {
            resizeObserver.disconnect();
          };
        }}
      >
        {props.children}
      </div>
    </motion.div>
  );
};
