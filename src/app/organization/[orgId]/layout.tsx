"use client";

import { useRouter } from "next/navigation";
import { Shield, LogOut, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppStore } from "@/lib/store";
import { useHydrated } from "@/hooks/useHydrated";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export default function OrganizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { currentUser, logout } = useAppStore();
  const hydrated = useHydrated();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleProfile = () => {
    router.push("/profile");
  };

  if (!hydrated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* 简化顶部栏 */}
      <header className="h-14 border-b bg-background flex items-center justify-between px-6 shrink-0">
        {/* 左侧 */}
        <div className="flex items-center gap-2.5">
          <Shield className="size-5 text-primary" />
          <span className="text-lg font-semibold">工贸三方监管平台</span>
        </div>
        {/* 右侧 */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="size-8 text-muted-foreground">
            <Bell className="size-4" />
            <span className="sr-only">通知</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="relative size-8 rounded-full cursor-pointer">
                <Avatar className="size-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    {currentUser?.realName?.charAt(0) ?? "?"}
                  </AvatarFallback>
                </Avatar>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleProfile} className="cursor-pointer">
                <User className="size-4 mr-2" />
                个人中心
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} variant="destructive" className="cursor-pointer">
                <LogOut className="size-4 mr-2" />
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* 内容区 */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto py-6 px-6">
          {children}
        </div>
      </main>
    </div>
  );
}
