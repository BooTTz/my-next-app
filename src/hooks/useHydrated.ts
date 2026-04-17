"use client";

import { useState, useEffect } from "react";

/** 确保组件只在客户端渲染，避免 SSR 水合错误 */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated;
}
