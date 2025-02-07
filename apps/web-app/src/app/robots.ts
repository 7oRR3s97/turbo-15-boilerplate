import type { MetadataRoute } from "next";

import { env } from "@packages/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: new URL("/sitemap.xml", `https://${env.VERCEL_URL}`).href,
  };
}
