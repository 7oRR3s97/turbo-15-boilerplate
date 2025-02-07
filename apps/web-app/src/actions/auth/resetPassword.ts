"use server";

import {
  generatePasswordResetToken,
  getUserByEmail,
  sendPasswordResetEmail,
} from "@packages/auth/utils";
import { db } from "@packages/db";
import { ResetPasswordSchema } from "@packages/validators/auth";

import { actionClient } from "~/actions/utils/safe-action";

export const resetPassword = actionClient
  .schema(ResetPasswordSchema)
  .action(async ({ parsedInput: { email } }) => {
    if (!email) {
      throw new Error("No email data");
    }

    const existingUser = await getUserByEmail({ email, db });

    if (!existingUser) {
      throw new Error("Email not found");
    }

    const passwordResetToken = await generatePasswordResetToken({
      email,
      db,
    });

    // if (!passwordResetToken) {
    //   throw new Error("Error generating password reset token");
    // }

    await sendPasswordResetEmail({
      email: passwordResetToken.email,
      token: passwordResetToken.token,
    });

    return { success: true, email };
  });
