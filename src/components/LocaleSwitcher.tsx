"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "~/components/ui/select";
import Image from "next/image";

type Locale = "en" | "ko" | "zh";

interface LocaleSwitcherProps {
  currentLocale: Locale;
}

const locales = {
  en: { label: "English", flag: "/img/flags/us.svg" },
  ko: { label: "한국어", flag: "/img/flags/kr.svg" },
  zh: { label: "简体中文", flag: "/img/flags/cn.svg" },
} as const;

export function LocaleSwitcher({ currentLocale }: LocaleSwitcherProps) {
  const changeLocale = (newLocale: Locale) => {
    const segments = window.location.pathname.split("/");
    segments[1] = newLocale;
    const newPath = segments.join("/") || "/";
    window.location.href = newPath;
  };

  return (
    <Select value={currentLocale} onValueChange={changeLocale}>
      <SelectTrigger className="w-[180px] bg-card">
        <div className="flex items-center gap-2">
          <Image
            src={locales[currentLocale].flag}
            alt={locales[currentLocale].label}
            width={20}
            height={20}
          />
          {locales[currentLocale].label}
        </div>
      </SelectTrigger>
      <SelectContent className="bg-card">
        {Object.entries(locales).map(([code, { label, flag }]) => (
          <SelectItem key={code} value={code as Locale}>
            <div className="flex items-center gap-2">
              <Image src={flag} alt={label} width={20} height={20} />
              {label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
