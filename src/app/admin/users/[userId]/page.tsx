"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import OrganizationCard from "@/components/shared/OrganizationCard";
import { MOCK_USERS, MOCK_MEMBERS, MOCK_ORGANIZATIONS } from "@/lib/mock-data";
import type { User, PaidTier, Gender } from "@/lib/types";
import {
  ArrowLeft, Pencil, Camera, Save, X, Smartphone, KeyRound, Ban,
} from "lucide-react";
import { toast } from "sonner";

const CITIES = [
  { code: "330100", name: "浙江省杭州市" },
  { code: "370100", name: "山东省济南市" },
  { code: "310000", name: "上海市" },
  { code: "440100", name: "广东省广州市" },
  { code: "110000", name: "北京市" },
];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("zh-CN");
}

function PaidTierBadge({ tier }: { tier?: PaidTier }) {
  if (!tier) return <Badge variant="secondary">免费</Badge>;
  const labels: Record<PaidTier, string> = {
    free: "免费",
    standard: "标准",
    premium: "高级",
  };
  const styles: Record<PaidTier, string> = {
    free: "bg-secondary text-secondary-foreground",
    standard: "bg-blue-500/10 text-blue-600",
    premium: "bg-amber-500/10 text-amber-600",
  };
  return <Badge className={styles[tier]}>{labels[tier]}</Badge>;
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;

  const user = useMemo(() => MOCK_USERS.find((u) => u.id === userId), [userId]);

  // 编辑模式
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<User>>({});

  // 手机号修改 Dialog
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [newPhone, setNewPhone] = useState("");

  // 重置密码 Dialog
  const [pwdOpen, setPwdOpen] = useState(false);
  const [newPwd, setNewPwd] = useState("");

  // 限制登录 Switch
  const [restricted, setRestricted] = useState(user?.status === "disabled");

  // 关联组织
  const relatedOrgs = useMemo(() => {
    if (!user) return [];
    const memberTeams = MOCK_MEMBERS.filter((m) => m.userId === user.id).map((m) => m.teamId);
    return MOCK_ORGANIZATIONS.filter((o) => memberTeams.includes(o.id));
  }, [user]);

  if (!user) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.push("/admin/users")}>
            <ArrowLeft className="size-4 mr-1" /> 返回
          </Button>
        </div>
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            用户不存在或已被删除
          </CardContent>
        </Card>
      </div>
    );
  }

  function startEdit() {
    if (!user) return;
    setEditForm({
      realName: user.realName,
      gender: user.gender,
      paidTier: user.paidTier,
      cityCode: user.cityCode,
      cityName: user.cityName,
      birthDate: user.birthDate,
    });
    setIsEditing(true);
  }

  function cancelEdit() {
    setIsEditing(false);
    setEditForm({});
  }

  function saveEdit() {
    toast.success("用户信息已保存");
    setIsEditing(false);
  }

  function handlePhoneChange() {
    if (!/^1\d{10}$/.test(newPhone)) {
      toast.error("手机号需为11位数字");
      return;
    }
    toast.success("手机号修改成功");
    setPhoneOpen(false);
    setNewPhone("");
  }

  function handlePwdReset() {
    if (!/^(?=.*[a-zA-Z])(?=.*\d).{6,20}$/.test(newPwd)) {
      toast.error("密码需6-20位，同时包含字母和数字");
      return;
    }
    toast.success("密码重置成功");
    setPwdOpen(false);
    setNewPwd("");
  }

  function handleToggleRestriction(checked: boolean) {
    setRestricted(checked);
    if (checked) {
      toast.success("已限制该用户登录");
    } else {
      toast.success("已解除登录限制");
    }
  }

  const displayCity = CITIES.find((c) => c.code === (editForm.cityCode || user.cityCode))?.name || "未设置";

  return (
    <div className="space-y-4 max-w-5xl">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => router.push("/admin/users")}>
            <ArrowLeft className="size-4 mr-1" /> 返回
          </Button>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">用户详情</h1>
            <p className="text-sm text-muted-foreground">{user.realName}（{user.username}）</p>
          </div>
        </div>
      </div>

      {/* 账户信息区（只读） */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">账户信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <Label className="text-muted-foreground text-xs">用户ID</Label>
              <p className="text-sm font-mono mt-0.5">{user.id}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">用户账号</Label>
              <p className="text-sm font-medium mt-0.5">{user.username}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">手机号</Label>
              <p className="text-sm mt-0.5">{user.phone}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">注册时间</Label>
              <p className="text-sm mt-0.5">{formatDate(user.createdAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 基本信息区（可编辑） */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base">基本信息</CardTitle>
          {!isEditing ? (
            <Button variant="ghost" size="sm" onClick={startEdit}>
              <Pencil className="size-3.5 mr-1.5" /> 编辑
            </Button>
          ) : (
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="sm" onClick={cancelEdit}>
                <X className="size-3.5 mr-1.5" /> 取消
              </Button>
              <Button size="sm" onClick={saveEdit}>
                <Save className="size-3.5 mr-1.5" /> 保存
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-6">
            {/* 头像 */}
            <div className="flex flex-col items-center gap-2">
              <Avatar className="size-20">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {user.realName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button variant="outline" size="xs">
                  <Camera className="size-3 mr-1" /> 修改头像
                </Button>
              )}
            </div>

            {/* 表单 */}
            <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-4">
              <div className="space-y-1.5">
                <Label>姓名</Label>
                {isEditing ? (
                  <Input
                    value={editForm.realName || ""}
                    onChange={(e) => setEditForm((s) => ({ ...s, realName: e.target.value }))}
                  />
                ) : (
                  <p className="text-sm py-2">{user.realName}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label>性别</Label>
                {isEditing ? (
                  <Select
                    value={editForm.gender || "unknown"}
                    onValueChange={(v) => setEditForm((s) => ({ ...s, gender: v as Gender }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">男</SelectItem>
                      <SelectItem value="female">女</SelectItem>
                      <SelectItem value="unknown">保密</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm py-2">
                    {user.gender === "male" ? "男" : user.gender === "female" ? "女" : "保密"}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label>付费等级</Label>
                {isEditing ? (
                  <Select
                    value={editForm.paidTier || "free"}
                    onValueChange={(v) => setEditForm((s) => ({ ...s, paidTier: v as PaidTier }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">免费</SelectItem>
                      <SelectItem value="standard">标准</SelectItem>
                      <SelectItem value="premium">高级</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="py-2">
                    <PaidTierBadge tier={user.paidTier} />
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <Label>所在城市</Label>
                {isEditing ? (
                  <Select
                    value={editForm.cityCode || ""}
                    onValueChange={(v) => {
                      const city = CITIES.find((c) => c.code === v);
                      setEditForm((s) => ({
                        ...s,
                        cityCode: v || undefined,
                        cityName: city?.name,
                      }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择城市" />
                    </SelectTrigger>
                    <SelectContent>
                      {CITIES.map((c) => (
                        <SelectItem key={c.code} value={c.code}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm py-2">{user.cityName || "未设置"}</p>
                )}
              </div>

              <div className="space-y-1.5 col-span-2">
                <Label>出生日期</Label>
                {isEditing ? (
                  <Input
                    type="date"
                    value={editForm.birthDate || ""}
                    onChange={(e) => setEditForm((s) => ({ ...s, birthDate: e.target.value }))}
                    className="max-w-xs"
                  />
                ) : (
                  <p className="text-sm py-2">{user.birthDate || "未设置"}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 关联组织区 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">关联组织</CardTitle>
        </CardHeader>
        <CardContent>
          {relatedOrgs.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {relatedOrgs.map((org) => (
                <OrganizationCard
                  key={org.id}
                  org={{
                    id: org.id,
                    name: org.name,
                    systemLogo: org.systemLogo,
                    teamType: org.teamType,
                  }}
                  size="md"
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-4 text-center">
              该用户未加入任何组织
            </p>
          )}
        </CardContent>
      </Card>

      {/* 管理功能区 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">账号管理</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 修改手机号 */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">修改手机号</div>
              <div className="text-xs text-muted-foreground">更换用户绑定的手机号码</div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setPhoneOpen(true)}>
              <Smartphone className="size-3.5 mr-1.5" /> 修改
            </Button>
          </div>
          <Separator />

          {/* 重置密码 */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">重置密码</div>
              <div className="text-xs text-muted-foreground">为用户生成新的登录密码</div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setPwdOpen(true)}>
              <KeyRound className="size-3.5 mr-1.5" /> 重置
            </Button>
          </div>
          <Separator />

          {/* 限制登录 */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium flex items-center gap-1.5">
                <Ban className="size-3.5" />
                限制登录
              </div>
              <div className="text-xs text-muted-foreground">
                开启后该用户将无法登录平台
              </div>
            </div>
            <Switch
              checked={restricted}
              onCheckedChange={handleToggleRestriction}
            />
          </div>
        </CardContent>
      </Card>

      {/* 修改手机号 Dialog */}
      <Dialog open={phoneOpen} onOpenChange={setPhoneOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>修改手机号</DialogTitle>
            <DialogDescription>
              当前手机号：{user.phone}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Label htmlFor="newPhone">新手机号</Label>
            <Input
              id="newPhone"
              placeholder="请输入11位手机号"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPhoneOpen(false)}>
              取消
            </Button>
            <Button onClick={handlePhoneChange}>确认修改</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 重置密码 Dialog */}
      <Dialog open={pwdOpen} onOpenChange={setPwdOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>重置密码</DialogTitle>
            <DialogDescription>
              为用户 {user.realName} 设置新的登录密码
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Label htmlFor="newPwd">新密码</Label>
            <Input
              id="newPwd"
              type="password"
              placeholder="6-20位，包含字母和数字"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPwdOpen(false)}>
              取消
            </Button>
            <Button onClick={handlePwdReset}>确认重置</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
