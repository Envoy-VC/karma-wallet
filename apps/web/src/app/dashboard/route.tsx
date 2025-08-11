import { SidebarProvider } from "@karma-wallet/ui/components/sidebar";
import {
  createFileRoute,
  Outlet,
  redirect,
  useLocation,
} from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";

import { MobileSidebar, Sidebar } from "@/components";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: () => {
    const account = localStorage.getItem("karmaAccount");
    if (!account) {
      throw redirect({ to: "/create" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { pathname } = useLocation();
  return (
    <SidebarProvider>
      <Sidebar />
      <div className="flex h-full w-full flex-col">
        <MobileSidebar />
        <AnimatePresence mode="popLayout">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="h-screen p-6"
            exit={{ opacity: 1 }}
            initial={{ opacity: 0, y: -20 }}
            key={pathname}
            transition={{ type: "tween" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
    </SidebarProvider>
  );
}
