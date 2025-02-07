import { unstable_cacheLife as cacheLife } from "next/cache";

import { Link } from "@packages/ui/base/components/link";

import type { Locale } from "~/i18n";
import { GoogleLoginButton } from "~/app/[lang]/auth/_components/GoogleLoginButton";
import LoginForm from "~/app/[lang]/auth/_components/LoginForm";
import { getDictionary } from "~/utils/getDictionary";

export default async function Login({ lang }: { lang: Locale }) {
  "use cache";
  cacheLife("hours");
  const t = await getDictionary(lang);

  return (
    <>
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">{t.signIn.login}</h1>
        <p className="text-balance text-muted-foreground">
          {t.signIn.enterEmail}
        </p>
      </div>
      <div className="grid gap-4">
        <LoginForm t={t} />
        <GoogleLoginButton t={t} />
      </div>
      <div className="mt-4 text-center text-sm">
        {t.signIn.noAccount}
        <Link href="/auth/register" className="underline" prefetch={true}>
          {t.signIn.signUp}
        </Link>
      </div>
    </>
  );
}
