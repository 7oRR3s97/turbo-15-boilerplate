import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { after } from "next/server";

import { analytics } from "@packages/analytics/posthog/server";
import { auth } from "@packages/auth";

import { CreatePostForm } from "../_components/CreatePostForm";
import { PostCardSkeleton } from "../_components/PostCardSkeleton";
import { PostList } from "../_components/PostList";
import { homeSearchParams } from "./searchParams";

interface PageProps {
  searchParams: Promise<SearchParams>; // Next.js 15+: async searchParams prop
}

export default async function HomePage({ searchParams }: PageProps) {
  const session = await auth();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  after(() => {
    analytics.capture({
      event: "Page Viewed",
      distinctId: session?.user.id ?? "",
      properties: {
        page: "home",
      },
    });
  });
  const { sort } = await homeSearchParams.parse(searchParams);
  const sortedText = sort === "asc" ? "Ascending" : "Descending";
  return (
    <main className="container h-screen py-16">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Nextjs Boilerplate
        </h1>

        <CreatePostForm />
        <div className="w-full max-w-2xl overflow-y-scroll">
          <h2 className="text-2xl font-semibold">{`Sorted by ${sortedText} posts`}</h2>
          <Suspense
            fallback={
              <div className="flex w-full flex-col gap-4">
                <PostCardSkeleton />
                <PostCardSkeleton />
                <PostCardSkeleton />
              </div>
            }
          >
            <PostList sort={sort} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
