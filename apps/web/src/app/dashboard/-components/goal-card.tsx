import { useMemo } from "react";

import Random from "rand-seed";

import type { Goal } from "@/db/goal";

const colors = [
  "#7DD3FC", // sky blue pastel
  "#A5F3FC", // tropical aqua
  "#6EE7B7", // mint green
  "#FBCFE8", // cherry blossom pink
  "#FDE68A", // warm pastel yellow
  "#C4B5FD", // soft lilac
  "#FCA5A5", // pastel coral
  "#F9A8D4", // candy pink
  "#93C5FD", // pastel periwinkle
  "#A7F3D0", // seafoam green
  "#FFD6A5", // peach pastel
  "#FFB5E8", // bubblegum pastel
  "#B5F2EA", // aqua mint
  "#FFF5BA", // lemon cream
  "#D5A6E5", // lavender purple
  "#BEE3F8", // light ice blue
  "#FFCBC1", // soft coral cream
  "#E4F1FE", // baby sky mist
  "#FFDAC1", // apricot pastel
  "#D7E8BA", // light moss pastel
];

interface GoalCardProps {
  goal: Goal;
}

export const GoalCard = ({ goal }: GoalCardProps) => {
  const rand = new Random(goal.name).next();
  const color = colors[Math.floor(rand * colors.length)] as string;

  const progress = useMemo(() => {
    return Math.floor((goal.currentAmount / goal.targetAmount) * 100);
  }, [goal]);

  return (
    <div
      className="relative flex flex-col rounded-2xl p-3"
      style={{
        backgroundColor: `${color}60`,
        border: `1px solid ${color}`,
      }}
    >
      <div
        className="absolute top-2 right-2 rounded-xl px-2 py-1 font-medium text-secondary-foreground text-xs"
        style={{
          backgroundColor: `${color}60`,
          border: `1px solid ${color}`,
        }}
      >
        {goal.category}
      </div>
      <div className="flex flex-row items-center gap-2">
        <div className="text-3xl">{goal.emoji}</div>
        <div className="flex flex-col">
          <div className="font-medium text-lg">{goal.name}</div>
          <div className="text-neutral-500 text-sm">
            ${goal.currentAmount} of ${goal.targetAmount}
          </div>
        </div>
      </div>
      <div className="space-y-2 pt-4 font-medium text-neutral-600">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-50">
          <div
            className="h-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor: color,

              width: `${Math.min(progress, 100)}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};
