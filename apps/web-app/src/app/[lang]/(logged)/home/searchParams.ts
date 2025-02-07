import { createSearchParamsCache, parseAsStringEnum } from "nuqs/server";

// Then pass it to the parser
export type SortOrder = "asc" | "desc";

// Note: import from 'nuqs/server' to avoid the "use client" directive

export const homeParsers = {
  sort: parseAsStringEnum(["asc", "desc"]).withDefault("asc"),
};
export const homeSearchParams = createSearchParamsCache(homeParsers);
