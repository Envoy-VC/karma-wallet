import { createFileRoute } from "@tanstack/react-router";

import { CreateAccount } from "@/components";

const Home = () => {
  return (
    <div className="relative h-screen w-full">
      <div className="absolute top-1/3 right-1/2 w-full max-w-sm translate-x-1/2">
        <CreateAccount />
      </div>
    </div>
  );
};

export const Route = createFileRoute("/create")({
  component: Home,
});
