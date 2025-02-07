"use server";

import bcrypt from "bcryptjs";

import { db, eq, schema } from "@packages/db";
import { ChangePasswordSchema } from "@packages/validators/auth";

import { actionClient } from "~/actions/utils/safe-action";
import { getUserById, getUserSession } from "~/data/middlewares/auth";

export const changePassword = actionClient
  .schema(ChangePasswordSchema)
  .action(async ({ parsedInput: { currentPassword, newPassword } }) => {
    const session = await getUserSession();
    const user = await getUserById({ userId: session.user.id });

    if (currentPassword && newPassword && user.password) {
      const passwordMatch = await bcrypt.compare(
        currentPassword,
        user.password,
      );
      if (!passwordMatch) {
        throw new Error("Invalid password!");
      }
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db
      .update(schema.users)
      .set({ password: hashedPassword })
      .where(eq(schema.users.id, session.user.id));

    return { success: true };
  });
