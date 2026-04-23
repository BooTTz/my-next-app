"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Users,
  Briefcase,
  Clock,
  ChevronRight,
  Check,
  Pencil,
  Camera,
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  BadgeCheck,
  AlertCircle,
  FileText,
  ClipboardList,
  Plus,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppStore } from "@/lib/store";
import {
  MOCK_ORGANIZATIONS,
  MOCK_MEMBERS,
  MOCK_TEAMS,
  MOCK_TEAM_WORKSPACES,
} from "@/lib/mock-data";
import type { User as UserType, Gender, Organization, Workspace } from "@/lib/types";
import { useHydrated } from "@/hooks/useHydrated";

// 性别选项
const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: "male", label: "男" },
  { value: "female", label: "女" },
  { value: "unknown", label: "保密" },
];

// 城市选项
const CITY_OPTIONS = [
  "北京市",
  "上海市",
  "杭州市",
  "深圳市",
  "广州市",
  "成都市",
  "杭州市",
  "南京市",
  "武汉市",
  "西安市",
];

// 待办类型映射
const TODO_TYPE_MAP = {
  task: { label: "任务", icon: ClipboardList, color: "text-blue-500" },
  hazard: { label: "隐患", icon: AlertCircle, color: "text-orange-500" },
  report: { label: "报告", icon: FileText, color: "text-purple-500" },
  rectification: { label: "整改", icon: Check, color: "text-green-500" },
};

