export const i18n = {
  defaultLocale: "pt-br",
  locales: ["pt-br"],
} as const;

export type Locale = (typeof i18n)["locales"][number];
