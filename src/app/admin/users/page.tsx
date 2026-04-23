"use client";

import { useState, useMemo } from "react";
import { PageHeader, ListToolbar } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MOCK_USERS } from "@/lib/mock-data";
import type { User, PaidTier, UserStatus } from "@/lib/types";
import {
  Eye, Edit, Trash2, MoreHorizontal, Plus, Ban, CheckCircle,
  AlertTriangle, Search, Mail, Phone, Calendar, Shield,
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

const STATUS_OPTIONS: { value: UserStatus | "all"; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "active", label: "正常" },
  { value: "disabled", label: "已限制" },
];

const TIER_OPTIONS: { value: PaidTier | "all"; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "free", label: "免费" },
  { value: "standard", label: "标准" },
  { value: "premium", label: "高级" },
];

function PaidTierBadge({ tier }: { tier?: PaidTier }) {
  if (!tier) return <Badge variant="secondary">免费</Badge>;
  const styles: Record<PaidTier, string> = {
    free: "bg-secondary text-secondary-foreground",
    standard: "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20",
    premium: "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20",
  };
  const labels: Record<PaidTier, string> = {
    free: "免费",
    standard: "标准",
    premium: "高级",
  };
  return <Badge className={styles[tier]}>{labels[tier]}</Badge>;
}

function UserStatusBadge({ status }: { status: UserStatus }) {
  if (status === "active") {
    return (
      <Badge variant="outline" className="border-green-500/30 text-green-600 bg-green-500/10">
        正常
      </Badge>
    );
  }
  if (status === "disabled") {
    return (
      <Badge variant="outline" className="border-red-500/30 text-red-600 bg-red-500/10">
        已限制
      </Badge>
    );
  }
  return <Badge variant="secondary">待审核</Badge>;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("zh-CN");
}

function truncateId(id: string) {
  return id.slice(0, 8) + "...";
}

interface NewUserForm {
  username: string;
  phone: string;
  password: string;
  realName: string;
  paidTier: PaidTier;
  gender: "male" | "female" | "unknown";
}

function validateNewUser(form: NewUserForm): string | null {
  if (!/^[a-zA-Z][a-zA-Z0-9_]{3,19}$/.test(form.username)) {
    return "用户账号需4-20字符，字母开头，仅含字母数字下划线";
  }
  if (!/^1\d{10}$/.test(form.phone)) {
    return "手机号需为11位数字";
  }
  if (!/^(?=.*[a-zA-Z])(?=.*\d).{6,20}$/.test(form.password)) {
    return "密码需6-20位，同时包含字母和数字";
  }
  if (form.realName.length < 2 || form.realName.length > 20) {
    return "姓名需2-20字符";
  }
  return null;
}

