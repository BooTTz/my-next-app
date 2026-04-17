"use client";

import { use } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { TaskStatusBadge, HazardLevelBadge, HazardStatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { MOCK_TASKS, MOCK_HAZARDS } from "@/lib/mock-data";
import { CONCLUSION_MAP, SAFETY_LEVEL_MAP } from "@/lib/types";
import {
  ArrowLeft, FileText, Calendar, User, Building2, MapPin,
  CheckCircle2, AlertTriangle, ClipboardList,
} from "lucide-react";
import { toast } from "sonner";

export default function TaskDetailPage({ params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = use(params);
  const task = MOCK_TASKS.find((t) => t.id === taskId) || MOCK_TASKS[0];
  const hazards = MOCK_HAZARDS.filter((h) => h.taskId === task.id);
  const closedCount = hazards.filter((h) => h.status === "closed").length;
  const rectProgress = hazards.length > 0 ? Math.round((closedCount / hazards.length) * 100) : 0;

  return (
    <div className="space-y-4">
      <PageHeader title="检查任务详情">
        <div className="flex items-center gap-2">
          <Link href="/team/t1/tasks">
            <Button variant="outline" size="sm">
              <ArrowLeft className="size-3.5" /> 返回列表
            </Button>
          </Link>
          {task.status === "assigned" && (
            <Button size="sm" onClick={() => toast.success("任务已接收")}>
              接收任务
            </Button>
          )}
          {task.status === "inspecting" && (
            <Button size="sm" onClick={() => toast.success("已提交报告")}>
              <FileText className="size-3.5" /> 提交报告
            </Button>
          )}
          {task.status === "report_submitted" && (
            <Button size="sm" onClick={() => toast.success("审核通过")}>
              <CheckCircle2 className="size-3.5" /> 审核通过
            </Button>
          )}
        </div>
      </PageHeader>

      {/* 任务概要 */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-sm text-muted-foreground">{task.taskNo}</span>
                <TaskStatusBadge status={task.status} />
                {task.conclusion && (
                  <Badge
                    variant="secondary"
                    className={`text-xs ${
                      task.conclusion === "qualified"
                        ? "bg-status-success/10 text-status-success"
                        : "bg-status-warning/10 text-status-warning"
                    }`}
                  >
                    {CONCLUSION_MAP[task.conclusion]}
                  </Badge>
                )}
                {task.safetyLevel && (
                  <Badge variant="secondary" className="text-xs">
                    安全等级：{task.safetyLevel}
                  </Badge>
                )}
              </div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Building2 className="size-4 text-muted-foreground" />
                {task.enterpriseName}
              </h2>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">整改进度</p>
              <div className="flex items-center gap-2 mt-1">
                <Progress value={rectProgress} className="w-24 h-2" />
                <span className="text-sm font-medium">{rectProgress}%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {closedCount}/{hazards.length} 已销号
              </p>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-4 gap-6 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">所属计划</p>
              <Link href={`/team/t1/plans/${task.planId}`} className="text-primary hover:underline text-xs">
                {task.planName?.substring(0, 15)}...
              </Link>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">计划检查日期</p>
              <p className="flex items-center gap-1.5">
                <Calendar className="size-3.5 text-muted-foreground" />
                {task.scheduledDate}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">检查组长</p>
              <p className="flex items-center gap-1.5">
                <User className="size-3.5 text-muted-foreground" />
                {task.leadInspectorName}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">检查人员</p>
              <div className="flex flex-wrap gap-1">
                {task.inspectorNames?.map((name) => (
                  <Badge key={name} variant="secondary" className="text-[10px]">{name}</Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 隐患清单 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertTriangle className="size-4" />
            隐患清单 ({hazards.length})
            {hazards.filter((h) => h.level === "major").length > 0 && (
              <Badge variant="destructive" className="text-[10px] px-1.5">
                {hazards.filter((h) => h.level === "major").length} 项重大
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hazards.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[110px]">编号</TableHead>
                    <TableHead className="w-[70px]">等级</TableHead>
                    <TableHead className="w-[90px]">类别</TableHead>
                    <TableHead>隐患描述</TableHead>
                    <TableHead className="w-[80px]">位置</TableHead>
                    <TableHead className="w-[80px]">状态</TableHead>
                    <TableHead className="w-[90px]">整改期限</TableHead>
                    <TableHead className="w-[60px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hazards.map((h) => (
                    <TableRow key={h.id}>
                      <TableCell className="font-mono text-xs">{h.hazardNo}</TableCell>
                      <TableCell><HazardLevelBadge level={h.level} /></TableCell>
                      <TableCell className="text-xs">{h.subCategoryName}</TableCell>
                      <TableCell className="text-sm line-clamp-1 max-w-[200px]">{h.description}</TableCell>
                      <TableCell className="text-xs text-muted-foreground truncate max-w-[80px]">{h.location}</TableCell>
                      <TableCell><HazardStatusBadge status={h.status} /></TableCell>
                      <TableCell className="text-xs">{h.deadline}</TableCell>
                      <TableCell>
                        <Link href={`/team/t1/hazards/${h.id}`}>
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
              暂无隐患记录
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
