"use server";

import { revalidateTag } from "next/cache";

import { db, schema } from "@packages/db";
import { CreatePostSchema } from "@packages/validators/post";

import { authActionClient } from "~/actions/utils/safe-action";

export const createPost = authActionClient
  .schema(CreatePostSchema)
  .action(async ({ parsedInput: { title, content }, ctx: { user } }) => {
    await db.insert(schema.post).values({
      title,
      content,
      ownerId: user.id,
    });
    revalidateTag("getAllPosts");
    return { success: true };
  });
