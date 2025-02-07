import { createSafeActionClient } from "next-safe-action";

import { getUserById, getUserSession } from "~/data/middlewares/auth";

export const actionClient = createSafeActionClient();

export const authActionClient = actionClient.use(async ({ next, ctx }) => {
  const session = await getUserSession();
  const user = await getUserById({ userId: session.user.id });

  return next({ ctx: { ...ctx, user } });
});
