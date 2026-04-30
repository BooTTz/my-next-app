import { BreadcrumbItem } from "./types";

// 面包屑配置 - 去掉首页层级，根目录就是工作台
// 动态路由参数用 [param] 占位
export const BREADCRUMB_CONFIG: Record<string, BreadcrumbItem[]> = {
  // 工作台根目录 - 无面包屑
  "/workspace": [],
  
  // 工作台子页面
  "/workspace/settings": [
    { label: "工作组管理" },
  ],
  
  // 团队工作台页面（当前组织）
  "/team/[teamId]/workspace": [],

  // 检查事项
  "/team/[teamId]/inspection-items": [
    { label: "检查事项" },
  ],
  "/team/[teamId]/inspection-items/[itemId]": [
    { label: "检查事项", href: "" },
    { label: "检查事项详情" },
  ],

  // 隐患管理
  "/team/[teamId]/hazards": [
    { label: "隐患管理" },
  ],
  "/team/[teamId]/hazards/[hazardId]": [
    { label: "隐患管理", href: "" },
    { label: "隐患详情" },
  ],
  
  // 报告管理
  "/team/[teamId]/reports": [
    { label: "检查报告" },
  ],
  "/team/[teamId]/reports/[reportId]": [
    { label: "检查报告", href: "" },
    { label: "报告详情" },
  ],
  
  // 数据统计
  "/team/[teamId]/statistics": [
    { label: "统计分析" },
  ],
  
  // 组织成员管理
  "/team/[teamId]/members": [
    { label: "组织成员管理" },
  ],
  "/team/[teamId]/members/enterprises": [
    { label: "组织成员管理", href: "" },
    { label: "企业列表" },
  ],
  "/team/[teamId]/members/inspectors": [
    { label: "组织成员管理", href: "" },
    { label: "服务机构列表" },
  ],
  "/team/[teamId]/members/supervisors": [
    { label: "组织成员管理", href: "" },
    { label: "监管部门列表" },
  ],
  
  // 组织设置
  "/team/[teamId]/settings": [
    { label: "组织设置" },
  ],
  
  // 整改管理
  "/team/[teamId]/rectification": [
    { label: "整改管理" },
  ],
  
  // 组织管理（工作组子页面）
  "/team/[teamId]/organization": [
    { label: "组织管理" },
  ],
  
  // 通知中心
  "/team/[teamId]/notifications": [
    { label: "通知中心" },
  ],
  
  // 组织详情页
  "/organization/[orgId]": [
    { label: "组织主页" },
  ],
  "/organization/[orgId]/settings": [
    { label: "组织主页", href: "" },
    { label: "组织信息编辑" },
  ],
  
  // 管理员页面
  "/admin/users": [
    { label: "用户管理" },
  ],
  "/admin/users/[userId]": [
    { label: "用户管理", href: "/admin/users" },
    { label: "用户详情" },
  ],
  "/admin/organizations": [
    { label: "组织管理" },
  ],
  "/admin/organizations/new": [
    { label: "组织管理", href: "/admin/organizations" },
    { label: "新建组织" },
  ],
  "/admin/organizations/[orgId]": [
    { label: "组织管理", href: "/admin/organizations" },
    { label: "组织详情" },
  ],
  
  // 个人中心
  "/profile": [
    { label: "个人中心" },
  ],
};
