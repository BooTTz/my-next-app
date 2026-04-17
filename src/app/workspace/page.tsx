"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/lib/store";
import { MOCK_TEAMS, MOCK_NOTIFICATIONS } from "@/lib/mock-data";
import { USER_TYPE_MAP } from "@/lib/types";
import {
  ArrowRight, Plus, Users, Building2, Clock,
  AlertTriangle, FileCheck, Shield,
} from "lucide-react";
import { toast } from "sonner";
import { useHydrated } from "@/hooks/useHydrated";

export default function WorkspacePage() {
  const router = useRouter();
  const { currentUser, switchTeam } = useAppStore();
  const hydrated = useHydrated();

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!currentUser) {
    router.push("/login");
    return null;
  }

  const userTeams = MOCK_TEAMS;
  const pendingItems = MOCK_NOTIFICATIONS.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部 */}
      <header className="border-b bg-card">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-6 h-14">
          <div className="flex items-center gap-2.5">
            <Shield className="size-5 text-primary" />
            <span className="font-semibold">工贸三方监管平台</span>
          </div>
          <div className="flex items-center gap-2">
            <Avatar className="size-7">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {currentUser.realName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">{currentUser.realName}</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-8 space-y-6">
        {/* 欢迎 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              你好，{currentUser.realName}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              欢迎回到工贸三方监管平台，以下是你的工作概览
            </p>
          </div>
          <Card className="px-4 py-3">
            <div className="flex items-center gap-6 text-sm">
              <div className="text-center">
                <p className="text-xl font-bold">{userTeams.length}</p>
                <p className="text-xs text-muted-foreground">我的团队</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-status-warning">{pendingItems}</p>
                <p className="text-xs text-muted-foreground">待处理</p>
              </div>
            </div>
          </Card>
        </div>

        {/* 我的团队 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold">我的团队</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => toast.info("加入团队功能")}>
                加入团队
              </Button>
              <Button size="sm" onClick={() => toast.info("创建团队功能")}>
                <Plus className="size-3.5" /> 创建团队
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {userTeams.map((team) => (
              <Card
                key={team.id}
                className="cursor-pointer hover:shadow-md transition-all hover:border-primary/30"
                onClick={() => {
                  switchTeam(team, "supervisor");
                  router.push(`/team/${team.id}/dashboard`);
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{team.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{team.description}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Building2 className="size-3" /> {team.region}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Users className="size-3" /> {team.memberCount} 人
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="size-4 shrink-0 text-muted-foreground mt-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 跨团队待办 */}
        <div>
          <h2 className="text-base font-semibold mb-3">跨团队待办汇总</h2>
          <Card>
            <CardContent className="p-4">
              {pendingItems > 0 ? (
                <div className="space-y-2">
                  {MOCK_NOTIFICATIONS.filter((n) => !n.isRead).slice(0, 5).map((n) => (
                    <div key={n.id} className="flex items-start gap-3 rounded-md border p-3">
                      <AlertTriangle className="size-4 shrink-0 text-status-warning mt-0.5" />
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
    </div>
  );
}
