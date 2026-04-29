"use client";

import { use } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { ReportStatusBadge, HazardLevelBadge, HazardStatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { MOCK_REPORTS, MOCK_TASKS, MOCK_HAZARDS, MOCK_ENTERPRISES } from "@/lib/mock-data";
import { HAZARD_CATEGORY_MAP, CONCLUSION_MAP } from "@/lib/types";
import {
  ArrowLeft, Download, Share2, Printer, CheckCircle2, XCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function ReportPreviewPage({ params }: { params: Promise<{ teamId: string; reportId: string }> }) {
  const { teamId, reportId } = use(params);
  const report = MOCK_REPORTS.find((r) => r.id === reportId) || MOCK_REPORTS[0];
  const task = MOCK_TASKS.find((t) => t.id === report.taskId);
  const enterprise = MOCK_ENTERPRISES.find((e) => e.id === task?.enterpriseId);
  const hazards = MOCK_HAZARDS.filter((h) => h.taskId === report.taskId);

  const closedCount = hazards.filter((h) => h.status === "closed").length;
  const rectRate = hazards.length > 0 ? Math.round((closedCount / hazards.length) * 100) : 0;

  return (
    <div className="space-y-4">
      <PageHeader title="检查报告预览" backHref={`/team/${teamId}/reports`} backLabel="返回">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.info("导出PDF")}>
            <Download className="size-3.5" /> 导出PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.info("已生成分享链接")}>
            <Share2 className="size-3.5" /> 分享
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="size-3.5" /> 打印
          </Button>
          {report.status === "submitted" && (
            <>
              <Button variant="outline" size="sm" onClick={() => toast.error("报告已退回")}>
                <XCircle className="size-3.5" /> 退回
              </Button>
              <Button size="sm" onClick={() => toast.success("报告审核通过")}>
                <CheckCircle2 className="size-3.5" /> 审核通过
              </Button>
            </>
          )}
        </div>
      </PageHeader>

      {/* 报告正文 */}
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-8 space-y-6">
          {/* 封面 */}
          <div className="text-center space-y-4 pb-6 border-b">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{report.reportNo}</span>
              <ReportStatusBadge status={report.status} />
            </div>
            <h1 className="text-2xl font-bold">安全生产检查报告</h1>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>被检查单位：{report.enterpriseName}</p>
              <p>检查日期：{task?.scheduledDate}</p>
              <p>报告编制：{report.generatedByName}</p>
              <p>报告日期：{report.generatedAt}</p>
            </div>
          </div>

          {/* 一、检查概述 */}
          <section>
            <h2 className="text-base font-semibold border-l-4 border-primary pl-3 mb-3">一、检查概述</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <p><span className="text-muted-foreground">检查计划：</span>{task?.planName}</p>
              <p><span className="text-muted-foreground">任务编号：</span>{task?.taskNo}</p>
              <p><span className="text-muted-foreground">检查人员：</span>{task?.inspectorNames?.join("、")}</p>
              <p><span className="text-muted-foreground">检查组长：</span>{task?.leadInspectorName}</p>
            </div>
          </section>

          {/* 二、企业基本情况 */}
          {enterprise && (
            <section>
              <h2 className="text-base font-semibold border-l-4 border-primary pl-3 mb-3">二、企业基本情况</h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <p><span className="text-muted-foreground">企业名称：</span>{enterprise.name}</p>
                <p><span className="text-muted-foreground">信用代码：</span>{enterprise.creditCode}</p>
                <p><span className="text-muted-foreground">法定代表人：</span>{enterprise.legalPerson}</p>
                <p><span className="text-muted-foreground">安全负责人：</span>{enterprise.safetyDirector}</p>
                <p><span className="text-muted-foreground">企业地址：</span>{enterprise.address}</p>
                <p><span className="text-muted-foreground">员工人数：</span>{enterprise.employeeCount}人</p>
              </div>
            </section>
          )}

          {/* 三、检查发现 */}
          <section>
            <h2 className="text-base font-semibold border-l-4 border-primary pl-3 mb-3">
              三、检查发现（共{hazards.length}条隐患）
            </h2>
            {hazards.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px]">序号</TableHead>
                      <TableHead className="w-[70px]">等级</TableHead>
                      <TableHead className="w-[80px]">类别</TableHead>
                      <TableHead>隐患描述</TableHead>
                      <TableHead className="w-[80px]">位置</TableHead>
                      <TableHead className="w-[80px]">整改期限</TableHead>
                      <TableHead className="w-[70px]">状态</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {hazards.map((h, i) => (
                      <TableRow key={h.id}>
                        <TableCell className="text-xs">{i + 1}</TableCell>
                        <TableCell><HazardLevelBadge level={h.level} /></TableCell>
                        <TableCell className="text-xs">{h.subCategoryName}</TableCell>
                        <TableCell className="text-xs">{h.description}</TableCell>
                        <TableCell className="text-xs">{h.location}</TableCell>
                        <TableCell className="text-xs">{h.deadline}</TableCell>
                        <TableCell><HazardStatusBadge status={h.status} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">本次检查未发现隐患问题。</p>
            )}
          </section>

          {/* 四、整改情况 */}
          <section>
            <h2 className="text-base font-semibold border-l-4 border-primary pl-3 mb-3">四、整改情况汇总</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="rounded-md border p-3">
                <p className="text-2xl font-bold">{closedCount}</p>
                <p className="text-xs text-muted-foreground">已整改</p>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-2xl font-bold">{hazards.length - closedCount}</p>
                <p className="text-xs text-muted-foreground">未整改</p>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-2xl font-bold">{rectRate}%</p>
                <p className="text-xs text-muted-foreground">整改率</p>
              </div>
            </div>
          </section>

          {/* 五、综合评价 */}
          <section>
            <h2 className="text-base font-semibold border-l-4 border-primary pl-3 mb-3">五、综合评价</h2>
            <div className="rounded-md border p-4 space-y-2 text-sm">
              {task?.conclusion && (
                <p><span className="text-muted-foreground">检查结论：</span>
                  <Badge variant="secondary" className="ml-1">{CONCLUSION_MAP[task.conclusion]}</Badge>
                </p>
              )}
              {task?.safetyLevel && (
                <p><span className="text-muted-foreground">安全等级：</span>
                  <Badge variant="secondary" className="ml-1">{task.safetyLevel}级</Badge>
                </p>
              )}
              <p className="text-muted-foreground mt-2">
                综合评价：该企业在安全生产方面总体情况{task?.conclusion === "qualified" ? "良好" : "需要改善"}，
                需重点关注已发现隐患的整改落实情况。
              </p>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
