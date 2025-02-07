import Image from "next/image";

import { signIn } from "@packages/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@packages/auth/routes";

import type { Dictionary } from "~/utils/getDictionary";

export function GoogleLoginButton({
  t,
  register,
  callbackUrl,
}: {
  t: Dictionary;
  register?: boolean;
  callbackUrl?: string;
}) {
  const signInText = register
    ? t.signIn.registerWithGoogle
    : t.signIn.loginWithGoogle;
  return (
    <form>
      <button
        className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-1 font-semibold text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
        formAction={async () => {
          "use server";
          await signIn("google", {
            callbackUrl: callbackUrl ?? DEFAULT_LOGIN_REDIRECT,
          });
        }}
      >
        <div className="flex items-center justify-center">
          <Image
            loading="eager"
            decoding="sync"
            src="/googleIcon.svg"
            alt="Google Icon"
            width={30}
            height={30}
          />
          <span className="ml-4">{signInText}</span>
        </div>
      </button>
    </form>
  );
}
