"use client";

import { useRouter } from "next/navigation";
import { Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppStore } from "@/lib/store";
import { useHydrated } from "@/hooks/useHydrated";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { currentUser, logout } = useAppStore();
  const hydrated = useHydrated();

  const handleLogout = () => {
    logout();
    router.push("/");
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
          <Avatar className="size-8">
            <AvatarFallback className="bg-primary/10 text-primary text-sm">
              {currentUser?.realName?.charAt(0) ?? "?"}
            </AvatarFallback>
          </Avatar>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1.5 text-muted-foreground hover:text-destructive">
            <LogOut className="size-4" />
            退出登录
          </Button>
        </div>
      </header>

      {/* 内容区 */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto py-8 px-6">
          {children}
        </div>
      </main>
    </div>
  );
}
