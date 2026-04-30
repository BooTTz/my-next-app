"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import {
  MOCK_INSPECTION_ITEMS, MOCK_TASKS, MOCK_HAZARDS,
  MOCK_ENTERPRISES, MOCK_TEAMS, MOCK_REPORTS,
} from "@/lib/mock-data";
import {
  ClipboardList, AlertTriangle, CheckCircle2, Building2,
  FileCheck, Shield, FileText, Users, TrendingUp,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line,
} from "recharts";

const COLORS = ["#1E3A5F", "#3B82F6", "#22C55E", "#F59E0B", "#EF4444", "#8B5CF6"];

function useFilteredData(teamId: string) {
  // 当前团队参与的检查事项
  const relatedItems = MOCK_INSPECTION_ITEMS.filter(
    (item) =>
      item.teamId === teamId ||
      item.supervisorTeamIds.includes(teamId) ||
      item.inspectorTeamIds.includes(teamId) ||
      item.enterpriseTeamIds.includes(teamId)
  );
  const relatedItemIds = relatedItems.map((i) => i.id);

  // 关联的任务
  const relatedTasks = MOCK_TASKS.filter((t) => relatedItemIds.includes(t.inspectionItemId));

  // 关联的隐患
  const relatedHazards = MOCK_HAZARDS.filter((h) =>
    relatedTasks.some((t) => t.id === h.taskId)
  );

  // 关联的报告
  const relatedReports = MOCK_REPORTS.filter((r) =>
    relatedTasks.some((t) => t.id === r.taskId)
  );

  return { relatedItems, relatedTasks, relatedHazards, relatedReports };
}

