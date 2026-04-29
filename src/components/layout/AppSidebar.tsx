"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import {
  LayoutDashboard, ClipboardList, FileCheck, AlertTriangle,
  FileText, BarChart3, Building2, Bell,
  Wrench, ChevronDown, ChevronRight, Shield, FolderKanban,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface NavItem {
  label: string;
  icon: ReactNode;
  href?: string;
  children?: { label: string; href: string }[];
  roles?: string[];
}

function getNavItems(teamId: string, userType: string): NavItem[] {
  const base = `/team/${teamId}`;

  if (userType === "supervisor") {
    return [
      { label: "工作台", icon: <LayoutDashboard className="size-4" />, href: `${base}/workspace` },
      { label: "项目管理", icon: <FolderKanban className="size-4" />, href: `${base}/projects` },
      {
        label: "检查管理", icon: <ClipboardList className="size-4" />,
        children: [
          { label: "检查计划列表", href: `${base}/plans` },
          { label: "检查任务管理", href: `${base}/tasks` },
          { label: "隐患总览", href: `${base}/hazards` },
          { label: "检查报告", href: `${base}/reports` },
        ],
      },
      { label: "数据统计", icon: <BarChart3 className="size-4" />, href: `${base}/statistics` },
      // 成员管理已整合到团队详情页（/team/[teamId]）
    ];
  }

  if (userType === "inspector") {
    return [
      { label: "工作台", icon: <LayoutDashboard className="size-4" />, href: `${base}/workspace` },
      { label: "收到的项目", icon: <FolderKanban className="size-4" />, href: `${base}/projects/received` },
      { label: "检查计划管理", icon: <ClipboardList className="size-4" />, href: `${base}/plans` },
      { label: "检查任务列表", icon: <FileCheck className="size-4" />, href: `${base}/tasks` },
      { label: "隐患管理", icon: <AlertTriangle className="size-4" />, href: `${base}/hazards` },
      {
        label: "报告管理", icon: <FileText className="size-4" />,
        children: [
          { label: "报告列表", href: `${base}/reports` },
        ],
      },
      { label: "通知中心", icon: <Bell className="size-4" />, href: `${base}/notifications` },
    ];
  }

  // enterprise
  return [
    { label: "工作台", icon: <LayoutDashboard className="size-4" />, href: `${base}/workspace` },
    { label: "隐患管理", icon: <AlertTriangle className="size-4" />, href: `${base}/hazards` },
    { label: "报告列表", icon: <FileText className="size-4" />, href: `${base}/reports` },
    { label: "通知中心", icon: <Bell className="size-4" />, href: `${base}/notifications` },
  ];
}

function NavGroup({ item, pathname }: { item: NavItem; pathname: string }) {
  const isChildActive = item.children?.some((c) => pathname === c.href);
  const [open, setOpen] = useState(isChildActive || false);

  if (!item.children) {
    const isActive = pathname === item.href;
    return (
      <Link
        href={item.href || "#"}
        className={cn(
          "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
        )}
      >
        {item.icon}
        <span>{item.label}</span>
      </Link>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
          isChildActive
            ? "text-sidebar-accent-foreground font-medium"
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
        )}
      >
        <span className="flex items-center gap-2.5">
          {item.icon}
          <span>{item.label}</span>
        </span>
        {open ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
      </button>
      {open && (
        <div className="ml-4 mt-0.5 space-y-0.5 border-l border-sidebar-border pl-3">
          {item.children.map((child) => {
            const isActive = pathname === child.href;
            return (
              <Link
                key={child.href}
                href={child.href}
                className={cn(
                  "block rounded-md px-2.5 py-1.5 text-sm transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                {child.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AppSidebar() {
  const pathname = usePathname();
  const { currentTeam, currentUserType, currentOrganization, currentWorkspace } = useAppStore();

  if (!currentTeam) return null;

  const navItems = getNavItems(currentTeam.id, currentUserType);
  const orgId = currentOrganization?.id || currentTeam?.id;

  // 获取当前工作组的统计数据
  const workspaceStats = currentWorkspace ? {
    enterpriseCount: currentWorkspace.enterpriseCount || 0,
    serviceCount: currentWorkspace.serviceCount || 0,
  } : { enterpriseCount: 0, serviceCount: 0 };
  // 监管方数量固定为1
  const supervisorCount = 1;

  return (
    <aside className="flex h-screen w-48 flex-shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      {/* 平台标识区 */}
      <div className="flex flex-col px-3 py-3 gap-2">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-md bg-sidebar-primary">
            <Shield className="size-4 text-sidebar-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-semibold text-sidebar-foreground">
              {currentWorkspace?.name || currentTeam?.name || "工作组"}
            </p>
            <p className="truncate text-[10px] text-sidebar-foreground/50">多方安全协管平台</p>
          </div>
        </div>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {navItems.map((item) => (
          <NavGroup key={item.label} item={item} pathname={pathname} />
        ))}
      </nav>

      {/* 底部信息 */}
      <div className="border-t border-sidebar-border px-3 py-2">
        {/* 工作组统计入口 - 整体可点击 */}
        <Link
          href="/workspace/settings"
          className="flex items-center gap-1.5 py-2 text-[11px] hover:bg-muted/50 rounded-md px-2 -mx-2 transition-colors"
        >
          <span className="text-muted-foreground">企业</span>
          <span className="font-semibold text-role-enterprise">{workspaceStats.enterpriseCount}</span>
          <span className="text-border">|</span>
          <span className="text-muted-foreground">机构</span>
          <span className="font-semibold text-role-inspector">{workspaceStats.serviceCount}</span>
          <span className="text-border">|</span>
          <span className="text-muted-foreground">监管</span>
          <span className="font-semibold text-role-supervisor">{supervisorCount}</span>
        </Link>

        {/* 我的组织入口 */}
        {orgId && (
          <Link href={`/organization/${orgId}`} className="block mt-1">
            <div className="flex items-center gap-2 py-2 text-sm hover:bg-muted/50 rounded-md px-2 -mx-2 transition-colors">
              <Building2 className="size-4 text-muted-foreground" />
              <span className="truncate">
                {currentOrganization?.name || currentTeam?.name || "我的组织"}
              </span>
              <ChevronRight className="size-3.5 ml-auto text-muted-foreground" />
            </div>
          </Link>
        )}

        {/* 平台版本信息 */}
        <div className="pt-2">
          <p className="text-[10px] text-muted-foreground/50">
            工贸三方监管平台 v1.1.8
          </p>
        </div>
      </div>
    </aside>
  );
}
