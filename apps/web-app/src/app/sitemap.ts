// biome-ignore lint/correctness/noNodejsModules: Generates sitemap on Node.js
import fs from "node:fs";

import type { MetadataRoute } from "next";

import { env } from "@packages/env";

const appFolders = fs.readdirSync("src/app", { withFileTypes: true });
const pages = appFolders
  .filter((file) => file.isDirectory())
  .filter((folder) => !folder.name.startsWith("_"))
  .filter((folder) => !folder.name.startsWith("("))
  .map((folder) => folder.name);

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: env.VERCEL_URL,
      lastModified: new Date(),
    },
    ...pages.map((page) => ({
      url: new URL(page, env.VERCEL_URL).href,
      lastModified: new Date(),
    })),
  ];
}
