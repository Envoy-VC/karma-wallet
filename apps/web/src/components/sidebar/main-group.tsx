import { useState } from "react";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@karma-wallet/ui/components/sidebar";
import { DashboardIcon, PassportIcon } from "@karma-wallet/ui/icons";
import { cn } from "@karma-wallet/ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";

const mainGroupItems = [
  {
    href: "/dashboard",
    icon: DashboardIcon,
    id: "dashboard",
    title: "Dashboard",
  },
  {
    href: "/dashboard/send",
    icon: PassportIcon,
    id: "send-swap",
    title: "Send & Swap",
  },
];

export const MainGroup = () => {
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <SidebarGroup className="border-b py-4">
      <SidebarMenu>
        {mainGroupItems.map((item) => (
          <SidebarMenuItem className="mx-auto w-full" key={item.title}>
            <motion.div
              className="rounded-2xl"
              onHoverEnd={() => setHovered(null)}
              onHoverStart={() => setHovered(item.id)}
            >
              <SidebarMenuButton asChild={true} size="lg" tooltip={item.title}>
                <Link
                  activeOptions={{
                    exact: true,
                    includeHash: true,
                    includeSearch: true,
                  }}
                  activeProps={{
                    className: cn(
                      "!text-primary hover:!bg-primary/[0.15] bg-primary/[0.125] shadow-xs focus-visible:ring-primary/20",
                    ),
                  }}
                  className="[&>svg]:!size-5 h-10 w-full rounded-xl text-base hover:bg-sidebar-accent"
                  to={item.href}
                >
                  <item.icon hovered={hovered === item.id} strokeWidth={2} />
                  <span className="font-medium">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </motion.div>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};
