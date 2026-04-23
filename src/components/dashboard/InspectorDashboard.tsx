"use client";

import StatCard from "@/components/shared/StatCard";
import EmptyState from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskStatusBadge } from "@/components/shared/StatusBadge";
import { MOCK_TASKS, MOCK_HAZARDS } from "@/lib/mock-data";
import {
  FileCheck, AlertTriangle, FileText, Eye,
  Calendar, ClipboardList, Clock,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import Link from "next/link";

export default function InspectorDashboard() {
  const myTasks = MOCK_TASKS.filter((t) => t.inspectorIds.includes("u2"));
  const pendingAccept = myTasks.filter((t) => t.status === "assigned").length;
  const inspecting = myTasks.filter((t) => ["accepted", "inspecting"].includes(t.status)).length;
  const reportPending = myTasks.filter((t) => ["report_drafting", "report_rejected"].includes(t.status)).length;
  const reviewPending = MOCK_HAZARDS.filter((h) => h.status === "submitted" && h.discoveredBy === "u2").length;

  const inspectorWorkload = [
    { name: "张敏", 任务数: 5 },
    { name: "王强", 任务数: 4 },
    { name: "孙浩", 任务数: 3 },
  ];

  const upcomingTasks = myTasks
    .filter((t) => ["assigned", "accepted"].includes(t.status))
    .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate));

  return (
    <div className="space-y-6">
      <PageHeader title="服务机构工作台" />

      {/* 统计卡片 */}
      <div className="grid-stats">
        <StatCard title="待接收任务" value={pendingAccept} icon={<FileCheck className="size-5" />} variant="warning" />
        <StatCard title="检查中任务" value={inspecting} icon={<Eye className="size-5" />} variant="primary" />
        <StatCard title="待提交报告" value={reportPending} icon={<FileText className="size-5" />} variant="danger" />
        <StatCard title="待复查隐患" value={reviewPending} icon={<AlertTriangle className="size-5" />} variant="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 任务日历视图简化版 */}
        <Card className="col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">我的任务</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">全部</TabsTrigger>
                <TabsTrigger value="pending">待处理</TabsTrigger>
                <TabsTrigger value="inspecting">检查中</TabsTrigger>
                <TabsTrigger value="completed">已完成</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-3">
                <div className="space-y-2">
                  {myTasks.map((task) => (
                    <Link
                      key={task.id}
                      href={`/team/t1/tasks/${task.id}`}
                      className="flex items-center justify-between rounded-md border p-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-muted-foreground">{task.taskNo}</span>
                          <TaskStatusBadge status={task.status} />
                        </div>
                        <p className="mt-1 text-sm font-medium truncate">{task.enterpriseName}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          计划检查：{task.scheduledDate} · 隐患：{task.hazardCount}条
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="pending" className="mt-3">
                <div className="space-y-2">
                  {myTasks.filter((t) => ["assigned", "accepted"].includes(t.status)).map((task) => (
                    <div key={task.id} className="flex items-center justify-between rounded-md border p-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-muted-foreground">{task.taskNo}</span>
                          <TaskStatusBadge status={task.status} />
                        </div>
                        <p className="mt-1 text-sm font-medium">{task.enterpriseName}</p>
                      </div>
                    </div>
                  ))}
                  {myTasks.filter((t) => ["assigned", "accepted"].includes(t.status)).length === 0 && (
                    <EmptyState variant="task" title="暂无待处理任务" description="当前没有待处理的任务" className="py-6" />
                  )}
                </div>
              </TabsContent>
              <TabsContent value="inspecting" className="mt-3">
                <div className="space-y-2">
                  {myTasks.filter((t) => t.status === "inspecting").map((task) => (
                    <div key={task.id} className="flex items-center justify-between rounded-md border p-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-muted-foreground">{task.taskNo}</span>
                          <TaskStatusBadge status={task.status} />
                        </div>
                        <p className="mt-1 text-sm font-medium">{task.enterpriseName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="completed" className="mt-3">
                <div className="space-y-2">
                  {myTasks.filter((t) => t.status === "completed").map((task) => (
                    <div key={task.id} className="flex items-center justify-between rounded-md border p-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-muted-foreground">{task.taskNo}</span>
                          <TaskStatusBadge status={task.status} />
                        </div>
                        <p className="mt-1 text-sm font-medium">{task.enterpriseName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* 右侧面板 */}
        <div className="space-y-4">
          {/* 工作量统计 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">检查人员工作量</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={inspectorWorkload} margin={{ left: 0, right: 8, top: 8, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="任务数" fill="var(--color-role-inspector)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 近期到期 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-1.5">
                <Clock className="size-3.5 text-status-warning" />
                近期到期任务
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {upcomingTasks.length > 0 ? upcomingTasks.map((task) => (
                  <div key={task.id} className="rounded-md border border-status-warning/20 bg-status-warning/5 p-2.5">
                    <p className="text-xs font-medium">{task.enterpriseName}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      <Calendar className="inline size-3 mr-1" />
                      {task.scheduledDate}
                    </p>
                  </div>
                )) : (
                  <EmptyState variant="task" title="暂无近期到期任务" description="当前没有即将到期的任务" className="py-4" />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
