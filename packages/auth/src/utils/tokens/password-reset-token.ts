import type { Database } from "@packages/db";
import { eq } from "@packages/db";
import { passwordResetTokens } from "@packages/db/schema/auth";

export const getPasswordResetTokenByToken = async ({
  token,
  db,
}: {
  token: string;
  db: Database;
}) => {
  try {
    const passwordResetToken = await db.query.passwordResetTokens.findFirst({
      where: eq(passwordResetTokens.token, token),
    });

    return passwordResetToken;
  } catch {
    return undefined;
  }
};

export const getPasswordResetTokenByEmail = async ({
  email,
  db,
}: {
  email: string;
  db: Database;
}) => {
  try {
    const passwordResetToken = await db.query.passwordResetTokens.findFirst({
      where: eq(passwordResetTokens.email, email),
    });

    return passwordResetToken;
  } catch {
    return undefined;
  }
};
