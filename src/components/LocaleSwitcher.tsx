"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

export function LocaleSwitcher() {
  const pathname = usePathname();
  const currentLocale = pathname.split("/")[1] ?? "en";
  const [locale, setLocale] = useState(currentLocale);

  const changeLocale = (newLocale: string) => {
    // Replace the current locale in the pathname with the new locale
    const segments = pathname.split("/");
    segments[1] = newLocale;
    const newPath = segments.join("/") || "/";
    window.location.href = newPath;
  };

  return (
    <select
      value={locale}
      onChange={(e) => changeLocale(e.target.value)}
      className="border-none p-1 px-3"
      style={{
        fontFamily:
          "Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif !important",
      }}
    >
      <option className="bg-white dark:bg-black" value="en">
        🇺🇸 English
      </option>
      <option className="bg-white dark:bg-black" value="ko">
        🇰🇷 한국어
      </option>
      <option className="bg-white dark:bg-black" value="zh">
        🇨🇳 简体中文
      </option>
    </select>
  );
}
