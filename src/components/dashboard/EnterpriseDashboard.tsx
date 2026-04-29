"use client";

import StatCard from "@/components/shared/StatCard";
import EmptyState from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { HazardStatusBadge, HazardLevelBadge } from "@/components/shared/StatusBadge";
import { MOCK_TASKS, MOCK_HAZARDS } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";
import {
  FileCheck, AlertTriangle, CheckCircle2, TrendingUp,
  Shield, Clock, ArrowRight, ClipboardList,
} from "lucide-react";
import Link from "next/link";

// 获取时间问候语
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 6) return "凌晨好";
  if (hour < 9) return "早上好";
  if (hour < 12) return "上午好";
  if (hour < 14) return "中午好";
  if (hour < 18) return "下午好";
  if (hour < 22) return "晚上好";
  return "晚安";
}

export default function EnterpriseDashboard() {
  const { currentUser, currentWorkspace } = useAppStore();
  const greeting = getGreeting();
  
  // 企业e1的数据
  const myTasks = MOCK_TASKS.filter((t) => t.enterpriseId === "e1");
  const myHazards = MOCK_HAZARDS.filter((h) => h.enterpriseId === "e1" || h.enterpriseId === "e3");
  const totalChecks = myTasks.length;
  const pendingRect = myHazards.filter((h) => ["pending_rectification", "rectifying"].includes(h.status)).length;
  const closedCount = myHazards.filter((h) => h.status === "accepted").length;
  const rectRate = myHazards.length > 0 ? Math.round((closedCount / myHazards.length) * 100) : 0;

  const safetyGrade = "B";
  const gradeColors: Record<string, string> = {
    A: "text-status-success bg-status-success/10 border-status-success/20",
    B: "text-status-info bg-status-info/10 border-status-info/20",
    C: "text-status-warning bg-status-warning/10 border-status-warning/20",
    D: "text-status-danger bg-status-danger/10 border-status-danger/20",
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title={`${currentUser?.realName}，${greeting}`}
        subtitle={`${currentWorkspace?.name || "工作组"}工作台`}
      />

      {/* 统计卡片 */}
      <div className="grid-stats">
        <StatCard title="累计检查次数" value={totalChecks} icon={<FileCheck className="size-5" />} variant="primary" />
        <StatCard title="待整改隐患" value={pendingRect} icon={<AlertTriangle className="size-5" />} variant="danger" />
        <StatCard title="已整改数" value={closedCount} icon={<CheckCircle2 className="size-5" />} variant="success" />
        <StatCard title="整改完成率" value={`${rectRate}%`} icon={<TrendingUp className="size-5" />} variant="primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 安全等级 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">企业安全等级</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-6">
            <div className={`flex size-20 items-center justify-center rounded-full border-2 text-3xl font-bold ${gradeColors[safetyGrade]}`}>
              {safetyGrade}
            </div>
            <p className="mt-3 text-sm font-medium">安全等级：良好</p>
            <p className="mt-1 text-xs text-muted-foreground">上次评定：2025-02-12</p>
            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="size-2 rounded-full bg-status-success" />
                较上次提升
              </span>
            </div>
          </CardContent>
        </Card>

        {/* 隐患整改进度 */}
        <Card className="col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">隐患整改进度</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myHazards.filter((h) => h.status !== "accepted").length > 0 ? (
                myHazards.filter((h) => h.status !== "accepted").map((hazard) => {
                  const progressMap: Record<string, number> = {
                    pending_rectification: 10, rectifying: 50, pending_acceptance: 80,
                  };
                  return (
                    <div key={hazard.id} className="rounded-md border p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-muted-foreground">{hazard.hazardNo}</span>
                          <HazardLevelBadge level={hazard.level} />
                          <HazardStatusBadge status={hazard.status} />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          <Clock className="inline size-3 mr-1" />
                          截止：{hazard.deadline}
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm line-clamp-1">{hazard.description}</p>
                      <div className="mt-2 flex items-center gap-3">
                        <Progress value={progressMap[hazard.status] || 0} className="flex-1 h-1.5" />
                        <span className="text-xs text-muted-foreground">{progressMap[hazard.status] || 0}%</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <EmptyState variant="hazard" title="暂无待整改隐患" description="当前没有需要整改的隐患" className="py-6" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 历次检查时间线 + 待办 */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">历次检查记录</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative space-y-4 pl-6">
              <div className="absolute left-2 top-2 bottom-2 w-px bg-border" />
              {myTasks.map((task, index) => (
                <div key={task.id} className="relative">
                  <div className={`absolute -left-4 top-1.5 size-2.5 rounded-full border-2 border-card ${
                    task.status === "completed" ? "bg-status-success" : "bg-status-info"
                  }`} />
                  <div className="rounded-md border p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-muted-foreground">{task.taskNo}</span>
                      <span className="text-xs text-muted-foreground">{task.scheduledDate}</span>
                    </div>
                    <p className="mt-1 text-sm font-medium">{task.planName?.substring(0, 20)}...</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      隐患 {task.hazardCount} 条 · 已整改 {task.rectifiedCount} 条
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">待办事项</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {myHazards.filter((h) => ["pending_rectification", "rectifying"].includes(h.status)).map((h) => (
                <Link
                  key={h.id}
                  href={`/team/t1/hazards/${h.id}`}
                  className="flex items-center justify-between rounded-md border p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <HazardLevelBadge level={h.level} />
                      <span className="text-xs text-muted-foreground truncate">{h.hazardNo}</span>
                    </div>
                    <p className="mt-1 text-sm line-clamp-1">{h.description}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">截止：{h.deadline}</p>
                  </div>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                </Link>
              ))}
              {myHazards.filter((h) => ["pending_rectification", "rectifying"].includes(h.status)).length === 0 && (
                <EmptyState variant="notification" title="暂无待处理事项" description="当前没有需要处理的事项" className="py-6" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
