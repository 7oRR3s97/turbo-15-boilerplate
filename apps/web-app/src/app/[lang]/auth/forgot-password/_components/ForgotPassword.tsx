import { unstable_cacheLife as cacheLife } from "next/cache";

import { env } from "@packages/env";

import type { Locale } from "~/i18n";
import ResetForm from "~/app/[lang]/auth/_components/ResetForm";
import { getDictionary } from "~/utils/getDictionary";

export default async function ForgotPassword({ lang }: { lang: Locale }) {
  "use cache";
  cacheLife("hours");
  const tokenConfirmation = env.RESET_PASSWORD_METHOD === "token";
  const t = await getDictionary(lang);

  return (
    <>
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">{t.signIn.forgotPassword}</h1>
        <p className="text-balance text-muted-foreground">
          {t.signIn.insertResetEmail}
        </p>
      </div>
      <div className="grid gap-4">
        <ResetForm t={t} tokenConfirmation={tokenConfirmation} />
      </div>
    </>
  );
}
