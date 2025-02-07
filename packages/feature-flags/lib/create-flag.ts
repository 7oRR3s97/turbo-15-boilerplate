import { unstable_flag as flag } from "@vercel/flags/next";

import { analytics } from "@packages/analytics/posthog/server";
import { auth } from "@packages/auth";

export const createFlag = (key: string) =>
  flag({
    key,
    defaultValue: false,
    async decide() {
      const session = await auth();
      const userId = session?.user?.id;

      if (!userId) {
        return this.defaultValue as boolean;
      }

      const isEnabled = await analytics.isFeatureEnabled(key, userId);

      return isEnabled ?? (this.defaultValue as boolean);
    },
  });
