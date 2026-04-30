"use client";

import { use, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Building2, Calendar, Edit, User, Users, ClipboardList, FileText } from "lucide-react";
import { toast } from "sonner";

import { useAppStore } from "@/lib/store";
import {
  MOCK_INSPECTION_ITEMS,
  MOCK_TASKS,
  MOCK_HAZARDS,
  MOCK_MEMBERS,
  MOCK_ENTERPRISES,
} from "@/lib/mock-data";
import type { InspectionTask, Hazard, TaskStatus, UserType } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LoadingButton } from "@/components/ui/loading-button";
import StatusBadge, {
  TaskStatusBadge,
  HazardLevelBadge,
  HazardStatusBadge,
} from "@/components/shared/StatusBadge";
import EmptyState from "@/components/shared/EmptyState";

// ─── Constants ───────────────────────────────────────────────

const CONCLUSION_VARIANT: Record<string, "success" | "warning" | "danger"> = {
  qualified: "success",
  basically_qualified: "warning",
  unqualified: "danger",
};

const CONCLUSION_LABEL: Record<string, string> = {
  qualified: "合格",
  basically_qualified: "基本合格",
  unqualified: "不合格",
};

// ─── Helpers ─────────────────────────────────────────────────

function getNextTaskNo(): string {
  const existingNos = MOCK_TASKS.map((t) => t.taskNo);
  let maxSeq = 0;
  for (const no of existingNos) {
    const match = no.match(/RW-(\d+)$/);
    if (match) {
      const seq = parseInt(match[1], 10);
      if (seq > maxSeq) maxSeq = seq;
    }
  }
  const next = maxSeq + 1;
  return `RW-${String(next).padStart(3, "0")}`;
}

// ─── Multi-Select Inspector Component ────────────────────────

interface InspectorOption {
  value: string;
  label: string;
}

