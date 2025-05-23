"use server";

import bcrypt from "bcryptjs";

import {
  getPasswordResetTokenByToken,
  getUserByEmail,
} from "@packages/auth/utils";
import { db, eq, schema } from "@packages/db";
import { ChangePasswordEmailSchema } from "@packages/validators/auth";

import { actionClient } from "~/actions/utils/safe-action";

export const changePasswordEmail = actionClient
  .schema(ChangePasswordEmailSchema)
  .action(async ({ parsedInput: { token, password } }) => {
    if (!token) {
      throw new Error("No token data");
    }

    if (!password) {
      throw new Error("No password data");
    }

    const existingToken = await getPasswordResetTokenByToken({ token, db });

    if (!existingToken) {
      throw new Error("Invalid token!");
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

    const hashedPassword = await bcrypt.hash(password, 10);

    await db
      .update(schema.users)
      .set({ password: hashedPassword })
      .where(eq(schema.users.id, existingUser.id));

    await db
      .delete(schema.passwordResetTokens)
      .where(eq(schema.passwordResetTokens.id, existingToken.id));

    return { success: true };
  });
