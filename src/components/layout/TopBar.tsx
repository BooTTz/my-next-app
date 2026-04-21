"use client";

import { useAppStore } from "@/lib/store";
import { USER_TYPE_MAP } from "@/lib/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Bell, ChevronDown, LogOut, User, Settings } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export default function TopBar() {
  const { currentUser, currentTeam, currentUserType } = useAppStore();

  if (!currentUser || !currentTeam) return null;

  const userTypeColors = {
    supervisor: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    inspector: "bg-green-500/10 text-green-600 dark:text-green-400",
    enterprise: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  };

  return (
    <header className="flex h-14 items-center justify-between border-b bg-card px-4">
      {/* 左侧 - 用户类型标签 */}
      <div className="flex items-center gap-3">
        {/* 用户类型标签 */}
        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${userTypeColors[currentUserType]}`}>
          {USER_TYPE_MAP[currentUserType]}
        </span>
        <span className="text-sm text-muted-foreground">{currentTeam.name}</span>
      </div>

      {/* 右侧 - 主题 + 通知 + 用户 */}
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
            <span>{currentUser.realName}</span>
            <ChevronDown className="size-3 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5">
              <p className="font-medium">{currentUser.realName}</p>
              <p className="text-xs text-muted-foreground">{currentUser.phone}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="size-3.5 mr-2" />
              个人设置
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="size-3.5 mr-2" />
              账号安全
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <LogOut className="size-3.5 mr-2" />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
