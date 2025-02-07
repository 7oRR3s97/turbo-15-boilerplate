import { z } from "zod";

export const SubscribeEmailSchema = z.object({
  email: z.string().email(),
});
