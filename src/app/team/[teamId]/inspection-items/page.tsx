"use client";

import { useState, useMemo, useCallback } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  DetailDialog,
  DetailDialogContent,
  DetailDialogHeader,
  DetailDialogBody,
  DetailDialogFooter,
} from "@/components/shared/DetailDialog";
import HoverActionMenu from "@/components/shared/HoverActionMenu";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import EmptyState, { ListEmpty } from "@/components/shared/EmptyState";
import { LoadingButton } from "@/components/ui/loading-button";
import { MOCK_INSPECTION_ITEMS, MOCK_TEAMS } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";
import {
  ITEM_TYPE_MAP,
  type PlanType,
  type PlanStatus,
  type InspectionItem,
} from "@/lib/types";
import {
  Eye,
  Edit,
  Trash2,
  Plus,
  ShieldBan,
} from "lucide-react";
import { toast } from "sonner";

// ============ Constants & Helpers ============

const TYPE_OPTIONS: { value: PlanType; label: string }[] = [
  { value: "routine", label: "日常检查" },
  { value: "special", label: "专项检查" },
  { value: "random", label: "双随机检查" },
  { value: "holiday", label: "节假日检查" },
];

const STATUS_OPTIONS: { value: PlanStatus; label: string }[] = [
  { value: "draft", label: "草稿" },
  { value: "published", label: "已发布" },
  { value: "in_progress", label: "执行中" },
  { value: "completed", label: "已完成" },
  { value: "archived", label: "已归档" },
];

const ALL_VALUE = "__all__";

interface ItemFormData {
  name: string;
  type: PlanType;
  description: string;
  startDate: string;
  endDate: string;
  year: number;
  basis: string;
  scope: string;
  supervisorTeamIds: string[];
  inspectorTeamIds: string[];
  enterpriseTeamIds: string[];
}

const DEFAULT_FORM_DATA: ItemFormData = {
  name: "",
  type: "routine",
  description: "",
  startDate: "",
  endDate: "",
  year: new Date().getFullYear(),
  basis: "",
  scope: "",
  supervisorTeamIds: [],
  inspectorTeamIds: [],
  enterpriseTeamIds: [],
};

/** Generate a next sequential item number */
function generateItemNo(items: InspectionItem[]): string {
  const year = new Date().getFullYear();
  const existingNos = items
    .filter((item) => item.itemNo.startsWith(`JCBX-${year}`))
    .map((item) => {
      const seq = item.itemNo.split("-").pop();
      return seq ? parseInt(seq, 10) : 0;
    })
    .filter((n) => !Number.isNaN(n));
  const maxSeq = existingNos.length > 0 ? Math.max(...existingNos) : 0;
  const nextSeq = String(maxSeq + 1).padStart(3, "0");
  return `JCBX-${year}-${nextSeq}`;
}

/** Determine a user's role in relation to an inspection item */
function getUserRole(
  item: InspectionItem,
  currentTeamId: string,
): "creator" | "supervisor" | "inspector" | "enterprise" | null {
  if (item.teamId === currentTeamId) return "creator";
  if (item.supervisorTeamIds.includes(currentTeamId)) return "supervisor";
  if (item.inspectorTeamIds.includes(currentTeamId)) return "inspector";
  if (item.enterpriseTeamIds.includes(currentTeamId)) return "enterprise";
  return null;
}

// ============ Main Page Component ============

