/// <reference types="@capacitor/splash-screen" />

import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.boilerplate.app",
  appName: "Boilerplate",
  webDir: "dist",
  backgroundColor: "#FFFFFF",
  server: {
    allowNavigation: ["*"],
    url: "http://localhost:3000",
  },
  plugins: {
    CapacitorCookies: {
      enabled: false,
    },
    CapacitorHttp: {
      enabled: false,
    },
    SplashScreen: {
      splashImmersive: true,
    },
  },
};

export default config;
