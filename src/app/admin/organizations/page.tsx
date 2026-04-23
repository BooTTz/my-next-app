"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MOCK_ORGANIZATIONS } from "@/lib/mock-data";
import type { Organization, UserType } from "@/lib/types";
import {
  Eye, Edit, Trash2, MoreHorizontal, Plus, Ban, CheckCircle,
  AlertTriangle, Search, XCircle, Building2, User, Phone, Mail, MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  DetailDialog,
  DetailDialogContent,
  DetailDialogHeader,
  DetailDialogBody,
  DetailDialogFooter,
} from "@/components/shared/DetailDialog";

type OrgStatus = "active" | "inactive" | "archived";
type OrgStatusFilter = OrgStatus | "all";
type OrgTypeFilter = UserType | "all";

// 组织状态（Team 里没有 status 区分 inactive/archived，我们用本地 state 模拟覆盖）
const STATUS_OPTIONS: { value: OrgStatusFilter; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "active", label: "活跃" },
  { value: "inactive", label: "已停用" },
  { value: "archived", label: "已注销" },
];

const TYPE_OPTIONS: { value: OrgTypeFilter; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "supervisor", label: "监管部门" },
  { value: "inspector", label: "服务机构" },
  { value: "enterprise", label: "企业单位" },
];

function OrgTypeBadge({ type }: { type: UserType }) {
  const map: Record<UserType, { label: string; className: string }> = {
    supervisor: { label: "监管部门", className: "bg-blue-500/10 text-blue-600 border-blue-500/30" },
    inspector: { label: "服务机构", className: "bg-green-500/10 text-green-600 border-green-500/30" },
    enterprise: { label: "企业单位", className: "bg-amber-500/10 text-amber-600 border-amber-500/30" },
  };
  const { label, className } = map[type];
  return <Badge variant="outline" className={className}>{label}</Badge>;
}

