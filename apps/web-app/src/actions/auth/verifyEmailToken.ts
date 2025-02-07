"use server";

import {
  getUserByEmail,
  getVerificationTokenByEmail,
} from "@packages/auth/utils";
import { db, eq, schema } from "@packages/db";
import { VerifyEmailTokenSchema } from "@packages/validators/auth";

import { actionClient } from "~/actions/utils/safe-action";

export const verifyEmailToken = actionClient
  .schema(VerifyEmailTokenSchema)
  .action(async ({ parsedInput: { token, email } }) => {
    if (!token) {
      throw new Error("Missing token!");
    }

    if (!email) {
      throw new Error("Missing email!");
    }

    const existingUser = await getUserByEmail({ email, db });

    if (!existingUser?.email || !existingUser.password) {
      throw new Error("Invalid email!");
    }

    const existingToken = await getVerificationTokenByEmail({
      email: existingUser.email,
      db,
    });

    if (!existingToken) {
      throw new Error("Invalid email!");
    }

    if (existingToken.token !== token) {
      throw new Error("Invalid code!");
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      throw new Error("Code has expired!");
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
