import { redirect } from "next/navigation";

import { auth } from "@packages/auth";

export default async function Home() {
  const session = await auth();
  if (session?.user.id) {
    redirect("/home");
  }
  redirect("/auth/login");
}
