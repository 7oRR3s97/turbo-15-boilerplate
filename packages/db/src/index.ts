import { sql } from "@vercel/postgres";
// import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/vercel-postgres";

import * as auth from "./schema/auth";
import * as post from "./schema/post";

// dotenv.config();
export const schema = { ...auth, ...post };

export { pgTable as tableCreator } from "./schema/_table";

export * from "drizzle-orm";
export const connectionString = process.env.POSTGRES_PRISMA_URL;
export const db = drizzle(sql, { schema });

export type Database = typeof db;
