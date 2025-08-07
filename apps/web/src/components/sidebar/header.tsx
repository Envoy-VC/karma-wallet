import { Button } from "@karma-wallet/ui/components/button";
import {
  SidebarHeader as SidebarHeaderCore,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@karma-wallet/ui/components/sidebar";
import { KarmaLogo, PanelLeftIcon } from "@karma-wallet/ui/icons";
import { cn } from "@karma-wallet/ui/lib/utils";
import { Link } from "@tanstack/react-router";

export const SidebarHeader = () => {
  const { open, setOpen, isMobile, setOpenMobile } = useSidebar();

  return (
    <SidebarHeaderCore className="!pt-3 border-b">
      <SidebarMenu>
        <SidebarMenuItem
          className={cn(
            "flex items-center gap-4",
            open ? "justify-between" : "justify-center",
          )}
        >
          <Link className="group/header-icon flex flex-row items-center" to="/">
            <SidebarMenuButton className="!p-0 !m-0 !size-16 flex cursor-pointer items-center justify-center transition-all duration-300 ease-in-out group-hover/header-icon:rotate-3 group-hover/header-icon:scale-[107%] group-data-[collapsible=icon]:size-12! [&>svg]:size-7">
              <KarmaLogo fill="#000" />
            </SidebarMenuButton>
            <div
              className={cn(
                "font-semibold text-2xl text-accent-foreground transition-all duration-300 ease-in-out",
                open ? "inline-flex" : "hidden",
              )}
            >
              Karma
            </div>
          </Link>
          {open && (
            <Button
              className="justify-self-end"
              onClick={() => {
                if (isMobile) {
                  setOpenMobile(false);
                } else {
                  setOpen(false);
                }
              }}
              size="icon"
              variant="outline"
            >
              <PanelLeftIcon strokeWidth={2.5} />
            </Button>
          )}
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeaderCore>
  );
};
