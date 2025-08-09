import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import { ProviderTree } from "@/providers";

import "@karma-wallet/ui/globals.css";

import { Toaster } from "@karma-wallet/ui/components/sonner";

const RootComponent = () => {
  return (
    <ProviderTree>
      <Outlet />
      <Toaster
        richColors={true}
        theme="light"
        toastOptions={{
          className: "!rounded-2xl",
        }}
      />
      {import.meta.env.MODE === "development" && (
        <TanStackRouterDevtools position="bottom-right" />
      )}
    </ProviderTree>
  );
};

export const Route = createRootRoute({
  component: RootComponent,
});
