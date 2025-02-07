"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

import { analytics } from "@packages/analytics/posthog/server";
import { signIn } from "@packages/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@packages/auth/routes";
import {
  generateVerificationToken,
  getUserByEmail,
  sendVerificationEmail,
} from "@packages/auth/utils";
import { db, schema } from "@packages/db";
import { env } from "@packages/env";
import { createStripeCustomer } from "@packages/payments";
import { RegisterSchema } from "@packages/validators/auth";

import { actionClient } from "~/actions/utils/safe-action";

export const register = actionClient
  .schema(RegisterSchema)
  .action(async ({ parsedInput: { email, password, name } }) => {
    const mandatoryEmailConfirmation =
      env.MANDATORY_EMAIL_CONFIRMATION === "true";
    const tokenConfirmation = env.EMAIL_CONFIRMATION_METHOD === "token";

    if (!email || !password || !name) {
      throw new Error("Missing required fields!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail({ email, db });

    if (existingUser) {
      return { error: "Email already in use!" };
    }

    const users = await db
      .insert(schema.users)
      .values({
        name,
        email,
        password: hashedPassword,
      })
      .returning();
    const user = users[0];
    analytics.capture({
      event: "user_created",
      distinctId: user.id,
    });
    await createStripeCustomer(user);

    if (mandatoryEmailConfirmation) {
      const verificationToken = await generateVerificationToken({
        email,
        db,
      });

      // if (!verificationToken) {
      //   throw new Error("Error generating verification token");
      // }
      await sendVerificationEmail({
        email: verificationToken.email,
        token: verificationToken.token,
      });

      if (tokenConfirmation) {
        redirect(`/auth/new-verification?email=${email}`);
      }

      return {
        success: true,
        email: verificationToken.email,
      };
    }
    return signIn("credentials", {
      email: email,
      password: password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    }) as never as undefined;
  });