// 隐患类别分布数据
function getCategoryStats(hazards: typeof MOCK_HAZARDS) {
  const categoryMap: Record<string, number> = {};
  hazards.forEach((h) => {
    const key = h.subCategoryName || h.category;
    categoryMap[key] = (categoryMap[key] || 0) + 1;
  });
  return Object.entries(categoryMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

// 月度趋势
const MONTHLY_TREND = [
  { month: "2024-10", 检查: 3, 隐患: 8, 整改: 6 },
  { month: "2024-11", 检查: 4, 隐患: 12, 整改: 9 },
  { month: "2024-12", 检查: 5, 隐患: 15, 整改: 11 },
  { month: "2025-01", 检查: 4, 隐患: 16, 整改: 14 },
  { month: "2025-02", 检查: 3, 隐患: 11, 整改: 11 },
  { month: "2025-03", 检查: 5, 隐患: 17, 整改: 10 },
];

/** 监管部门统计分析 */
function SupervisorStats({ teamId }: { teamId: string }) {
  const { relatedItems, relatedTasks, relatedHazards, relatedReports } = useFilteredData(teamId);
  const totalHazards = relatedHazards.length;
  const closedHazards = relatedHazards.filter((h) => h.status === "accepted").length;
  const rectifyingHazards = relatedHazards.filter((h) => h.status === "rectifying" || h.status === "pending_rectification").length;
  const majorHazards = relatedHazards.filter((h) => h.level === "major").length;
  const completedTasks = relatedTasks.filter((t) => t.status === "completed").length;
  const categoryStats = getCategoryStats(relatedHazards);

  // 各企业隐患统计
  const enterpriseStats = MOCK_ENTERPRISES.map((e) => {
    const hazards = relatedHazards.filter((h) => h.enterpriseId === e.id);
    if (hazards.length === 0) return null;
    return {
      name: e.name.length > 8 ? e.name.substring(0, 8) + "..." : e.name,
      重大: hazards.filter((h) => h.level === "major").length,
      一般: hazards.filter((h) => h.level === "general").length,
    };
  }).filter(Boolean) as { name: string; 重大: number; 一般: number }[];

  // 机构执行情况
  const inspectorTeams = new Set(relatedItems.flatMap((i) => i.inspectorTeamIds));
  const institutionCount = inspectorTeams.size;

  return (
    <div className="space-y-6">
      {/* 概览卡片 */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="检查事项" value={relatedItems.length} icon={<ClipboardList className="size-5" />} variant="primary" />
        <StatCard title="检查任务" value={relatedTasks.length} icon={<FileCheck className="size-5" />} variant="primary" />
        <StatCard title="隐患总数" value={totalHazards} icon={<AlertTriangle className="size-5" />} variant="warning" />
        <StatCard title="已整改" value={closedHazards} icon={<CheckCircle2 className="size-5" />} variant="success" />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatCard title="涉及机构" value={institutionCount} icon={<Shield className="size-5" />} />
        <StatCard title="被检企业" value={enterpriseStats.length} icon={<Building2 className="size-5" />} />
        <StatCard title="重大隐患" value={majorHazards} icon={<AlertTriangle className="size-5" />} variant="danger" />
        <StatCard title="整改中" value={rectifyingHazards} icon={<TrendingUp className="size-5" />} variant="warning" />
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">月度检查与整改趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MONTHLY_TREND} margin={{ left: 0, right: 16, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={11} />
                  <YAxis fontSize={11} />
                  <Tooltip />
                  <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="检查" stroke="#1E3A5F" strokeWidth={2} />
                  <Line type="monotone" dataKey="隐患" stroke="#EF4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="整改" stroke="#22C55E" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">隐患类别分布</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryStats.length > 0 ? categoryStats : [{ name: "暂无数据", value: 1 }]} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name }) => name} fontSize={10}>
                    {categoryStats.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 各企业隐患对比 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">各企业隐患对比</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={enterpriseStats} margin={{ left: 0, right: 16, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="重大" fill="#EF4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="一般" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/** 服务机构统计分析 */
function InspectorStats({ teamId }: { teamId: string }) {
  const { relatedItems, relatedTasks, relatedHazards, relatedReports } = useFilteredData(teamId);
  const totalHazards = relatedHazards.length;
  const closedHazards = relatedHazards.filter((h) => h.status === "accepted").length;
  const rectifyingHazards = relatedHazards.filter((h) => h.status !== "accepted").length;
  const completedTasks = relatedTasks.filter((t) => t.status === "completed").length;
  const inspectingTasks = relatedTasks.filter((t) => t.status === "inspecting").length;
  const pendingTasks = relatedTasks.filter((t) => t.status === "assigned").length;
  const submittedReports = relatedReports.filter((r) => r.status === "submitted" || r.status === "approved").length;
  const categoryStats = getCategoryStats(relatedHazards);

  // 检查进度统计
  const taskProgress = [
    { name: "已完成", value: completedTasks, fill: "#22C55E" },
    { name: "检查中", value: inspectingTasks, fill: "#3B82F6" },
    { name: "待执行", value: pendingTasks, fill: "#F59E0B" },
  ].filter((t) => t.value > 0);

  // 关联企业隐患情况
  const enterpriseHazardStats = MOCK_ENTERPRISES.map((e) => {
    const hazards = relatedHazards.filter((h) => h.enterpriseId === e.id);
    if (hazards.length === 0) return null;
    return {
      name: e.name.length > 8 ? e.name.substring(0, 8) + "..." : e.name,
      隐患数: hazards.length,
      已整改: hazards.filter((h) => h.status === "accepted").length,
    };
  }).filter(Boolean) as { name: string; 隐患数: number; 已整改: number }[];

  return (
    <div className="space-y-6">
      {/* 概览卡片 */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="检查事项" value={relatedItems.length} icon={<ClipboardList className="size-5" />} variant="primary" />
        <StatCard title="检查任务" value={relatedTasks.length} icon={<FileCheck className="size-5" />} />
        <StatCard title="已完成任务" value={completedTasks} icon={<CheckCircle2 className="size-5" />} variant="success" />
        <StatCard title="已提交报告" value={submittedReports} icon={<FileText className="size-5" />} />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatCard title="关联隐患" value={totalHazards} icon={<AlertTriangle className="size-5" />} variant="warning" />
        <StatCard title="已整改闭环" value={closedHazards} icon={<CheckCircle2 className="size-5" />} variant="success" />
        <StatCard title="整改中" value={rectifyingHazards} icon={<TrendingUp className="size-5" />} variant="warning" />
        <StatCard title="关联企业" value={enterpriseHazardStats.length} icon={<Building2 className="size-5" />} />
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">检查进度</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] flex items-center justify-center">
              {taskProgress.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={taskProgress} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`} fontSize={11}>
                      {taskProgress.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground">暂无任务数据</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">隐患类别分布</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryStats.length > 0 ? categoryStats : [{ name: "暂无数据", value: 1 }]} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name }) => name} fontSize={10}>
                    {categoryStats.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 各企业隐患整改情况 */}
      {enterpriseHazardStats.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">关联企业隐患/整改情况</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={enterpriseHazardStats} margin={{ left: 0, right: 16, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={11} />
                  <YAxis fontSize={11} />
                  <Tooltip />
                  <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="隐患数" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="已整改" fill="#22C55E" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/** 企业单位统计分析 */
function EnterpriseStats({ teamId, teamName }: { teamId: string; teamName: string }) {
  const { relatedItems, relatedTasks, relatedHazards } = useFilteredData(teamId);

  const totalHazards = relatedHazards.length;
  const closedHazards = relatedHazards.filter((h) => h.status === "accepted").length;
  const rectifyingHazards = relatedHazards.filter((h) => h.status === "rectifying").length;
  const pendingHazards = relatedHazards.filter((h) => h.status === "pending_rectification").length;
  const majorHazards = relatedHazards.filter((h) => h.level === "major").length;
  const categoryStats = getCategoryStats(relatedHazards);

  // 找到当前企业对应的 Enterprise 数据
  const enterpriseInfo = MOCK_ENTERPRISES.find((e) => e.teamId === teamId);
  const employeeCount = enterpriseInfo?.employeeCount || 0;

  // 各检查事项隐患统计
  const itemStats = relatedItems.map((item) => {
    const itemTasks = relatedTasks.filter((t) => t.inspectionItemId === item.id);
    const itemHazards = relatedHazards.filter((h) => itemTasks.some((t) => t.id === h.taskId));
    return {
      name: item.name.length > 10 ? item.name.substring(0, 10) + "..." : item.name,
      隐患数: itemHazards.length,
      已整改: itemHazards.filter((h) => h.status === "accepted").length,
    };
  }).filter((s) => s.隐患数 > 0);

  return (
    <div className="space-y-6">
      {/* 主体信息 */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="检查次数" value={relatedTasks.length} icon={<FileCheck className="size-5" />} variant="primary" />
        <StatCard title="隐患总数" value={totalHazards} icon={<AlertTriangle className="size-5" />} variant="warning" />
        <StatCard title="已整改" value={closedHazards} icon={<CheckCircle2 className="size-5" />} variant="success" />
        <StatCard title="员工人数" value={employeeCount} icon={<Users className="size-5" />} />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatCard title="待整改" value={pendingHazards} icon={<AlertTriangle className="size-5" />} variant="danger" />
        <StatCard title="整改中" value={rectifyingHazards} icon={<TrendingUp className="size-5" />} variant="warning" />
        <StatCard title="重大隐患" value={majorHazards} icon={<AlertTriangle className="size-5" />} variant="danger" />
        <StatCard title="参与检查事项" value={relatedItems.length} icon={<ClipboardList className="size-5" />} />
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">隐患类型侧重</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryStats.length > 0 ? categoryStats : [{ name: "暂无数据", value: 1 }]} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name }) => name} fontSize={10}>
                    {categoryStats.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">整改情况</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={[
                    { name: "已整改", value: closedHazards, fill: "#22C55E" },
                    { name: "待整改", value: pendingHazards, fill: "#EF4444" },
                    { name: "整改中", value: rectifyingHazards, fill: "#F59E0B" },
                  ].filter((d) => d.value > 0)} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`} fontSize={11}>
                    {[
                      { name: "已整改", fill: "#22C55E" },
                      { name: "待整改", fill: "#EF4444" },
                      { name: "整改中", fill: "#F59E0B" },
                    ].filter((_, i) => [closedHazards, pendingHazards, rectifyingHazards][i] > 0).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 各检查事项隐患对比 */}
      {itemStats.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">各检查事项隐患/整改对比</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={itemStats} margin={{ left: 0, right: 16, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={11} />
                  <YAxis fontSize={11} />
                  <Tooltip />
                  <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="隐患数" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="已整改" fill="#22C55E" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function StatisticsPage() {
  const { currentTeam, currentUserType } = useAppStore();
  const teamId = currentTeam?.id || "";
  const teamName = currentTeam?.name || "";

  if (!teamId) {
    return (
      <div className="page-container">
        <PageHeader title="统计分析" />
        <p className="text-sm text-muted-foreground">请先选择组织</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <PageHeader title="统计分析" />

      {currentUserType === "supervisor" && <SupervisorStats teamId={teamId} />}
      {currentUserType === "inspector" && <InspectorStats teamId={teamId} />}
      {currentUserType === "enterprise" && <EnterpriseStats teamId={teamId} teamName={teamName} />}
    </div>
  );
}
