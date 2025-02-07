import { unstable_cacheLife as cacheLife } from "next/cache";

import type { Locale } from "~/i18n";
import NewVerificationForm from "~/app/[lang]/auth/_components/NewVerificationForm";
import { getDictionary } from "~/utils/getDictionary";

export default async function NewVerification({ lang }: { lang: Locale }) {
  "use cache";
  cacheLife("hours");
  const t = await getDictionary(lang);

  return (
    <>
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">{t.signIn.verifyEmail}</h1>
        <p className="text-balance text-muted-foreground">
          {t.signIn.verifyEmailWithCode}
        </p>
      </div>
      <div className="grid gap-4">
        <NewVerificationForm t={t} />
      </div>
    </>
  );
}
