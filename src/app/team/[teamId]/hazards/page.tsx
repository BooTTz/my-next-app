"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader, ListToolbar } from "@/components/shared/PageHeader";
import { HazardLevelBadge, HazardStatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOCK_HAZARDS } from "@/lib/mock-data";
import { HAZARD_CATEGORY_MAP } from "@/lib/types";
import { Eye, MoreHorizontal, AlertTriangle } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export default function HazardsListPage() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");

  const filtered = MOCK_HAZARDS.filter((h) => {
    const matchSearch =
      h.hazardNo.includes(search) ||
      h.description.includes(search) ||
      (h.enterpriseName || "").includes(search);
    if (tab === "all") return matchSearch;
    if (tab === "major") return matchSearch && h.level === "major";
    if (tab === "pending") return matchSearch && ["discovered", "notified", "rectifying"].includes(h.status);
    if (tab === "closed") return matchSearch && h.status === "closed";
    return matchSearch;
  });

  const majorCount = MOCK_HAZARDS.filter((h) => h.level === "major").length;
  const pendingCount = MOCK_HAZARDS.filter((h) => ["discovered", "notified", "rectifying", "submitted"].includes(h.status)).length;
  const closedCount = MOCK_HAZARDS.filter((h) => h.status === "closed").length;

  return (
    <div className="space-y-4">
      <PageHeader title="隐患管理" description="全团队隐患汇总与跟踪">
        <div className="flex items-center gap-3 text-sm">
          <span className="flex items-center gap-1.5">
            <AlertTriangle className="size-3.5 text-status-danger" />
            <span className="text-muted-foreground">重大</span>
            <span className="font-medium text-status-danger">{majorCount}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-status-warning" />
            <span className="text-muted-foreground">待处理</span>
            <span className="font-medium">{pendingCount}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-status-success" />
            <span className="text-muted-foreground">已销号</span>
            <span className="font-medium">{closedCount}</span>
          </span>
        </div>
      </PageHeader>

      <Card>
        <CardContent className="p-4">
          <Tabs value={tab} onValueChange={setTab}>
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="all">全部 ({MOCK_HAZARDS.length})</TabsTrigger>
                <TabsTrigger value="major">重大隐患 ({majorCount})</TabsTrigger>
                <TabsTrigger value="pending">待处理 ({pendingCount})</TabsTrigger>
                <TabsTrigger value="closed">已销号 ({closedCount})</TabsTrigger>
              </TabsList>
            </div>

            <div className="mt-3">
              <ListToolbar
                searchPlaceholder="搜索隐患编号、描述、企业..."
                searchValue={search}
                onSearchChange={setSearch}
                onFilter={() => toast.info("筛选功能")}
                onExport={() => toast.info("导出功能")}
                onRefresh={() => toast.info("已刷新")}
              />
            </div>

            <TabsContent value={tab} className="mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[110px]">隐患编号</TableHead>
                      <TableHead className="w-[70px]">等级</TableHead>
                      <TableHead className="w-[80px]">类别</TableHead>
                      <TableHead className="w-[80px]">子类</TableHead>
                      <TableHead>隐患描述</TableHead>
                      <TableHead className="w-[140px]">所属企业</TableHead>
                      <TableHead className="w-[80px]">状态</TableHead>
                      <TableHead className="w-[90px]">整改期限</TableHead>
                      <TableHead className="w-[70px]">发现人</TableHead>
                      <TableHead className="w-[60px] text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((h) => (
                      <TableRow key={h.id}>
                        <TableCell className="font-mono text-xs">{h.hazardNo}</TableCell>
                        <TableCell><HazardLevelBadge level={h.level} /></TableCell>
                        <TableCell className="text-xs">{HAZARD_CATEGORY_MAP[h.category]}</TableCell>
                        <TableCell className="text-xs">{h.subCategoryName}</TableCell>
                        <TableCell>
                          <Link
                            href={`/team/t1/hazards/${h.id}`}
                            className="text-sm hover:text-primary transition-colors line-clamp-1 max-w-[200px]"
                          >
                            {h.description}
                          </Link>
                        </TableCell>
                        <TableCell className="text-xs truncate max-w-[140px]">{h.enterpriseName}</TableCell>
                        <TableCell><HazardStatusBadge status={h.status} /></TableCell>
                        <TableCell className="text-xs">{h.deadline}</TableCell>
                        <TableCell className="text-xs">{h.discoveredByName}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md size-6 hover:bg-muted transition-colors outline-none">
                              <MoreHorizontal className="size-3.5" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Link href={`/team/t1/hazards/${h.id}`} className="flex items-center">
                                  <Eye className="size-3.5 mr-2" /> 查看详情
                                </Link>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>

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
