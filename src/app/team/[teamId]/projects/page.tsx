"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { PageHeader, ListToolbar } from "@/components/shared/PageHeader";
import { ProjectStatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  DetailDialog,
  DetailDialogContent,
  DetailDialogHeader,
  DetailDialogBody,
  DetailDialogFooter,
} from "@/components/shared/DetailDialog";
import { MOCK_PROJECTS, MOCK_TEAMS } from "@/lib/mock-data";
import { Eye, Edit, CheckCircle2, Archive, Plus } from "lucide-react";
import HoverActionMenu from "@/components/shared/HoverActionMenu";
import { toast } from "sonner";
import { useAppStore } from "@/lib/store";

export default function ProjectsListPage() {
  const router = useRouter();
  const params = useParams();
  const teamId = params.teamId as string;
  const { currentUserType } = useAppStore();
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const isSupervisor = currentUserType === "supervisor";

  const filteredProjects = MOCK_PROJECTS.filter(
    (p) => p.name.includes(search) || p.projectNo.includes(search)
  );

  // 可选的服务机构团队列表
  const inspectorTeams = MOCK_TEAMS.filter((t) => t.teamType === "inspector");

  const handleCreateProject = () => {
    if (!projectName.trim() || !assignedTo) {
      toast.error("请填写项目名称并选择服务机构");
      return;
    }
    toast.success("项目已创建");
    setCreateOpen(false);
    setProjectName("");
    setProjectDesc("");
    setAssignedTo("");
  };

  return (
    <div className="space-y-4">
      <PageHeader title="项目管理">
        {isSupervisor && (
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="size-3.5" /> 新建项目
          </Button>
        )}
      </PageHeader>

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
                  <TableHead className="w-[130px]">被指派机构</TableHead>
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
                      <TableCell className="text-sm">{project.assignedToTeamName}</TableCell>
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
                          actions={
                            isSupervisor
                              ? [
                                  {
                                    label: "查看详情",
                                    icon: <Eye className="h-4 w-4" />,
                                    onClick: () => toast.info("查看项目详情"),
                                  },
                                  {
                                    label: "编辑",
                                    icon: <Edit className="h-4 w-4" />,
                                    onClick: () => toast.info("编辑项目"),
                                  },
                                  {
                                    label: "完成项目",
                                    icon: <CheckCircle2 className="h-4 w-4" />,
                                    onClick: () => toast.info("项目已完成"),
                                  },
                                  {
                                    label: "归档",
                                    icon: <Archive className="h-4 w-4" />,
                                    onClick: () => toast.info("项目已归档"),
                                  },
                                ]
                              : [
                                  {
                                    label: "查看详情",
                                    icon: <Eye className="h-4 w-4" />,
                                    onClick: () => toast.info("查看项目详情"),
                                  },
                                ]
                          }
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
              共 {filteredProjects.length} 条记录
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="xs" disabled>上一页</Button>
              <Button variant="outline" size="xs" className="bg-primary text-primary-foreground">1</Button>
              <Button variant="outline" size="xs" disabled>下一页</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 新建项目弹窗 */}
      <DetailDialog open={createOpen} onOpenChange={setCreateOpen}>
        <DetailDialogContent className="max-w-[800px]">
          <DetailDialogHeader title="新建项目" />
          <DetailDialogBody>
            <div className="flex gap-6">
              <div className="flex-1 space-y-4 max-h-[calc(85vh-180px)] overflow-y-auto pr-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>项目名称 *</Label>
                    <Input
                      placeholder="请输入项目名称"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>指派服务机构 *</Label>
                    <Select value={assignedTo} onValueChange={(value) => value && setAssignedTo(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择服务机构">
                          {(value) => inspectorTeams.find((t) => t.id === value)?.name ?? value}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {inspectorTeams.map((t) => (
                          <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>项目说明</Label>
                    <Textarea
                      placeholder="请输入项目详细说明..."
                      rows={4}
                      value={projectDesc}
                      onChange={(e) => setProjectDesc(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="w-56 shrink-0 space-y-4">
                <div className="rounded-lg border p-4 space-y-3">
                  <h4 className="text-sm font-medium">操作提示</h4>
                  <Separator />
                  <p className="text-xs text-muted-foreground">
                    创建项目后，被指派的服务机构可以在其工作台中查看该项目，并创建相关的检查计划。
                  </p>
                </div>
              </div>
            </div>
          </DetailDialogBody>
          <DetailDialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>取消</Button>
            <Button onClick={handleCreateProject}>创建项目</Button>
          </DetailDialogFooter>
        </DetailDialogContent>
      </DetailDialog>
    </div>
  );
}
