"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { PageHeader, ListToolbar } from "@/components/shared/PageHeader";
import { PlanStatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MOCK_PLANS } from "@/lib/mock-data";
import { PLAN_TYPE_MAP } from "@/lib/types";
import { Eye, Edit, Trash2, Copy } from "lucide-react";
import HoverActionMenu from "@/components/shared/HoverActionMenu";
import { toast } from "sonner";

export default function PlansListPage() {
  const router = useRouter();
  const params = useParams();
  const teamId = params.teamId as string;
  const [search, setSearch] = useState("");

  const filteredPlans = MOCK_PLANS.filter(
    (p) => p.name.includes(search) || p.planNo.includes(search)
  );

  return (
    <div className="space-y-4">
      <PageHeader title="检查计划管理" description="管理和查看所有安全检查计划">
        <Link href={`/team/${teamId}/plans/new`}>
          <Button size="sm">新建检查计划</Button>
        </Link>
      </PageHeader>

      <Card>
        <CardContent className="p-4">
          <ListToolbar
            searchPlaceholder="搜索计划名称或编号..."
            searchValue={search}
            onSearchChange={setSearch}
            onFilter={() => toast.info("筛选功能")}
            onExport={() => toast.info("导出功能")}
            onImport={() => toast.info("导入功能")}
            onRefresh={() => toast.info("已刷新")}
          />

          <div className="mt-4 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[130px]">计划编号</TableHead>
                  <TableHead>计划名称</TableHead>
                  <TableHead className="w-[90px]">检查类型</TableHead>
                  <TableHead className="w-[80px]">年度</TableHead>
                  <TableHead className="w-[90px]">状态</TableHead>
                  <TableHead className="w-[160px]">检查时间</TableHead>
                  <TableHead className="w-[120px]">任务进度</TableHead>
                  <TableHead className="w-[80px]">创建人</TableHead>
                  <TableHead className="w-[60px] text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlans.map((plan) => {
                  const progress = plan.taskCount
                    ? Math.round(((plan.completedTaskCount || 0) / plan.taskCount) * 100)
                    : 0;
                  return (
                    <TableRow key={plan.id} className="group">
                      <TableCell className="font-mono text-xs">{plan.planNo}</TableCell>
                      <TableCell>
                        <Link
                          href={`/team/${teamId}/plans/${plan.id}`}
                          className="font-medium text-sm hover:text-primary transition-colors line-clamp-1"
                        >
                          {plan.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {PLAN_TYPE_MAP[plan.type]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{plan.year}</TableCell>
                      <TableCell>
                        <PlanStatusBadge status={plan.status} />
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {plan.startDate} ~ {plan.endDate}
                      </TableCell>
                      <TableCell>
                        {plan.taskCount ? (
                          <div className="flex items-center gap-2">
                            <Progress value={progress} className="h-1.5 flex-1" />
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {plan.completedTaskCount}/{plan.taskCount}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">{plan.creatorName}</TableCell>
                      <TableCell className="text-right">
                        <HoverActionMenu
                          actions={[
                            {
                              label: "查看详情",
                              icon: <Eye className="h-4 w-4" />,
                              onClick: () => router.push(`/team/${teamId}/plans/${plan.id}`),
                            },
                            {
                              label: "编辑",
                              icon: <Edit className="h-4 w-4" />,
                              onClick: () => toast.info("编辑功能"),
                            },
                            {
                              label: "复制计划",
                              icon: <Copy className="h-4 w-4" />,
                              onClick: () => toast.info("复制功能"),
                            },
                            {
                              label: "删除",
                              icon: <Trash2 className="h-4 w-4" />,
                              onClick: () => toast.error("删除计划"),
                              variant: "destructive",
                            },
                          ]}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* 分页 */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              共 {filteredPlans.length} 条记录
            </p>
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
