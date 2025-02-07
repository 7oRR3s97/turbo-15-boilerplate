import { unstable_cacheLife as cacheLife } from "next/cache";

import { Link } from "@packages/ui/base/components/link";

import type { Locale } from "~/i18n";
import { GoogleLoginButton } from "~/app/[lang]/auth/_components/GoogleLoginButton";
import RegisterForm from "~/app/[lang]/auth/_components/RegisterForm";
import { getDictionary } from "~/utils/getDictionary";

export default async function Register({
  lang,
  callbackUrl,
}: {
  lang: Locale;
  callbackUrl?: string;
}) {
  "use cache";
  cacheLife("hours");
  const t = await getDictionary(lang);
  const callback = callbackUrl ?? undefined;
  return (
    <>
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">{t.signIn.register}</h1>
        <p className="text-balance text-muted-foreground">
          {t.signIn.registerData}
        </p>
      </div>
      <div className="grid gap-4">
        <RegisterForm t={t} />
        <GoogleLoginButton t={t} callbackUrl={callback} register />
      </div>
      <div className="mt-4 text-center text-sm">
        {t.signIn.alreadyAccount}
        <Link href="/auth/login" className="underline" prefetch={true}>
          {t.signIn.login}
        </Link>
      </div>
    </>
  );
}
