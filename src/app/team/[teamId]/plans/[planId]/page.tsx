"use client";

import { use } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { PlanStatusBadge, TaskStatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { MOCK_PLANS, MOCK_TASKS } from "@/lib/mock-data";
import { PLAN_TYPE_MAP } from "@/lib/types";
import { ArrowLeft, Edit, Send, FileText, Calendar, User, MapPin } from "lucide-react";

export default function PlanDetailPage({ params }: { params: Promise<{ teamId: string; planId: string }> }) {
  const { teamId, planId } = use(params);
  const plan = MOCK_PLANS.find((p) => p.id === planId) || MOCK_PLANS[0];
  const tasks = MOCK_TASKS.filter((t) => t.planId === plan.id);
  const progress = plan.taskCount
    ? Math.round(((plan.completedTaskCount || 0) / plan.taskCount) * 100)
    : 0;

  return (
    <div className="space-y-4">
      <PageHeader title="检查计划详情" backHref={`/team/${teamId}/plans`} backLabel="返回列表">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Edit className="size-3.5" /> 编辑
          </Button>
          {plan.status === "draft" && (
            <Button size="sm">
              <Send className="size-3.5" /> 发布计划
            </Button>
          )}
        </div>
      </PageHeader>

      {/* 基本信息卡片 */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="font-mono text-sm text-muted-foreground">{plan.planNo}</span>
                <PlanStatusBadge status={plan.status} />
                <Badge variant="secondary" className="text-xs">{PLAN_TYPE_MAP[plan.type]}</Badge>
              </div>
              <h2 className="text-lg font-semibold">{plan.name}</h2>
              {plan.description && (
                <p className="mt-2 text-sm text-muted-foreground max-w-2xl">{plan.description}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">任务进度</p>
              <div className="flex items-center gap-2 mt-1">
                <Progress value={progress} className="w-24 h-2" />
                <span className="text-sm font-medium">{progress}%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {plan.completedTaskCount || 0}/{plan.taskCount || 0} 已完成
              </p>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-4 gap-6 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">检查时间</p>
              <p className="flex items-center gap-1.5">
                <Calendar className="size-3.5 text-muted-foreground" />
                {plan.startDate} ~ {plan.endDate}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">计划年度</p>
              <p>{plan.year}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">创建人</p>
              <p className="flex items-center gap-1.5">
                <User className="size-3.5 text-muted-foreground" />
                {plan.creatorName}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">创建时间</p>
              <p>{plan.createdAt}</p>
            </div>
          </div>

          {plan.basis && (
            <>
              <Separator className="my-4" />
              <div className="text-sm">
                <p className="text-muted-foreground mb-1">检查依据</p>
                <p>{plan.basis}</p>
              </div>
            </>
          )}

          {plan.scope && (
            <div className="text-sm mt-3">
              <p className="text-muted-foreground mb-1">检查范围</p>
              <p>{plan.scope}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 关联检查任务 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">关联检查任务 ({tasks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {tasks.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">任务编号</TableHead>
                    <TableHead>被检查企业</TableHead>
                    <TableHead className="w-[80px]">状态</TableHead>
                    <TableHead className="w-[100px]">计划日期</TableHead>
                    <TableHead className="w-[100px]">检查组长</TableHead>
                    <TableHead className="w-[80px]">隐患数</TableHead>
                    <TableHead className="w-[80px]">已整改</TableHead>
                    <TableHead className="w-[60px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-mono text-xs">{task.taskNo}</TableCell>
                      <TableCell className="text-sm font-medium">{task.enterpriseName}</TableCell>
                      <TableCell><TaskStatusBadge status={task.status} /></TableCell>
                      <TableCell className="text-xs">{task.scheduledDate}</TableCell>
                      <TableCell className="text-sm">{task.leadInspectorName}</TableCell>
                      <TableCell className="text-sm">{task.hazardCount}</TableCell>
                      <TableCell className="text-sm">{task.rectifiedCount}</TableCell>
                      <TableCell>
                        <Link href={`/team/${teamId}/tasks/${task.id}`}>
                          <Button variant="ghost" size="icon-xs">
                            <FileText className="size-3.5" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              暂无关联任务，发布计划后将自动创建任务
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
