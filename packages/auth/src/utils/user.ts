import type { Database } from "@packages/db";
import { eq, schema } from "@packages/db";

export const getUserByEmail = async ({
  email,
  db,
}: {
  email?: string;
  db: Database;
}) => {
  try {
    if (!email) {
      return undefined;
    }
    const user = await db.query.users.findFirst({
      where: eq(schema.users.email, email),
    });

    return user;
  } catch {
    return undefined;
  }
};

export const getUserById = async ({
  id,
  db,
}: {
  id?: string;
  db: Database;
}) => {
  try {
    if (!id) {
      return undefined;
    }
    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, id),
    });
    return user;
  } catch {
    return undefined;
  }
};
