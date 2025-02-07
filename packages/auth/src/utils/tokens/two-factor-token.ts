import type { Database } from "@packages/db";
import { eq } from "@packages/db";
import { twoFactorTokens } from "@packages/db/schema/auth";

export const getTwoFactorTokenByToken = async ({
  token,
  db,
}: {
  token: string;
  db: Database;
}) => {
  try {
    const twoFactorToken = await db.query.twoFactorTokens.findFirst({
      where: eq(twoFactorTokens.token, token),
    });

    return twoFactorToken;
  } catch {
    return undefined;
  }
};

export const getTwoFactorTokenByEmail = async ({
  email,
  db,
}: {
  email: string;
  db: Database;
}) => {
  try {
    const twoFactorToken = await db.query.twoFactorTokens.findFirst({
      where: eq(twoFactorTokens.email, email),
    });

    return twoFactorToken;
  } catch {
    return undefined;
  }
};
