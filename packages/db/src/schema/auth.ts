import type { AdapterAccount } from "@auth/core/adapters";
import type { z } from "zod";
import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";

import { pgTable } from "./_table";

export const roleEnum = pgEnum("userRole", ["MEMBER", "ADMIN"]);

export const users = pgTable("user", {
  id: uuid("id").notNull().defaultRandom().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  password: text("password"),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  role: roleEnum().notNull().default("MEMBER"),
  isTwoFactorEnabled: boolean("isTwoFactorEnabled").notNull().default(false),
  stripeCustomerId: text("stripeCustomerId"),
});

export const accounts = pgTable(
  "account",
  {
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    id: uuid("id").notNull().defaultRandom(),
    email: text("email").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.email, vt.token] }),
  }),
);

export const passwordResetTokens = pgTable(
  "passwordResetToken",
  {
    id: uuid("id").notNull().defaultRandom(),
    email: text("email").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.email, vt.token] }),
  }),
);

export const twoFactorTokens = pgTable(
  "twoFactorToken",
  {
    id: uuid("id").notNull().defaultRandom(),
    email: text("email").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.email, vt.token] }),
  }),
);

export const twoFactorConfirmations = pgTable("twoFactorConfirmation", {
  id: uuid("id").notNull().defaultRandom().primaryKey(),

  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const userRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  verificationTokens: many(verificationTokens),
}));

export const accountRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const twoFactorConfirmationRelations = relations(
  twoFactorConfirmations,
  ({ one }) => ({
    user: one(users, {
      fields: [twoFactorConfirmations.userId],
      references: [users.id],
    }),
  }),
);

export const verificationTokenRelations = relations(
  verificationTokens,
  ({ one }) => ({
    user: one(users, {
      fields: [verificationTokens.email],
      references: [users.email],
    }),
  }),
);

export const passwordResetTokenRelations = relations(
  passwordResetTokens,
  ({ one }) => ({
    user: one(users, {
      fields: [passwordResetTokens.email],
      references: [users.email],
    }),
  }),
);

export const twoFactorTokenRelations = relations(
  twoFactorTokens,
  ({ one }) => ({
    user: one(users, {
      fields: [twoFactorTokens.email],
      references: [users.email],
    }),
  }),
);

export const selectUserSchema = createSelectSchema(users);

export type User = z.infer<typeof selectUserSchema>;
