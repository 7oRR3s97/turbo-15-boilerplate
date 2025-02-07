import "server-only";

import { unstable_cacheLife as cacheLife } from "next/cache";

import type { Locale } from "~/i18n";

// We enumerate all dictionaries here for better linting and typescript support
// We also get the default import for cleaner types
const dictionaries = {
  "pt-br": () =>
    import("~/dictionaries/pt-br.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  "use cache";
  cacheLife("days");
  return dictionaries[locale]();
};

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
