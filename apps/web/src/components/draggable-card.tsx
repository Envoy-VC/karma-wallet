"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@karma-wallet/ui/lib/utils";
import {
  animate,
  type MotionProps,
  motion,
  useAnimationControls,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";

export const DraggableCardBody = ({
  className,
  children,
  ...props
}: MotionProps & React.ComponentProps<"div">) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();
  const [constraints, setConstraints] = useState({
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  });

  // physics biatch
  const velocityX = useVelocity(mouseX);
  const velocityY = useVelocity(mouseY);

  const springConfig = {
    damping: 20,
    mass: 0.5,
    stiffness: 100,
  };

  const rotateX = useSpring(
    useTransform(mouseY, [-300, 300], [25, -25]),
    springConfig,
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-300, 300], [-25, 25]),
    springConfig,
  );

  const opacity = useSpring(
    useTransform(mouseX, [-300, 0, 300], [0.8, 1, 0.8]),
    springConfig,
  );

  const glareOpacity = useSpring(
    useTransform(mouseX, [-300, 0, 300], [0.2, 0, 0.2]),
    springConfig,
  );

  useEffect(() => {
    // Update constraints when component mounts or window resizes
    const updateConstraints = () => {
      if (typeof window !== "undefined") {
        setConstraints({
          bottom: window.innerHeight / 2,
          left: -window.innerWidth / 2,
          right: window.innerWidth / 2,
          top: -window.innerHeight / 2,
        });
      }
    };

    updateConstraints();

    // Add resize listener
    window.addEventListener("resize", updateConstraints);

    // Clean up
    return () => {
      window.removeEventListener("resize", updateConstraints);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { width, height, left, top } =
      cardRef.current?.getBoundingClientRect() ?? {
        height: 0,
        left: 0,
        top: 0,
        width: 0,
      };
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    mouseX.set(deltaX);
    mouseY.set(deltaY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      animate={controls}
      className={cn(
        "transform-3d relative overflow-hidden rounded-md bg-neutral-100 p-4 shadow-2xl",
        className,
      )}
      drag={true}
      dragConstraints={constraints}
      onDragEnd={(_event, info) => {
        document.body.style.cursor = "default";

        controls.start({
          rotateX: 0,
          rotateY: 0,
          transition: {
            type: "spring",
            ...springConfig,
          },
        });
        const currentVelocityX = velocityX.get();
        const currentVelocityY = velocityY.get();

        const velocityMagnitude = Math.sqrt(
          currentVelocityX * currentVelocityX +
            currentVelocityY * currentVelocityY,
        );
        const bounce = Math.min(0.8, velocityMagnitude / 1000);

        animate(info.point.x, info.point.x + currentVelocityX * 0.3, {
          bounce,
          damping: 15,
          duration: 0.8,
          ease: [0.2, 0, 0, 1],
          mass: 0.8,
          stiffness: 50,
          type: "spring",
        });

        animate(info.point.y, info.point.y + currentVelocityY * 0.3, {
          bounce,
          damping: 15,
          duration: 0.8,
          ease: [0.2, 0, 0, 1],
          mass: 0.8,
          stiffness: 50,
          type: "spring",
        });
      }}
      onDragStart={() => {
        document.body.style.cursor = "grabbing";
      }}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      ref={cardRef}
      style={{
        opacity,
        rotateX,
        rotateY,
        willChange: "transform",
      }}
      whileHover={{ scale: 1.02 }}
      {...props}
    >
      {children}
      <motion.div
        className="pointer-events-none absolute inset-0 select-none bg-white"
        style={{
          opacity: glareOpacity,
        }}
      />
    </motion.div>
  );
};

export const DraggableCardContainer = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className={cn("[perspective:3000px]", className)}>{children}</div>
  );
};
