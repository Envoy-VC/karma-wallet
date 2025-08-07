import { createFileRoute } from "@tanstack/react-router";

const Home = () => {
  return <div className="relative h-screen w-full"></div>;
};

export const Route = createFileRoute("/")({
  component: Home,
});
