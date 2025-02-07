import type { Locale } from "~/i18n";
import Register from "./_components/Register";

export default async function RegisterPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: Locale }>;
  searchParams: Promise<{ callbackUrl: string | null | undefined }>;
}) {
  const { lang } = await params;
  const { callbackUrl } = await searchParams;
  return <Register lang={lang} callbackUrl={callbackUrl ?? undefined} />;
}
