"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/lib/store";
import { MOCK_TEAMS, MOCK_MEMBERS, MOCK_REGIONS, MOCK_TEAM_WORKSPACES } from "@/lib/mock-data";
import { USER_TYPE_MAP, type UserType } from "@/lib/types";
import {
  ChevronRight, ChevronDown, Plus, Users, Building2,
  MapPin, Settings, ArrowLeft, Pencil, Trash2, UserPlus,
  Search, Filter, X,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// 行政区划树节点组件
function RegionTreeNode({
  node,
  level = 0,
  onSelect,
  selectedId,
  onEdit,
  onDelete,
  onAddChild,
}: {
  node: typeof MOCK_REGIONS[0];
  level?: number;
  onSelect?: (id: string) => void;
  selectedId?: string;
  onEdit?: (id: string, name: string) => void;
  onDelete?: (id: string) => void;
  onAddChild?: (parentId: string) => void;
}) {
  const [expanded, setExpanded] = useState(level === 0);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedId === node.id;

  return (
    <div className="select-none">
      <div
        className={cn(
          "group flex items-center gap-1 py-1.5 px-2 rounded-md cursor-pointer hover:bg-accent transition-colors",
          isSelected && "bg-accent"
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => {
          if (hasChildren) setExpanded(!expanded);
          if (onSelect) onSelect(node.id);
        }}
      >
        {hasChildren ? (
          expanded ? (
            <ChevronDown className="size-3.5 text-muted-foreground" />
          ) : (
            <ChevronRight className="size-3.5 text-muted-foreground" />
          )
        ) : (
          <span className="size-3.5" />
        )}
        <MapPin className="size-3.5 text-muted-foreground" />
        <span className="text-sm flex-1">{node.name}</span>
        {/* 操作按钮 */}
        <div className="hidden group-hover:flex items-center gap-0.5">
          <button
            className="p-1 rounded hover:bg-muted transition-colors"
            onClick={(e) => { e.stopPropagation(); onAddChild?.(node.id); }}
            title="添加子区划"
          >
            <Plus className="size-3 text-muted-foreground" />
          </button>
          <button
            className="p-1 rounded hover:bg-muted transition-colors"
            onClick={(e) => { e.stopPropagation(); onEdit?.(node.id, node.name); }}
            title="编辑"
          >
            <Pencil className="size-3 text-muted-foreground" />
          </button>
          <button
            className="p-1 rounded hover:bg-muted transition-colors text-red-500 hover:text-red-600"
            onClick={(e) => { e.stopPropagation(); onDelete?.(node.id); }}
            title="删除"
          >
            <Trash2 className="size-3" />
          </button>
        </div>
      </div>
      {expanded && hasChildren && (
        <div>
          {node.children!.map((child) => (
            <RegionTreeNode
              key={child.id}
              node={child}
              level={level + 1}
              onSelect={onSelect}
              selectedId={selectedId}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function WorkspaceSettingsPage() {
  const { currentWorkspace, currentUser, currentUserType } = useAppStore();
  const [selectedRegionId, setSelectedRegionId] = useState<string | undefined>();
  const [activeTab, setActiveTab] = useState("organization");

  // 行政区划相关状态
  const [regionDialogOpen, setRegionDialogOpen] = useState(false);
  const [regionDialogMode, setRegionDialogMode] = useState<"add" | "edit">("add");
  const [regionDialogName, setRegionDialogName] = useState("");
  const [regionDialogParentId, setRegionDialogParentId] = useState<string | null>(null);
  const [editingRegionId, setEditingRegionId] = useState<string | null>(null);

  // 邀请组织相关状态
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteTeamType, setInviteTeamType] = useState<UserType>("enterprise");
  const [inviteTeamName, setInviteTeamName] = useState("");
  const [inviteRegionId, setInviteRegionId] = useState<string | null>("");

  // 组织筛选状态
  const [teamSearch, setTeamSearch] = useState("");
  const [teamTypeFilter, setTeamTypeFilter] = useState<UserType | "all">("all");

  // 编辑工作组相关状态
  const [editWorkspaceDialogOpen, setEditWorkspaceDialogOpen] = useState(false);
  const [editWorkspaceName, setEditWorkspaceName] = useState("");

  if (!currentWorkspace) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">请先选择一个工作组</p>
      </div>
    );
  }

  // 获取工作组内的组织
  const workspaceTeamIds = MOCK_TEAM_WORKSPACES
    .filter((tw) => tw.workspaceId === currentWorkspace.id)
    .map((tw) => tw.teamId);
  const workspaceTeams = MOCK_TEAMS.filter((t) => workspaceTeamIds.includes(t.id));

  // 筛选组织
  const filteredTeams = workspaceTeams.filter((team) => {
    const matchesSearch = team.name.toLowerCase().includes(teamSearch.toLowerCase()) ||
      team.description?.toLowerCase().includes(teamSearch.toLowerCase());
    const matchesType = teamTypeFilter === "all" || team.teamType === teamTypeFilter;
    return matchesSearch && matchesType;
  });

  // 按类型分类组织
  const supervisorTeams = workspaceTeams.filter((t) => t.teamType === "supervisor");
  const inspectorTeams = workspaceTeams.filter((t) => t.teamType === "inspector");
  const enterpriseTeams = workspaceTeams.filter((t) => t.teamType === "enterprise");

  // 获取区域内的组织
  const getTeamsInRegion = (regionId: string) => {
    const regionTeamIds = MOCK_TEAM_WORKSPACES
      .filter((tw) => tw.workspaceId === currentWorkspace.id && tw.regionId === regionId)
      .map((tw) => tw.teamId);
    return MOCK_TEAMS.filter((t) => regionTeamIds.includes(t.id));
  };

  const selectedRegionTeams = selectedRegionId ? getTeamsInRegion(selectedRegionId) : [];

  // 行政区划操作
  const handleOpenAddRegion = (parentId: string | null = null) => {
    setRegionDialogMode("add");
    setRegionDialogName("");
    setRegionDialogParentId(parentId);
    setEditingRegionId(null);
    setRegionDialogOpen(true);
  };

  const handleOpenEditRegion = (id: string, name: string) => {
    setRegionDialogMode("edit");
    setRegionDialogName(name);
    setRegionDialogParentId(null);
    setEditingRegionId(id);
    setRegionDialogOpen(true);
  };

  const handleSaveRegion = () => {
    if (!regionDialogName.trim()) {
      toast.error("请输入区划名称");
      return;
    }
    if (regionDialogMode === "add") {
      toast.success(`已添加区划：${regionDialogName}`);
    } else {
      toast.success(`已更新区划：${regionDialogName}`);
    }
    setRegionDialogOpen(false);
  };

  const handleDeleteRegion = (id: string) => {
    const regionTeamCount = getTeamsInRegion(id).length;
    if (regionTeamCount > 0) {
      toast.error(`该区划下存在 ${regionTeamCount} 个组织，无法删除`);
      return;
    }
    toast.success("已删除区划");
  };

  // 邀请组织操作
  const handleInviteTeam = () => {
    if (!inviteTeamName.trim()) {
      toast.error("请输入组织名称或邀请码");
      return;
    }
    toast.success(`已向 ${inviteTeamName} 发送邀请`);
    setInviteDialogOpen(false);
    setInviteTeamName("");
  };

  // 保存工作组编辑
  const handleSaveWorkspace = () => {
    if (!editWorkspaceName.trim()) {
      toast.error("请输入工作组名称");
      return;
    }
    toast.success(`已更新工作组名称为：${editWorkspaceName}`);
    setEditWorkspaceDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* 页面标题区 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">工作组管理</h1>
          <p className="mt-1 text-sm text-muted-foreground">{currentWorkspace.name}</p>
        </div>
        {currentUserType === "supervisor" && (
          <Button onClick={() => { setEditWorkspaceName(currentWorkspace.name); setEditWorkspaceDialogOpen(true); }}>
            <Pencil className="size-4 mr-2" />
            编辑工作组
          </Button>
        )}
      </div>

      {/* 工作组概览信息 */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Users className="size-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xl font-bold">{workspaceTeams.reduce((sum, t) => sum + (t.memberCount || 0), 0)}</p>
                <p className="text-xs text-muted-foreground">成员数量</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-green-500/10">
                <Building2 className="size-5 text-green-600" />
              </div>
              <div>
                <p className="text-xl font-bold">{currentWorkspace.enterpriseCount || 0}</p>
                <p className="text-xs text-muted-foreground">企业数量</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10">
                <Building2 className="size-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xl font-bold">{currentWorkspace.serviceCount || 0}</p>
                <p className="text-xs text-muted-foreground">服务机构</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-purple-500/10">
                <MapPin className="size-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xl font-bold">{workspaceTeams.length}</p>
                <p className="text-xs text-muted-foreground">组织总数</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 基本信息 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <MapPin className="size-4" />
            基本信息
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">所属区域：</span>
              <span className="font-medium">{currentWorkspace.region}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">创建时间：</span>
              <span className="font-medium">{currentWorkspace.createdAt}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">状态：</span>
              <Badge variant="secondary" className="bg-green-500/10 text-green-600">活跃</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 标签页 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="organization">组织信息</TabsTrigger>
          <TabsTrigger value="supervisor">监管部门 ({supervisorTeams.length})</TabsTrigger>
          <TabsTrigger value="inspector">服务机构 ({inspectorTeams.length})</TabsTrigger>
          <TabsTrigger value="enterprise">企业单位 ({enterpriseTeams.length})</TabsTrigger>
        </TabsList>

        {/* 组织信息 - 行政区划树 + 组织列表 */}
        <TabsContent value="organization" className="mt-4">
          <div className="flex gap-4">
            {/* 左侧行政区划树 */}
            <Card className="w-72 shrink-0">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">行政区划</CardTitle>
                  <Button variant="ghost" size="sm" className="h-7" onClick={() => handleOpenAddRegion(null)}>
                    <Plus className="size-3.5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="max-h-[400px] overflow-y-auto">
                  {MOCK_REGIONS.filter((r) => r.workspaceId === currentWorkspace.id).map((region) => (
                    <RegionTreeNode
                      key={region.id}
                      node={region}
                      onSelect={setSelectedRegionId}
                      selectedId={selectedRegionId}
                      onEdit={handleOpenEditRegion}
                      onDelete={handleDeleteRegion}
                      onAddChild={handleOpenAddRegion}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 右侧组织列表 */}
            <Card className="flex-1">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {selectedRegionId
                      ? `组织列表 (${selectedRegionTeams.length})`
                      : `全部组织 (${filteredTeams.length})`}
                  </CardTitle>
                  <Button size="sm" className="h-8" onClick={() => setInviteDialogOpen(true)}>
                    <UserPlus className="size-3.5 mr-1.5" />
                    邀请组织
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {/* 搜索和筛选 */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      placeholder="搜索组织名称..."
                      value={teamSearch}
                      onChange={(e) => setTeamSearch(e.target.value)}
                      className="pl-9 h-8"
                    />
                    {teamSearch && (
                      <button
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setTeamSearch("")}
                      >
                        <X className="size-4 text-muted-foreground hover:text-foreground" />
                      </button>
                    )}
                  </div>
                  <Select value={teamTypeFilter} onValueChange={(v) => setTeamTypeFilter(v as UserType | "all")}>
                    <SelectTrigger className="w-28 h-8">
                      <Filter className="size-3.5 mr-1.5" />
                      <SelectValue placeholder="筛选类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部类型</SelectItem>
                      <SelectItem value="supervisor">监管部门</SelectItem>
                      <SelectItem value="inspector">服务机构</SelectItem>
                      <SelectItem value="enterprise">企业单位</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 组织列表 */}
                <div className="space-y-3">
                  {(teamSearch || teamTypeFilter !== "all" ? filteredTeams : (selectedRegionId ? selectedRegionTeams : workspaceTeams)).map((team) => {
                    const typeColors = {
                      supervisor: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
                      inspector: "bg-green-500/10 text-green-600 dark:text-green-400",
                      enterprise: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
                    };
                    return (
                      <div
                        key={team.id}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="size-9">
                            <AvatarFallback className="bg-primary/10 text-primary text-sm">
                              {team.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm">{team.name}</p>
                              <Badge className={cn("text-[10px]", typeColors[team.teamType])}>
                                {USER_TYPE_MAP[team.teamType]}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{team.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="size-3" /> {team.memberCount} 人
                          </span>
                          <Link href={`/team/${team.id}`}>
                            <Button variant="ghost" size="sm" className="h-7">
                              查看
                            </Button>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                  {(teamSearch || teamTypeFilter !== "all" ? filteredTeams : (selectedRegionId ? selectedRegionTeams : workspaceTeams)).length === 0 && (
                    <p className="text-center text-muted-foreground py-8">暂无组织</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 监管部门列表 */}
        <TabsContent value="supervisor" className="mt-4">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                {supervisorTeams.map((team) => {
                  const members = MOCK_MEMBERS.filter(
                    (m) => m.teamId === team.id && m.userType === "supervisor"
                  );
                  return (
                    <div key={team.id} className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-10">
                            <AvatarFallback className="bg-blue-500/10 text-blue-600">
                              {team.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{team.name}</p>
                            <p className="text-xs text-muted-foreground">{team.description}</p>
                          </div>
                        </div>
                        <Link href={`/team/${team.id}`}>
                          <Button variant="outline" size="sm">管理组织</Button>
                        </Link>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {members.map((m) => (
                          <Badge key={m.userId} variant="secondary">
                            {m.user?.realName} ({m.roleName})
                          </Badge>
                        ))}
                      </div>
                    </div>
                  );
                })}
                {supervisorTeams.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">暂无监管部门组织</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 服务机构列表 */}
        <TabsContent value="inspector" className="mt-4">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                {inspectorTeams.map((team) => {
                  const members = MOCK_MEMBERS.filter(
                    (m) => m.teamId === team.id && m.userType === "inspector"
                  );
                  return (
                    <div key={team.id} className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-10">
                            <AvatarFallback className="bg-green-500/10 text-green-600">
                              {team.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{team.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {team.qualification && `资质: ${team.qualification}`}
                              {team.mainServiceField && ` · ${team.mainServiceField}`}
                            </p>
                          </div>
                        </div>
                        <Link href={`/team/${team.id}`}>
                          <Button variant="outline" size="sm">管理组织</Button>
                        </Link>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {members.map((m) => (
                          <Badge key={m.userId} variant="secondary">
                            {m.user?.realName} ({m.roleName})
                          </Badge>
                        ))}
                      </div>
                    </div>
                  );
                })}
                {inspectorTeams.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">暂无服务机构组织</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 企业单位列表 */}
        <TabsContent value="enterprise" className="mt-4">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                {enterpriseTeams.map((team) => {
                  const members = MOCK_MEMBERS.filter(
                    (m) => m.teamId === team.id && m.userType === "enterprise"
                  );
                  return (
                    <div key={team.id} className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-10">
                            <AvatarFallback className="bg-amber-500/10 text-amber-600">
                              {team.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{team.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {team.industryType && `${team.industryType} · ${team.subIndustryField || ""}`}
                              {team.scale && ` · ${team.scale === "large" ? "大型" : team.scale === "medium" ? "中型" : team.scale === "small" ? "小型" : "微型"}企业`}
                            </p>
                          </div>
                        </div>
                        <Link href={`/team/${team.id}`}>
                          <Button variant="outline" size="sm">管理组织</Button>
                        </Link>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {members.map((m) => (
                          <Badge key={m.userId} variant="secondary">
                            {m.user?.realName} ({m.roleName})
                          </Badge>
                        ))}
                      </div>
                    </div>
                  );
                })}
                {enterpriseTeams.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">暂无企业单位组织</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 行政区划编辑 Dialog */}
      <Dialog open={regionDialogOpen} onOpenChange={setRegionDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {regionDialogMode === "add" ? "添加行政区划" : "编辑行政区划"}
            </DialogTitle>
            <DialogDescription>
              {regionDialogMode === "add"
                ? regionDialogParentId
                  ? "为选中区划添加子区划"
                  : "添加新的顶级行政区划"
                : "修改区划名称"
              }
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">区划名称</label>
              <Input
                placeholder="请输入区划名称"
                value={regionDialogName}
                onChange={(e) => setRegionDialogName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSaveRegion()}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRegionDialogOpen(false)}>取消</Button>
            <Button onClick={handleSaveRegion}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑工作组 Dialog */}
      <Dialog open={editWorkspaceDialogOpen} onOpenChange={setEditWorkspaceDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>编辑工作组</DialogTitle>
            <DialogDescription>修改工作组的名称</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">工作组名称</label>
              <Input
                placeholder="请输入工作组名称"
                value={editWorkspaceName}
                onChange={(e) => setEditWorkspaceName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSaveWorkspace()}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditWorkspaceDialogOpen(false)}>取消</Button>
            <Button onClick={handleSaveWorkspace}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 邀请组织 Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>邀请组织加入工作组</DialogTitle>
            <DialogDescription>
              输入组织名称或邀请码，选择组织类型和所属区划进行邀请
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">组织类型</label>
              <Select value={inviteTeamType} onValueChange={(v) => setInviteTeamType(v as UserType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supervisor">监管部门</SelectItem>
                  <SelectItem value="inspector">服务机构</SelectItem>
                  <SelectItem value="enterprise">企业单位</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">组织名称或邀请码</label>
              <Input
                placeholder="请输入组织名称或邀请码"
                value={inviteTeamName}
                onChange={(e) => setInviteTeamName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">所属行政区划</label>
              <Select value={inviteRegionId} onValueChange={setInviteRegionId}>
                <SelectTrigger>
                  <SelectValue placeholder="选择行政区划" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_REGIONS.filter((r) => r.workspaceId === currentWorkspace.id).map((region) => (
                    <SelectItem key={region.id} value={region.id}>{region.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>取消</Button>
            <Button onClick={handleInviteTeam}>发送邀请</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
