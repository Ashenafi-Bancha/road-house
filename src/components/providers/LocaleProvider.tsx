"use client";
import { createContext, useContext } from "react";
import type { Dictionary, Locale } from "@/i18n";

type Ctx = { locale: Locale; t: Dictionary };
const LocaleContext = createContext<Ctx | null>(null);

/** Makes the active locale + its dictionary available to client components. */
export function LocaleProvider({ locale, dict, children }: { locale: Locale; dict: Dictionary; children: React.ReactNode }) {
  return <LocaleContext.Provider value={{ locale, t: dict }}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used inside <LocaleProvider>");
  return ctx;
}
