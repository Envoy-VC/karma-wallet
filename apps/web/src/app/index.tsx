import { Button } from "@karma-wallet/ui/components/button";
import { KarmaLogo } from "@karma-wallet/ui/icons";
import { cn } from "@karma-wallet/ui/lib/utils";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRightIcon } from "lucide-react";

import {
  DraggableCardBody,
  DraggableCardContainer,
} from "@/components/draggable-card";

const qaItems = [
  {
    className: "top-10 -left-2 rotate-[3deg]",
    color: "#7DD3FC",
    description:
      "It's a next-generation that helps you automatically save spare change from your transaction fees.",
    icon: "https://api.dicebear.com/9.x/micah/svg?seed=Destiny",
    title: "What is a Karma Wallet?",
  },
  {
    className: "top-5 -right-4 rotate-[-10deg]",
    color: "#FBCFE8",
    description: `A built-in "Karma Account" that collects rounded-up gas fees, turning digital dust into meaningful savings.`,
    icon: "https://api.dicebear.com/9.x/micah/svg?seed=Sophia",
    title: "What makes it different?",
  },
  {
    className: "bottom-10 right-4 rotate-[-2deg]",
    color: "#FFDAC1",
    description: `A built-in "Karma Account" that collects rounded-up gas fees, turning digital dust into meaningful savings.`,
    icon: "https://api.dicebear.com/9.x/micah/svg?seed=Jude",
    title: `Why is it called "Karma"?`,
  },
  {
    className: "bottom-10 left-4 rotate-[4deg]",
    color: "#A7F3D0",
    description: `It's your own money. We just make it easy to save the tiny bits left over from transaction fees that you'd barely notice.`,
    icon: "https://api.dicebear.com/9.x/micah/svg?seed=Kingston",
    title: "Where does the saved money come from?",
  },
];

const statsItems = [
  {
    className: "top-[50%] -right-[4rem] rotate-[-2deg]",
    color: "#FFF5BA",
    description:
      "Create your wallet with a social login. Web3 onboarding, simplified.",
    title: "90% Less Hassle",
  },
  {
    className: "bottom-[55%] -right-[8rem] rotate-[5deg]",
    color: "#A5F3FC",
    description:
      "The average Karma saved from every transaction on our network. It adds up!",
    title: "$0.0065 Saved Per Transaction",
  },
  {
    className: "bottom-[50%] left-4 rotate-[3deg]",
    color: "#C4B5FD",
    description:
      "Connect Karma Wallet via WalletConnect to your favorite dApps and watch your Karma grow with every swap and stake.",
    title: "Do Good While You DeFi.",
  },
];

const QACard = ({
  className,
  description,
  icon,
  title,
  color,
}: {
  className: string;
  description: string;
  icon: string;
  title: string;
  color: string;
}) => {
  return (
    <DraggableCardBody
      className={cn(
        "absolute hidden max-w-md flex-col gap-2 rounded-2xl border lg:flex",
        className,
      )}
      key={title}
      style={{
        backgroundColor: `${color}40`,
        border: `1px solid ${color}`,
      }}
    >
      <div
        className={cn("flex size-10 items-center justify-center rounded-lg")}
        style={{
          background: `${color}60`,
          border: `1px solid ${color}`,
        }}
      >
        <img
          alt={title}
          className="pointer-events-none relative z-10 size-8 object-cover"
          src={icon}
        />
      </div>
      <h3 className="font-bold text-neutral-700 text-xl">{title}</h3>
      <p className="font-medium text-neutral-500 text-sm">{description}</p>
    </DraggableCardBody>
  );
};

const StatsCard = ({
  className,
  description,
  title,
  color,
}: {
  className: string;
  description: string;
  title: string;
  color: string;
}) => {
  return (
    <DraggableCardBody
      className={cn(
        "absolute hidden max-w-md flex-col gap-0 rounded-2xl border lg:flex",
        className,
      )}
      key={title}
      style={{
        backgroundColor: `${color}40`,
        border: `1px solid ${color}`,
      }}
    >
      <h3 className="font-bold text-lg text-neutral-700">{title}</h3>
      <p className="font-medium text-neutral-500 text-xs">{description}</p>
    </DraggableCardBody>
  );
};

const Home = () => {
  return (
    <div className="relative h-screen w-full">
      <DraggableCardContainer className="relative min-h-screen w-full overflow-clip">
        <div className="absolute top-[10%] right-1/2 flex translate-x-1/2 flex-row items-center gap-2 text-2xl text-primary">
          <KarmaLogo fill="currentColor" size={40} />
          <div className="pb-1 font-medium text-3xl text-neutral-600">
            Karma Wallet
          </div>
        </div>
        <div className="absolute top-1/3 right-1/2 flex max-w-md translate-x-1/2 flex-col items-center gap-4">
          <p className="text-center font-black text-2xl text-neutral-500 md:text-4xl">
            Save Money on Every Transaction. Automatically.
          </p>
          <Button asChild={true}>
            <Link className="flex flex-row items-center gap-2" to="/create">
              <div>Get Started</div>
              <ArrowRightIcon />
            </Link>
          </Button>
        </div>
        {qaItems.map((item) => (
          <QACard {...item} key={item.title} />
        ))}
        {statsItems.map((item) => (
          <StatsCard {...item} key={item.title} />
        ))}
      </DraggableCardContainer>
    </div>
  );
};

export const Route = createFileRoute("/")({
  component: Home,
});
