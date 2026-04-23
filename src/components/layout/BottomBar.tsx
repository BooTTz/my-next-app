"use client";

import React from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Settings, Users, Building2, Home, Briefcase } from "lucide-react";

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

interface WorkspaceStatBadgeProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  href: string;
}

function WorkspaceStatBadge({ icon, label, value, href }: WorkspaceStatBadgeProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Link href={href}>
            <span className="inline-flex items-center gap-1.5 rounded-md border bg-background px-2.5 py-1 text-xs transition-colors hover:bg-muted cursor-pointer">
              {icon}
              <span className="font-semibold text-primary">{value}</span>
              <span className="text-muted-foreground">{label}</span>
            </span>
          </Link>
        }
      />
      <TooltipContent side="top">
        <p>查看{label}详情</p>
      </TooltipContent>
    </Tooltip>
  );
}

export default function BottomBar() {
  const { currentUserType, currentOrganization, currentUser, currentTeam, currentWorkspace } = useAppStore();

  const teamId = currentTeam?.id;
  const orgId = currentOrganization?.id || currentTeam?.id;
  const platformRole = currentUser?.platformRole;

  const isOrgAdminOrSuper =
    platformRole === "org_admin" || platformRole === "super_admin";

  // 获取当前工作组的统计数据
  const workspaceStats = currentWorkspace ? {
    enterpriseCount: currentWorkspace.enterpriseCount || 0,
    serviceCount: currentWorkspace.serviceCount || 0,
  } : { enterpriseCount: 0, serviceCount: 0 };
  // 监管方数量：根据团队类型判断
  const supervisorCount = currentTeam?.teamType === "supervisor" ? 1 : 0;

  return (
    <footer className="flex h-12 items-center justify-between border-t bg-card px-4 shrink-0">
      {/* 左侧：工作组管理入口 + 工作组统计数据 */}
      <div className="flex items-center gap-3">
        {/* 工作组管理图标按钮 */}
        <Tooltip>
          <TooltipTrigger
            render={
              <Link href="/workspace/settings">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings className="size-4" />
                </Button>
              </Link>
            }
          />
          <TooltipContent side="top">
            <p>工作组管理</p>
          </TooltipContent>
        </Tooltip>

        {/* 工作组包含的组织类型统计 */}
        <div className="flex items-center gap-2 border-l border-l-border pl-3">
          <WorkspaceStatBadge
            icon={<Building2 className="size-3.5" />}
            label="企业"
            value={workspaceStats.enterpriseCount}
            href={teamId ? `/team/${teamId}/members` : "#"}
          />
          <WorkspaceStatBadge
            icon={<Briefcase className="size-3.5" />}
            label="机构"
            value={workspaceStats.serviceCount}
            href={teamId ? `/team/${teamId}/members` : "#"}
          />
          <WorkspaceStatBadge
            icon={<Users className="size-3.5" />}
            label="监管"
            value={supervisorCount}
            href={teamId ? `/team/${teamId}/members` : "#"}
          />
        </div>
      </div>

      {/* 右侧：快捷按钮 */}
      <div className="flex items-center gap-1">

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
