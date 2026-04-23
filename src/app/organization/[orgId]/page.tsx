"use client";

import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Settings,
  Users,
  Building2,
  ClipboardList,
  AlertTriangle,
  Search,
  CheckCircle,
  ListChecks,
  AlertCircle,
  Shield,
  Plus,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAppStore } from "@/lib/store";
import { useHydrated } from "@/hooks/useHydrated";
import {
  MOCK_ORGANIZATIONS,
  MOCK_ORGANIZATION_STATS,
  MOCK_WORKSPACES,
  MOCK_TEAM_WORKSPACES,
} from "@/lib/mock-data";
import type { UserType, Organization, OrganizationStats, Workspace } from "@/lib/types";
import { USER_TYPE_MAP } from "@/lib/types";
import { useState } from "react";

/* =========================================
 * 类型与配置
 * ========================================= */

interface StatItemConfig {
  title: string;
  icon: React.ReactNode;
  value: number;
  color: "blue" | "green" | "amber" | "red";
}

const COLOR_STYLES: Record<StatItemConfig["color"], { bg: string; text: string }> = {
  blue: { bg: "bg-blue-500/10", text: "text-blue-600" },
  green: { bg: "bg-green-500/10", text: "text-green-600" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-600" },
  red: { bg: "bg-red-500/10", text: "text-red-600" },
};

const TYPE_STYLES: Record<UserType, string> = {
  supervisor: "bg-blue-500/10 text-blue-600",
  inspector: "bg-green-500/10 text-green-600",
  enterprise: "bg-amber-500/10 text-amber-600",
};

/* =========================================
 * 辅助函数
 * ========================================= */

function getOrgStats(orgId: string): OrganizationStats | undefined {
  return MOCK_ORGANIZATION_STATS.find((s) => s.orgId === orgId);
}

function getOrgWorkspaces(orgId: string): Workspace[] {
  const workspaceIds = MOCK_TEAM_WORKSPACES
    .filter((tw) => tw.teamId === orgId)
    .map((tw) => tw.workspaceId);
  const uniqueIds = [...new Set(workspaceIds)];
  return MOCK_WORKSPACES.filter((ws) => uniqueIds.includes(ws.id));
}

function getOrgWorkspaceJoinDate(orgId: string, workspaceId: string): string | undefined {
  const tw = MOCK_TEAM_WORKSPACES.find(
    (item) => item.teamId === orgId && item.workspaceId === workspaceId
  );
  return tw?.joinedAt;
}

function buildSupervisorStats(stats: OrganizationStats): StatItemConfig[] {
  return [
    { title: "服务机构数量", icon: <Users className="size-5" />, value: stats.inspectorCount, color: "blue" },
    { title: "企业单位数量", icon: <Building2 className="size-5" />, value: stats.enterpriseCount, color: "amber" },
    { title: "进行中计划数", icon: <ClipboardList className="size-5" />, value: stats.inProgressPlanCount, color: "green" },
    { title: "隐患整改中企业数", icon: <AlertTriangle className="size-5" />, value: stats.rectifyingEnterpriseCount, color: "red" },
    { title: "检查中服务机构数", icon: <Search className="size-5" />, value: stats.inspectingInspectorCount, color: "blue" },
    { title: "运行良好企业数", icon: <CheckCircle className="size-5" />, value: stats.healthyEnterpriseCount, color: "green" },
  ];
}

function buildInspectorStats(stats: OrganizationStats): StatItemConfig[] {
  return [
    { title: "监管部门数量", icon: <Shield className="size-5" />, value: stats.supervisorCount, color: "blue" },
    { title: "企业单位数量", icon: <Building2 className="size-5" />, value: stats.enterpriseCount, color: "amber" },
    { title: "进行中计划数", icon: <ClipboardList className="size-5" />, value: stats.inProgressPlanCount, color: "green" },
    { title: "进行中任务数", icon: <ListChecks className="size-5" />, value: stats.inProgressTaskCount, color: "blue" },
    { title: "待整改企业数", icon: <AlertTriangle className="size-5" />, value: stats.pendingRectificationEnterpriseCount, color: "red" },
    { title: "待整改隐患数", icon: <AlertCircle className="size-5" />, value: stats.pendingRectificationHazardCount, color: "red" },
  ];
}

function buildEnterpriseStats(stats: OrganizationStats): StatItemConfig[] {
  return [
    { title: "监管部门数量", icon: <Shield className="size-5" />, value: stats.supervisorCount, color: "blue" },
    { title: "服务机构数量", icon: <Users className="size-5" />, value: stats.inspectorCount, color: "green" },
    { title: "检查任务数", icon: <ListChecks className="size-5" />, value: stats.involvedTaskCount, color: "blue" },
    { title: "待整改隐患数", icon: <AlertTriangle className="size-5" />, value: stats.pendingHazardCount, color: "red" },
  ];
}

function buildStatsByType(type: UserType, stats: OrganizationStats): StatItemConfig[] {
  switch (type) {
    case "supervisor":
      return buildSupervisorStats(stats);
    case "inspector":
      return buildInspectorStats(stats);
    case "enterprise":
      return buildEnterpriseStats(stats);
    default:
      return [];
  }
}

/* =========================================
 * 子组件
 * ========================================= */

function StatItem({ config }: { config: StatItemConfig }) {
  const styles = COLOR_STYLES[config.color];
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="flex items-center gap-4 p-4">
        <div className={`rounded-lg ${styles.bg} p-3 ${styles.text}`}>
          {config.icon}
        </div>
        <div>
          <p className="text-2xl font-bold">{config.value}</p>
          <p className="text-sm text-muted-foreground">{config.title}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function WorkspaceCard({
  workspace,
  orgType,
  joinedAt,
  onClick,
}: {
  workspace: Workspace;
  orgType: UserType;
  joinedAt?: string;
  onClick: () => void;
}) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardContent className="p-4 space-y-3">
        <p className="font-semibold">{workspace.name}</p>
        <p className="text-sm text-muted-foreground">{workspace.region}</p>
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className={TYPE_STYLES[orgType]}>
            {USER_TYPE_MAP[orgType]}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="size-3" />
            <span>加入时间：{joinedAt ?? "—"}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* =========================================
 * 主页面
 * ========================================= */

export default function OrganizationPage() {
  const router = useRouter();
  const params = useParams();
  const { currentUser } = useAppStore();
  const hydrated = useHydrated();

  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const orgId = params.orgId as string;

  const org: Organization | undefined = MOCK_ORGANIZATIONS.find((o) => o.id === orgId);
  const stats = getOrgStats(orgId);
  const workspaces = getOrgWorkspaces(orgId);

  const canManage =
    currentUser?.platformRole === "org_admin" ||
    currentUser?.platformRole === "super_admin";

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/workspace");
    }
  };

  const handleManage = () => {
    router.push(`/organization/${orgId}/settings`);
  };

  const handleWorkspaceClick = (_workspaceId: string) => {
    // 使用当前组织的 ID 作为 teamId 进入工作台
    router.push(`/team/${orgId}/dashboard`);
  };

  const handleCreateWorkspace = () => {
    if (!newWorkspaceName.trim()) {
      toast.error("请输入工作组名称");
      return;
    }
    toast.success(`工作组 "${newWorkspaceName}" 创建成功`);
    setNewWorkspaceName("");
    setDialogOpen(false);
  };

  if (!hydrated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!org) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-lg text-muted-foreground">未找到该组织信息</p>
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="size-4 mr-2" />
          返回
        </Button>
      </div>
    );
  }

  const statItems = stats ? buildStatsByType(org.teamType, stats) : [];

  return (
    <div className="space-y-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handleBack} className="gap-1">
            <ArrowLeft className="size-4" />
            返回
          </Button>
          <h1 className="text-xl font-bold">组织主页</h1>
        </div>
        {canManage && (
          <Button size="sm" variant="outline" onClick={handleManage}>
            <Settings className="size-4 mr-2" />
            管理入口
          </Button>
        )}
      </div>

      {/* 组织信息卡片 */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* 左侧：Logo */}
            <Avatar className="size-20">
              <AvatarFallback
                className={`text-2xl font-bold ${org.teamType ? TYPE_STYLES[org.teamType] : "bg-muted text-muted-foreground"}`}
              >
                {org.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            {/* 中间信息 */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-xl font-bold">{org.name}</h2>
                <Badge variant="secondary" className={TYPE_STYLES[org.teamType]}>
                  {USER_TYPE_MAP[org.teamType]}
                </Badge>
              </div>
              {org.shortName && (
                <p className="text-sm text-muted-foreground">
                  简称：{org.shortName}
                </p>
              )}
            </div>

            {/* 右侧信息 */}
            <div className="space-y-2 text-sm min-w-[200px]">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">主要联系人</span>
                <span>{org.contactPerson ?? "—"}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">联系电话</span>
                <span>{org.contactPhone ?? "—"}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">组织状态</span>
                <Badge variant={org.status === "active" ? "default" : "secondary"}>
                  {org.status === "active" ? "活跃" : "停用"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 统计指标区 */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold">数据概览</h2>
        {statItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {statItems.map((item, idx) => (
              <StatItem key={idx} config={item} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">暂无统计数据</p>
        )}
      </div>

      {/* 工作组标签页 */}
      <Tabs defaultValue="workspaces" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="workspaces">已加入工作组</TabsTrigger>
          </TabsList>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger>
              <Button size="sm">
                <Plus className="size-4 mr-2" />
                新增工作组
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>创建或加入工作组</DialogTitle>
                <DialogDescription>
                  输入工作组名称以创建新工作组
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="workspace-name">工作组名称</Label>
                  <Input
                    id="workspace-name"
                    placeholder="请输入工作组名称"
                    value={newWorkspaceName}
                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleCreateWorkspace}>确认</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <TabsContent value="workspaces" className="mt-4">
          {workspaces.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workspaces.map((ws) => (
                <WorkspaceCard
                  key={ws.id}
                  workspace={ws}
                  orgType={org.teamType}
                  joinedAt={getOrgWorkspaceJoinDate(orgId, ws.id)}
                  onClick={() => handleWorkspaceClick(ws.id)}
                />
              ))}
            </div>
          ) : (
            <Card className="py-12">
              <CardContent className="flex flex-col items-center justify-center gap-4 text-center">
                <Users className="size-10 text-muted-foreground/50" />
                <div className="space-y-1">
                  <p className="text-muted-foreground">尚未加入工作组</p>
                  <p className="text-xs text-muted-foreground">
                    点击右上角{`"新增工作组"`}按钮创建或加入工作组
                  </p>
                </div>
                <Button size="sm" onClick={() => setDialogOpen(true)}>
                  <Plus className="size-4 mr-2" />
                  新增工作组
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
