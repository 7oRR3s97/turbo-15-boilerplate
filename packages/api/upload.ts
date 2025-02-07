import { UTApi } from "uploadthing/server";

import { env } from "@packages/env";

export const utapi = new UTApi({
  token: env.UPLOADTHING_TOKEN,
});
