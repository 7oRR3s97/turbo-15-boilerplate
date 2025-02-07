import baseConfig from "@tooling/eslint-config/base";
import reactConfig from "@tooling/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ["android", "ios", "dist"],
  },
  ...baseConfig,
  ...reactConfig,
];
