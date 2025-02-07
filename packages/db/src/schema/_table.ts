// import dotenv from "dotenv";
import { pgTableCreator } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM.
 * Use the same database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
// dotenv.config();
export const pgTable = pgTableCreator(
  (name) => `boilerplate_${process.env.APP_ENV}_${name}`,
);
