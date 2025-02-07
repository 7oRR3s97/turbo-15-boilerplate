import { z } from "zod";

import { selectPostSchema } from "@packages/db/schema/post";

export const postTypeName = z.literal("Post");

export const postSubject = z.tuple([
  z.union([
    z.literal("read"),
    z.literal("create"),
    z.literal("update"),
    z.literal("delete"),
    z.literal("manage"),
  ]),
  z.union([postTypeName, selectPostSchema]),
]);

export type PostTypeName = z.infer<typeof postTypeName>;
export type PostSubject = z.infer<typeof postSubject>;
