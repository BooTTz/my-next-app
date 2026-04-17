"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader, ListToolbar } from "@/components/shared/PageHeader";
import { ReportStatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MOCK_REPORTS } from "@/lib/mock-data";
import { Eye, Download, Share2, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export default function ReportsListPage() {
  const [search, setSearch] = useState("");

  const filtered = MOCK_REPORTS.filter(
    (r) => r.reportNo.includes(search) || (r.enterpriseName || "").includes(search)
  );

  return (
    <div className="space-y-4">
      <PageHeader title="检查报告管理" description="查看和管理所有检查报告" />

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
                        href={`/team/t1/reports/${report.id}`}
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
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md size-6 hover:bg-muted transition-colors outline-none">
                          <MoreHorizontal className="size-3.5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Link href={`/team/t1/reports/${report.id}`} className="flex items-center">
                              <Eye className="size-3.5 mr-2" /> 在线预览
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.info("导出PDF")}>
                            <Download className="size-3.5 mr-2" /> 导出PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.info("已生成分享链接")}>
                            <Share2 className="size-3.5 mr-2" /> 分享链接
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
