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
import {
  Bell, ChevronDown, LogOut, User, Settings, Building2, LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import type { UserType } from "@/lib/types";

export default function TopBar() {
  const {
    currentUser, currentTeam, currentUserType,
    teams, switchTeam, switchUserType,
  } = useAppStore();

  if (!currentUser) return null;

  const userTypeColors: Record<UserType, string> = {
    supervisor: "bg-status-info/10 text-status-info",
    inspector: "bg-status-success/10 text-status-success",
    enterprise: "bg-status-warning/10 text-status-warning",
  };

  return (
    <header className="flex h-14 items-center justify-between border-b bg-card px-4">
      {/* 左侧 - 团队切换 */}
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium hover:bg-muted transition-colors outline-none">
            <Building2 className="size-3.5 text-muted-foreground" />
            <span className="max-w-[200px] truncate">{currentTeam?.name || "选择团队"}</span>
            <ChevronDown className="size-3 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            <DropdownMenuLabel>我的团队</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {teams.map((team) => (
              <DropdownMenuItem
                key={team.id}
                onClick={() => switchTeam(team, currentUserType)}
                className="flex flex-col items-start gap-0.5"
              >
                <span className="font-medium">{team.name}</span>
                <span className="text-xs text-muted-foreground">{team.region}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/workspace" className="flex items-center gap-2 w-full">
                <LayoutDashboard className="size-3.5" />
                个人工作台
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 用户类型标签 */}
        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${userTypeColors[currentUserType]}`}>
          {USER_TYPE_MAP[currentUserType]}
        </span>

        {/* 角色切换（演示用） */}
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-xs text-muted-foreground hover:bg-muted transition-colors outline-none">
            切换角色
            <ChevronDown className="size-3" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => switchUserType("supervisor")}>
              监管方视角
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => switchUserType("inspector")}>
              服务方视角
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => switchUserType("enterprise")}>
              履行方视角
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 右侧 - 通知 + 用户 */}
      <div className="flex items-center gap-2">
        {/* 通知铃铛 */}
        <Link href={currentTeam ? `/team/${currentTeam.id}/notifications` : "#"}>
          <Button variant="ghost" size="icon-sm" className="relative">
            <Bell className="size-4" />
            <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-status-danger text-[10px] font-medium text-white">
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
            <DropdownMenuLabel>
              <div>
                <p className="font-medium">{currentUser.realName}</p>
                <p className="text-xs text-muted-foreground">{currentUser.phone}</p>
              </div>
            </DropdownMenuLabel>
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
