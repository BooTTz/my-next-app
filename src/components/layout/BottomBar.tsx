"use client";

import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Settings, Building2, Home } from "lucide-react";

interface StatBadgeProps {
  label: string;
  value: number;
  href: string;
}

function StatBadge({ label, value, href }: StatBadgeProps) {
  return (
    <Link href={href}>
      <span className="inline-flex items-center gap-1 rounded-md border bg-background px-2 py-0.5 text-xs transition-colors hover:bg-muted cursor-pointer">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold text-primary">{value}</span>
      </span>
    </Link>
  );
}

export default function BottomBar() {
  const { currentUserType, currentOrganization, currentUser, currentTeam } = useAppStore();

  const teamId = currentTeam?.id;
  const orgId = currentOrganization?.id || currentTeam?.id;
  const platformRole = currentUser?.platformRole;

  const isOrgAdminOrSuper =
    platformRole === "org_admin" || platformRole === "super_admin";

  // 根据用户类型渲染不同统计 badge（使用静态 mock 数值，后续接入真实数据）
  function renderStatBadges() {
    if (!teamId) return null;

    if (currentUserType === "supervisor") {
      return (
        <>
          <StatBadge label="履行方" value={12} href={`/team/${teamId}/members`} />
          <StatBadge label="服务方" value={4} href={`/team/${teamId}/members`} />
          <StatBadge label="进行中计划" value={3} href={`/team/${teamId}/plans`} />
        </>
      );
    }

    if (currentUserType === "inspector") {
      return (
        <>
          <StatBadge label="履行方" value={8} href={`/team/${teamId}/members`} />
          <StatBadge label="进行中任务" value={5} href={`/team/${teamId}/tasks`} />
          <StatBadge label="待整改隐患" value={11} href={`/team/${teamId}/hazards`} />
        </>
      );
    }

    // enterprise
    return (
      <>
        <StatBadge label="待整改隐患" value={6} href={`/team/${teamId}/rectification`} />
        <StatBadge label="最近检查任务" value={2} href={`/team/${teamId}/tasks`} />
      </>
    );
  }

  return (
    <footer className="flex h-12 items-center justify-between border-t bg-card px-4 shrink-0">
      {/* 左侧：统计指标 */}
      <div className="flex items-center gap-2">
        {renderStatBadges()}
      </div>

      {/* 右侧：快捷按钮 */}
      <div className="flex items-center gap-1">
        <Link href="/workspace/settings">
          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1.5">
            <Settings className="size-3.5" />
            工作组管理
          </Button>
        </Link>

        {orgId && (
          <Link href={`/organization/${orgId}`}>
            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1.5">
              <Home className="size-3.5" />
              组织主页
            </Button>
          </Link>
        )}

        {isOrgAdminOrSuper && orgId && (
          <Link href={`/organization/${orgId}/settings`}>
            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1.5">
              <Building2 className="size-3.5" />
              组织管理
            </Button>
          </Link>
        )}
      </div>
    </footer>
  );
}
