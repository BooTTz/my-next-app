"use client";

import { useState } from "react";
import { PageHeader, ListToolbar } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MOCK_MEMBERS } from "@/lib/mock-data";
import { USER_TYPE_MAP } from "@/lib/types";
import { UserPlus, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export default function MembersPage() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");

  const filtered = MOCK_MEMBERS.filter((m) => {
    const matchSearch = (m.user?.realName || "").includes(search) || (m.user?.phone || "").includes(search);
    if (tab === "all") return matchSearch;
    return matchSearch && m.userType === tab;
  });

  const supervisors = MOCK_MEMBERS.filter((m) => m.userType === "supervisor");
  const inspectors = MOCK_MEMBERS.filter((m) => m.userType === "inspector");
  const enterprises = MOCK_MEMBERS.filter((m) => m.userType === "enterprise");

  const userTypeColor: Record<string, string> = {
    supervisor: "bg-status-info/10 text-status-info",
    inspector: "bg-status-success/10 text-status-success",
    enterprise: "bg-status-warning/10 text-status-warning",
  };

  return (
    <div className="space-y-4">
      <PageHeader title="成员管理" description="管理团队内三方成员">
        <Button size="sm" onClick={() => toast.info("邀请成员功能")}>
          <UserPlus className="size-3.5" /> 邀请成员
        </Button>
      </PageHeader>

      <Card>
        <CardContent className="p-4">
          <Tabs value={tab} onValueChange={setTab}>
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="all">全部 ({MOCK_MEMBERS.length})</TabsTrigger>
                <TabsTrigger value="supervisor">监管方 ({supervisors.length})</TabsTrigger>
                <TabsTrigger value="inspector">服务方 ({inspectors.length})</TabsTrigger>
                <TabsTrigger value="enterprise">履行方 ({enterprises.length})</TabsTrigger>
              </TabsList>
            </div>

            <div className="mt-3">
              <ListToolbar
                searchPlaceholder="搜索姓名、手机号..."
                searchValue={search}
                onSearchChange={setSearch}
                onExport={() => toast.info("导出功能")}
                onRefresh={() => toast.info("已刷新")}
              />
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
                          <Badge variant="secondary" className="text-[10px] bg-status-success/10 text-status-success">
                            正常
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md size-6 hover:bg-muted transition-colors outline-none">
                              <MoreHorizontal className="size-3.5" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>查看详情</DropdownMenuItem>
                              <DropdownMenuItem>修改角色</DropdownMenuItem>
                              <DropdownMenuItem className="text-status-danger">移除成员</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
