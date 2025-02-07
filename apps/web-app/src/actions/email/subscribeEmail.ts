"use server";

import type { z } from "zod";

import type { SubscribeEmailSchema } from "@packages/validators/email";
import { subscribeEmail } from "@packages/auth/utils";

export const subscribeEmailAction = async (
  data: z.infer<typeof SubscribeEmailSchema>,
) => {
  try {
    await subscribeEmail(data);
    return { success: true };
  } catch {
    throw new Error("Error subscribing to email");
  }
};
