import type { User } from "@packages/db/schema/auth";

import { defineAbilityFor } from "./abilities";

export const getUserPermissions = (user: User) => {
  const ability = defineAbilityFor(user);
  return ability;
};
