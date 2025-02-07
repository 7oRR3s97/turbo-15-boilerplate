"use server";

import {
  getUserByEmail,
  getVerificationTokenByToken,
} from "@packages/auth/utils";
import { db, eq, schema } from "@packages/db";
import { VerifyEmailSchema } from "@packages/validators/auth";

import { actionClient } from "~/actions/utils/safe-action";

export const verifyEmail = actionClient
  .schema(VerifyEmailSchema)
  .action(async ({ parsedInput: { token } }) => {
    if (!token) {
      throw new Error("Missing token!");
    }
    const existingToken = await getVerificationTokenByToken({ token, db });

    if (!existingToken) {
      throw new Error("Token does not exist!");
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      throw new Error("Token has expired!");
    }

    const existingUser = await getUserByEmail({
      email: existingToken.email,
      db,
    });

    if (!existingUser) {
      throw new Error("Email does not exist!");
    }

    await db
      .update(schema.users)
      .set({
        emailVerified: new Date(),
        email: existingToken.email,
      })
      .where(eq(schema.users.id, existingUser.id));

    await db
      .delete(schema.verificationTokens)
      .where(eq(schema.verificationTokens.id, existingToken.id));

    return { success: "Email verified!" };
  });