export default function UsersListPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all");
  const [tierFilter, setTierFilter] = useState<PaidTier | "all">("all");

  // 详情弹窗
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // 删除确认
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // 新建用户
  const [createOpen, setCreateOpen] = useState(false);
  const [newUser, setNewUser] = useState<NewUserForm>({
    username: "",
    phone: "",
    password: "",
    realName: "",
    paidTier: "free",
    gender: "unknown",
  });

  const filteredUsers = useMemo(() => {
    return MOCK_USERS.filter((u) => {
      const matchSearch =
        !search ||
        u.realName.includes(search) ||
        u.phone.includes(search) ||
        u.username.includes(search);
      const matchStatus = statusFilter === "all" || u.status === statusFilter;
      const matchTier = tierFilter === "all" || u.paidTier === tierFilter;
      return matchSearch && matchStatus && matchTier;
    });
  }, [search, statusFilter, tierFilter]);

  function handleToggleStatus(user: User) {
    const newStatus = user.status === "active" ? "disabled" : "active";
    const action = newStatus === "disabled" ? "限制" : "解除限制";
    toast.success(`已${action}用户 ${user.realName} 的登录权限`);
  }

  function handleDelete(user: User) {
    setDeleteTarget(user);
    setDeleteOpen(true);
  }

  function confirmDelete() {
    if (deleteTarget) {
      toast.success(`已删除用户 ${deleteTarget.realName}`);
    }
    setDeleteOpen(false);
    setDeleteTarget(null);
  }

  function handleCreate() {
    const error = validateNewUser(newUser);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success("用户创建成功");
    setCreateOpen(false);
    setNewUser({
      username: "",
      phone: "",
      password: "",
      realName: "",
      paidTier: "free",
      gender: "unknown",
    });
  }

  return (
    <div className="space-y-4">
      <PageHeader title="用户管理">
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger
            render={
              <Button size="sm">
                <Plus className="size-3.5 mr-1.5" />
                新建用户
              </Button>
            }
          />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>新建用户</DialogTitle>
              <DialogDescription>填写以下信息创建新用户账号</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="username">
                  用户账号 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="username"
                  placeholder="4-20字符，字母开头"
                  value={newUser.username}
                  onChange={(e) => setNewUser((s) => ({ ...s, username: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">
                  手机号 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  placeholder="11位手机号"
                  value={newUser.phone}
                  onChange={(e) => setNewUser((s) => ({ ...s, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">
                  初始密码 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="6-20位，包含字母和数字"
                  value={newUser.password}
                  onChange={(e) => setNewUser((s) => ({ ...s, password: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="realName">
                  姓名 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="realName"
                  placeholder="2-20字符"
                  value={newUser.realName}
                  onChange={(e) => setNewUser((s) => ({ ...s, realName: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="paidTier">付费等级</Label>
                  <Select
                    value={newUser.paidTier}
                    onValueChange={(v) => setNewUser((s) => ({ ...s, paidTier: v as PaidTier }))}
                  >
                    <SelectTrigger id="paidTier">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">免费</SelectItem>
                      <SelectItem value="standard">标准</SelectItem>
                      <SelectItem value="premium">高级</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="gender">性别</Label>
                  <Select
                    value={newUser.gender}
                    onValueChange={(v) => setNewUser((s) => ({ ...s, gender: v as NewUserForm["gender"] }))}
                  >
                    <SelectTrigger id="gender">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">男</SelectItem>
                      <SelectItem value="female">女</SelectItem>
                      <SelectItem value="unknown">保密</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateOpen(false)}>
                取消
              </Button>
              <Button onClick={handleCreate}>创建</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索姓名、手机号或账号..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as UserStatus | "all")}
              >
                <SelectTrigger className="h-8 w-[120px]">
                  <SelectValue placeholder="账号状态" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={tierFilter}
                onValueChange={(v) => setTierFilter(v as PaidTier | "all")}
              >
                <SelectTrigger className="h-8 w-[120px]">
                  <SelectValue placeholder="付费等级" />
                </SelectTrigger>
                <SelectContent>
                  {TIER_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[110px]">用户ID</TableHead>
                  <TableHead>用户账号</TableHead>
                  <TableHead>手机号</TableHead>
                  <TableHead>姓名</TableHead>
                  <TableHead className="w-[90px]">付费等级</TableHead>
                  <TableHead className="w-[110px]">注册时间</TableHead>
                  <TableHead className="w-[90px]">账号状态</TableHead>
                  <TableHead className="w-[60px] text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="group">
                    <TableCell className="text-xs text-muted-foreground font-mono" title={user.id}>
                      {truncateId(user.id)}
                    </TableCell>
                    <TableCell className="font-medium text-sm">{user.username}</TableCell>
                    <TableCell className="text-sm">{user.phone}</TableCell>
                    <TableCell className="text-sm">{user.realName}</TableCell>
                    <TableCell>
                      <PaidTierBadge tier={user.paidTier} />
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell>
                      <UserStatusBadge status={user.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          setSelectedUser(user);
                          setDetailOpen(true);
                        }}
                      >
                        <Eye className="size-3.5" />
                        <span className="ml-1">查看</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground text-sm">
                      未找到匹配的用户
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              共 {filteredUsers.length} 条记录
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
              确定要删除用户 <strong>{deleteTarget?.realName}</strong> 吗？此操作不可恢复。
            </DialogDescription>
          </DialogHeader>
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

      {/* 用户详情弹窗 */}
      {selectedUser && (
        <DetailDialog open={detailOpen} onOpenChange={setDetailOpen}>
          <DetailDialogContent className="max-w-[900px]">
            <DetailDialogHeader
              title="用户详情"
              description={`账号：${selectedUser.username}`}
            />
            <DetailDialogBody scrollable>
              <div className="space-y-6">
                {/* 基本信息 */}
                <div>
                  <p className="text-sm font-medium mb-3">基本信息</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Shield className="size-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">用户ID</p>
                        <p className="text-sm font-mono">{selectedUser.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Phone className="size-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">手机号</p>
                        <p className="text-sm font-medium">{selectedUser.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Mail className="size-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">邮箱</p>
                        <p className="text-sm">{selectedUser.email || "未设置"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Calendar className="size-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">注册时间</p>
                        <p className="text-sm">{formatDate(selectedUser.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* 账号信息 */}
                <div>
                  <p className="text-sm font-medium mb-3">账号信息</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">付费等级</p>
                      <PaidTierBadge tier={selectedUser.paidTier} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">账号状态</p>
                      <UserStatusBadge status={selectedUser.status} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">最后登录</p>
                      <p className="text-sm">{formatDate(selectedUser.lastLoginAt || selectedUser.createdAt)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">平台角色</p>
                      <Badge variant="outline">{selectedUser.platformRole === "super_admin" ? "超级管理员" : selectedUser.platformRole === "org_admin" ? "机构管理员" : "普通用户"}</Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">性别</p>
                      <p className="text-sm">
                        {selectedUser.gender === "male" ? "男" : selectedUser.gender === "female" ? "女" : "未知"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">所属城市</p>
                      <p className="text-sm">{selectedUser.cityName || "-"}</p>
                    </div>
                  </div>
                </div>

                {selectedUser.certNo && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium mb-3">资质信息</p>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Shield className="size-5 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">资质编号</p>
                          <p className="text-sm font-mono">{selectedUser.certNo}</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </DetailDialogBody>
            <DetailDialogFooter>
              <Button variant="outline" onClick={() => handleToggleStatus(selectedUser)}>
                {selectedUser.status === "active" ? "限制登录" : "解除限制"}
              </Button>
              <Button variant="destructive" onClick={() => handleDelete(selectedUser)}>删除</Button>
              <Button variant="outline" onClick={() => setDetailOpen(false)}>关闭</Button>
            </DetailDialogFooter>
          </DetailDialogContent>
        </DetailDialog>
      )}
    </div>
  );
}
