import type { Locale } from "~/i18n";
import NewVerification from "./_components/NewVerification";

export default async function NewPasswordPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  return <NewVerification lang={lang} />;
}
