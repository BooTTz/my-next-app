"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { MOCK_NOTIFICATIONS, MOCK_TEAMS, DEMO_ACCOUNTS, MOCK_USERS } from "@/lib/mock-data";
import {
  ArrowRight, Plus, Users, Building2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

export default function WorkspacePage() {
  const router = useRouter();
  const { currentUser, workspaces, currentWorkspace, switchWorkspace, switchTeam, login, userStats } = useAppStore();

  if (!currentUser) {
    router.push("/login");
    return null;
  }

  const userWorkspaces = workspaces;
  const pendingItems = userStats.pendingCount;

  // 获取用户对应的演示账号类型
  const demoAccount = DEMO_ACCOUNTS.find(a => a.userId === currentUser.id);

  const handleEnterWorkspace = (workspace: typeof userWorkspaces[0]) => {
    switchWorkspace(workspace);
    // 根据用户类型自动选择对应的组织
    const targetTeam = MOCK_TEAMS.find(t => t.teamType === (demoAccount?.userType || "supervisor"));
    if (targetTeam) {
      switchTeam(targetTeam);
      router.push(`/team/${targetTeam.id}/dashboard`);
    }
  };

  return (
    <div className="space-y-6">
      {/* 欢迎和统计 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">
            你好，{currentUser.realName}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            欢迎回到工贸三方监管平台
          </p>
        </div>
        <Card className="px-4 py-2">
          <div className="flex items-center gap-6 text-sm">
            <div className="text-center">
              <p className="text-xl font-bold">{userWorkspaces.length}</p>
              <p className="text-xs text-muted-foreground">我的工作组</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-amber-500">{pendingItems}</p>
              <p className="text-xs text-muted-foreground">待处理</p>
            </div>
          </div>
        </Card>
      </div>

      {/* 我的工作组 */}
      <div className="page-container-narrow">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold">我的工作组</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.info("加入工作组功能")}>
              加入工作组
            </Button>
            <Button size="sm" onClick={() => toast.info("创建工作组功能")}>
              <Plus className="size-3.5" /> 创建工作组
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userWorkspaces.map((workspace) => (
            <Card
              key={workspace.id}
              className="card-hover"
              onClick={() => handleEnterWorkspace(workspace)}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate">{workspace.name}</h3>
                      {currentWorkspace?.id === workspace.id && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-primary/10 text-primary">
                          当前
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">{workspace.region}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Building2 className="size-3" /> {workspace.enterpriseCount || 0} 家企业
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="size-3" /> {workspace.serviceCount || 0} 家机构
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="size-5 shrink-0 text-muted-foreground mt-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 演示账号快速切换 */}
      <div className="page-container-narrow">
        <h2 className="text-base font-semibold mb-3">快速切换角色（演示）</h2>
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-3">
              {DEMO_ACCOUNTS.map((account) => (
                <Button
                  key={account.username}
                  variant={demoAccount?.userType === account.userType ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    const targetUser = MOCK_USERS.find((u) => u.id === account.userId);
                    const targetTeam = MOCK_TEAMS.find((t) => t.teamType === account.userType);
                    if (targetUser && targetTeam) {
                      login(targetUser);
                      switchTeam(targetTeam);
                      toast.success(`已切换至 ${account.realName}`);
                    }
                  }}
                  className="justify-start"
                >
                  <span className={`mr-2 ${
                    account.userType === "supervisor" ? "text-blue-500" :
                    account.userType === "inspector" ? "text-green-500" : "text-amber-500"
                  }`}>●</span>
                  {account.realName}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 跨工作组待办 */}
      <div className="page-container-narrow">
        <h2 className="text-base font-semibold mb-3">跨工作组待办汇总</h2>
        <Card>
          <CardContent className="p-4">
            {pendingItems > 0 ? (
              <div className="space-y-2">
                {MOCK_NOTIFICATIONS.filter((n) => !n.isRead).slice(0, 5).map((n) => (
                  <div key={n.id} className="flex items-start gap-3 rounded-md border p-3">
                    <AlertTriangle className="size-4 shrink-0 text-amber-500 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{n.content}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{n.createdAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">暂无待处理事项</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
