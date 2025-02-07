import "server-only";

import { UnauthorizedError } from "@packages/api/http";
import { auth } from "@packages/auth";
import { db, eq, schema } from "@packages/db";

export const getUserSession = async () => {
  const session = await auth();
  if (!session?.user.id) {
    throw new UnauthorizedError("User not authenticated");
  }
  return session;
};

export const getUserById = async ({ userId }: { userId: string }) => {
  const user = await db.query.users.findFirst({
    where: eq(schema.users.id, userId),
  });

  if (!user) {
    throw new Error("User not found");
  }
  return user;
};
