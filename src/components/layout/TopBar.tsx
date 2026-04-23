"use client";

import { useAppStore } from "@/lib/store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, ChevronDown, LogOut, User, Settings, UserCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

interface TopBarActionsProps {
  /** 页面标题，用于在标题旁显示 */
  title?: string;
  /** 标题旁是否显示徽章 */
  badge?: string | number;
}

export function TopBarActions({ title, badge }: TopBarActionsProps) {
  const { currentUser, currentTeam, logout } = useAppStore();
  const router = useRouter();

  if (!currentUser || !currentTeam) return null;

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <div className="flex items-center gap-2">
      {/* 主题切换 */}
      <ThemeToggle />

      {/* 通知铃铛 */}
      <Link href={currentTeam ? `/team/${currentTeam.id}/notifications` : "#"}>
        <Button variant="ghost" size="icon-sm" className="relative">
          <Bell className="size-4" />
          <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
            3
          </span>
        </Button>
      </Link>

      {/* 用户下拉 */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted transition-colors outline-none">
          <Avatar className="size-7">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {currentUser.realName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline">{currentUser.realName}</span>
          <ChevronDown className="size-3 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <div className="px-2 py-1.5">
            <p className="font-medium">{currentUser.realName}</p>
            <p className="text-xs text-muted-foreground">{currentUser.phone}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push("/profile")}>
            <UserCircle className="size-3.5 mr-2" />
            个人中心
          </DropdownMenuItem>
          <DropdownMenuItem>
            <User className="size-3.5 mr-2" />
            个人设置
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
  );
}

export default function TopBar() {
  return (
    <header className="flex h-14 items-center justify-end border-b bg-card px-4">
      <TopBarActions />
    </header>
  );
}
