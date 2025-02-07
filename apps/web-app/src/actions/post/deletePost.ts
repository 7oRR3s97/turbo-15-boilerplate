"use server";

import { revalidateTag } from "next/cache";

import { UnauthorizedError } from "@packages/api/http";
import { db, eq, schema } from "@packages/db";
import { getUserPermissions } from "@packages/permissions/src/get-user-permissions";
import { DeletePostSchema } from "@packages/validators/post";

import { authActionClient } from "~/actions/utils/safe-action";
import { getPostById } from "~/data/post/getPostById";

export const deletePost = authActionClient
  .schema(DeletePostSchema)
  .action(async ({ parsedInput: { id }, ctx: { user } }) => {
    const permissions = getUserPermissions(user);
    const post = await getPostById({ postId: id });
    if (!post) throw new Error("Post not found");

    if (permissions.cannot("delete", post)) {
      throw new UnauthorizedError(
        "Unauthorized! You can delete only your own posts",
      );
    }
    await db.delete(schema.post).where(eq(schema.post.id, id));
    revalidateTag("getAllPosts");

    return { success: true };
  });
