import { cache } from "react";
import NextAuth, { AuthError } from "next-auth";

import { authConfig } from "./config";

const {
  handlers: { GET, POST },
  auth: uncachedAuth,
  signIn,
  signOut,
} = NextAuth(authConfig);

const auth = cache(uncachedAuth);
export type { Session } from "next-auth";

export { authConfig };

export { GET, POST, auth, signIn, signOut, AuthError };
