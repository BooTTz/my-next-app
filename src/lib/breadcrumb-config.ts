import { BreadcrumbItem } from "./types";

// 路由模式 → 面包屑配置的映射表
// 动态路由参数用 [param] 占位
export const BREADCRUMB_CONFIG: Record<string, BreadcrumbItem[]> = {
  "/workspace": [{ label: "首页" }],
  "/workspace/settings": [
    { label: "首页", href: "/workspace" },
    { label: "工作组管理" },
  ],
  "/team/[teamId]/dashboard": [
    { label: "首页", href: "/workspace" },
    { label: "工作台" },
  ],
  "/team/[teamId]/plans": [
    { label: "首页", href: "/workspace" },
    { label: "检查计划管理" },
  ],
  "/team/[teamId]/plans/new": [
    { label: "首页", href: "/workspace" },
    { label: "检查计划管理", href: "" }, // href 将在 hook 中动态填充
    { label: "新建检查计划" },
  ],
  "/team/[teamId]/plans/[planId]": [
    { label: "首页", href: "/workspace" },
    { label: "检查计划管理", href: "" },
    { label: "计划详情" },
  ],
  "/team/[teamId]/tasks": [
    { label: "首页", href: "/workspace" },
    { label: "检查任务管理" },
  ],
  "/team/[teamId]/tasks/[taskId]": [
    { label: "首页", href: "/workspace" },
    { label: "检查任务管理", href: "" },
    { label: "任务详情" },
  ],
  "/team/[teamId]/hazards": [
    { label: "首页", href: "/workspace" },
    { label: "隐患管理" },
  ],
  "/team/[teamId]/hazards/[hazardId]": [
    { label: "首页", href: "/workspace" },
    { label: "隐患管理", href: "" },
    { label: "隐患详情" },
  ],
  "/team/[teamId]/reports": [
    { label: "首页", href: "/workspace" },
    { label: "报告管理" },
  ],
  "/team/[teamId]/reports/[reportId]": [
    { label: "首页", href: "/workspace" },
    { label: "报告管理", href: "" },
    { label: "报告详情" },
  ],
  "/team/[teamId]/statistics": [
    { label: "首页", href: "/workspace" },
    { label: "数据统计" },
  ],
  "/team/[teamId]/members": [
    { label: "首页", href: "/workspace" },
    { label: "组织成员管理" },
  ],
  "/team/[teamId]/notifications": [
    { label: "首页", href: "/workspace" },
    { label: "通知中心" },
  ],
  "/team/[teamId]/settings": [
    { label: "首页", href: "/workspace" },
    { label: "组织设置" },
  ],
  "/team/[teamId]/rectification": [
    { label: "首页", href: "/workspace" },
    { label: "整改管理" },
  ],
  "/team/[teamId]/organization": [
    { label: "首页", href: "/workspace" },
    { label: "组织管理" },
  ],
  "/organization/[orgId]": [
    { label: "首页", href: "/workspace" },
    { label: "组织主页" },
  ],
  "/organization/[orgId]/settings": [
    { label: "首页", href: "/workspace" },
    { label: "组织主页", href: "" },
    { label: "组织信息编辑" },
  ],
  "/admin/users": [
    { label: "首页", href: "/admin" },
    { label: "平台用户管理" },
    { label: "用户管理" },
  ],
  "/admin/users/[userId]": [
    { label: "首页", href: "/admin" },
    { label: "用户管理", href: "/admin/users" },
    { label: "用户详情" },
  ],
  "/admin/organizations": [
    { label: "首页", href: "/admin" },
    { label: "平台用户管理" },
    { label: "组织管理" },
  ],
  "/admin/organizations/[orgId]": [
    { label: "首页", href: "/admin" },
    { label: "组织管理", href: "/admin/organizations" },
    { label: "组织详情" },
  ],
  "/profile": [{ label: "个人中心" }],
};
