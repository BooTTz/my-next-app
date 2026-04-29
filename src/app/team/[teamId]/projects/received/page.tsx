"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageHeader, ListToolbar } from "@/components/shared/PageHeader";
import { ProjectStatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MOCK_PROJECTS } from "@/lib/mock-data";
import { Eye, ClipboardList } from "lucide-react";
import HoverActionMenu from "@/components/shared/HoverActionMenu";
import { toast } from "sonner";

export default function ReceivedProjectsPage() {
  const router = useRouter();
  const params = useParams();
  const teamId = params.teamId as string;
  const [search, setSearch] = useState("");

  // 仅显示指派给当前机构的项目
  const filteredProjects = MOCK_PROJECTS.filter(
    (p) =>
      p.assignedToTeamId === teamId &&
      (p.name.includes(search) || p.projectNo.includes(search))
  );

  return (
    <div className="space-y-4">
      <PageHeader title="收到的项目" />

      <Card>
        <CardContent className="p-4">
          <ListToolbar
            searchPlaceholder="搜索项目名称或编号..."
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
                  <TableHead className="w-[130px]">项目编号</TableHead>
                  <TableHead>项目名称</TableHead>
                  <TableHead className="w-[130px]">监管方</TableHead>
                  <TableHead className="w-[90px]">状态</TableHead>
                  <TableHead className="w-[100px]">创建时间</TableHead>
                  <TableHead className="w-[120px]">计划进度</TableHead>
                  <TableHead className="w-[60px] text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => {
                  const progress = project.planCount
                    ? Math.round(((project.completedPlanCount || 0) / project.planCount) * 100)
                    : 0;
                  return (
                    <TableRow key={project.id} className="group">
                      <TableCell className="font-mono text-xs">{project.projectNo}</TableCell>
                      <TableCell>
                        <span className="font-medium text-sm">{project.name}</span>
                      </TableCell>
                      <TableCell className="text-sm">博兴县应急管理局</TableCell>
                      <TableCell>
                        <ProjectStatusBadge status={project.status} />
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {project.createdAt}
                      </TableCell>
                      <TableCell>
                        {project.planCount ? (
                          <div className="flex items-center gap-2">
                            <Progress value={progress} className="h-1.5 flex-1" />
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {project.completedPlanCount}/{project.planCount}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <HoverActionMenu
                          actions={[
                            {
                              label: "查看详情",
                              icon: <Eye className="h-4 w-4" />,
                              onClick: () => toast.info("查看项目详情"),
                            },
                            {
                              label: "创建计划",
                              icon: <ClipboardList className="h-4 w-4" />,
                              onClick: () => router.push(`/team/${teamId}/plans`),
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

          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">共 {filteredProjects.length} 条记录</p>
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
