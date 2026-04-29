"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { PageHeader, ListToolbar } from "@/components/shared/PageHeader";
import { PlanStatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  DetailDialog,
  DetailDialogContent,
  DetailDialogHeader,
  DetailDialogBody,
  DetailDialogFooter,
} from "@/components/shared/DetailDialog";
import { MOCK_PLANS, MOCK_ENTERPRISES, MOCK_MEMBERS } from "@/lib/mock-data";
import { PLAN_TYPE_MAP } from "@/lib/types";
import { Eye, Edit, Trash2, Copy, Save, Send } from "lucide-react";
import HoverActionMenu from "@/components/shared/HoverActionMenu";
import { toast } from "sonner";

export default function PlansListPage() {
  const router = useRouter();
  const params = useParams();
  const teamId = params.teamId as string;
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedEnterprises, setSelectedEnterprises] = useState<string[]>([]);

  const filteredPlans = MOCK_PLANS.filter(
    (p) => p.name.includes(search) || p.planNo.includes(search)
  );

  const inspectors = MOCK_MEMBERS.filter((m) => m.userType === "inspector");

  const handleSubmit = (isDraft: boolean) => {
    toast.success(isDraft ? "计划已保存为草稿" : "计划已发布，任务已下达");
    setCreateOpen(false);
  };

  return (
    <div className="space-y-4">
      <PageHeader title="检查计划管理">
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          新建检查计划
        </Button>
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

      {/* 新建检查计划弹窗 */}
      <DetailDialog open={createOpen} onOpenChange={setCreateOpen}>
        <DetailDialogContent className="max-w-[1000px]">
          <DetailDialogHeader title="新建检查计划" />
          <DetailDialogBody>
            <div className="flex gap-6">
              {/* 主要表单 - 左侧可滚动 */}
              <div className="flex-1 space-y-4 max-h-[calc(85vh-180px)] overflow-y-auto pr-2">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">基本信息</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>计划名称 *</Label>
                        <Input placeholder="请输入检查计划名称" />
                      </div>
                      <div className="space-y-2">
                        <Label>检查类型 *</Label>
                        <Select>
                          <SelectTrigger><SelectValue placeholder="选择检查类型" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="routine">日常检查</SelectItem>
                            <SelectItem value="special">专项检查</SelectItem>
                            <SelectItem value="random">双随机检查</SelectItem>
                            <SelectItem value="holiday">节假日检查</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>计划年度 *</Label>
                        <Select defaultValue="2025">
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2025">2025</SelectItem>
                            <SelectItem value="2024">2024</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>开始日期 *</Label>
                        <Input type="date" />
                      </div>
                      <div className="space-y-2">
                        <Label>结束日期 *</Label>
                        <Input type="date" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>计划说明</Label>
                      <Textarea placeholder="请输入检查计划的详细说明..." rows={3} />
                    </div>
                    <div className="space-y-2">
                      <Label>检查范围</Label>
                      <Textarea placeholder="请描述本次检查的范围..." rows={2} />
                    </div>
                    <div className="space-y-2">
                      <Label>检查依据</Label>
                      <Textarea placeholder="引用的法规标准，如《安全生产法》等..." rows={2} />
                    </div>
                  </CardContent>
                </Card>

                {/* 被检查企业选择 */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">选择被检查企业 *</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                      {MOCK_ENTERPRISES.map((e) => (
                        <label
                          key={e.id}
                          className="flex items-center gap-3 rounded-md border p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                        >
                          <Checkbox
                            checked={selectedEnterprises.includes(e.id)}
                            onCheckedChange={(checked) => {
                              setSelectedEnterprises((prev) =>
                                checked ? [...prev, e.id] : prev.filter((id) => id !== e.id)
                              );
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{e.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {e.address} · {e.safetyDirector} · {e.safetyDirectorPhone}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 侧边信息 - 右侧固定 */}
              <div className="w-64 shrink-0 space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">操作</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button className="w-full" onClick={() => handleSubmit(false)}>
                      <Send className="size-3.5" /> 发布计划
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => handleSubmit(true)}>
                      <Save className="size-3.5" /> 保存草稿
                    </Button>
                    <Separator className="my-3" />
                    <p className="text-xs text-muted-foreground">
                      发布后将自动为每个被检查企业创建检查任务，并通知对应的服务机构人员。
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">分配检查人员</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {inspectors.map((m) => (
                        <label key={m.userId} className="flex items-center gap-2 text-sm cursor-pointer">
                          <Checkbox defaultChecked />
                          <span>{m.user?.realName}</span>
                          <span className="text-xs text-muted-foreground">({m.roleName})</span>
                        </label>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </DetailDialogBody>
          <DetailDialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>取消</Button>
          </DetailDialogFooter>
        </DetailDialogContent>
      </DetailDialog>
    </div>
  );
}
