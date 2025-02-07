import { v4 as uuidv4 } from "uuid";

import type { Database } from "@packages/db";
import { eq } from "@packages/db";
import {
  passwordResetTokens,
  twoFactorTokens,
  verificationTokens,
} from "@packages/db/schema/auth";
import { env } from "@packages/env";

import { getPasswordResetTokenByEmail } from "./password-reset-token";
import { getTwoFactorTokenByEmail } from "./two-factor-token";
import { getVerificationTokenByEmail } from "./verification-token";

function getRandomSixDigitString() {
  const randomNumber = Math.floor(Math.random() * 1000000);
  return randomNumber.toString().padStart(6, "0");
}

export * from "./two-factor-token";
export * from "./password-reset-token";
export * from "./verification-token";
export * from "./two-factor-confirmation";

export const generateTwoFactorToken = async ({
  email,
  db,
}: {
  email: string;
  db: Database;
}) => {
  const token = getRandomSixDigitString();
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000);

  const existingToken = await getTwoFactorTokenByEmail({ email, db });

  if (existingToken) {
    await db
      .delete(twoFactorTokens)
      .where(eq(twoFactorTokens.id, existingToken.id));
  }

  const twoFactorToken = await db
    .insert(twoFactorTokens)
    .values({
      email,
      token,
      expires,
    })
    .returning();

  return twoFactorToken[0];
};

export const generatePasswordResetToken = async ({
  email,
  db,
}: {
  email: string;
  db: Database;
}) => {
  const tokenConfirmation = env.RESET_PASSWORD_METHOD === "token";
  const token = tokenConfirmation ? getRandomSixDigitString() : uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPasswordResetTokenByEmail({ email, db });

  if (existingToken) {
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.id, existingToken.id));
  }

  const passwordResetToken = await db
    .insert(passwordResetTokens)
    .values({
      email,
      token,
      expires,
    })
    .returning();

  return passwordResetToken[0];
};

export const generateVerificationToken = async ({
  email,
  db,
}: {
  email: string;
  db: Database;
}) => {
  const tokenConfirmation = env.EMAIL_CONFIRMATION_METHOD === "token";
  const token = tokenConfirmation ? getRandomSixDigitString() : uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail({ email, db });

  if (existingToken) {
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.id, existingToken.id));
  }

  const verficationToken = await db
    .insert(verificationTokens)
    .values({
      email,
      token,
      expires,
    })
    .returning();

  return verficationToken[0];
};
