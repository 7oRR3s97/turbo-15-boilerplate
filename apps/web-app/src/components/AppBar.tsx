"use client";

import { useSafeAreaInsets } from "@apps/app-shell";

export default function Appbar() {
  const { top } = useSafeAreaInsets();
  return <div className={`pt-[${top}px]`} />;
}
