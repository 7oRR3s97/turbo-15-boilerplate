import type { CreateAbility, MongoAbility } from "@casl/ability";
import { AbilityBuilder, createMongoAbility } from "@casl/ability";
import { z } from "zod";

import type { User } from "@packages/db/schema/auth";

import { permissions } from "./permissions";
import { postSubject } from "./subjects/post";

export const appAbilities = z.union([
  postSubject,

  // used to allow all actions
  z.tuple([z.literal("manage"), z.literal("all")]),
]);

type AppAbilities = z.infer<typeof appAbilities>;

export type AppAbility = MongoAbility<AppAbilities>;
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>;

export function defineAbilityFor(user: User): AppAbility {
  const builder = new AbilityBuilder(createAppAbility);
  if (typeof permissions[user.role] === "function") {
    permissions[user.role](user, builder);
  } else {
    throw new Error(`Trying to use unknown role ${user.role}`);
  }
  const ability = builder.build();
  ability.can.bind(ability);
  ability.cannot.bind(ability);

  return ability;
}
