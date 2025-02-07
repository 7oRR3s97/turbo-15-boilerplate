import type { Database } from "@packages/db";
import { eq, schema } from "@packages/db";

export const getAccountByUserId = async ({
  userId,
  db,
}: {
  userId: string;
  db: Database;
}) => {
  try {
    const account = await db.query.accounts.findFirst({
      where: eq(schema.accounts.userId, userId),
    });

    return account;
  } catch {
    return null;
  }
};
