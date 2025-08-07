import { Button } from "@karma-wallet/ui/components/button";
import {
  SidebarFooter as SidebarFooterCore,
  useSidebar,
} from "@karma-wallet/ui/components/sidebar";
import { EmailIcon, GitHubIcon, TwitterIcon } from "@karma-wallet/ui/icons";
import { cn } from "@karma-wallet/ui/lib/utils";

const socials = [
  {
    href: "https://x.com/Envoy_1084",
    icon: TwitterIcon,
    id: "twitter",
    title: "Twitter",
  },
  {
    href: "mailto:vedantchainani1084@gmail.com",
    icon: EmailIcon,
    id: "email",
    title: "Email",
  },
  {
    href: "https://github.com/Envoy-VC/karma-wallet",
    icon: GitHubIcon,
    id: "github",
    title: "Github",
  },
];

export const SidebarFooter = () => {
  const { open } = useSidebar();
  return (
    <SidebarFooterCore
      className={cn(
        "flex items-center justify-evenly gap-2 pb-4",
        open ? "flex-row" : "flex-col",
      )}
    >
      {socials.map((item) => {
        return (
          <Button asChild={true} key={item.id} size="icon" variant="outline">
            <a href={item.href} rel="noreferrer" target="_blank">
              <span className="sr-only">{item.title}</span>
              <item.icon strokeWidth={2.5} />
            </a>
          </Button>
        );
      })}
    </SidebarFooterCore>
  );
};
