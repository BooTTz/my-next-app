"use client";

import { useState, useEffect } from "react";

/** 确保组件只在客户端渲染，避免 SSR 水合错误 */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);
  return hydrated;
}
