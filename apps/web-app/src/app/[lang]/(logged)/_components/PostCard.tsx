"use client";

import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";

import type { Post } from "@packages/db/schema/post";
import { UnauthorizedError } from "@packages/api/http";
import { Button } from "@packages/ui/base/ui/button";

import { deletePost } from "~/actions/post/deletePost";

export function PostCard(props: { post: Post }) {
  const [_isPending, startTransition] = useTransition();
  const [optimisticPost, removeOptimisticPost] = useOptimistic(
    props.post,
    () => undefined,
  );

  const handleDeletePost = async (postToRemove: Post) => {
    removeOptimisticPost(postToRemove);
    try {
      await deletePost({ id: postToRemove.id });
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        toast.error("You must be logged in to delete a post");
      } else {
        toast.error("Failed to delete post");
      }
    }
  };

  if (!optimisticPost) {
    return null;
  }
  return (
    <div className="flex flex-row rounded-lg bg-muted p-4">
      <div className="flex-grow">
        <h2 className="text-2xl font-bold text-primary">
          {optimisticPost.title}
        </h2>
        <p className="mt-2 text-sm">{optimisticPost.content}</p>
      </div>
      <div>
        <Button
          variant="ghost"
          className="cursor-pointer text-sm font-bold uppercase text-primary hover:bg-transparent hover:text-white"
          onClick={() => startTransition(() => handleDeletePost(props.post))}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
