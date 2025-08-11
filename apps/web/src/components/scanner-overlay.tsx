import type React from "react";
import { useLayoutEffect, useRef, useState } from "react";

import { motion } from "motion/react";

interface QrScannerOverlayProps {
  holeSize?: number; // width/height of hole in px
  holeRadius?: number; // corner radius of hole
  outerRadius?: number; // corner radius of entire overlay
  borderColor?: string; // CSS color
  borderWidth?: number; // px
  overlayOpacity?: number; // 0..1
  minMargin?: number; // px: min space around hole
  lineThickness?: number; // px
  glowLength?: number; // px
}

export const QrScannerOverlay: React.FC<QrScannerOverlayProps> = ({
  holeSize = 200,
  holeRadius = 20,
  outerRadius = 0,
  borderColor = "white",
  borderWidth = 4,
  overlayOpacity = 0.6,
  minMargin = 24,
  lineThickness = 6,
  glowLength = 50,
}) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const idRef = useRef(`qr-mask-${Math.random().toString(36).slice(2)}`);
  const [bounds, setBounds] = useState({ h: 0, w: 0 });

  const [direction, setDirection] = useState<"down" | "up">("down");

  useLayoutEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const update = () => {
      const r = el.getBoundingClientRect();
      setBounds({ h: Math.round(r.height), w: Math.round(r.width) });
    };

    update();
    if ("ResizeObserver" in window) {
      const ro = new ResizeObserver(update);
      ro.observe(el);
      return () => ro.disconnect();
    } else {
      // @ts-ignore safe to assume window exists
      window.addEventListener("resize", update);
      return () => window.removeEventListener("resize", update);
    }
  }, []);

  const { w, h } = bounds;
  if (w === 0 || h === 0) {
    return (
      <div className="pointer-events-none absolute inset-0" ref={wrapperRef} />
    );
  }

  // clamp hole size so it fits
  const maxHole = Math.max(
    0,
    Math.min(holeSize, Math.min(w - minMargin, h - minMargin)),
  );
  const hole = Math.max(0, maxHole);
  const x = Math.round((w - hole) / 2);
  const y = Math.round((h - hole) / 2);

  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 z-[3]"
        ref={wrapperRef}
      >
        <svg
          aria-hidden={true}
          className="h-full w-full"
          height={h}
          preserveAspectRatio="none"
          viewBox={`0 0 ${w} ${h}`}
          width={w}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <mask
              height={h}
              id={idRef.current}
              maskUnits="userSpaceOnUse"
              width={w}
              x="0"
              y="0"
            >
              {/* White = visible overlay, Black = hole */}
              <rect
                fill="white"
                height={h}
                rx={outerRadius}
                ry={outerRadius}
                width={w}
                x="0"
                y="0"
              />
              <rect
                fill="black"
                height={hole}
                rx={holeRadius}
                ry={holeRadius}
                width={hole}
                x={x}
                y={y}
              />
            </mask>
          </defs>

          {/* Dark overlay with mask */}
          <rect
            fill="black"
            height={h}
            mask={`url(#${idRef.current})`}
            opacity={overlayOpacity}
            rx={outerRadius}
            ry={outerRadius}
            width={w}
            x="0"
            y="0"
          />

          {/* Border around the hole */}
          <rect
            fill="none"
            height={hole}
            rx={holeRadius}
            ry={holeRadius}
            stroke={borderColor}
            strokeWidth={borderWidth}
            vectorEffect="non-scaling-stroke"
            width={hole}
            x={x}
            y={y}
          />
        </svg>
      </div>

      <div
        className="absolute top-1/2 left-1/2 z-[2]"
        style={{
          borderRadius: holeRadius,
          height: holeSize,
          overflow: "hidden",
          transform: "translate(-50%, -50%)",
          width: holeSize,
        }}
      >
        <motion.div
          animate={{
            y: [0, holeSize - lineThickness],
          }}
          className="w-full"
          style={{
            background:
              direction === "down"
                ? `linear-gradient(to bottom, var(--primary) 0%, transparent 100%)`
                : `linear-gradient(to top, var(--primary) 0%, transparent 100%)`,
            height: lineThickness + glowLength,
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            onRepeat: () => {
              setDirection((prev) => (prev === "down" ? "up" : "down"));
            },
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>
    </>
  );
};
