"use client";

/**
 * RoleThemeProvider
 * 根据当前登录用户的角色类型，在 <body> 上动态挂载 data-role 属性，
 * 从而触发 globals.css 中对应的角色主题 CSS 变量覆盖。
 *
 * 角色 → 主题色：
 *   supervisor  → 蓝色（监管部门）
 *   inspector   → 绿色（服务机构）
 *   enterprise  → 黄色/琥珀色（企业主体）
 */

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";

export function RoleThemeProvider({ children }: { children: React.ReactNode }) {
  const currentUserType = useAppStore((s) => s.currentUserType);
  const currentUser = useAppStore((s) => s.currentUser);

  useEffect(() => {
    const body = document.body;
    // 移除旧的 data-role
    body.removeAttribute("data-role");

    if (currentUser) {
      // 已登录时根据用户类型设置角色主题
      body.setAttribute("data-role", currentUserType);
    }
  }, [currentUserType, currentUser]);

  return <>{children}</>;
}
