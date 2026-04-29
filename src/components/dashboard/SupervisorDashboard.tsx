"use client";

import StatCard from "@/components/shared/StatCard";
import EmptyState from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_PLANS, MOCK_TASKS, MOCK_HAZARDS, MOCK_NOTIFICATIONS, MOCK_PROJECTS } from "@/lib/mock-data";
import { TASK_STATUS_MAP, HAZARD_LEVEL_MAP, HAZARD_STATUS_MAP } from "@/lib/types";
import { TaskStatusBadge, HazardLevelBadge } from "@/components/shared/StatusBadge";
import { useAppStore } from "@/lib/store";
import {
  ClipboardList, FileCheck, AlertTriangle, CheckCircle2,
  Shield, TrendingUp, Building2, Bell, FolderKanban, Plus, Play,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from "recharts";

const CHART_COLORS = ["var(--color-role-supervisor)", "var(--color-role-inspector)", "var(--color-role-enterprise)", "var(--status-warning)", "var(--status-danger)"];

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

export default function SupervisorDashboard() {
  const { currentUser, currentWorkspace } = useAppStore();
  const greeting = getGreeting();
  
  const totalPlans = MOCK_PLANS.length;
  const inProgressTasks = MOCK_TASKS.filter((t) => !["completed", "cancelled"].includes(t.status)).length;
  const completedTasks = MOCK_TASKS.filter((t) => t.status === "completed").length;
  // 项目统计
  const totalProjects = MOCK_PROJECTS.length;
  const inProgressProjects = MOCK_PROJECTS.filter((p) => p.status === "in_progress").length;
  const completedProjects = MOCK_PROJECTS.filter((p) => p.status === "completed").length;
  const currentMonth = new Date().toISOString().substring(0, 7);
  const newProjectsThisMonth = MOCK_PROJECTS.filter((p) => p.createdAt.startsWith(currentMonth)).length;

  const totalHazards = MOCK_HAZARDS.length;
  const majorHazards = MOCK_HAZARDS.filter((h) => h.level === "major").length;
  const generalHazards = MOCK_HAZARDS.filter((h) => h.level === "general").length;
  const closedHazards = MOCK_HAZARDS.filter((h) => h.status === "accepted").length;
  const rectRate = totalHazards > 0 ? Math.round((closedHazards / totalHazards) * 100) : 0;

  // 任务进度数据
  const taskProgressData = MOCK_PLANS.filter((p) => p.taskCount && p.taskCount > 0).map((p) => ({
    name: p.name.length > 12 ? p.name.substring(0, 12) + "..." : p.name,
    已完成: p.completedTaskCount || 0,
    进行中: (p.taskCount || 0) - (p.completedTaskCount || 0),
  }));

  // 隐患趋势数据
  const trendData = [
    { month: "10月", 发现: 8, 整改: 6 },
    { month: "11月", 发现: 12, 整改: 9 },
    { month: "12月", 发现: 15, 整改: 11 },
    { month: "1月", 发现: 10, 整改: 8 },
    { month: "2月", 发现: 14, 整改: 12 },
    { month: "3月", 发现: 18, 整改: 13 },
  ];

  // 隐患分类数据
  const categoryData = [
    { name: "基础管理类", value: MOCK_HAZARDS.filter((h) => h.category === "management").length },
    { name: "现场管理类", value: MOCK_HAZARDS.filter((h) => h.category === "onsite").length },
  ];

  // 企业隐患排名
  const enterpriseRank = [
    { name: "天成机械加工厂", count: 6 },
    { name: "鑫盛金属制品", count: 2 },
    { name: "宏达纺织", count: 1 },
  ];

  const unreadNotifs = MOCK_NOTIFICATIONS.filter((n) => !n.isRead && n.userId === "u1");

  return (
    <div className="space-y-6">
      <PageHeader 
        title={`${currentUser?.realName}，${greeting}`}
        subtitle={`${currentWorkspace?.name || "工作组"}工作台`}
      />

      {/* 数据卡片 - 项目概况 */}
      <div className="grid-stats">
        <StatCard title="项目总数" value={totalProjects} icon={<FolderKanban className="size-5" />} variant="primary" />
        <StatCard title="进行中项目" value={inProgressProjects} icon={<Play className="size-5" />} variant="warning" />
        <StatCard title="本月新增" value={newProjectsThisMonth} icon={<Plus className="size-5" />} variant="primary" />
        <StatCard title="已完成项目" value={completedProjects} icon={<CheckCircle2 className="size-5" />} variant="success" />
      </div>

      {/* 数据卡片 - 检查任务 */}
      <div className="grid-stats">
        <StatCard title="检查计划总数" value={totalPlans} icon={<ClipboardList className="size-5" />} variant="primary" />
        <StatCard title="进行中任务" value={inProgressTasks} icon={<FileCheck className="size-5" />} variant="warning" trend={{ value: 12, label: "较上月" }} />
        <StatCard title="已完成任务" value={completedTasks} icon={<CheckCircle2 className="size-5" />} variant="success" />
      </div>

      {/* 隐患概览卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
        <StatCard title="隐患总数" value={totalHazards} icon={<AlertTriangle className="size-5" />} />
        <StatCard title="一般隐患" value={generalHazards} icon={<Shield className="size-5" />} variant="warning" />
        <StatCard title="重大隐患" value={majorHazards} icon={<AlertTriangle className="size-5" />} variant="danger" />
        <StatCard title="已整改数" value={closedHazards} icon={<CheckCircle2 className="size-5" />} variant="success" />
        <StatCard title="整改率" value={`${rectRate}%`} icon={<TrendingUp className="size-5" />} variant="primary" />
      </div>

      {/* 图表行 */}
      <div className="grid grid-cols-2 gap-4">
        {/* 任务进度 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">各计划任务进度</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={taskProgressData} layout="vertical" margin={{ left: 0, right: 16, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" fontSize={12} />
                  <YAxis type="category" dataKey="name" fontSize={11} width={100} />
                  <Tooltip />
                  <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="已完成" stackId="a" fill="var(--status-success)" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="进行中" stackId="a" fill="var(--color-role-supervisor)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 隐患趋势 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">隐患发现与整改趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ left: 0, right: 16, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="发现" stroke="var(--status-danger)" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="整改" stroke="var(--status-success)" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 隐患分类 + 企业排名 + 待办 */}
      <div className="grid grid-cols-3 gap-4">
        {/* 隐患分类 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">隐患类型分布</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`} fontSize={11}>
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 企业隐患排名 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">企业隐患排名</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={enterpriseRank} layout="vertical" margin={{ left: 0, right: 16, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" fontSize={12} />
                  <YAxis type="category" dataKey="name" fontSize={11} width={100} />
                  <Tooltip />
                  <Bar dataKey="count" fill="var(--color-role-supervisor)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 待办事项 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              待办事项
              {unreadNotifs.length > 0 && (
                <Badge variant="destructive" className="ml-2 text-[10px] px-1.5 py-0">
                  {unreadNotifs.length}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5 max-h-[200px] overflow-y-auto">
              {unreadNotifs.length > 0 ? (
                unreadNotifs.map((n) => (
                  <div key={n.id} className="flex items-start gap-2 rounded-md border p-2.5">
                    <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-status-warning" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{n.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{n.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState
                  variant="notification"
                  title="暂无待办"
                  description="当前没有需要处理的事项"
                  className="py-6"
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
