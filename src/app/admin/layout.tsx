"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { useHydrated } from "@/hooks/useHydrated";
import { useAppStore as useStore } from "@/lib/store";
import {
  Shield,
  Users,
  Building2,
  ChevronDown,
  LogOut,
  UserCircle,
  Settings,
  AlertTriangle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface NavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

function NavItem({ href, icon: Icon, label }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
        isActive
          ? "bg-primary/10 text-primary font-medium"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className="size-4" />
      <span>{label}</span>
    </Link>
  );
}

function AdminSidebar() {
  return (
    <aside className="w-56 border-r bg-card flex flex-col">
      {/* Logo 区 */}
      <div className="h-14 border-b flex items-center px-4 gap-2">
        <Shield className="h-6 w-6 text-primary" />
        <div>
          <div className="font-semibold text-sm">平台管理后台</div>
          <div className="text-xs text-muted-foreground">工贸三方监管平台</div>
        </div>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 p-3 space-y-1">
        <div className="text-xs font-medium text-muted-foreground px-3 py-2">
          平台用户管理
        </div>
        <NavItem href="/admin/users" icon={Users} label="用户管理" />
        <NavItem href="/admin/organizations" icon={Building2} label="组织管理" />
      </nav>

      {/* 底部：版本号 */}
      <div className="p-3 border-t text-xs text-muted-foreground text-center">
        v1.1.2
      </div>
    </aside>
  );
}

function AdminTopBar() {
  const { currentUser, logout } = useAppStore();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/");
  }

  if (!currentUser) return null;

  return (
    <header className="h-14 border-b bg-background flex items-center justify-between px-6">
      {/* 左侧：面包屑简化为静态文字 */}
      <div className="text-sm text-muted-foreground">
        <span className="text-foreground font-medium">超级管理员</span>
        <span className="mx-2 text-muted-foreground/40">/</span>
        <span>平台管理后台</span>
      </div>

      {/* 右侧：ThemeToggle + 超管头像下拉 */}
      <div className="flex items-center gap-2">
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted transition-colors outline-none">
            <Avatar className="size-7">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {currentUser.realName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span>{currentUser.realName}</span>
            <ChevronDown className="size-3 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5">
              <p className="font-medium">{currentUser.realName}</p>
              <p className="text-xs text-muted-foreground">超级管理员</p>
              <p className="text-xs text-muted-foreground">{currentUser.phone}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              <UserCircle className="size-3.5 mr-2" />
              个人中心
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="size-3.5 mr-2" />
              账号安全
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={handleLogout}>
              <LogOut className="size-3.5 mr-2" />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const hydrated = useHydrated();
  const currentUser = useStore((s) => s.currentUser);
  const router = useRouter();

  if (!hydrated) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="space-y-3 w-56">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
          <Skeleton className="h-3 w-40" />
        </div>
      </div>
    );
  }

  const isSuperAdmin = currentUser?.platformRole === "super_admin";

  if (!currentUser || !isSuperAdmin) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-muted/40">
        <div className="bg-card border rounded-xl p-8 max-w-sm w-full text-center space-y-4">
          <div className="flex justify-center">
            <AlertTriangle className="h-10 w-10 text-amber-500" />
          </div>
          <h2 className="text-lg font-semibold">权限不足</h2>
          <p className="text-sm text-muted-foreground">
            {!currentUser
              ? "您尚未登录，无法访问管理后台。"
              : "您没有超级管理员权限，无法访问此页面。"}
          </p>
          <Button onClick={() => router.push("/")} className="w-full">
            返回首页
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminTopBar />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
