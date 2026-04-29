"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { PageHeader, ListToolbar } from "@/components/shared/PageHeader";
import { ReportStatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MOCK_REPORTS } from "@/lib/mock-data";
import { Eye, Download, Share2, Plus } from "lucide-react";
import HoverActionMenu from "@/components/shared/HoverActionMenu";
import { toast } from "sonner";
import { useAppStore } from "@/lib/store";

export default function ReportsListPage() {
  const router = useRouter();
  const params = useParams();
  const teamId = params.teamId as string;
  const { currentUserType } = useAppStore();
  const [search, setSearch] = useState("");

  const isInspector = currentUserType === "inspector";
  const isSupervisor = currentUserType === "supervisor";

  const pageTitle = isSupervisor ? "报告列表" : isInspector ? "报告管理" : "报告列表";

  const filtered = MOCK_REPORTS.filter(
    (r) => r.reportNo.includes(search) || (r.enterpriseName || "").includes(search)
  );

  return (
    <div className="space-y-4">
      <PageHeader title={pageTitle}>
        {isInspector && (
          <Button size="sm" onClick={() => toast.info("生成报告 - 从已完成任务中选择")}>
            <Plus className="size-3.5" /> 生成报告
          </Button>
        )}
      </PageHeader>

      <Card>
        <CardContent className="p-4">
          <ListToolbar
            searchPlaceholder="搜索报告编号、企业名称..."
            searchValue={search}
            onSearchChange={setSearch}
            onFilter={() => toast.info("筛选功能")}
            onExport={() => toast.info("导出功能")}
            onRefresh={() => toast.info("已刷新")}
          />

          <div className="mt-4 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">报告编号</TableHead>
                  <TableHead>被检查企业</TableHead>
                  <TableHead className="w-[110px]">关联任务</TableHead>
                  <TableHead className="w-[80px]">状态</TableHead>
                  <TableHead className="w-[80px]">版本</TableHead>
                  <TableHead className="w-[80px]">生成人</TableHead>
                  <TableHead className="w-[100px]">生成时间</TableHead>
                  <TableHead className="w-[80px] text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-mono text-xs">{report.reportNo}</TableCell>
                    <TableCell>
                      <Link
                        href={`/team/${teamId}/reports/${report.id}`}
                        className="font-medium text-sm hover:text-primary transition-colors"
                      >
                        {report.enterpriseName}
                      </Link>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{report.taskNo}</TableCell>
                    <TableCell><ReportStatusBadge status={report.status} /></TableCell>
                    <TableCell className="text-sm">v{report.version}</TableCell>
                    <TableCell className="text-sm">{report.generatedByName}</TableCell>
                    <TableCell className="text-xs">{report.generatedAt}</TableCell>
                    <TableCell className="text-right">
                      <HoverActionMenu
                        actions={[
                          {
                            label: "在线预览",
                            icon: <Eye className="h-4 w-4" />,
                            onClick: () => router.push(`/team/${teamId}/reports/${report.id}`),
                          },
                          {
                            label: "导出 PDF",
                            icon: <Download className="h-4 w-4" />,
                            onClick: () => toast.info("导出 PDF"),
                          },
                          {
                            label: "分享链接",
                            icon: <Share2 className="h-4 w-4" />,
                            onClick: () => toast.info("已生成分享链接"),
                          },
                        ]}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">共 {filtered.length} 条记录</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="xs" disabled>上一页</Button>
              <Button variant="outline" size="xs" className="bg-primary text-primary-foreground">1</Button>
              <Button variant="outline" size="xs" disabled>下一页</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
