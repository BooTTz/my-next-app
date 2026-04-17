"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_HAZARDS, MOCK_TASKS, MOCK_ENTERPRISES } from "@/lib/mock-data";
import {
  FileCheck, AlertTriangle, CheckCircle2, Building2,
  TrendingUp, Shield,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";

const COLORS = ["#1E3A5F", "#3B82F6", "#22C55E", "#F59E0B", "#EF4444", "#8B5CF6"];

export default function StatisticsPage() {
  const totalTasks = MOCK_TASKS.length;
  const totalHazards = MOCK_HAZARDS.length;
  const closedHazards = MOCK_HAZARDS.filter((h) => h.status === "closed").length;
  const enterprises = MOCK_ENTERPRISES.length;

  // 各企业隐患统计
  const enterpriseStats = MOCK_ENTERPRISES.map((e) => {
    const hazards = MOCK_HAZARDS.filter((h) => h.enterpriseId === e.id);
    return {
      name: e.name.length > 8 ? e.name.substring(0, 8) + "..." : e.name,
      重大: hazards.filter((h) => h.level === "major").length,
      一般: hazards.filter((h) => h.level === "general").length,
    };
  }).filter((e) => e.重大 > 0 || e.一般 > 0);

  // 隐患类别分布
  const categoryStats = [
    { name: "资质证照", value: 0 },
    { name: "教育培训", value: 1 },
    { name: "安全责任制", value: 1 },
    { name: "应急管理", value: 1 },
    { name: "设备设施", value: 1 },
    { name: "安全标识", value: 1 },
    { name: "消防安全", value: 1 },
    { name: "用电安全", value: 1 },
    { name: "粉尘防爆", value: 1 },
  ].filter((c) => c.value > 0);

  // 月度趋势
  const monthlyTrend = [
    { month: "2024-10", 检查: 3, 隐患: 8, 整改: 6 },
    { month: "2024-11", 检查: 4, 隐患: 12, 整改: 9 },
    { month: "2024-12", 检查: 5, 隐患: 15, 整改: 11 },
    { month: "2025-01", 检查: 4, 隐患: 16, 整改: 14 },
    { month: "2025-02", 检查: 3, 隐患: 11, 整改: 11 },
    { month: "2025-03", 检查: 5, 隐患: 17, 整改: 10 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="数据统计" description="综合数据分析与统计报表" />

      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="检查任务总数" value={totalTasks} icon={<FileCheck className="size-5" />} variant="primary" />
        <StatCard title="隐患总数" value={totalHazards} icon={<AlertTriangle className="size-5" />} variant="warning" />
        <StatCard title="已销号" value={closedHazards} icon={<CheckCircle2 className="size-5" />} variant="success" />
        <StatCard title="覆盖企业" value={enterprises} icon={<Building2 className="size-5" />} />
      </div>

      {/* 图表 */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">月度检查与整改趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrend} margin={{ left: 0, right: 16, top: 8, bottom: 8 }}>
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
                  <Pie data={categoryStats} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name }) => name} fontSize={10}>
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
