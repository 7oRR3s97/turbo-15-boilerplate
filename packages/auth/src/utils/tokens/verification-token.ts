import type { Database } from "@packages/db";
import { eq } from "@packages/db";
import { verificationTokens } from "@packages/db/schema/auth";

export const getVerificationTokenByToken = async ({
  token,
  db,
}: {
  token: string;
  db: Database;
}) => {
  try {
    const verificationToken = await db.query.verificationTokens.findFirst({
      where: eq(verificationTokens.token, token),
    });

    return verificationToken;
  } catch {
    return undefined;
  }
};

export const getVerificationTokenByEmail = async ({
  email,
  db,
}: {
  email: string;
  db: Database;
}) => {
  try {
    const verificationToken = await db.query.verificationTokens.findFirst({
      where: eq(verificationTokens.email, email),
    });

    return verificationToken;
  } catch {
    return undefined;
  }
};
