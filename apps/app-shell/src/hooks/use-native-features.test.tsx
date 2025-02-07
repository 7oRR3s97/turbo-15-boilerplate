import { renderHook } from "@testing-library/react";
import { expect, test, vi } from "vitest";

vi.mock("../plugins", async () => {
  return {
    filesystem: undefined,
    device: await import("@capacitor/device"),
  };
});

test("happy path feature load", async () => {
  const { useNativeFeatures } = await import("./use-native-features");

  const { result } = renderHook(() => useNativeFeatures());

  expect(result.current.filesystem).toBe(undefined);
  expect(result.current.device).toEqual({ Device: {} });
});
