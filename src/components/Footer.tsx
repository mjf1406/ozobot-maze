import { Button } from "~/components/ui/button";
import {
  GithubIcon,
  LinkedinIcon,
  BriefcaseIcon,
  CodeIcon,
} from "lucide-react";
import { getI18n } from "locales/server"; // Ensure this function is correctly typed

export type FooterLabelKey =
  | "footer_github"
  | "footer_linkedin"
  | "footer_portfolio"
  | "footer_source"
  | "footer_mit_licensed";

const Footer = async () => {
  const t = await getI18n();

  // Define the links with proper typing
  const links: Array<{
    href: string;
    labelKey: FooterLabelKey;
    icon: JSX.Element;
  }> = [
    {
      href: "https://github.com/mjf1406",
      labelKey: "footer_github",
      icon: <GithubIcon className="h-4 w-4" />,
    },
    {
      href: "https://www.linkedin.com/in/mfitz06/",
      labelKey: "footer_linkedin",
      icon: <LinkedinIcon className="h-4 w-4" />,
    },
    {
      href: "https://mr-monkey-portfolio.vercel.app/",
      labelKey: "footer_portfolio",
      icon: <BriefcaseIcon className="h-4 w-4" />,
    },
    {
      href: "https://github.com/mjf1406/ozobot-maze",
      labelKey: "footer_source",
      icon: <CodeIcon className="h-4 w-4" />,
    },
  ];

  return (
    <footer className="flex w-full flex-col items-center justify-center gap-6 py-6">
      <div className="flex gap-4">
        {links.map(({ href, labelKey, icon }) => (
          <Button
            key={href}
            variant="ghost"
            size="sm"
            className="flex gap-2 hover:text-foreground"
            asChild
          >
            <a href={href} target="_blank" rel="noopener noreferrer">
              {icon}
              <span>{t(labelKey)}</span>
            </a>
          </Button>
        ))}
      </div>

      <div className="font-serif text-sm">
        © {new Date().getFullYear()} {t("footer_mit_licensed")}
      </div>
    </footer>
  );
};

export default Footer;
