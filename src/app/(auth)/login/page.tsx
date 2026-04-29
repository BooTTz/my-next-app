"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Phone, Lock, Eye, EyeOff, ArrowRight, ClipboardCheck, Search, Wrench } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { MOCK_USERS, MOCK_ORGANIZATIONS } from "@/lib/mock-data";
import { useHydrated } from "@/hooks/useHydrated";
import type { User } from "@/lib/types";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAppStore();
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("13800001001");
  const [password, setPassword] = useState("123456");
  const hydrated = useHydrated();

  // 登录成功后根据角色跳转
  const handleLoginSuccess = (user: User) => {
    login(user);
    // 1. 超级管理员 → /admin/users
    if (user.platformRole === "super_admin") {
      router.push("/admin/users");
      return;
    }
    // 2. 查找用户关联的组织
    const userOrgs = MOCK_ORGANIZATIONS.filter(
      (org) => org.orgAdminUserId === user.id || org.creatorId === user.id
    );
    // 3. 已加入组织 → 工作台
    if (userOrgs.length > 0) {
      router.push(`/team/${userOrgs[0].id}/workspace`);
      return;
    }
    // 4. 未加入任何组织 → /profile
    router.push("/profile");
  };

  const handleLogin = () => {
    // 支持手机号登录
    let user = MOCK_USERS.find((u) => u.phone === phone);
    // 也支持用 username 登录（演示用）
    if (!user) {
      user = MOCK_USERS.find((u) => u.username === phone);
    }
    if (user) {
      handleLoginSuccess(user);
    }
  };

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen">
      {/* 左侧品牌区 */}
      <div className="hidden lg:flex lg:w-[55%] flex-col justify-between bg-primary p-12">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary-foreground/10">
            <Shield className="size-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-primary-foreground">工贸三方监管平台</span>
        </div>

        <div className="max-w-lg space-y-6">
          <h1 className="text-4xl font-bold leading-tight text-primary-foreground">
            安全检查协同管理
            <br />
            三方联动 高效监管
          </h1>
          <p className="text-lg leading-relaxed text-primary-foreground/70">
            为工贸企业安全生产检查提供从政府发布、服务机构执行、企业整改的全流程数字化管理平台，
            打通三方协作壁垒，提升安全监管效能。
          </p>
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { label: "监管部门", desc: "计划发布与验收", icon: ClipboardCheck, color: "role-supervisor" },
              { label: "服务机构", desc: "现场检查与报告", icon: Search, color: "role-inspector" },
              { label: "企业单位", desc: "隐患整改与反馈", icon: Wrench, color: "role-enterprise" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="rounded-lg bg-primary-foreground/5 p-4 backdrop-blur-sm border border-primary-foreground/10"
                >
                  <div className={`mb-2`}>
                    <Icon className={`size-6 text-${item.color}`} />
                  </div>
                  <p className="font-medium text-primary-foreground">{item.label}</p>
                  <p className="text-xs text-primary-foreground/60 mt-1">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-xs text-primary-foreground/40">
          © 2025 博兴县应急管理局 · 工贸三方监管平台
        </p>
      </div>

      {/* 右侧登录区 */}
      <div className="flex flex-1 items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* 移动端Logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <Shield className="size-6 text-primary" />
            <span className="text-lg font-semibold">工贸三方监管平台</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold">欢迎登录</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              请输入您的账号信息登录平台
            </p>
          </div>

          <Tabs defaultValue="password" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="password" className="flex-1">密码登录</TabsTrigger>
              <TabsTrigger value="sms" className="flex-1">验证码登录</TabsTrigger>
            </TabsList>

            <TabsContent value="password" className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">手机号</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="phone"
                    placeholder="请输入手机号"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="请输入密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="rounded border-input" defaultChecked />
                  记住登录
                </label>
                <a href="#" className="text-sm text-primary hover:underline">忘记密码？</a>
              </div>
              <Button className="w-full" size="lg" onClick={handleLogin}>
                登录
                <ArrowRight className="size-4 ml-1" />
              </Button>
            </TabsContent>

            <TabsContent value="sms" className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sms-phone">手机号</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="sms-phone" placeholder="请输入手机号" className="pl-9" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sms-code">验证码</Label>
                <div className="flex gap-2">
                  <Input id="sms-code" placeholder="请输入验证码" className="flex-1" />
                  <Button variant="outline" size="default" className="whitespace-nowrap">
                    获取验证码
                  </Button>
                </div>
              </div>
              <Button className="w-full" size="lg" onClick={handleLogin}>
                登录
                <ArrowRight className="size-4 ml-1" />
              </Button>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              还没有账号？{" "}
              <a href="/register" className="font-medium text-primary hover:underline">
                立即注册
              </a>
            </p>
          </div>

          {/* 快速登录提示 - 演示用 */}
          <Card className="mt-8">
            <CardHeader className="pb-2 pt-4 px-4">
              <p className="text-xs font-medium text-muted-foreground">演示账号（点击快速登录）</p>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-1.5">
              {[
                { name: "李伟 - 监管部门", phone: "13800001001" },
                { name: "张敏 - 服务机构", phone: "13800001002" },
                { name: "陈杰 - 企业单位", phone: "13800001004" },
                { name: "平台管理员", phone: "superadmin" },
              ].map((demo) => (
                <button
                  key={demo.phone}
                  onClick={() => {
                    setPhone(demo.phone);
                    const user = MOCK_USERS.find(
                      (u) => u.phone === demo.phone || u.username === demo.phone
                    );
                    if (user) {
                      handleLoginSuccess(user);
                    }
                  }}
                  className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
                >
                  <span>{demo.name}</span>
                  <span className="text-xs text-muted-foreground">{demo.phone}</span>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
