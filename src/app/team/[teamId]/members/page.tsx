"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useAppStore } from "@/lib/store";
import { MOCK_MEMBERS } from "@/lib/mock-data";
import { USER_TYPE_MAP } from "@/lib/types";
import { UserPlus, Users, Building2, MapPin, ArrowLeft } from "lucide-react";
import HoverActionMenu from "@/components/shared/HoverActionMenu";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function MembersPage() {
  const { currentTeam } = useAppStore();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");

  if (!currentTeam) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">请先选择一个组织</p>
      </div>
    );
  }

  // 获取当前组织的成员
  const teamMembers = MOCK_MEMBERS.filter((m) => m.teamId === currentTeam.id);

  const filtered = teamMembers.filter((m) => {
    const matchSearch = (m.user?.realName || "").includes(search) || (m.user?.phone || "").includes(search);
    if (tab === "all") return matchSearch;
    return matchSearch && m.userType === tab;
  });

  const supervisors = teamMembers.filter((m) => m.userType === "supervisor");
  const inspectors = teamMembers.filter((m) => m.userType === "inspector");
  const enterprises = teamMembers.filter((m) => m.userType === "enterprise");

  const userTypeColor: Record<string, string> = {
    supervisor: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    inspector: "bg-green-500/10 text-green-600 dark:text-green-400",
    enterprise: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  };

  const typeColors = {
    supervisor: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    inspector: "bg-green-500/10 text-green-600 dark:text-green-400",
    enterprise: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Link
          href={`/team/${currentTeam.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          返回组织详情
        </Link>
      </div>

      <PageHeader 
        title={`${currentTeam.name} - 成员管理`} 
        description="管理组织内的成员"
      >
        <Button size="sm" onClick={() => toast.info("邀请成员功能")}>
          <UserPlus className="size-3.5" /> 邀请成员
        </Button>
      </PageHeader>

      {/* 组织信息卡片 */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">组织名称</p>
              <p className="font-semibold truncate">{currentTeam.name}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className={cn("flex size-10 items-center justify-center rounded-lg", typeColors[currentTeam.teamType])}>
              <Users className="size-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">组织类型</p>
              <Badge className={typeColors[currentTeam.teamType]}>{USER_TYPE_MAP[currentTeam.teamType]}</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
              <Users className="size-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">成员数量</p>
              <p className="font-semibold">{currentTeam.memberCount || 0} 人</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
              <MapPin className="size-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">所属区域</p>
              <p className="font-semibold truncate">{currentTeam.region}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <Tabs value={tab} onValueChange={setTab}>
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="all">全部 ({teamMembers.length})</TabsTrigger>
                <TabsTrigger value="supervisor">监管方 ({supervisors.length})</TabsTrigger>
                <TabsTrigger value="inspector">服务方 ({inspectors.length})</TabsTrigger>
                <TabsTrigger value="enterprise">履行方 ({enterprises.length})</TabsTrigger>
              </TabsList>
            </div>

            <div className="mt-3">
              <div className="relative max-w-sm">
                <input
                  type="text"
                  placeholder="搜索姓名、手机号..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8 w-full rounded-md border border-input bg-background px-3 pr-8 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            <TabsContent value={tab} className="mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">成员</TableHead>
                      <TableHead className="w-[120px]">手机号</TableHead>
                      <TableHead className="w-[80px]">用户类型</TableHead>
                      <TableHead className="w-[100px]">角色</TableHead>
                      <TableHead className="w-[120px]">资质编号</TableHead>
                      <TableHead className="w-[100px]">加入时间</TableHead>
                      <TableHead className="w-[80px]">状态</TableHead>
                      <TableHead className="w-[60px] text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((member) => (
                      <TableRow key={`${member.teamId}-${member.userId}`}>
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <Avatar className="size-7">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {member.user?.realName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{member.user?.realName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{member.user?.phone}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium ${userTypeColor[member.userType]}`}>
                            {USER_TYPE_MAP[member.userType]}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm">{member.roleName}</TableCell>
                        <TableCell className="text-xs font-mono text-muted-foreground">
                          {member.user?.certNo || "-"}
                        </TableCell>
                        <TableCell className="text-xs">{member.joinedAt}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-[10px] bg-green-500/10 text-green-600">
                            正常
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <HoverActionMenu
                            actions={[
                              {
                                label: "查看详情",
                                onClick: () => toast.info("查看详情"),
                              },
                              {
                                label: "修改角色",
                                onClick: () => toast.info("修改角色"),
                              },
                              {
                                label: "移除成员",
                                onClick: () => toast.error("移除成员"),
                                variant: "destructive",
                              },
                            ]}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
