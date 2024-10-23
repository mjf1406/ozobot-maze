import Image from "next/image";
import Link from "next/link";
import { Card } from "./ui/card";

const OzobotComponent = () => {
  return (
    <div className="flex items-center space-x-6">
      <Link
        href="https://ozobot.com/"
        rel="noopener noreferrer"
        target="_blank"
        className="relative flex h-[200px] w-[200px] items-center justify-center overflow-hidden rounded-full bg-[radial-gradient(169.40%_89.55%_at_94.76%_6.29%,hsl(var(--primary))_0%,hsl(var(--secondary))_50%,hsl(var(--accent))_100%)] p-1 transition-all hover:scale-105 hover:shadow-xl"
      >
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl">
          <Image
            src="/img/ozobot.png"
            alt="Ozobot"
            width={160}
            height={160}
            className="cursor-pointer object-contain"
          />
        </div>
      </Link>

      <Card className="relative max-w-sm rounded-full border-none bg-secondary p-6">
        <p className="text-lg font-semibold">
          Who&apos;s Ozobot? Well, I am! Click me to learn more!
        </p>
        <div className="absolute -left-4 top-1/2 -translate-y-1/2 transform">
          <div className="h-0 w-0 border-b-8 border-r-8 border-t-8 border-b-transparent border-r-primary border-t-transparent"></div>
        </div>
      </Card>
    </div>
  );
};

export default OzobotComponent;
