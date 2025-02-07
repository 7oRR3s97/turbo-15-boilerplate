import type { Metadata, Viewport } from "next";
import { connection } from "next/server";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { VercelToolbar } from "@vercel/toolbar/next";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { AnalyticsProvider } from "@packages/analytics";
import { env } from "@packages/env";
import { createMetadata } from "@packages/seo/metadata";
import { Toaster } from "@packages/ui/base/ui/sonner";
import { TooltipProvider } from "@packages/ui/base/ui/tooltip";
import { ThemeProvider } from "@packages/ui/providers/theme";

import { i18n } from "~/i18n";

const title = "Home";
const description = "homepage";

export const metadata: Metadata = createMetadata({
  title,
  description,
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <NuqsAdapter>
        <AnalyticsProvider>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster richColors position="bottom-center" />
          <SpeedInsights />
          {env.NODE_ENV === "development" && <VercelToolbar />}
        </AnalyticsProvider>
      </NuqsAdapter>
    </ThemeProvider>
  );
}
