import * as plugins from "../plugins";

type Plugins = keyof typeof plugins;

type MappedPlugins = {
  [K in Plugins]?: (typeof plugins)[K];
};

export const useNativeFeatures = (): MappedPlugins => {
  return plugins;
};
