import type { Locale } from "~/i18n";
import NewPassword from "./_components/NewPassword";

export default async function NewPasswordPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  return <NewPassword lang={lang} />;
}
