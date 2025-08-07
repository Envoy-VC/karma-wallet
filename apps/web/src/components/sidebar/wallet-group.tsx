import { useState } from "react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@karma-wallet/ui/components/sidebar";
import { ActivityIcon, WalletIcon } from "@karma-wallet/ui/icons";
import { cn } from "@karma-wallet/ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { PiggyBankIcon, TargetIcon } from "lucide-react";
import { motion } from "motion/react";

const walletGroupItems = [
  {
    href: "/dashboard/assets",
    icon: WalletIcon,
    id: "assets",
    title: "Assets",
  },
  {
    href: "/dashboard/activity",
    icon: ActivityIcon,
    id: "activity",
    title: "Activity",
  },
  {
    href: "/dashboard/savings",
    icon: PiggyBankIcon,
    id: "savings",
    title: "Savings",
  },
  {
    href: "/dashboard/goals",
    icon: TargetIcon,
    id: "goals",
    title: "Goals",
  },
];

export const WalletGroup = () => {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <SidebarGroup className="border-b">
      <SidebarGroupLabel>My Account</SidebarGroupLabel>
      <SidebarMenu>
        {walletGroupItems.map((item) => (
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
