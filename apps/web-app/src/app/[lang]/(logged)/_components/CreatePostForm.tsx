"use client";

import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { UnauthorizedError } from "@packages/api/http";
import { Button } from "@packages/ui/base/ui/button";
import { Input } from "@packages/ui/base/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  useForm,
} from "@packages/ui/components/form";
import { CreatePostSchema } from "@packages/validators/post";

import { createPost } from "~/actions/post/createPost";

export function CreatePostForm() {
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    schema: CreatePostSchema,
    defaultValues: {
      content: "",
      title: "",
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    startTransition(() => {
      createPost(data)
        .then(() => {
          form.reset();
        })
        .catch((err) => {
          if (err instanceof UnauthorizedError) {
            toast.error("You must be logged in to post");
          } else {
            toast.error("Failed to create post");
          }
        });
    });
  });

  return (
    <Form {...form}>
      <form
        className="flex w-full max-w-2xl flex-col gap-4"
        onSubmit={onSubmit}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Title" disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Content" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isPending && (
          <Button disabled>
            <Loader2 className="animate-spin" />
            Please wait
          </Button>
        )}
        {!isPending && (
          <Button type="submit" disabled={isPending}>
            Create
          </Button>
        )}
      </form>
    </Form>
  );
}
