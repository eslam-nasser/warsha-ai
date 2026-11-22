import { defineRouting } from "next-intl/routing";

// English is the first locale. To add Arabic: add "ar" here and to rtlLocales,
// then add messages/ar.json with the same keys as messages/en.json.
export const routing = defineRouting({
  locales: ["en"],
  defaultLocale: "en",
});

export type Locale = (typeof routing.locales)[number];

export const rtlLocales: readonly string[] = ["ar"];

export function directionOf(locale: string): "rtl" | "ltr" {
  return rtlLocales.includes(locale) ? "rtl" : "ltr";
}
