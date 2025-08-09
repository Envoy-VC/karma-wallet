import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@karma-wallet/ui/components/sidebar";
import { cn } from "@karma-wallet/ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { PiggyBankIcon, TargetIcon } from "lucide-react";
import { motion } from "motion/react";

const walletGroupItems = [
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
  return (
    <SidebarGroup className="border-b">
      <SidebarGroupLabel>My Account</SidebarGroupLabel>
      <SidebarMenu>
        {walletGroupItems.map((item) => (
          <SidebarMenuItem className="mx-auto w-full" key={item.title}>
            <motion.div className="rounded-2xl">
              <SidebarMenuButton asChild={true} size="lg" tooltip={item.title}>
                <Link
                  activeOptions={{
                    exact: item.id === "goals",
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
                  <item.icon strokeWidth={2} />
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
