import { useEffect, useState } from "react";

import { useNativeFeatures } from "./use-native-features";

interface SafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export const useSafeAreaInsets = () => {
  const { safeArea } = useNativeFeatures();
  const [insets, setInsets] = useState<SafeAreaInsets>({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });

  useEffect(() => {
    const getSafeAreaInsets = async () => {
      const response = await safeArea?.SafeArea.getSafeAreaInsets();
      if (response?.insets) setInsets(response.insets);
    };

    void getSafeAreaInsets();
  }, [safeArea?.SafeArea]);

  return insets;
};
