"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Pencil,
  Save,
  X,
  Smartphone,
  Lock,
  LogOut,
  Camera,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { useAppStore } from "@/lib/store";
import {
  MOCK_ORGANIZATIONS,
  MOCK_MEMBERS,
  MOCK_TEAMS,
} from "@/lib/mock-data";
import type { User, Gender, Organization } from "@/lib/types";
import { useHydrated } from "@/hooks/useHydrated";
import OrganizationCard from "@/components/shared/OrganizationCard";

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: "male", label: "男" },
  { value: "female", label: "女" },
  { value: "unknown", label: "保密" },
];

const CITY_OPTIONS = [
  "北京市",
  "上海市",
  "杭州市",
  "深圳市",
  "广州市",
  "成都市",
];

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
  const { currentUser, logout, switchTeam } = useAppStore();
  const hydrated = useHydrated();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<User>>({});

  const [phoneDialogOpen, setPhoneDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

  const [phoneForm, setPhoneForm] = useState({
    oldPhone: currentUser?.phone ?? "",
    verifyCode: "",
    newPhone: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

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

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!currentUser) {
    router.push("/login");
    return null;
  }

  const startEdit = () => {
    setEditForm({
      realName: currentUser.realName,
      gender: currentUser.gender,
      cityName: currentUser.cityName,
      birthDate: currentUser.birthDate,
    });
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditForm({});
  };

  const saveEdit = () => {
    // 实际应调用 API，这里仅模拟
    toast.success("保存成功");
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleOrgClick = (org: Organization) => {
    const team = MOCK_TEAMS.find((t) => t.id === org.id);
    if (team) {
      switchTeam(team);
      router.push(`/team/${team.id}/dashboard`);
    }
  };

  const handleChangePhone = () => {
    if (!phoneForm.verifyCode || !phoneForm.newPhone) {
      toast.error("请填写完整信息");
      return;
    }
    toast.success("手机号修改成功");
    setPhoneDialogOpen(false);
    setPhoneForm({
      oldPhone: currentUser?.phone ?? "",
      verifyCode: "",
      newPhone: "",
    });
  };

  const handleChangePassword = () => {
    const { oldPassword, newPassword, confirmPassword } = passwordForm;
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("请填写完整信息");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("两次输入的密码不一致");
      return;
    }
    if (newPassword.length < 6 || newPassword.length > 20) {
      toast.error("密码长度需在 6-20 位之间");
      return;
    }
    const hasLetter = /[a-zA-Z]/.test(newPassword);
    const hasNumber = /\d/.test(newPassword);
    if (!hasLetter || !hasNumber) {
      toast.error("密码需同时包含字母和数字");
      return;
    }
    toast.success("密码修改成功");
    setPasswordDialogOpen(false);
    setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <div className="space-y-6">
      {/* 页面标题区 */}
      <div>
        <h1 className="text-2xl font-bold">个人中心</h1>
        <p className="text-muted-foreground mt-1">
          管理您的个人信息和账户设置
        </p>
      </div>

      {/* 账户信息区（只读） */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">账户信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <Label className="text-muted-foreground text-xs">用户ID</Label>
              <p className="text-foreground font-medium mt-1">{currentUser.id}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">用户账号</Label>
              <p className="text-foreground font-medium mt-1">{currentUser.username}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">手机号</Label>
              <p className="text-foreground font-medium mt-1">{currentUser.phone}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">注册时间</Label>
              <p className="text-foreground font-medium mt-1">
                {formatDate(currentUser.createdAt)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 基本信息区（可编辑） */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">基本信息</CardTitle>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={startEdit}>
              <Pencil className="size-3.5 mr-1" />
              编辑
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-8">
            {/* 左侧：头像 */}
            <div className="flex flex-col items-center gap-3">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                  {currentUser.realName?.charAt(0) ?? "?"}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button variant="ghost" size="sm" className="gap-1">
                  <Camera className="size-3.5" />
                  修改头像
                </Button>
              )}
            </div>
            {/* 右侧：信息字段 */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Label className="text-muted-foreground text-xs">姓名</Label>
                {isEditing ? (
                  <Input
                    className="mt-1"
                    value={editForm.realName ?? ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, realName: e.target.value }))
                    }
                  />
                ) : (
                  <p className="text-foreground font-medium mt-1">
                    {currentUser.realName}
                  </p>
                )}
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">性别</Label>
                {isEditing ? (
                  <Select
                    value={editForm.gender ?? "unknown"}
                    onValueChange={(v) =>
                      setEditForm((prev) => ({ ...prev, gender: v as Gender }))
                    }
                  >
                    <SelectTrigger className="mt-1 w-full">
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
                ) : (
                  <p className="text-foreground font-medium mt-1">
                    {genderLabel(currentUser.gender)}
                  </p>
                )}
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">所在城市</Label>
                {isEditing ? (
                  <Select
                    value={editForm.cityName ?? ""}
                    onValueChange={(v) =>
                      setEditForm((prev) => ({ ...prev, cityName: v || undefined }))
                    }
                  >
                    <SelectTrigger className="mt-1 w-full">
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
                ) : (
                  <p className="text-foreground font-medium mt-1">
                    {currentUser.cityName ?? "-"}
                  </p>
                )}
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">出生日期</Label>
                {isEditing ? (
                  <Input
                    type="date"
                    className="mt-1"
                    value={editForm.birthDate ?? ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, birthDate: e.target.value }))
                    }
                  />
                ) : (
                  <p className="text-foreground font-medium mt-1">
                    {currentUser.birthDate ?? "-"}
                  </p>
                )}
              </div>
            </div>
          </div>
          {isEditing && (
            <div className="flex gap-3 mt-6 justify-end">
              <Button variant="outline" onClick={cancelEdit}>
                <X className="size-3.5 mr-1" />
                取消
              </Button>
              <Button onClick={saveEdit}>
                <Save className="size-3.5 mr-1" />
                保存
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 安全操作区 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">安全设置</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 修改手机号 */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Smartphone className="size-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">修改手机号</p>
                <p className="text-xs text-muted-foreground">
                  当前绑定手机号：{currentUser.phone}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPhoneDialogOpen(true)}
            >
              修改
            </Button>
          </div>
          <hr className="border-border" />
          {/* 修改密码 */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Lock className="size-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">修改密码</p>
                <p className="text-xs text-muted-foreground">
                  密码要求：6-20位，包含字母和数字
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPasswordDialogOpen(true)}
            >
              修改
            </Button>
          </div>
          <hr className="border-border" />
          {/* 退出登录 */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <LogOut className="size-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">退出登录</p>
                <p className="text-xs text-muted-foreground">
                  退出当前账号并返回首页
                </p>
              </div>
            </div>
            <Button variant="destructive" size="sm" onClick={handleLogout}>
              退出
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 关联组织区 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">我的组织</CardTitle>
        </CardHeader>
        <CardContent>
          {userOrganizations.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {userOrganizations.map((org) => (
                <OrganizationCard
                  key={org.id}
                  org={{
                    id: org.id,
                    name: org.name,
                    systemLogo: org.systemLogo,
                    teamType: org.teamType,
                  }}
                  onClick={() => handleOrgClick(org)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
              <Building2 className="size-10 mb-3 opacity-50" />
              <p className="text-sm">您尚未加入任何组织</p>
              <p className="text-xs mt-1">
                请联系您的组织管理员获取邀请
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 修改手机号 Dialog */}
      <Dialog open={phoneDialogOpen} onOpenChange={setPhoneDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>修改手机号</DialogTitle>
            <DialogDescription>
              验证原手机号后绑定新号码
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-xs">原手机号</Label>
              <Input
                className="mt-1"
                value={phoneForm.oldPhone}
                disabled
              />
            </div>
            <div>
              <Label className="text-xs">验证码</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  placeholder="请输入验证码"
                  value={phoneForm.verifyCode}
                  onChange={(e) =>
                    setPhoneForm((prev) => ({
                      ...prev,
                      verifyCode: e.target.value,
                    }))
                  }
                />
                <Button variant="outline" size="sm" className="shrink-0">
                  获取验证码
                </Button>
              </div>
            </div>
            <div>
              <Label className="text-xs">新手机号</Label>
              <Input
                className="mt-1"
                placeholder="请输入新手机号"
                value={phoneForm.newPhone}
                onChange={(e) =>
                  setPhoneForm((prev) => ({
                    ...prev,
                    newPhone: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPhoneDialogOpen(false)}
            >
              取消
            </Button>
            <Button size="sm" onClick={handleChangePhone}>
              确认
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 修改密码 Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>修改密码</DialogTitle>
            <DialogDescription>
              密码需为 6-20 位，同时包含字母和数字
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-xs">原密码</Label>
              <Input
                type="password"
                className="mt-1"
                placeholder="请输入原密码"
                value={passwordForm.oldPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    oldPassword: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label className="text-xs">新密码</Label>
              <Input
                type="password"
                className="mt-1"
                placeholder="请输入新密码"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label className="text-xs">确认密码</Label>
              <Input
                type="password"
                className="mt-1"
                placeholder="请再次输入新密码"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPasswordDialogOpen(false)}
            >
              取消
            </Button>
            <Button size="sm" onClick={handleChangePassword}>
              确认
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