function InspectorMultiSelect({
  options,
  selected,
  onChange,
}: {
  options: InspectorOption[];
  selected: string[];
  onChange: (ids: string[]) => void;
}) {
  const [open, setOpen] = useState(false);

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const displayText =
    selected.length > 0
      ? `已选择 ${selected.length} 人`
      : "选择检查人员";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={<Button variant="outline" className="w-full justify-start" />}>
        <span className="text-sm">{displayText}</span>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-2">
        <div className="space-y-1">
          {options.map((opt) => {
            const isChecked = selected.includes(opt.value);
            return (
              <label
                key={opt.value}
                className="flex items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-muted cursor-pointer"
              >
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={() => toggle(opt.value)}
                />
                <span>{opt.label}</span>
              </label>
            );
          })}
          {options.length === 0 && (
            <p className="px-2 py-4 text-sm text-muted-foreground text-center">
              暂无可选人员
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ─── Sub-components ──────────────────────────────────────────

function ConclusionBadge({
  conclusion,
}: {
  conclusion: "qualified" | "basically_qualified" | "unqualified";
}) {
  const variant = CONCLUSION_VARIANT[conclusion] ?? "neutral";
  const label = CONCLUSION_LABEL[conclusion] ?? conclusion;
  return <StatusBadge variant={variant} label={label} />;
}

// ─── Page Component ───────────────────────────────────────────

export default function InspectionItemTasksPage({
  params,
}: {
  params: Promise<{ teamId: string; itemId: string }>;
}) {
  const { teamId, itemId } = use(params);

  const { currentUser, currentUserType } = useAppStore();

  // ── Data ──────────────────────────────────────────────────

  const item = useMemo(
    () => MOCK_INSPECTION_ITEMS.find((i) => i.id === itemId) ?? null,
    [itemId],
  );

  const tasks = useMemo(
    () => MOCK_TASKS.filter((t) => t.inspectionItemId === itemId),
    [itemId],
  );

  const hazardsByTaskId = useMemo(() => {
    const map = new Map<string, Hazard[]>();
    for (const h of MOCK_HAZARDS) {
      const existing = map.get(h.taskId) ?? [];
      existing.push(h);
      map.set(h.taskId, existing);
    }
    return map;
  }, []);

  // ── Computed ──────────────────────────────────────────────

  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const totalCount = tasks.length;
  const progressValue =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const canCreateTask = useMemo(() => {
    if (!currentUser || !item) return false;
    if (item.creatorId === currentUser.id) return true;
    return currentUserType === "inspector";
  }, [currentUser, item, currentUserType]);

  const itemEnterprises = useMemo(
    () =>
      MOCK_ENTERPRISES.filter((e) =>
        item?.enterpriseTeamIds.includes(e.teamId),
      ),
    [item],
  );

  const inspectorPool = useMemo(
    () =>
      MOCK_MEMBERS.filter(
        (m) =>
          item?.inspectorTeamIds.includes(m.teamId) && m.user,
      ),
    [item],
  );

  const inspectorOptions: InspectorOption[] = useMemo(
    () =>
      inspectorPool.map((m) => ({
        value: m.userId,
        label: m.user?.realName ?? m.userId,
      })),
    [inspectorPool],
  );

  // ── Dialog States ─────────────────────────────────────────

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [taskDetailOpen, setTaskDetailOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<InspectionTask | null>(null);
  const [editingTask, setEditingTask] = useState<InspectionTask | null>(null);

  // ── Create/Edit Task Form State ───────────────────────────

  const [isEditing, setIsEditing] = useState(false);
  const [newTaskEnterprise, setNewTaskEnterprise] = useState("");
  const [newTaskLeadInspector, setNewTaskLeadInspector] = useState("");
  const [newTaskInspectors, setNewTaskInspectors] = useState<string[]>([]);
  const [newTaskDate, setNewTaskDate] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [, setRefreshKey] = useState(0);

  const resetCreateForm = useCallback(() => {
    setNewTaskEnterprise("");
    setNewTaskLeadInspector("");
    setNewTaskInspectors([]);
    setNewTaskDate("");
    setIsCreating(false);
    setIsEditing(false);
    setEditingTask(null);
  }, []);

  const handleCreateTask = useCallback(() => {
    if (!item || !currentUser) return;

    // Validate
    if (!newTaskEnterprise) {
      toast.error("请选择被检查企业");
      return;
    }
    if (!newTaskLeadInspector) {
      toast.error("请选择检查组长");
      return;
    }
    if (newTaskInspectors.length === 0) {
      toast.error("请至少选择1名检查人员");
      return;
    }
    if (!newTaskDate) {
      toast.error("请选择计划检查日期");
      return;
    }

    setIsCreating(true);

    // Simulate async creation
    setTimeout(() => {
      const enterprise = MOCK_ENTERPRISES.find(
        (e) => e.id === newTaskEnterprise,
      );
      const leadInspector = MOCK_MEMBERS.find(
        (m) => m.userId === newTaskLeadInspector,
      );
      const inspectorMembers = MOCK_MEMBERS.filter((m) =>
        newTaskInspectors.includes(m.userId),
      );

      const newTask: InspectionTask = {
        id: `tk-new-${Date.now()}`,
        teamId,
        inspectionItemId: itemId,
        inspectionItemName: item.name,
        taskNo: getNextTaskNo(),
        enterpriseId: newTaskEnterprise,
        enterpriseName: enterprise?.name ?? "未知企业",
        inspectorIds: newTaskInspectors,
        inspectorNames: inspectorMembers.map((m) => m.user?.realName ?? ""),
        leadInspectorId: newTaskLeadInspector,
        leadInspectorName: leadInspector?.user?.realName ?? "",
        scheduledDate: newTaskDate,
        status: "assigned" as TaskStatus,
        creatorOrgType: (currentUserType ?? "supervisor") as UserType,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
        hazardCount: 0,
        rectifiedCount: 0,
      };

      // Push to mock data (this is a client-side only mutation)
      MOCK_TASKS.push(newTask);

      toast.success(`任务 ${newTask.taskNo} 创建成功`);
      setCreateDialogOpen(false);
      resetCreateForm();
      setIsCreating(false);

      // Force re-render by using a state toggle
      setRefreshKey((k) => k + 1);
    }, 600);
  }, [
    item,
    currentUser,
    currentUserType,
    teamId,
    itemId,
    newTaskEnterprise,
    newTaskLeadInspector,
    newTaskInspectors,
    newTaskDate,
    resetCreateForm,
  ]);

  // ── Open Task Detail / Edit ──────────────────────────────

  const openTaskDetail = useCallback((task: InspectionTask) => {
    setSelectedTask(task);
    setTaskDetailOpen(true);
  }, []);

  const openEditDialog = useCallback(() => {
    if (!selectedTask) return;
    const task = selectedTask;
    setEditingTask(task);
    setNewTaskEnterprise(task.enterpriseId);
    setNewTaskLeadInspector(task.leadInspectorId);
    setNewTaskInspectors(task.inspectorIds);
    setNewTaskDate(task.scheduledDate);
    setIsEditing(true);
    setTaskDetailOpen(false);
    setCreateDialogOpen(true);
  }, [selectedTask]);

  const handleUpdateTask = useCallback(() => {
    if (!item || !currentUser || !editingTask) return;

    if (!newTaskEnterprise) {
      toast.error("请选择被检查企业");
      return;
    }
    if (!newTaskLeadInspector) {
      toast.error("请选择检查组长");
      return;
    }
    if (newTaskInspectors.length === 0) {
      toast.error("请至少选择1名检查人员");
      return;
    }
    if (!newTaskDate) {
      toast.error("请选择计划检查日期");
      return;
    }

    setIsCreating(true);

    setTimeout(() => {
      const enterprise = MOCK_ENTERPRISES.find(
        (e) => e.id === newTaskEnterprise,
      );
      const leadInspector = MOCK_MEMBERS.find(
        (m) => m.userId === newTaskLeadInspector,
      );
      const inspectorMembers = MOCK_MEMBERS.filter((m) =>
        newTaskInspectors.includes(m.userId),
      );

      const idx = MOCK_TASKS.findIndex((t) => t.id === editingTask.id);
      if (idx !== -1) {
        MOCK_TASKS[idx] = {
          ...MOCK_TASKS[idx],
          enterpriseId: newTaskEnterprise,
          enterpriseName: enterprise?.name ?? "未知企业",
          inspectorIds: newTaskInspectors,
          inspectorNames: inspectorMembers.map((m) => m.user?.realName ?? ""),
          leadInspectorId: newTaskLeadInspector,
          leadInspectorName: leadInspector?.user?.realName ?? "",
          scheduledDate: newTaskDate,
          updatedAt: new Date().toISOString().split("T")[0],
        };
      }

      toast.success(`任务 ${editingTask.taskNo} 已更新`);
      setCreateDialogOpen(false);
      resetCreateForm();
      setIsCreating(false);
      setRefreshKey((k) => k + 1);
    }, 600);
  }, [
    item,
    currentUser,
    editingTask,
    newTaskEnterprise,
    newTaskLeadInspector,
    newTaskInspectors,
    newTaskDate,
    resetCreateForm,
  ]);

  // ── Guard: item not found ─────────────────────────────────

  if (!item) {
    return (
      <div className="page-container">
        <EmptyState
          variant="default"
          title="未找到检查事项"
          description="该检查事项不存在或已被删除"
          action={{
            label: "返回列表",
            onClick: () => (window.location.href = `/team/${teamId}/inspection-items`),
          }}
        />
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────

  return (
    <div className="page-container space-y-4">
      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/team/${teamId}/inspection-items`}>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-4 mr-1" />
              返回
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">{item.name}</h1>
            <p className="text-xs text-muted-foreground">
              检查编号：{item.itemNo}
            </p>
          </div>
        </div>
      </div>

      {/* ── Progress Bar ──────────────────────────────── */}
      <div className="flex items-center gap-3">
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">任务进度</span>
            <span className="text-xs text-muted-foreground">
              {completedCount}/{totalCount} 项任务已完成
            </span>
          </div>
          <Progress value={progressValue} />
        </div>
      </div>

      {/* ── Tasks Section ─────────────────────────────── */}
      <div className="space-y-3">
        {/* Section header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList className="size-5 text-muted-foreground" />
            <h2 className="text-base font-semibold">检查任务</h2>
            {totalCount > 0 && (
              <span className="text-sm text-muted-foreground">
                ({totalCount} 条)
              </span>
            )}
          </div>
          {canCreateTask && (
            <Button size="sm" onClick={() => setCreateDialogOpen(true)}>
              <Plus className="size-3.5" />
              创建任务
            </Button>
          )}
        </div>

        {/* Tasks table */}
        {totalCount === 0 ? (
          <Card>
            <CardContent className="py-8">
              <EmptyState
                variant="task"
                title="暂无任务"
                description="还没有创建检查任务"
                action={
                  canCreateTask
                    ? {
                        label: "创建任务",
                        onClick: () => setCreateDialogOpen(true),
                      }
                    : undefined
                }
              />
            </CardContent>
          </Card>
        ) : (
          <Card size="sm" className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>任务编号</TableHead>
                  <TableHead>被检查企业</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>计划检查日期</TableHead>
                  <TableHead>检查组长</TableHead>
                  <TableHead>检查人员</TableHead>
                  <TableHead>隐患数量</TableHead>
                  <TableHead>检查结论</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow
                    key={task.id}
                    className="cursor-pointer"
                    onClick={() => openTaskDetail(task)}
                  >
                    <TableCell className="font-mono text-xs">
                      {task.taskNo}
                    </TableCell>
                    <TableCell>{task.enterpriseName}</TableCell>
                    <TableCell>
                      <TaskStatusBadge status={task.status} />
                    </TableCell>
                    <TableCell>{task.scheduledDate}</TableCell>
                    <TableCell>{task.leadInspectorName}</TableCell>
                    <TableCell>
                      {task.inspectorNames?.join("、") ?? "-"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          (task.hazardCount ?? 0) > 0
                            ? "font-medium text-status-warning"
                            : "text-muted-foreground"
                        }
                      >
                        {task.hazardCount ?? 0}
                      </span>
                    </TableCell>
                    <TableCell>
                      {task.conclusion ? (
                        <ConclusionBadge conclusion={task.conclusion} />
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>

      {/* ── Create/Edit Task Dialog ──────────────────── */}
      <Dialog open={createDialogOpen} onOpenChange={(open) => {
        setCreateDialogOpen(open);
        if (!open) resetCreateForm();
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? "编辑检查任务" : "创建检查任务"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? `正在编辑任务 ${editingTask?.taskNo}`
                : `为 "${item.name}" 创建新的检查任务`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Enterprise select */}
            <div className="space-y-2">
              <Label>
                被检查企业 <span className="text-destructive">*</span>
              </Label>
              <Select
                value={newTaskEnterprise}
                onValueChange={(value: string | null) => {
                  if (value !== null) setNewTaskEnterprise(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择被检查企业" />
                </SelectTrigger>
                <SelectContent>
                  {itemEnterprises.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.name}
                    </SelectItem>
                  ))}
                  {itemEnterprises.length === 0 && (
                    <SelectItem value="__none__" disabled>
                      暂无可用企业
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Lead inspector select */}
            <div className="space-y-2">
              <Label>
                检查组长 <span className="text-destructive">*</span>
              </Label>
              <Select
                value={newTaskLeadInspector}
                onValueChange={(value: string | null) => {
                  if (value !== null) setNewTaskLeadInspector(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择检查组长" />
                </SelectTrigger>
                <SelectContent>
                  {inspectorOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                  {inspectorOptions.length === 0 && (
                    <SelectItem value="__none__" disabled>
                      暂无可选人员
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Inspector multi-select */}
            <div className="space-y-2">
              <Label>
                检查人员 <span className="text-destructive">*</span>
              </Label>
              <InspectorMultiSelect
                options={inspectorOptions}
                selected={newTaskInspectors}
                onChange={setNewTaskInspectors}
              />
              {newTaskInspectors.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  已选：{newTaskInspectors.length} 人
                </p>
              )}
            </div>

            {/* Date input */}
            <div className="space-y-2">
              <Label>
                计划检查日期 <span className="text-destructive">*</span>
              </Label>
              <Input
                type="date"
                value={newTaskDate}
                onChange={(e) => setNewTaskDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setCreateDialogOpen(false);
                resetCreateForm();
              }}
            >
              取消
            </Button>
            <LoadingButton
              loading={isCreating}
              loadingText={isEditing ? "保存中..." : "创建中..."}
              onClick={isEditing ? handleUpdateTask : handleCreateTask}
            >
              {isEditing ? "保存修改" : "创建"}
            </LoadingButton>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Task Detail Dialog ────────────────────────── */}
      <Dialog open={taskDetailOpen} onOpenChange={setTaskDetailOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>任务详情</DialogTitle>
            <DialogDescription>检查任务详细信息</DialogDescription>
          </DialogHeader>

          {selectedTask && (
            <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-1">
              {/* Task header */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-sm text-muted-foreground">
                  {selectedTask.taskNo}
                </span>
                <TaskStatusBadge status={selectedTask.status} />
                {selectedTask.conclusion && (
                  <ConclusionBadge conclusion={selectedTask.conclusion} />
                )}
              </div>

              <Separator />

              {/* Enterprise info */}
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="size-4 text-muted-foreground" />
                <span className="font-medium">
                  {selectedTask.enterpriseName}
                </span>
              </div>

              <Separator />

              {/* Inspector info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">检查组长</p>
                  <p className="flex items-center gap-1.5">
                    <User className="size-3.5 text-muted-foreground" />
                    {selectedTask.leadInspectorName}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">检查人员</p>
                  <p className="flex items-center gap-1.5">
                    <Users className="size-3.5 text-muted-foreground" />
                    {selectedTask.inspectorNames?.join("、") ?? "-"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">计划检查日期</p>
                  <p className="flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-muted-foreground" />
                    {selectedTask.scheduledDate}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">实际检查日期</p>
                  <p className="flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-muted-foreground" />
                    {selectedTask.actualStartDate
                      ? `${selectedTask.actualStartDate}${selectedTask.actualEndDate ? ` ~ ${selectedTask.actualEndDate}` : ""}`
                      : "-"}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Hazard sub-table */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="size-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium">隐患清单</h3>
                  <span className="text-xs text-muted-foreground">
                    ({hazardsByTaskId.get(selectedTask.id)?.length ?? 0} 条)
                  </span>
                </div>

                {(hazardsByTaskId.get(selectedTask.id)?.length ?? 0) === 0 ? (
                  <p className="py-4 text-sm text-muted-foreground text-center">
                    暂无隐患记录
                  </p>
                ) : (
                  <div className="overflow-x-auto rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>隐患编号</TableHead>
                          <TableHead>等级</TableHead>
                          <TableHead>类别</TableHead>
                          <TableHead>描述</TableHead>
                          <TableHead>状态</TableHead>
                          <TableHead>整改期限</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(hazardsByTaskId.get(selectedTask.id) ?? []).map(
                          (hazard) => (
                            <TableRow key={hazard.id}>
                              <TableCell className="font-mono text-xs">
                                {hazard.hazardNo}
                              </TableCell>
                              <TableCell>
                                <HazardLevelBadge level={hazard.level} />
                              </TableCell>
                              <TableCell>
                                {hazard.subCategoryName ?? "-"}
                              </TableCell>
                              <TableCell className="max-w-[200px] truncate">
                                <span title={hazard.description}>
                                  {hazard.description}
                                </span>
                              </TableCell>
                              <TableCell>
                                <HazardStatusBadge status={hazard.status} />
                              </TableCell>
                              <TableCell>{hazard.deadline}</TableCell>
                            </TableRow>
                          ),
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            {canCreateTask && (
              <Button
                variant="outline"
                size="sm"
                onClick={openEditDialog}
              >
                <Edit className="size-3.5 mr-1" />
                编辑
              </Button>
            )}
            <div className="flex-1" />
            <Button
              variant="outline"
              onClick={() => setTaskDetailOpen(false)}
            >
              关闭
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
