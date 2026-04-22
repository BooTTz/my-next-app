import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { BREADCRUMB_CONFIG } from "@/lib/breadcrumb-config";
import type { BreadcrumbItem } from "@/lib/types";

/**
 * 将实际路径转换为路由模式，并提取参数映射
 * 例如: /team/abc123/plans/new → /team/[teamId]/plans/new, { teamId: "abc123" }
 */
function matchPathPattern(
  pathname: string
): { pattern: string; params: Record<string, string> } | null {
  const patterns = Object.keys(BREADCRUMB_CONFIG);

  for (const pattern of patterns) {
    // 将模式中的 [param] 替换为正则捕获组
    const paramNames: string[] = [];
    const regexStr = pattern.replace(/\[([^\]]+)\]/g, (_, name: string) => {
      paramNames.push(name);
      return "([^/]+)";
    });

    const regex = new RegExp(`^${regexStr}$`);
    const match = pathname.match(regex);

    if (match) {
      const params: Record<string, string> = {};
      paramNames.forEach((name, index) => {
        params[name] = match[index + 1];
      });
      return { pattern, params };
    }
  }

  return null;
}

/**
 * 使用路由参数填充面包屑中的动态 href
 * 例如: 检查计划管理 href="" → /team/abc123/plans
 */
function fillDynamicHrefs(
  items: BreadcrumbItem[],
  pattern: string,
  params: Record<string, string>
): BreadcrumbItem[] {
  return items.map((item) => {
    if (item.href !== "") return item;

    // 找到当前 label 对应的路由模式，尝试推断其 href
    // 通过匹配 label 在配置中已有 href 的同名条目
    for (const [configPattern, configItems] of Object.entries(BREADCRUMB_CONFIG)) {
      const matchingItem = configItems.find(
        (ci) => ci.label === item.label && ci.href && ci.href !== ""
      );
      if (matchingItem && matchingItem.href) {
        // 将模式中的参数用实际值替换
        let resolvedHref = matchingItem.href;
        Object.entries(params).forEach(([key, value]) => {
          resolvedHref = resolvedHref.replace(`[${key}]`, value);
        });
        return { ...item, href: resolvedHref };
      }
    }

    // 若无法从配置推断，尝试从当前 pattern 中推导上级路由
    const patternSegments = pattern.split("/");
    // 从当前路由模式中移除最后一段，作为父级路径
    const parentPattern = patternSegments.slice(0, -1).join("/");
    if (parentPattern) {
      let resolvedHref = parentPattern;
      Object.entries(params).forEach(([key, value]) => {
        resolvedHref = resolvedHref.replace(`[${key}]`, value);
      });
      return { ...item, href: resolvedHref };
    }

    return item;
  });
}

/**
 * 面包屑 hook
 * 根据当前路径自动匹配面包屑配置，并填充动态路由参数
 */
export function useBreadcrumbs(): BreadcrumbItem[] {
  const pathname = usePathname();

  return useMemo(() => {
    const result = matchPathPattern(pathname);
    if (!result) return [];

    const { pattern, params } = result;
    const configItems = BREADCRUMB_CONFIG[pattern];

    // 深拷贝，避免修改原始配置
    const items = configItems.map((item) => ({ ...item }));

    // 填充动态 href（空字符串的）
    return fillDynamicHrefs(items, pattern, params);
  }, [pathname]);
}
