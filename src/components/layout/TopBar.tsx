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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Bell, ChevronDown, LogOut, User, Settings, UserCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export default function TopBar() {
  const { currentUser, currentTeam, currentOrganization, logout } = useAppStore();
  const router = useRouter();

  if (!currentUser || !currentTeam) return null;

  const displayName = currentOrganization?.name || currentTeam?.name || "工贸三方监管平台";
  const isNameLong = displayName.length > 10;

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <header className="flex h-14 items-center justify-between border-b bg-card px-4">
      {/* 左侧 - 组织名称 */}
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger className="cursor-default">
            <div className="flex flex-col text-left">
              <span className="truncate max-w-[200px] text-sm font-semibold leading-tight">
                {displayName}
              </span>
              <span className="text-xs text-muted-foreground leading-tight">工贸三方监管平台</span>
            </div>
          </TooltipTrigger>
          {isNameLong && (
            <TooltipContent side="bottom">
              <p>{displayName}</p>
            </TooltipContent>
          )}
        </Tooltip>
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
    </header>
  );
}
