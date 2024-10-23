import { Button } from "~/components/ui/button";
import {
  GithubIcon,
  LinkedinIcon,
  BriefcaseIcon,
  CodeIcon,
} from "lucide-react";

const Footer = () => {
  const links = [
    {
      href: "https://github.com/mjf1406",
      label: "GitHub",
      icon: <GithubIcon className="h-4 w-4" />,
    },
    {
      href: "https://www.linkedin.com/in/mfitz06/",
      label: "LinkedIn",
      icon: <LinkedinIcon className="h-4 w-4" />,
    },
    {
      href: "https://mr-monkey-portfolio.vercel.app/",
      label: "Portfolio",
      icon: <BriefcaseIcon className="h-4 w-4" />,
    },
    {
      href: "https://github.com/mjf1406/ozobot-maze",
      label: "Source",
      icon: <CodeIcon className="h-4 w-4" />,
    },
  ];

  return (
    <footer className="flex w-full flex-col items-center justify-center gap-6 py-6">
      <div className="flex gap-4">
        {links.map(({ href, label, icon }) => (
          <Button
            key={href}
            variant="ghost"
            size="sm"
            className="flex gap-2 hover:text-foreground"
            asChild
          >
            <a href={href} target="_blank" rel="noopener noreferrer">
              {icon}
              <span>{label}</span>
            </a>
          </Button>
        ))}
      </div>

      <div className="font-serif text-sm">
        © {new Date().getFullYear()} MIT Licensed
      </div>
    </footer>
  );
};

export default Footer;
