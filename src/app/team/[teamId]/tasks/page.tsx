"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader, ListToolbar } from "@/components/shared/PageHeader";
import { TaskStatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MOCK_TASKS } from "@/lib/mock-data";
import { CONCLUSION_MAP } from "@/lib/types";
import { Eye, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export default function TasksListPage() {
  const [search, setSearch] = useState("");

  const filteredTasks = MOCK_TASKS.filter(
    (t) =>
      (t.enterpriseName || "").includes(search) ||
      t.taskNo.includes(search) ||
      (t.leadInspectorName || "").includes(search)
  );

  return (
    <div className="space-y-4">
      <PageHeader title="检查任务管理" description="查看和管理所有检查任务" />

      <Card>
        <CardContent className="p-4">
          <ListToolbar
            searchPlaceholder="搜索企业名称、任务编号..."
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
                  <TableHead className="w-[120px]">任务编号</TableHead>
                  <TableHead>被检查企业</TableHead>
                  <TableHead className="w-[100px]">所属计划</TableHead>
                  <TableHead className="w-[80px]">状态</TableHead>
                  <TableHead className="w-[100px]">计划日期</TableHead>
                  <TableHead className="w-[80px]">检查组长</TableHead>
                  <TableHead className="w-[100px]">检查人员</TableHead>
                  <TableHead className="w-[60px]">隐患</TableHead>
                  <TableHead className="w-[80px]">检查结论</TableHead>
                  <TableHead className="w-[60px] text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-mono text-xs">{task.taskNo}</TableCell>
                    <TableCell>
                      <Link
                        href={`/team/t1/tasks/${task.id}`}
                        className="font-medium text-sm hover:text-primary transition-colors"
                      >
                        {task.enterpriseName}
                      </Link>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground truncate max-w-[100px]">
                      {task.planName?.substring(0, 8)}...
                    </TableCell>
                    <TableCell><TaskStatusBadge status={task.status} /></TableCell>
                    <TableCell className="text-xs">{task.scheduledDate}</TableCell>
                    <TableCell className="text-sm">{task.leadInspectorName}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {task.inspectorNames?.map((name) => (
                          <Badge key={name} variant="secondary" className="text-[10px] px-1.5">
                            {name}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {task.hazardCount > 0 ? (
                          <span>
                            <span className="font-medium">{task.hazardCount}</span>
                            <span className="text-muted-foreground text-xs">
                              /{task.rectifiedCount}改
                            </span>
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </span>
                    </TableCell>
                    <TableCell>
                      {task.conclusion ? (
                        <Badge
                          variant="secondary"
                          className={`text-[10px] ${
                            task.conclusion === "qualified"
                              ? "bg-status-success/10 text-status-success"
                              : task.conclusion === "unqualified"
                              ? "bg-status-danger/10 text-status-danger"
                              : "bg-status-warning/10 text-status-warning"
                          }`}
                        >
                          {CONCLUSION_MAP[task.conclusion]}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md size-6 hover:bg-muted transition-colors outline-none">
                          <MoreHorizontal className="size-3.5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Link href={`/team/t1/tasks/${task.id}`} className="flex items-center">
                              <Eye className="size-3.5 mr-2" /> 查看详情
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.info("接收任务")}>
                            接收任务
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.info("验收任务")}>
                            验收任务
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
            <p className="text-xs text-muted-foreground">共 {filteredTasks.length} 条记录</p>
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
