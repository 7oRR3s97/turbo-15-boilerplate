import type { Config } from "drizzle-kit";

import { connectionString } from ".";

const credential = connectionString ?? "";
export default {
  schema: "./src/schema",
  dialect: "postgresql",
  out: `./drizzle_${process.env.APP_ENV}`,
  dbCredentials: { url: credential },
  tablesFilter: [`boilerplate_${process.env.APP_ENV}_*`],
} satisfies Config;
