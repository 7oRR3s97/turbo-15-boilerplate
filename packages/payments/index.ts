import "server-only";

import type { User } from "next-auth";
import Stripe from "stripe";

import { db, eq, schema } from "@packages/db";
import { env } from "@packages/env";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2024-11-20.acacia",
});

export async function createStripeCustomer(user: User) {
  const customer = await stripe.customers.create({
    email: String(user.email),
  });

  const newUser = await db
    .update(schema.users)
    .set({ stripeCustomerId: customer.id })
    .where(eq(schema.users.id, user.id ?? ""))
    .returning();

  return newUser[0]?.stripeCustomerId;
}

export const stripeVercelUrl = env.VERCEL_URL;

export const stripeAppUrl =
  env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://" + stripeVercelUrl;

export type { Stripe } from "stripe";
