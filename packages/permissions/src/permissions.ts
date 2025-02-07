import type { AbilityBuilder } from "@casl/ability";

import type { User } from "@packages/db/schema/auth";

import type { AppAbility } from "./abilities";
import type { Role } from "./roles";

type UserPermissions = (
  user: User,
  builder: AbilityBuilder<AppAbility>,
) => void;

export const permissions: Record<Role, UserPermissions> = {
  ADMIN(_, { can }) {
    can("manage", "all");
  },
  MEMBER(user, { can }) {
    can(["read", "create"], "Post");
    can(["delete", "update"], "Post", { ownerId: { $eq: user.id } });
  },
};
