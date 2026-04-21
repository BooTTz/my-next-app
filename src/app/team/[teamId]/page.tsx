"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStore } from "@/lib/store";
import { MOCK_MEMBERS, MOCK_TASKS, MOCK_HAZARDS, MOCK_REPORTS, MOCK_TEAMS } from "@/lib/mock-data";
import { USER_TYPE_MAP } from "@/lib/types";
import {
  ArrowLeft, Building2, Users, MapPin, Calendar,
  ClipboardList, AlertTriangle, FileText, Settings,
  ChevronRight, GitBranch,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

export default function TeamDetailPage() {
  const params = useParams();
  const teamId = params.teamId as string;
  const { currentTeam, currentUserType } = useAppStore();

  if (!currentTeam) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">请先选择一个团队</p>
      </div>
    );
  }

  // 获取当前团队的成员
  const teamMembers = MOCK_MEMBERS.filter((m) => m.teamId === teamId);
  // 获取当前团队的任务
  const teamTasks = MOCK_TASKS.filter((t) => t.teamId === teamId);
  // 获取当前团队的隐患
  const teamHazards = MOCK_HAZARDS.filter((h) => h.teamId === teamId);
  // 获取当前团队的报告
  const teamReports = MOCK_REPORTS.filter((r) => r.teamId === teamId);

  // 统计
  const stats = {
    totalTasks: teamTasks.length,
    completedTasks: teamTasks.filter((t) => t.status === "completed").length,
    totalHazards: teamHazards.length,
    majorHazards: teamHazards.filter((h) => h.level === "major").length,
    pendingHazards: teamHazards.filter((h) => !["closed", "submitted"].includes(h.status)).length,
    totalReports: teamReports.length,
    approvedReports: teamReports.filter((r) => r.status === "approved").length,
  };

  const typeColors = {
    supervisor: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    inspector: "bg-green-500/10 text-green-600 dark:text-green-400",
    enterprise: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  };

  const statusColors = {
    active: "bg-green-500/10 text-green-600 dark:text-green-400",
    archived: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
  };

  return (
    <div className="space-y-6">
      {/* 页面标题区 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/workspace"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            返回
          </Link>
          <div className="flex items-center gap-3">
            <Avatar className="size-12">
              <AvatarFallback className={cn("text-lg", typeColors[currentTeam.teamType])}>
                {currentTeam.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold tracking-tight">{currentTeam.name}</h1>
                <Badge className={typeColors[currentTeam.teamType]}>
                  {USER_TYPE_MAP[currentTeam.teamType]}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{currentTeam.description}</p>
            </div>
          </div>
        </div>
        {currentUserType === "supervisor" && (
          <div className="flex gap-2">
            <Link href={`/team/${teamId}/members`}>
              <Button variant="outline" size="sm">
                <Users className="size-3.5 mr-1.5" />
                成员管理
              </Button>
            </Link>
            <Button variant="outline" size="sm">
              <Settings className="size-3.5 mr-1.5" />
              团队设置
            </Button>
          </div>
        )}
      </div>

      {/* 团队信息卡片 */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <Users className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">成员数量</p>
              <p className="font-semibold text-lg">{currentTeam.memberCount || 0} 人</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
              <ClipboardList className="size-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">检查任务</p>
              <p className="font-semibold text-lg">
                {stats.completedTasks}/{stats.totalTasks}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10">
              <AlertTriangle className="size-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">隐患数量</p>
              <p className="font-semibold text-lg">
                {stats.pendingHazards}/{stats.totalHazards}
                {stats.majorHazards > 0 && (
                  <span className="text-xs text-red-500 ml-1">({stats.majorHazards}重大)</span>
                )}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-green-500/10">
              <FileText className="size-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">检查报告</p>
              <p className="font-semibold text-lg">
                {stats.approvedReports}/{stats.totalReports}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 详细信息和成员管理 */}
      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">基本信息</TabsTrigger>
          <TabsTrigger value="members">成员列表</TabsTrigger>
          <TabsTrigger value="org">组织架构</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">基本信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-muted-foreground" />
                  <span className="text-sm">所属区域：</span>
                  <span className="text-sm font-medium">{currentTeam.region}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-muted-foreground" />
                  <span className="text-sm">创建时间：</span>
                  <span className="text-sm font-medium">{currentTeam.createdAt}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="size-4 text-muted-foreground" />
                  <span className="text-sm">团队状态：</span>
                  <Badge className={statusColors[currentTeam.status]} variant="secondary">
                    {currentTeam.status === "active" ? "活跃" : "已归档"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-4 text-muted-foreground">邀请码</span>
                  <span className="text-sm">邀请码：</span>
                  <span className="text-sm font-mono font-medium">{currentTeam.inviteCode}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {currentTeam.teamType === "supervisor" && "监管行业"}
                  {currentTeam.teamType === "inspector" && "机构信息"}
                  {currentTeam.teamType === "enterprise" && "企业信息"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {currentTeam.teamType === "supervisor" && currentTeam.supervisoryIndustry && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">监管行业：</span>
                    <span className="text-sm font-medium">{currentTeam.supervisoryIndustry}</span>
                  </div>
                )}
                {currentTeam.teamType === "inspector" && (
                  <>
                    {currentTeam.qualification && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">机构资质：</span>
                        <span className="text-sm font-medium">{currentTeam.qualification}</span>
                      </div>
                    )}
                    {currentTeam.mainServiceField && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">主要服务：</span>
                        <span className="text-sm font-medium">{currentTeam.mainServiceField}</span>
                      </div>
                    )}
                    {currentTeam.agencyStaffCount && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">机构人数：</span>
                        <span className="text-sm font-medium">{currentTeam.agencyStaffCount} 人</span>
                      </div>
                    )}
                  </>
                )}
                {currentTeam.teamType === "enterprise" && (
                  <>
                    {currentTeam.industryType && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">行业类型：</span>
                        <span className="text-sm font-medium">{currentTeam.industryType}</span>
                      </div>
                    )}
                    {currentTeam.subIndustryField && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">细分领域：</span>
                        <span className="text-sm font-medium">{currentTeam.subIndustryField}</span>
                      </div>
                    )}
                    {currentTeam.scale && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">企业规模：</span>
                        <span className="text-sm font-medium">
                          {currentTeam.scale === "large" ? "大型" :
                           currentTeam.scale === "medium" ? "中型" :
                           currentTeam.scale === "small" ? "小型" : "微型"}企业
                        </span>
                      </div>
                    )}
                  </>
                )}
                {!currentTeam.supervisoryIndustry && currentTeam.teamType === "supervisor" && (
                  <p className="text-sm text-muted-foreground">暂无更多信息</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="members">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">成员列表 ({teamMembers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {teamMembers.length > 0 ? (
                <div className="space-y-2">
                  {teamMembers.map((member) => (
                    <div
                      key={`${member.teamId}-${member.userId}`}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <Avatar className="size-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {member.user?.realName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{member.user?.realName}</p>
                        <p className="text-xs text-muted-foreground">{member.user?.phone}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {member.roleName}
                      </Badge>
                      <Badge className={cn(
                        "text-xs",
                        member.userType === "supervisor" ? "bg-blue-500/10 text-blue-600" :
                        member.userType === "inspector" ? "bg-green-500/10 text-green-600" :
                        "bg-amber-500/10 text-amber-600"
                      )}>
                        {USER_TYPE_MAP[member.userType]}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">暂无成员</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="org">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <GitBranch className="size-4" />
                组织架构树
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4">
                {/* 根节点 - 团队名称 */}
                <div className="flex flex-col items-center mb-4">
                  <div className="px-4 py-2 rounded-lg bg-primary/10 text-primary font-medium">
                    {currentTeam.name}
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground mt-2 rotate-90" />
                </div>

                {/* 按角色分组 */}
                <div className="flex justify-center gap-8">
                  {/* 监管方 */}
                  {teamMembers.filter(m => m.userType === "supervisor").length > 0 && (
                    <div className="flex flex-col items-center">
                      <div className="px-3 py-1.5 rounded bg-blue-500/10 text-blue-600 text-xs font-medium mb-2">
                        监管方 ({teamMembers.filter(m => m.userType === "supervisor").length})
                      </div>
                      <div className="space-y-2">
                        {teamMembers.filter(m => m.userType === "supervisor").map((member) => (
                          <div key={member.userId} className="flex items-center gap-2 px-3 py-1.5 rounded border text-xs">
                            <Avatar className="size-5">
                              <AvatarFallback className="bg-blue-500/10 text-blue-600 text-[10px]">
                                {member.user?.realName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{member.user?.realName}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 服务方 */}
                  {teamMembers.filter(m => m.userType === "inspector").length > 0 && (
                    <div className="flex flex-col items-center">
                      <div className="px-3 py-1.5 rounded bg-green-500/10 text-green-600 text-xs font-medium mb-2">
                        服务方 ({teamMembers.filter(m => m.userType === "inspector").length})
                      </div>
                      <div className="space-y-2">
                        {teamMembers.filter(m => m.userType === "inspector").map((member) => (
                          <div key={member.userId} className="flex items-center gap-2 px-3 py-1.5 rounded border text-xs">
                            <Avatar className="size-5">
                              <AvatarFallback className="bg-green-500/10 text-green-600 text-[10px]">
                                {member.user?.realName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{member.user?.realName}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 履行方 */}
                  {teamMembers.filter(m => m.userType === "enterprise").length > 0 && (
                    <div className="flex flex-col items-center">
                      <div className="px-3 py-1.5 rounded bg-amber-500/10 text-amber-600 text-xs font-medium mb-2">
                        履行方 ({teamMembers.filter(m => m.userType === "enterprise").length})
                      </div>
                      <div className="space-y-2">
                        {teamMembers.filter(m => m.userType === "enterprise").map((member) => (
                          <div key={member.userId} className="flex items-center gap-2 px-3 py-1.5 rounded border text-xs">
                            <Avatar className="size-5">
                              <AvatarFallback className="bg-amber-500/10 text-amber-600 text-[10px]">
                                {member.user?.realName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{member.user?.realName}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
