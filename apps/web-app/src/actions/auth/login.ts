"use server";

import { redirect } from "next/navigation";

import { signIn } from "@packages/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@packages/auth/routes";
import {
  generateTwoFactorToken,
  generateVerificationToken,
  getTwoFactorConfirmationByUserId,
  getTwoFactorTokenByEmail,
  getUserByEmail,
  sendTwoFactorTokenEmail,
  sendVerificationEmail,
} from "@packages/auth/utils";
import { db, eq, schema } from "@packages/db";
import { env } from "@packages/env";
import { LoginSchema } from "@packages/validators/auth";

import { actionClient } from "~/actions/utils/safe-action";

export const login = actionClient
  .schema(LoginSchema)
  .action(async ({ parsedInput: { email, password, code, callbackUrl } }) => {
    const mandatoryEmailConfirmation =
      env.MANDATORY_EMAIL_CONFIRMATION === "true";
    const tokenConfirmation = env.EMAIL_CONFIRMATION_METHOD === "token";

    if (!email) {
      throw new Error("Email is required");
    }

    if (!password) {
      throw new Error("Password is required");
    }

    const existingUser = await getUserByEmail({ email, db });

    if (!existingUser?.email || !existingUser.password) {
      throw new Error("Invalid credentials!");
    }

    if (!existingUser.emailVerified && mandatoryEmailConfirmation) {
      const verificationToken = await generateVerificationToken({
        email: existingUser.email,
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
    if (existingUser.isTwoFactorEnabled && existingUser.email) {
      if (code) {
        const twoFactorToken = await getTwoFactorTokenByEmail({
          email: existingUser.email,
          db,
        });

        if (!twoFactorToken) {
          throw new Error("Invalid code!");
        }

        if (twoFactorToken.token !== code) {
          throw new Error("Invalid code!");
        }

        const hasExpired = new Date(twoFactorToken.expires) < new Date();

        if (hasExpired) {
          throw new Error("Code has expired!");
        }

        await db
          .delete(schema.twoFactorTokens)
          .where(eq(schema.twoFactorTokens.id, twoFactorToken.id));

        const existingConfirmation = await getTwoFactorConfirmationByUserId({
          userId: existingUser.id,
          db,
        });

        if (existingConfirmation) {
          await db
            .delete(schema.twoFactorConfirmations)
            .where(
              eq(schema.twoFactorConfirmations.id, existingConfirmation.id),
            );
        }

        await db.insert(schema.twoFactorConfirmations).values({
          userId: existingUser.id,
        });
      } else {
        const twoFactorToken = await generateTwoFactorToken({
          email: existingUser.email,
          db,
        });
        // if (!twoFactorToken) {
        //   throw new Error("Error generating two factor token");
        // }
        await sendTwoFactorTokenEmail({
          email: twoFactorToken.email,
          token: twoFactorToken.token,
        });

        return { twoFactor: true };
      }
    }
    return signIn("credentials", {
      email: email,
      password: password,
      redirectTo: callbackUrl ?? DEFAULT_LOGIN_REDIRECT,
    }) as never as undefined;
  });
