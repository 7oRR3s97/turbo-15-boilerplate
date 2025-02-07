import "dotenv/config";

import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

import { connectionString } from ".";

const main = async () => {
  const sql = postgres(connectionString ?? "", { max: 1 });
  const db = drizzle(sql);
  console.log("migrating...");
  await migrate(db, { migrationsFolder: `drizzle_${process.env.APP_ENV}` });
  console.log("migrate complete");
  await sql.end();

  process.exit(0);
};

await main();
