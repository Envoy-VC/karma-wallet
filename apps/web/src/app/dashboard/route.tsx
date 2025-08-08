import { SidebarProvider } from "@karma-wallet/ui/components/sidebar";
import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";

import { Sidebar } from "@/components";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const { pathname } = useLocation();
  return (
    <SidebarProvider>
      <div className="px-4">
        <Sidebar />
      </div>
      <div className="h-full w-full">
        <AnimatePresence mode="popLayout">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="h-screen p-6"
            exit={{ opacity: 1 }}
            initial={{ opacity: 0.5, y: -20 }}
            key={pathname}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
    </SidebarProvider>
  );
}
