"use client";

import { useState, useEffect } from "react";

export function LocaleSwitcher() {
  const [locale, setLocale] = useState("en"); // Default locale

  useEffect(() => {
    // Get the current locale from the URL (if available)
    const currentLocale = window.location.pathname.split("/")[1];
    setLocale(currentLocale ?? "en"); // Fallback to "en" if no locale is set
  }, []);

  const changeLocale = (newLocale: string) => {
    // Change the URL to reflect the new locale
    const newPath = window.location.pathname.replace(
      `/${locale}`,
      `/${newLocale}`,
    );
    window.location.href = newPath; // Redirect the user to the new locale page
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
