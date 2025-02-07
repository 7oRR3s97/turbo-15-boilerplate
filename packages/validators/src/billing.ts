import { z } from "zod";

export const CreateCheckoutLinkSchema = z.object({
  successUrl: z.string(),
  cancelUrl: z.string(),
  priceId: z.string(),
});

export const GetCustomerPortalLinkSchema = z.object({
  returnUrl: z.string(),
});

export const GetProductsSchema = z.object({
  successUrl: z.string(),
  cancelUrl: z.string(),
});
