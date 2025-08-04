import { Button } from "@karma-wallet/ui/components/button";
import { createFileRoute } from "@tanstack/react-router";

const HomeComponent = () => {
  return (
    <div className="">
      <Button>Hello World</Button>
    </div>
  );
};

export const Route = createFileRoute("/")({
  component: HomeComponent,
});
