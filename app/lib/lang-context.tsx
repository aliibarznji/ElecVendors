"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { ar, en, type Translations } from "./translations";

export type Lang = "en" | "ar";

type LangContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: keyof Translations) => string;
  isRtl: boolean;
};

const LangContext = createContext<LangContextValue>({
  lang: "en",
  setLang: () => {},
  t: (key) => en[key] ?? key,
  isRtl: false,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  const setLang = (next: Lang) => {
    setLangState(next);
    try { localStorage.setItem("lang", next); } catch {}
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem("lang") as Lang | null;
      if (saved === "ar" || saved === "en") setLangState(saved);
    } catch {}
  }, []);

  useEffect(() => {
    const el = document.documentElement;
    el.lang = lang;
    el.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const strings = lang === "ar" ? ar : en;
  const t = (key: keyof Translations): string => strings[key] ?? en[key] ?? key;

  return (
    <LangContext.Provider value={{ lang, setLang, t, isRtl: lang === "ar" }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
