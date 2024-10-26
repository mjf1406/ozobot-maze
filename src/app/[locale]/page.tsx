// src/app/[locale]/page.tsx

import Footer from "~/components/Footer";
import MazeForm from "~/components/MazeGeneratorForm";
import { pixelifySans, comfortaa } from "../fonts";
import OzobotComponent from "~/components/Ozobot";
import { getI18n } from "locales/server";
import { LocaleSwitcher } from "~/components/LocaleSwitcher";
import Tips from "~/components/Tips";
import FAQ from "~/components/FAQ";

export type Locale = "en" | "ko" | "zh";

export interface PageProps {
  params: {
    locale: Locale;
  };
}

export default async function HomePage({ params }: PageProps) {
  const t = await getI18n();
  const currentLocale = params.locale || "en";

  return (
    <main className="m-8 flex flex-col items-center justify-center gap-10">
      <h1 className={`text-5xl font-semibold ${pixelifySans.className}`}>
        {t("app_title")}
      </h1>
      <OzobotComponent />
      <LocaleSwitcher currentLocale={currentLocale} />
      <span id="form">
        <MazeForm />
      </span>
      <Tips />
      <div className={`max-w-xl text-lg ${comfortaa.className}`}>
        <h2
          className={`mb-5 text-center text-3xl font-semibold ${pixelifySans.className}`}
        >
          {t("app_meet_dev")}
        </h2>
        <p>
          {t("app_how_fortuitous_you_have_arrived")}{" "}
          <a className="link" href="https://mr-monkey-portfolio.vercel.app/">
            {t("app_developer_name")}
          </a>{" "}
          {t("app_built_ozobot_maze_generator")}
        </p>
        <p className="pt-8">
          {t("app_if_useful_request")}{" "}
          <a className="link" href="">
            {t("app_buy_me_an_avocado")}
          </a>{" "}
          {t("app_or_subscribe_to")}{" "}
          <a className="link" href="">
            {t("app_my_patreon")}
          </a>
          .
        </p>
        <p className="pt-8">
          {t("app_if_dont_know_ozobot")}{" "}
          <a className="link" href="https://ozobot.com/">
            {t("app_here")}
          </a>
          .
        </p>
      </div>
      <FAQ />
      <Footer />
    </main>
  );
}