export default function InspectionItemsListPage() {
  const router = useRouter();
  const params = useParams();
  const teamId = params.teamId as string;
  const { currentTeam, currentUser } = useAppStore();

  // ---- Items state (mock data driven) ----
  const [items, setItems] = useState<InspectionItem[]>(MOCK_INSPECTION_ITEMS);

  // ---- Search & Filter state ----
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>(ALL_VALUE);
  const [statusFilter, setStatusFilter] = useState<string>(ALL_VALUE);

  // ---- Dialog state ----
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InspectionItem | null>(null);
  const [formData, setFormData] = useState<ItemFormData>(DEFAULT_FORM_DATA);
  const [submitting, setSubmitting] = useState(false);

  // ---- Delete state ----
  const [deleteTarget, setDeleteTarget] = useState<InspectionItem | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // ---- Derived data ----
  const supervisorTeams = useMemo(
    () => MOCK_TEAMS.filter((t) => t.teamType === "supervisor"),
    [],
  );
  const inspectorTeams = useMemo(
    () => MOCK_TEAMS.filter((t) => t.teamType === "inspector"),
    [],
  );
  const enterpriseTeams = useMemo(
    () => MOCK_TEAMS.filter((t) => t.teamType === "enterprise"),
    [],
  );

  // ---- Filtered items ----
  const visibleItems = useMemo(() => {
    if (!currentTeam) return [];

    return items.filter((item) => {
      // 1) Visibility: current team must be creator or participant
      const role = getUserRole(item, currentTeam.id);
      if (!role) return false;

      // 2) Search filter
      const q = search.trim().toLowerCase();
      if (q) {
        const matchesSearch =
          item.itemNo.toLowerCase().includes(q) ||
          item.name.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }

      // 3) Type filter
      if (typeFilter !== ALL_VALUE && item.type !== typeFilter) return false;

      // 4) Status filter
      if (statusFilter !== ALL_VALUE && item.status !== statusFilter) return false;

      return true;
    });
  }, [items, currentTeam, search, typeFilter, statusFilter]);

  // ---- Form handlers ----

  const resetForm = useCallback(() => {
    setFormData(DEFAULT_FORM_DATA);
    setEditingItem(null);
  }, []);

  const openCreateDialog = useCallback(() => {
    resetForm();
    setFormOpen(true);
  }, [resetForm]);

  const openEditDialog = useCallback((item: InspectionItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      type: item.type,
      description: item.description ?? "",
      startDate: item.startDate,
      endDate: item.endDate,
      year: item.year,
      basis: item.basis ?? "",
      scope: item.scope ?? "",
      supervisorTeamIds: [...item.supervisorTeamIds],
      inspectorTeamIds: [...item.inspectorTeamIds],
      enterpriseTeamIds: [...item.enterpriseTeamIds],
    });
    setFormOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    setFormOpen(false);
    resetForm();
  }, [resetForm]);

  const handleFormSubmit = useCallback(async () => {
    // Validation
    if (!formData.name.trim()) {
      toast.error("请输入检查名称");
      return;
    }
    if (!formData.startDate) {
      toast.error("请选择开始日期");
      return;
    }
    if (!formData.endDate) {
      toast.error("请选择结束日期");
      return;
    }
    if (formData.startDate > formData.endDate) {
      toast.error("开始日期不能晚于结束日期");
      return;
    }
    if (!formData.year || formData.year < 2000 || formData.year > 2100) {
      toast.error("请输入有效的计划年度");
      return;
    }

    setSubmitting(true);

    // Simulate async
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const now = new Date().toISOString().split("T")[0];

      if (editingItem) {
        // ---- Update existing item ----
        const updatedItems = items.map((item) => {
          if (item.id !== editingItem.id) return item;

          const supervisorNames = formData.supervisorTeamIds
            .map((id) => MOCK_TEAMS.find((t) => t.id === id)?.name ?? "")
            .filter(Boolean);
          const inspectorNames = formData.inspectorTeamIds
            .map((id) => MOCK_TEAMS.find((t) => t.id === id)?.name ?? "")
            .filter(Boolean);
          const enterpriseNames = formData.enterpriseTeamIds
            .map((id) => MOCK_TEAMS.find((t) => t.id === id)?.name ?? "")
            .filter(Boolean);

          return {
            ...item,
            name: formData.name,
            type: formData.type,
            description: formData.description,
            startDate: formData.startDate,
            endDate: formData.endDate,
            year: formData.year,
            basis: formData.basis,
            scope: formData.scope,
            supervisorTeamIds: formData.supervisorTeamIds,
            supervisorTeamNames: supervisorNames,
            inspectorTeamIds: formData.inspectorTeamIds,
            inspectorTeamNames: inspectorNames,
            enterpriseTeamIds: formData.enterpriseTeamIds,
            enterpriseTeamNames: enterpriseNames,
          } satisfies InspectionItem;
        });

        setItems(updatedItems);
        toast.success("检查事项已更新");
      } else {
        // ---- Create new item ----
        const newId = `ii${Date.now()}`;
        const newItemNo = generateItemNo(items);

        const supervisorNames = formData.supervisorTeamIds
          .map((id) => MOCK_TEAMS.find((t) => t.id === id)?.name ?? "")
          .filter(Boolean);
        const inspectorNames = formData.inspectorTeamIds
          .map((id) => MOCK_TEAMS.find((t) => t.id === id)?.name ?? "")
          .filter(Boolean);
        const enterpriseNames = formData.enterpriseTeamIds
          .map((id) => MOCK_TEAMS.find((t) => t.id === id)?.name ?? "")
          .filter(Boolean);

        const newItem: InspectionItem = {
          id: newId,
          teamId: teamId,
          itemNo: newItemNo,
          name: formData.name,
          type: formData.type,
          status: "draft",
          description: formData.description,
          startDate: formData.startDate,
          endDate: formData.endDate,
          year: formData.year,
          creatorId: currentUser?.id ?? "",
          creatorName: currentUser?.realName ?? "",
          createdAt: now,
          basis: formData.basis,
          scope: formData.scope,
          institutionCount: formData.supervisorTeamIds.length + formData.inspectorTeamIds.length,
          enterpriseCount: formData.enterpriseTeamIds.length,
          taskCount: 0,
          completedTaskCount: 0,
          supervisorTeamIds: formData.supervisorTeamIds,
          supervisorTeamNames: supervisorNames,
          inspectorTeamIds: formData.inspectorTeamIds,
          inspectorTeamNames: inspectorNames,
          enterpriseTeamIds: formData.enterpriseTeamIds,
          enterpriseTeamNames: enterpriseNames,
        };

        setItems((prev) => [newItem, ...prev]);
        toast.success("检查事项已创建");
      }

      closeForm();
    } catch {
      toast.error("操作失败，请重试");
    } finally {
      setSubmitting(false);
    }
  }, [formData, editingItem, items, teamId, currentUser, closeForm]);

  // ---- Delete handler ----
  const handleDelete = useCallback(() => {
    if (!deleteTarget) return;
    setItems((prev) => prev.filter((item) => item.id !== deleteTarget.id));
    toast.success("检查事项已删除");
    setDeleteOpen(false);
    setDeleteTarget(null);
  }, [deleteTarget]);

  // ---- Clear filters ----
  const clearFilters = useCallback(() => {
    setTypeFilter(ALL_VALUE);
    setStatusFilter(ALL_VALUE);
    setSearch("");
  }, []);

  // ---- Early return: no current team ----
  if (!currentTeam) {
    return (
      <div className="page-container">
        <EmptyState
          title="无法加载"
          description="当前团队信息不可用"
          icon={ShieldBan}
        />
      </div>
    );
  }

  // ---- Role badge helper ----
  const renderRoleBadge = (role: "creator" | "supervisor" | "inspector" | "enterprise" | null) => {
    if (!role || role === "creator") return null;
    const config: Record<string, { label: string; className: string }> = {
      supervisor: { label: "监管方", className: "role-badge-supervisor" },
      inspector: { label: "服务方", className: "role-badge-inspector" },
      enterprise: { label: "企业方", className: "role-badge-enterprise" },
    };
    const c = config[role];
    return (
      <span className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${c.className}`}>
        {c.label}
      </span>
    );
  };

  // ---- Filter active indicator ----
  const filterActive = typeFilter !== ALL_VALUE || statusFilter !== ALL_VALUE;

  return (
    <div className="page-container space-y-4">
      {/* Page Header */}
      <PageHeader title="检查事项" badge={visibleItems.length > 0 ? visibleItems.length : undefined} />

      {/* Main Card */}
      <Card>
        <CardContent className="p-4">
          {/* Toolbar */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <ListToolbar
                searchPlaceholder="搜索检查名称或编号..."
                searchValue={search}
                onSearchChange={setSearch}
                onRefresh={() => {
                  setItems(MOCK_INSPECTION_ITEMS);
                  clearFilters();
                  toast.success("已刷新");
                }}
                extra={
                  <div className="flex items-center gap-2">
                    <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v ?? ALL_VALUE)}>
                      <SelectTrigger className="h-7 w-[130px] text-xs">
                        <SelectValue placeholder="全部类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ALL_VALUE}>全部类型</SelectItem>
                        {TYPE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? ALL_VALUE)}>
                      <SelectTrigger className="h-7 w-[110px] text-xs">
                        <SelectValue placeholder="全部状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ALL_VALUE}>全部状态</SelectItem>
                        {STATUS_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {filterActive && (
                      <Button variant="ghost" size="xs" onClick={clearFilters} className="text-xs">
                        清除筛选
                      </Button>
                    )}
                  </div>
                }
              />
            </div>
            <Button size="sm" onClick={openCreateDialog} className="shrink-0">
              <Plus className="size-3.5" />
              新建检查事项
            </Button>
          </div>

          {/* Table / Empty State */}
          {visibleItems.length === 0 ? (
            <div className="mt-4">
              {search || filterActive ? (
                <EmptyState
                  variant="search"
                  title="未找到匹配的检查事项"
                  description={search ? `未找到与"${search}"相关的检查事项` : "当前筛选条件下没有检查事项"}
                  action={filterActive ? { label: "清除筛选", onClick: clearFilters } : undefined}
                />
              ) : (
                <ListEmpty onAdd={openCreateDialog} addLabel="新建检查事项" />
              )}
            </div>
          ) : (
            <>
              <div className="mt-4 rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[140px]">检查编号</TableHead>
                      <TableHead>检查名称</TableHead>
                      <TableHead className="w-[90px]">检查类型</TableHead>
                      <TableHead className="w-[80px]">状态</TableHead>
                      <TableHead className="w-[170px]">检查时间</TableHead>
                      <TableHead className="w-[80px]">创建人</TableHead>
                      <TableHead className="w-[100px]">创建时间</TableHead>
                      <TableHead className="w-[110px]">任务进度</TableHead>
                      <TableHead className="w-[60px] text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visibleItems.map((item) => {
                      const role = getUserRole(item, currentTeam.id);
                      const isCreator = role === "creator";
                      const progress = item.taskCount
                        ? Math.round(((item.completedTaskCount ?? 0) / item.taskCount) * 100)
                        : 0;

                      return (
                        <TableRow key={item.id} className="group">
                          <TableCell className="font-mono text-xs">{item.itemNo}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/team/${teamId}/inspection-items/${item.id}`}
                                className="font-medium text-sm hover:text-primary transition-colors line-clamp-1"
                              >
                                {item.name}
                              </Link>
                              {renderRoleBadge(role)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs">
                              {ITEM_TYPE_MAP[item.type]}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <PlanStatusBadge status={item.status} />
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                            {item.startDate} ~ {item.endDate}
                          </TableCell>
                          <TableCell className="text-sm">{item.creatorName ?? "-"}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {item.createdAt}
                          </TableCell>
                          <TableCell>
                            {item.taskCount ? (
                              <div className="flex items-center gap-2">
                                <Progress value={progress} className="h-1.5 flex-1" />
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                  {item.completedTaskCount ?? 0}/{item.taskCount}
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
                                  icon: <Eye className="size-4" />,
                                  onClick: () =>
                                    router.push(`/team/${teamId}/inspection-items/${item.id}`),
                                },
                                ...(isCreator
                                  ? [
                                      {
                                        label: "编辑",
                                        icon: <Edit className="size-4" />,
                                        onClick: () => openEditDialog(item),
                                      } as const,
                                      {
                                        label: "删除",
                                        icon: <Trash2 className="size-4" />,
                                        onClick: () => {
                                          setDeleteTarget(item);
                                          setDeleteOpen(true);
                                        },
                                        variant: "destructive" as const,
                                      } as const,
                                    ]
                                  : []),
                              ]}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination footer */}
              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  共 {visibleItems.length} 条记录
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="xs" disabled>
                    上一页
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    className="bg-primary text-primary-foreground"
                  >
                    1
                  </Button>
                  <Button variant="outline" size="xs" disabled>
                    下一页
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* ============ Create / Edit Dialog ============ */}
      <DetailDialog open={formOpen} onOpenChange={setFormOpen}>
        <DetailDialogContent className="max-w-[800px]">
          <DetailDialogHeader
            title={editingItem ? "编辑检查事项" : "新建检查事项"}
            description={
              editingItem
                ? `正在编辑：${editingItem.itemNo}`
                : "创建一个新的检查事项"
            }
          />
          <DetailDialogBody>
            <div className="space-y-6">
              {/* Basic Info Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-foreground">基本信息</h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label>
                      检查名称 <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      placeholder="请输入检查名称"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, name: e.target.value }))
                      }
                    />
                  </div>

                  {/* Type */}
                  <div className="space-y-2">
                    <Label>检查类型</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(v) =>
                        setFormData((prev) => ({ ...prev, type: v as PlanType }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择检查类型" />
                      </SelectTrigger>
                      <SelectContent>
                        {TYPE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Year */}
                  <div className="space-y-2">
                    <Label>计划年度</Label>
                    <Input
                      type="number"
                      min={2000}
                      max={2100}
                      value={formData.year}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          year: parseInt(e.target.value, 10) || new Date().getFullYear(),
                        }))
                      }
                    />
                  </div>

                  {/* Start date */}
                  <div className="space-y-2">
                    <Label>
                      开始日期 <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, startDate: e.target.value }))
                      }
                    />
                  </div>

                  {/* End date */}
                  <div className="space-y-2">
                    <Label>
                      结束日期 <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                      }
                    />
                  </div>

                  {/* Basis */}
                  <div className="space-y-2">
                    <Label>检查依据</Label>
                    <Input
                      placeholder="引用的法规标准"
                      value={formData.basis}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, basis: e.target.value }))
                      }
                    />
                  </div>

                  {/* Scope */}
                  <div className="space-y-2 col-span-2">
                    <Label>检查范围</Label>
                    <Input
                      placeholder="描述本次检查的范围"
                      value={formData.scope}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, scope: e.target.value }))
                      }
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2 col-span-2">
                    <Label>检查描述</Label>
                    <Textarea
                      placeholder="请输入检查事项的详细说明..."
                      rows={3}
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, description: e.target.value }))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Participant Selection */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-foreground">参与方选择</h3>
                <div className="grid grid-cols-3 gap-4">
                  {/* Supervisor Teams */}
                  <div className="space-y-2">
                    <Label className="text-xs text-role-supervisor-foreground">
                      选择监管部门
                    </Label>
                    <div className="max-h-[180px] overflow-y-auto rounded-md border p-2 space-y-1">
                      {supervisorTeams.length === 0 ? (
                        <p className="text-xs text-muted-foreground py-2 text-center">
                          暂无可用监管部门
                        </p>
                      ) : (
                        supervisorTeams.map((team) => {
                          const checked = formData.supervisorTeamIds.includes(team.id);
                          return (
                            <label
                              key={team.id}
                              className="flex items-center gap-2 rounded-sm px-1.5 py-1 cursor-pointer hover:bg-muted/50 transition-colors"
                            >
                              <Checkbox
                                checked={checked}
                                onCheckedChange={(chk) => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    supervisorTeamIds: chk
                                      ? [...prev.supervisorTeamIds, team.id]
                                      : prev.supervisorTeamIds.filter((id) => id !== team.id),
                                  }));
                                }}
                              />
                              <span className="text-xs">{team.name}</span>
                            </label>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Inspector Teams */}
                  <div className="space-y-2">
                    <Label className="text-xs text-role-inspector-foreground">
                      选择服务机构
                    </Label>
                    <div className="max-h-[180px] overflow-y-auto rounded-md border p-2 space-y-1">
                      {inspectorTeams.length === 0 ? (
                        <p className="text-xs text-muted-foreground py-2 text-center">
                          暂无可用服务机构
                        </p>
                      ) : (
                        inspectorTeams.map((team) => {
                          const checked = formData.inspectorTeamIds.includes(team.id);
                          return (
                            <label
                              key={team.id}
                              className="flex items-center gap-2 rounded-sm px-1.5 py-1 cursor-pointer hover:bg-muted/50 transition-colors"
                            >
                              <Checkbox
                                checked={checked}
                                onCheckedChange={(chk) => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    inspectorTeamIds: chk
                                      ? [...prev.inspectorTeamIds, team.id]
                                      : prev.inspectorTeamIds.filter((id) => id !== team.id),
                                  }));
                                }}
                              />
                              <span className="text-xs">{team.name}</span>
                            </label>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Enterprise Teams */}
                  <div className="space-y-2">
                    <Label className="text-xs text-role-enterprise-foreground">
                      选择企业
                    </Label>
                    <div className="max-h-[180px] overflow-y-auto rounded-md border p-2 space-y-1">
                      {enterpriseTeams.length === 0 ? (
                        <p className="text-xs text-muted-foreground py-2 text-center">
                          暂无可用企业
                        </p>
                      ) : (
                        enterpriseTeams.map((team) => {
                          const checked = formData.enterpriseTeamIds.includes(team.id);
                          return (
                            <label
                              key={team.id}
                              className="flex items-center gap-2 rounded-sm px-1.5 py-1 cursor-pointer hover:bg-muted/50 transition-colors"
                            >
                              <Checkbox
                                checked={checked}
                                onCheckedChange={(chk) => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    enterpriseTeamIds: chk
                                      ? [...prev.enterpriseTeamIds, team.id]
                                      : prev.enterpriseTeamIds.filter((id) => id !== team.id),
                                  }));
                                }}
                              />
                              <span className="text-xs">{team.name}</span>
                            </label>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DetailDialogBody>
          <DetailDialogFooter>
            <Button variant="outline" onClick={closeForm} disabled={submitting}>
              取消
            </Button>
            <LoadingButton loading={submitting} loadingText="提交中..." onClick={handleFormSubmit}>
              {editingItem ? "保存修改" : "创建"}
            </LoadingButton>
          </DetailDialogFooter>
        </DetailDialogContent>
      </DetailDialog>

      {/* ============ Delete Confirm Dialog ============ */}
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="确认删除"
        description={
          deleteTarget
            ? `确定要删除检查事项"${deleteTarget.name}"吗？此操作不可撤销。`
            : "确定要删除该检查事项吗？此操作不可撤销。"
        }
        variant="danger"
        confirmText="删除"
        onConfirm={handleDelete}
      />
    </div>
  );
}
