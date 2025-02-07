"use server";

import type { z } from "zod";
import { isRedirectError } from "next/dist/client/components/redirect";

import { auth, signIn, signOut } from "@packages/auth";
import {
  generateVerificationToken,
  getUserByEmail,
  sendVerificationEmail,
} from "@packages/auth/utils";
import { db, eq, schema } from "@packages/db";
import { env } from "@packages/env";
import { UpdateUserSchema } from "@packages/validators/auth";

import { actionClient } from "~/actions/utils/safe-action";
import { getUserSession } from "~/data/middlewares/auth";

export const update = async (input: z.infer<typeof UpdateUserSchema>) => {
  const mandatoryEmailConfirmation =
    env.MANDATORY_EMAIL_CONFIRMATION === "true";

  const { name, email, isTwoFactorEnabled } = input;
  const session = await getUserSession();

  const user = await db.query.users.findFirst({
    where: eq(schema.users.id, session.user.id),
  });
  const isOAuth = session.user.isOAuth;
  const newInput = {
    name: name,
    email: isOAuth ? undefined : email,
    isTwoFactorEnabled: isOAuth ? undefined : isTwoFactorEnabled,
  };
  if (newInput.email && newInput.email != session.user.email) {
    const existingUser = await getUserByEmail({
      email: newInput.email,
      db,
    });
    if (existingUser && existingUser.id !== session.user.id) {
      throw new Error("Email already in use!");
    }
    const verificationToken = await generateVerificationToken({
      email: newInput.email,
      db,
    });
    // if (!verificationToken) {
    //   throw new Error("Error generating verification token");
    // }
    await sendVerificationEmail({
      email: verificationToken.email,
      token: verificationToken.token,
    });
    await db.update(schema.users).set({
      emailVerified: null,
    });
  }

  await db
    .update(schema.users)
    .set({
      name: newInput.name,
      email: newInput.email,
      isTwoFactorEnabled: newInput.isTwoFactorEnabled,
      emailVerified: isOAuth ? undefined : null,
    })
    .where(eq(schema.users.id, session.user.id));

  if (newInput.isTwoFactorEnabled) {
    return signOut({
      redirect: true,
      redirectTo: "/pt-br/auth/login",
    }) as never as undefined;
  }
  if (newInput.email && newInput.email != session.user.email) {
    if (mandatoryEmailConfirmation) {
      return signOut({
        redirect: true,
        redirectTo: "/pt-br/auth/login",
      }) as never as undefined;
    }
    return signIn("credentials", {
      email: newInput.email,
      password: user?.password,
    }) as never as undefined;
  }
  return signIn("credentials", {
    email: session.user.email,
    password: user?.password,
  }) as never as undefined;
};

export const updateUser = actionClient
  .schema(UpdateUserSchema)
  .action(async ({ parsedInput }) => {
    try {
      const response = await update(parsedInput);
      return response;
    } catch (err) {
      const error = err as Error;
      if (isRedirectError(error.cause)) {
        const session = await auth();
        if (!session?.user.emailVerified) {
          return { success: "Email updated! Verify your email to continue." };
        }
        return { success: "User updated!" };
      }
      throw error;
    }
  });
