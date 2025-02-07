import type { DefaultJWT } from "@auth/core/jwt";
import type { DefaultSession, NextAuthConfig } from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { analytics } from "@packages/analytics/posthog/server";
import { db, eq, schema, tableCreator } from "@packages/db";
import { env } from "@packages/env";
import { createStripeCustomer } from "@packages/payments";
import { getFirstName, getLastName } from "@packages/utils/name";
import { LoginSchema } from "@packages/validators/auth";

import { getAccountByUserId } from "./utils/account";
import { getTwoFactorConfirmationByUserId } from "./utils/tokens/two-factor-confirmation";
import { getUserByEmail, getUserById } from "./utils/user";

export type UserRole = "user" | "admin";

export type ExtendedUser = DefaultSession["user"] & {
  id: string;
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
  emailVerified?: Date;
};

export type ExtendedToken = DefaultJWT & {
  id: string;
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
  emailVerified?: Date;
};

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & ExtendedUser;
  }

  interface JWT {
    token: ExtendedToken;
  }
}

export const authConfig = {
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail({ email, db });
          if (!user?.password) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) return user;
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async createUser({ user }) {
      if (user.id) {
        analytics.identify({
          distinctId: user.id,
          properties: {
            email: user.email,
            firstName: getFirstName(user.name ?? undefined),
            lastName: getLastName(user.name ?? undefined),
            createdAt: new Date(),
            avatar: user.image,
          },
        });

        analytics.capture({
          event: "User Created",
          distinctId: user.id,
        });
      }
      await createStripeCustomer(user);
    },
    async linkAccount({ user }) {
      if (!user.id) return;
      await db
        .update(schema.users)
        .set({ emailVerified: new Date() })
        .where(eq(schema.users.id, user.id));
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      const mandatoryEmailConfirmation =
        env.MANDATORY_EMAIL_CONFIRMATION === "true";
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById({ id: user.id, db });

      if (!existingUser) return false;
      // Prevent sign in without email verification
      if (mandatoryEmailConfirmation && !existingUser.emailVerified)
        return false;

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId({
          userId: existingUser.id,
          db,
        });

        if (!twoFactorConfirmation) return false;

        // Delete two factor confirmation for next sign in
        await db
          .delete(schema.twoFactorConfirmations)
          .where(
            eq(schema.twoFactorConfirmations.id, twoFactorConfirmation.id),
          );
      }

      return true;
    },
    session({ token, session }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          isOAuth: token.isOAuth,
          isTwoFactorEnabled: token.isTwoFactorEnabled,
          emailVerified: token.emailVerified,
        },
      };
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById({ id: token.sub, db });

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId({
        userId: existingUser.id,
        db,
      });
      return {
        ...token,
        name: existingUser.name,
        email: existingUser.email,
        isOAuth: !!existingAccount,
        isTwoFactorEnabled: existingUser.isTwoFactorEnabled,
        emailVerified: existingUser.emailVerified ?? undefined,
      };
    },
  },
  adapter: DrizzleAdapter(db, tableCreator),
  session: { strategy: "jwt" },
} satisfies NextAuthConfig;
