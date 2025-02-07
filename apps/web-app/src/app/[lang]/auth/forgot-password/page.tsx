import type { Locale } from "~/i18n";
import ForgotPassword from "./_components/ForgotPassword";

export default async function ForgotPasswordPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  return <ForgotPassword lang={lang} />;
}
