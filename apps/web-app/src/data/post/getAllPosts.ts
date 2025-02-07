"use server";

import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";

import { db, eq } from "@packages/db";
import { post } from "@packages/db/schema/post";

import { getUserById, getUserSession } from "../middlewares/auth";

type SortOrder = "asc" | "desc" | null;

export const getAllPostsByUser = async ({
  userId,
  sort,
}: {
  userId: string;
  sort: SortOrder;
}) => {
  "use cache";
  cacheLife("minutes");
  cacheTag("getAllPosts");
  const posts = await db.query.post.findMany({
    where: eq(post.ownerId, userId),
    orderBy: (post, { asc, desc }) => {
      if (sort === "asc") {
        return asc(post.createdAt);
      }
      if (sort === "desc") {
        return desc(post.createdAt);
      }
      return asc(post.createdAt);
    },
  });

  return posts;
};

export const getAllPosts = async ({ sort }: { sort: SortOrder }) => {
  const session = await getUserSession();
  const user = await getUserById({ userId: session.user.id });
  const posts = getAllPostsByUser({ userId: user.id, sort });

  return posts;
};