function OrgStatusBadge({ status }: { status: OrgStatus }) {
  if (status === "active") {
    return (
      <Badge variant="outline" className="border-green-500/30 text-green-600 bg-green-500/10">
        活跃
      </Badge>
    );
  }
  if (status === "inactive") {
    return (
      <Badge variant="outline" className="border-gray-400/40 text-muted-foreground bg-muted/60">
        已停用
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="border-red-500/30 text-red-600 bg-red-500/10">
      已注销
    </Badge>
  );
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("zh-CN");
}

// 每个组织用 mock 状态，默认全部 active
function useOrgStatuses(orgs: Organization[]) {
  const [statuses, setStatuses] = useState<Record<string, OrgStatus>>(() => {
    const map: Record<string, OrgStatus> = {};
    orgs.forEach((o) => { map[o.id] = "active"; });
    return map;
  });
  function toggle(id: string) {
    setStatuses((s) => ({
      ...s,
      [id]: s[id] === "active" ? "inactive" : "active",
    }));
  }
  function archive(id: string) {
    setStatuses((s) => ({ ...s, [id]: "archived" }));
  }
  return { statuses, toggle, archive };
}

export default function OrganizationsListPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<OrgTypeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<OrgStatusFilter>("all");

  // 详情弹窗
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const { statuses, toggle, archive } = useOrgStatuses(MOCK_ORGANIZATIONS);

  // 删除确认
  const [deleteTarget, setDeleteTarget] = useState<Organization | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // 注销多重确认
  const [archiveTarget, setArchiveTarget] = useState<Organization | null>(null);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [archiveConfirmName, setArchiveConfirmName] = useState("");

  const filteredOrgs = useMemo(() => {
    return MOCK_ORGANIZATIONS.filter((o) => {
      const matchSearch =
        !search ||
        o.name.includes(search) ||
        (o.contactPerson ?? "").includes(search);
      const matchType = typeFilter === "all" || o.teamType === typeFilter;
      const orgStatus = statuses[o.id] ?? "active";
      const matchStatus = statusFilter === "all" || orgStatus === statusFilter;
      return matchSearch && matchType && matchStatus;
    });
  }, [search, typeFilter, statusFilter, statuses]);

  function handleToggleStatus(org: Organization) {
    const current = statuses[org.id] ?? "active";
    const next = current === "active" ? "inactive" : "active";
    toggle(org.id);
    toast.success(`已${next === "inactive" ? "停用" : "启用"}组织 ${org.name}`);
  }

  function handleDelete(org: Organization) {
    setDeleteTarget(org);
    setDeleteOpen(true);
  }

  function confirmDelete() {
    if (deleteTarget) {
      toast.success(`已删除组织 ${deleteTarget.name}`);
    }
    setDeleteOpen(false);
    setDeleteTarget(null);
  }

  function handleArchive(org: Organization) {
    setArchiveTarget(org);
    setArchiveConfirmName("");
    setArchiveOpen(true);
  }

  function confirmArchive() {
    if (archiveTarget) {
      archive(archiveTarget.id);
      toast.success("组织已注销");
    }
    setArchiveOpen(false);
    setArchiveTarget(null);
    setArchiveConfirmName("");
  }

  return (
    <div className="space-y-4">
      <PageHeader title="组织管理" description="管理平台所有组织">
        <Button size="sm" onClick={() => router.push("/admin/organizations/new")}>
          <Plus className="size-3.5 mr-1.5" />
          新建组织
        </Button>
      </PageHeader>

      <Card>
        <CardContent className="p-4">
          {/* 筛选搜索区 */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索组织名称或联系人..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <Select
                value={typeFilter}
                onValueChange={(v) => setTypeFilter(v as OrgTypeFilter)}
              >
                <SelectTrigger className="h-8 w-[120px]">
                  <SelectValue placeholder="组织类型" />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as OrgStatusFilter)}
              >
                <SelectTrigger className="h-8 w-[120px]">
                  <SelectValue placeholder="状态" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 表格 */}
          <div className="mt-4 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px]">系统名称</TableHead>
                  <TableHead>组织名称</TableHead>
                  <TableHead className="w-[90px]">组织简称</TableHead>
                  <TableHead className="w-[90px]">组织类型</TableHead>
                  <TableHead className="w-[90px]">主要联系人</TableHead>
                  <TableHead className="w-[120px]">联系人电话</TableHead>
                  <TableHead className="w-[80px]">状态</TableHead>
                  <TableHead className="w-[110px]">创建时间</TableHead>
                  <TableHead className="w-[60px] text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrgs.map((org) => {
                  const orgStatus = statuses[org.id] ?? "active";
                  return (
                    <TableRow key={org.id} className="group">
                      <TableCell
                        className="text-sm text-muted-foreground max-w-[140px] truncate"
                        title={org.systemName || "-"}
                      >
                        {org.systemName || "-"}
                      </TableCell>
                      <TableCell className="font-medium text-sm">{org.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {org.shortName || "-"}
                      </TableCell>
                      <TableCell>
                        <OrgTypeBadge type={org.teamType} />
                      </TableCell>
                      <TableCell className="text-sm">{org.contactPerson || "-"}</TableCell>
                      <TableCell className="text-sm">{org.contactPhone || "-"}</TableCell>
                      <TableCell>
                        <OrgStatusBadge status={orgStatus} />
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(org.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-muted-foreground hover:text-foreground"
                          onClick={() => {
                            setSelectedOrg(org);
                            setDetailOpen(true);
                          }}
                        >
                          <Eye className="size-3.5" />
                          <span className="ml-1">查看</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredOrgs.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center py-8 text-muted-foreground text-sm"
                    >
                      未找到匹配的组织
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              共 {filteredOrgs.length} 条记录
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="xs" disabled>
                上一页
              </Button>
              <Button variant="outline" size="xs" className="bg-primary text-primary-foreground">
                1
              </Button>
              <Button variant="outline" size="xs" disabled>
                下一页
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 删除确认 Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-amber-500" />
              确认删除
            </DialogTitle>
            <DialogDescription>
              确定要删除该组织吗？删除后不可恢复。仅允许删除无关联工作组的组织。
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            组织名称：<strong className="text-foreground">{deleteTarget?.name}</strong>
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 注销多重确认 Dialog */}
      <Dialog open={archiveOpen} onOpenChange={setArchiveOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="size-5 text-red-500" />
              注销组织
            </DialogTitle>
            <DialogDescription>
              注销将清除该组织所有数据，此操作不可恢复！
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5 py-1">
            <p className="text-sm text-muted-foreground">
              请输入组织名称{" "}
              <strong className="text-foreground">{archiveTarget?.name}</strong>{" "}
              以确认注销。
            </p>
            <Input
              placeholder="请输入组织名称以确认注销"
              value={archiveConfirmName}
              onChange={(e) => setArchiveConfirmName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setArchiveOpen(false);
                setArchiveConfirmName("");
              }}
            >
              取消
            </Button>
            <Button
              variant="destructive"
              disabled={archiveConfirmName !== archiveTarget?.name}
              onClick={confirmArchive}
            >
              确认注销
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 组织详情弹窗 */}
      {selectedOrg && (
        <DetailDialog open={detailOpen} onOpenChange={setDetailOpen}>
          <DetailDialogContent className="max-w-[900px]">
            <DetailDialogHeader
              title="组织详情"
              description={selectedOrg.name}
            />
            <DetailDialogBody scrollable>
              <div className="space-y-6">
                {/* 基本信息 */}
                <div>
                  <p className="text-sm font-medium mb-3">基本信息</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Building2 className="size-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">系统名称</p>
                        <p className="text-sm font-medium">{selectedOrg.systemName || "-"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Building2 className="size-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">组织简称</p>
                        <p className="text-sm">{selectedOrg.shortName || "-"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <User className="size-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">主要联系人</p>
                        <p className="text-sm">{selectedOrg.contactPerson || "-"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Phone className="size-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">联系电话</p>
                        <p className="text-sm">{selectedOrg.contactPhone || "-"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* 组织信息 */}
                <div>
                  <p className="text-sm font-medium mb-3">组织信息</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">组织类型</p>
                      <OrgTypeBadge type={selectedOrg.teamType} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">状态</p>
                      <OrgStatusBadge status={statuses[selectedOrg.id] || "active"} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">创建时间</p>
                      <p className="text-sm">{formatDate(selectedOrg.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </DetailDialogBody>
            <DetailDialogFooter>
              <Button variant="outline" onClick={() => toast.info("编辑组织")}>编辑</Button>
              <Button variant="outline" onClick={() => toggle(selectedOrg.id)}>
                {statuses[selectedOrg.id] === "active" ? "停用" : "启用"}
              </Button>
              <Button variant="destructive" onClick={() => handleDelete(selectedOrg)}>删除</Button>
              <Button variant="outline" onClick={() => setDetailOpen(false)}>关闭</Button>
            </DetailDialogFooter>
          </DetailDialogContent>
        </DetailDialog>
      )}
    </div>
  );
}