function formatDate(dateStr?: string): string {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function genderLabel(g?: Gender): string {
  return GENDER_OPTIONS.find((o) => o.value === g)?.label ?? "-";
}

export default function ProfilePage() {
  const router = useRouter();
  const {
    currentUser,
    currentOrganization,
    setCurrentOrganization,
    workspaces,
    currentWorkspace,
    switchWorkspace,
    lastWorkspaceId,
    userTodos,
    userStats,
    updateTodo,
    updateCurrentUser,
  } = useAppStore();
  const hydrated = useHydrated();

  // 编辑弹窗状态
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<UserType>>({});

  // 获取用户所属组织
  const userOrganizations = useMemo(() => {
    if (!currentUser) return [];
    const memberTeamIds = new Set(
      MOCK_MEMBERS.filter((m) => m.userId === currentUser.id).map((m) => m.teamId)
    );
    const creatorTeamIds = new Set(
      MOCK_TEAMS.filter((t) => t.creatorId === currentUser.id).map((t) => t.id)
    );
    const allTeamIds = new Set([...memberTeamIds, ...creatorTeamIds]);
    return MOCK_ORGANIZATIONS.filter((o) => allTeamIds.has(o.id));
  }, [currentUser]);

  // 获取当前组织的所有工作组
  const organizationWorkspaces = useMemo(() => {
    if (!currentOrganization) return workspaces;
    const workspaceIds = MOCK_TEAM_WORKSPACES
      .filter((tw) => tw.teamId === currentOrganization.id)
      .map((tw) => tw.workspaceId);
    return workspaces.filter((ws) => workspaceIds.includes(ws.id));
  }, [currentOrganization, workspaces]);

  // 打开编辑弹窗
  const handleOpenEditDialog = () => {
    if (!currentUser) return;
    setEditForm({
      realName: currentUser.realName,
      gender: currentUser.gender,
      cityName: currentUser.cityName,
      birthDate: currentUser.birthDate,
      phone: currentUser.phone,
      email: currentUser.email,
    });
    setEditDialogOpen(true);
  };

  // 保存编辑
  const handleSaveEdit = () => {
    updateCurrentUser(editForm);
    toast.success("保存成功");
    setEditDialogOpen(false);
  };

  // 切换组织
  const handleSwitchOrganization = (org: Organization) => {
    setCurrentOrganization(org as Organization);
    toast.success(`已切换至 ${org.name}`);
  };

  // 切换工作组
  const handleSwitchWorkspace = (ws: Workspace) => {
    const targetTeamId = currentOrganization?.id || "t1";
    switchWorkspace(ws);
    router.push(`/team/${targetTeamId}/dashboard`);
  };

  // 完成待办
  const handleCompleteTodo = (todoId: string) => {
    updateTodo(todoId, "completed");
    toast.success("待办已完成");
  };

  if (!hydrated) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!currentUser) {
    router.push("/login");
    return null;
  }

  return (
    <div className="h-full flex flex-col lg:flex-row gap-4 p-4 lg:p-6">
      {/* 左侧区域：组织 + 工作组 + 待办 */}
      <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4">
        {/* 组织选择 */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="size-4" />
                我的组织
              </CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center gap-1.5 h-8 px-3 text-sm font-medium transition-colors border border-transparent rounded-md hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                  切换
                  <ChevronRight className="size-3" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {userOrganizations.map((org) => (
                    <DropdownMenuItem
                      key={org.id}
                      onClick={() => handleSwitchOrganization(org)}
                      className="flex items-center justify-between"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{org.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {org.teamType === "supervisor" && "监管部门"}
                          {org.teamType === "inspector" && "服务机构"}
                          {org.teamType === "enterprise" && "企业单位"}
                        </span>
                      </div>
                      {currentOrganization?.id === org.id && (
                        <Badge variant="secondary" className="ml-2">当前</Badge>
                      )}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-primary">
                    <Plus className="size-4 mr-2" />
                    加入新组织
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-primary">
                    <Building2 className="size-4 mr-2" />
                    创建新组织
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {currentOrganization ? (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="size-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{currentOrganization.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {currentOrganization.teamType === "supervisor" && "监管部门"}
                    {currentOrganization.teamType === "inspector" && "服务机构"}
                    {currentOrganization.teamType === "enterprise" && "企业单位"}
                    {" · "}{currentOrganization.region}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                <Building2 className="size-10 mb-2 opacity-50" />
                <p className="text-sm">暂未加入任何组织</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 工作组列表 */}
        <Card className="flex-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Briefcase className="size-4" />
              工作组
              <Badge variant="secondary" className="ml-auto">
                {organizationWorkspaces.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {organizationWorkspaces.length > 0 ? (
              <div className="space-y-2">
                {organizationWorkspaces.map((ws) => {
                  const isLastWorkspace = ws.id === lastWorkspaceId;
                  const isSelected = ws.id === currentWorkspace?.id;
                  return (
                    <button
                      key={ws.id}
                      onClick={() => handleSwitchWorkspace(ws)}
                      className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-transparent hover:bg-muted/50 hover:border-border"
                      } ${isLastWorkspace && !isSelected ? "bg-muted/30" : ""}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm truncate">{ws.name}</p>
                            {isLastWorkspace && (
                              <Badge variant="outline" className="text-[10px] h-4 px-1 bg-orange-50 text-orange-600 border-orange-200">
                                上次
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{ws.region}</p>
                        </div>
                        <ArrowRight className={`size-4 shrink-0 transition-transform ${
                          isSelected ? "text-primary translate-x-1" : "text-muted-foreground"
                        }`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                <Briefcase className="size-8 mb-2 opacity-50" />
                <p className="text-sm">暂无工作组</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 右侧区域 */}
      <div className="flex-1 min-w-0 flex flex-col gap-4">
        {/* 统计信息 */}
        <div className="grid grid-cols-3 gap-4">
          {/* 我的团队 */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Users className="size-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{userStats.teamCount}</p>
                  <p className="text-xs text-muted-foreground">我的团队</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 工作组 */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Briefcase className="size-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{userStats.workspaceCount}</p>
                  <p className="text-xs text-muted-foreground">工作组</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 待处理 */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <AlertCircle className="size-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{userStats.pendingCount}</p>
                  <p className="text-xs text-muted-foreground">待处理</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 用户信息卡片 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="size-4" />
                个人基本信息
              </CardTitle>
              <Button variant="outline" size="sm" onClick={handleOpenEditDialog}>
                <Pencil className="size-3.5 mr-1.5" />
                编辑
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              {/* 头像 */}
              <div className="flex flex-col items-center gap-3">
                <Avatar className="w-24 h-24">
                  <AvatarFallback className="bg-primary/10 text-primary text-3xl">
                    {currentUser.realName?.charAt(0) ?? "?"}
                  </AvatarFallback>
                </Avatar>
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <Camera className="size-3.5" />
                  修改头像
                </Button>
              </div>

              {/* 信息字段 */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 姓名 */}
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1">
                    <User className="size-3" />
                    姓名
                  </Label>
                  <p className="text-sm font-medium">{currentUser.realName}</p>
                </div>

                {/* 性别 */}
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">性别</Label>
                  <p className="text-sm font-medium">{genderLabel(currentUser.gender)}</p>
                </div>

                {/* 手机号 */}
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1">
                    <Phone className="size-3" />
                    手机号
                  </Label>
                  <p className="text-sm font-medium">{currentUser.phone}</p>
                </div>

                {/* 邮箱 */}
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1">
                    <Mail className="size-3" />
                    邮箱
                  </Label>
                  <p className="text-sm font-medium">{currentUser.email || "-"}</p>
                </div>

                {/* 所在城市 */}
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="size-3" />
                    所在城市
                  </Label>
                  <p className="text-sm font-medium">{currentUser.cityName || "-"}</p>
                </div>

                {/* 出生日期 */}
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="size-3" />
                    出生日期
                  </Label>
                  <p className="text-sm font-medium">{currentUser.birthDate || "-"}</p>
                </div>

                {/* 注册时间 */}
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1">
                    <BadgeCheck className="size-3" />
                    注册时间
                  </Label>
                  <p className="text-sm font-medium">{formatDate(currentUser.createdAt)}</p>
                </div>

                {/* 用户ID */}
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">用户ID</Label>
                  <p className="text-sm font-medium text-muted-foreground">{currentUser.id}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 我的待办 */}
        <Card className="max-h-80">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="size-4" />
              我的待办
              <Badge variant="destructive" className="ml-auto">
                {userTodos.filter((t) => t.status === "pending").length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ScrollArea className="h-48 pr-3">
              <div className="space-y-2">
                {userTodos
                  .filter((t) => t.status === "pending")
                  .map((todo) => {
                    const typeInfo = TODO_TYPE_MAP[todo.type];
                    const TodoIcon = typeInfo.icon;
                    return (
                      <div
                        key={todo.id}
                        className="p-3 rounded-lg border bg-background hover:bg-muted/30 transition-colors group"
                      >
                        <div className="flex items-start gap-2">
                          <div className={`mt-0.5 ${typeInfo.color}`}>
                            <TodoIcon className="size-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium truncate">{todo.title}</p>
                              <Badge variant="outline" className="text-[10px] h-4 shrink-0">
                                {typeInfo.label}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                              {todo.description}
                            </p>
                            {todo.deadline && (
                              <p className="text-xs text-orange-500 mt-1">
                                截止：{todo.deadline}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                            onClick={() => handleCompleteTodo(todo.id)}
                          >
                            <Check className="size-3.5" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                {userTodos.filter((t) => t.status === "pending").length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <Check className="size-8 mb-2 opacity-50 text-green-500" />
                    <p className="text-sm">暂无待办事项</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* 编辑个人信息弹窗 */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>编辑个人信息</DialogTitle>
            <DialogDescription>
              修改您的个人基本信息
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* 姓名 */}
            <div className="space-y-1.5">
              <Label className="text-xs">姓名</Label>
              <Input
                value={editForm.realName ?? ""}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, realName: e.target.value }))
                }
                placeholder="请输入姓名"
              />
            </div>

            {/* 性别 */}
            <div className="space-y-1.5">
              <Label className="text-xs">性别</Label>
              <Select
                value={editForm.gender ?? "unknown"}
                onValueChange={(v) =>
                  setEditForm((prev) => ({ ...prev, gender: v as Gender }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GENDER_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 手机号 */}
            <div className="space-y-1.5">
              <Label className="text-xs">手机号</Label>
              <Input
                value={editForm.phone ?? ""}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, phone: e.target.value }))
                }
                placeholder="请输入手机号"
              />
            </div>

            {/* 邮箱 */}
            <div className="space-y-1.5">
              <Label className="text-xs">邮箱</Label>
              <Input
                type="email"
                value={editForm.email ?? ""}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="请输入邮箱"
              />
            </div>

            {/* 所在城市 */}
            <div className="space-y-1.5">
              <Label className="text-xs">所在城市</Label>
              <Select
                value={editForm.cityName ?? ""}
                onValueChange={(v) =>
                  setEditForm((prev) => ({ ...prev, cityName: v || undefined }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择城市" />
                </SelectTrigger>
                <SelectContent>
                  {CITY_OPTIONS.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 出生日期 */}
            <div className="space-y-1.5">
              <Label className="text-xs">出生日期</Label>
              <Input
                type="date"
                value={editForm.birthDate ?? ""}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, birthDate: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSaveEdit}>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
