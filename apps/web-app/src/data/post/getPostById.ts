"use server";

import { subject } from "@casl/ability";

import { db, eq } from "@packages/db";
import { post } from "@packages/db/schema/post";

export const getPostById = async ({ postId }: { postId: string }) => {
  const postResponse = await db.query.post.findFirst({
    where: eq(post.id, postId),
  });
  if (!postResponse) return undefined;
  return subject("Post", postResponse);
};
