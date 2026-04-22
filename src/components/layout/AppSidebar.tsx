"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import {
  LayoutDashboard, ClipboardList, FileCheck, AlertTriangle,
  FileText, BarChart3, Users, Building2, Settings, Bell,
  Wrench, ChevronDown, ChevronRight, Shield, MapPin,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
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
      { label: "工作台", icon: <LayoutDashboard className="size-4" />, href: `${base}/dashboard` },
      {
        label: "检查计划管理", icon: <ClipboardList className="size-4" />,
        children: [
          { label: "检查计划列表", href: `${base}/plans` },
          { label: "新建检查计划", href: `${base}/plans/new` },
        ],
      },
      { label: "检查任务管理", icon: <FileCheck className="size-4" />, href: `${base}/tasks` },
      { label: "隐患总览", icon: <AlertTriangle className="size-4" />, href: `${base}/hazards` },
      { label: "检查报告", icon: <FileText className="size-4" />, href: `${base}/reports` },
      { label: "数据统计", icon: <BarChart3 className="size-4" />, href: `${base}/statistics` },
      // 成员管理已整合到团队详情页（/team/[teamId]）
    ];
  }

  if (userType === "inspector") {
    return [
      { label: "工作台", icon: <LayoutDashboard className="size-4" />, href: `${base}/dashboard` },
      { label: "我的检查任务", icon: <FileCheck className="size-4" />, href: `${base}/tasks` },
      { label: "隐患管理", icon: <AlertTriangle className="size-4" />, href: `${base}/hazards` },
      {
        label: "检查报告", icon: <FileText className="size-4" />,
        children: [
          { label: "报告列表", href: `${base}/reports` },
        ],
      },
      { label: "通知中心", icon: <Bell className="size-4" />, href: `${base}/notifications` },
    ];
  }

  // enterprise
  return [
    { label: "工作台", icon: <LayoutDashboard className="size-4" />, href: `${base}/dashboard` },
    {
      label: "隐患整改", icon: <Wrench className="size-4" />,
      children: [
        { label: "待整改", href: `${base}/rectification` },
        { label: "整改记录", href: `${base}/hazards` },
      ],
    },
    { label: "检查报告", icon: <FileText className="size-4" />, href: `${base}/reports` },
    { label: "企业信息", icon: <Building2 className="size-4" />, href: `${base}/settings` },
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
  const { currentTeam, currentUserType, currentWorkspace, currentOrganization, workspaces, switchWorkspace } = useAppStore();

  if (!currentTeam) return null;

  const navItems = getNavItems(currentTeam.id, currentUserType);
  const orgId = currentOrganization?.id || currentTeam?.id;

  return (
    <aside className="flex h-screen w-56 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      {/* 工作组选择区 */}
      <div className="flex flex-col border-b border-sidebar-border px-3 py-3 gap-2">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-md bg-sidebar-primary">
            <Shield className="size-4 text-sidebar-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-semibold text-sidebar-foreground">安全监管平台</p>
            <p className="truncate text-[10px] text-sidebar-foreground/50">工贸三方协同</p>
          </div>
        </div>
        
        {/* 工作组选择器 */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 w-full rounded-md px-2 py-1.5 text-sm bg-sidebar-accent/50 hover:bg-sidebar-accent transition-colors outline-none">
            <MapPin className="size-3.5 text-sidebar-foreground/60" />
            <span className="flex-1 truncate text-left text-xs font-medium">{currentWorkspace?.name || "选择工作组"}</span>
            <ChevronDown className="size-3 text-sidebar-foreground/60" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <div className="px-2 py-1.5 text-xs font-medium text-sidebar-foreground/60">切换工作组</div>
            <DropdownMenuSeparator />
            {workspaces.map((ws) => (
              <DropdownMenuItem
                key={ws.id}
                onSelect={() => switchWorkspace(ws)}
                className={cn(
                  "flex flex-col items-start gap-0.5 cursor-pointer",
                  ws.id === currentWorkspace?.id && "bg-sidebar-accent"
                )}
              >
                <span className="font-medium text-sm">{ws.name}</span>
                <span className="text-[10px] text-sidebar-foreground/60">
                  {ws.region}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 工作组管理入口（仅监管方可见） */}
        {currentUserType === "supervisor" && (
          <Link href="/workspace/settings">
            <Button variant="ghost" size="sm" className="h-7 w-full justify-start text-xs">
              <Settings className="size-3 mr-1.5" />
              工作组管理
            </Button>
          </Link>
        )}
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {navItems.map((item) => (
          <NavGroup key={item.label} item={item} pathname={pathname} />
        ))}
      </nav>

      {/* 底部信息 */}
      <div className="border-t border-sidebar-border p-3 space-y-1">
        {/* 我的组织入口 */}
        {orgId && (
          <Link href={`/organization/${orgId}`}>
            <Button variant="ghost" size="sm" className="h-7 w-full justify-start text-xs">
              <Building2 className="size-3 mr-1.5" />
              我的组织
            </Button>
          </Link>
        )}
        <p className="text-[10px] text-sidebar-foreground/40 text-center">
          工贸三方监管平台 v1.1.1
        </p>
      </div>
    </aside>
  );
}
