import type { Locale } from "~/i18n";
import Login from "./_components/Login";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  return <Login lang={lang} />;
}
