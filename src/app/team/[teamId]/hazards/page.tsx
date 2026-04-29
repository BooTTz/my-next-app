"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PageHeader, ListToolbar } from "@/components/shared/PageHeader";
import { HazardLevelBadge, HazardStatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOCK_HAZARDS } from "@/lib/mock-data";
import { HAZARD_CATEGORY_MAP } from "@/lib/types";
import { Eye, AlertTriangle, MapPin, User, Calendar, Camera } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  DetailDialog,
  DetailDialogContent,
  DetailDialogHeader,
  DetailDialogBody,
  DetailDialogFooter,
} from "@/components/shared/DetailDialog";

export default function HazardsListPage() {
  const params = useParams();
  const teamId = params.teamId as string;
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const [selectedHazard, setSelectedHazard] = useState<typeof MOCK_HAZARDS[0] | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const filtered = MOCK_HAZARDS.filter((h) => {
    const matchSearch =
      h.hazardNo.includes(search) ||
      h.description.includes(search) ||
      (h.enterpriseName || "").includes(search);
    if (tab === "all") return matchSearch;
    if (tab === "major") return matchSearch && h.level === "major";
    if (tab === "pending") return matchSearch && ["discovered", "notified", "rectifying"].includes(h.status);
    if (tab === "closed") return matchSearch && h.status === "closed";
    return matchSearch;
  });

  const majorCount = MOCK_HAZARDS.filter((h) => h.level === "major").length;
  const pendingCount = MOCK_HAZARDS.filter((h) => ["discovered", "notified", "rectifying", "submitted"].includes(h.status)).length;
  const closedCount = MOCK_HAZARDS.filter((h) => h.status === "closed").length;

  return (
    <div className="space-y-4">
      <PageHeader title="隐患管理">
        <div className="flex items-center gap-3 text-sm">
          <span className="flex items-center gap-1.5">
            <AlertTriangle className="size-3.5 text-status-danger" />
            <span className="text-muted-foreground">重大</span>
            <span className="font-medium text-status-danger">{majorCount}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-status-warning" />
            <span className="text-muted-foreground">待处理</span>
            <span className="font-medium">{pendingCount}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-status-success" />
            <span className="text-muted-foreground">已销号</span>
            <span className="font-medium">{closedCount}</span>
          </span>
        </div>
      </PageHeader>

      <Card>
        <CardContent className="p-4">
          <Tabs value={tab} onValueChange={setTab}>
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="all">全部 ({MOCK_HAZARDS.length})</TabsTrigger>
                <TabsTrigger value="major">重大隐患 ({majorCount})</TabsTrigger>
                <TabsTrigger value="pending">待处理 ({pendingCount})</TabsTrigger>
                <TabsTrigger value="closed">已销号 ({closedCount})</TabsTrigger>
              </TabsList>
            </div>

            <div className="mt-3">
              <ListToolbar
                searchPlaceholder="搜索隐患编号、描述、企业..."
                searchValue={search}
                onSearchChange={setSearch}
                onFilter={() => toast.info("筛选功能")}
                onExport={() => toast.info("导出功能")}
                onRefresh={() => toast.info("已刷新")}
              />
            </div>

            <TabsContent value={tab} className="mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[110px]">隐患编号</TableHead>
                      <TableHead className="w-[70px]">等级</TableHead>
                      <TableHead className="w-[80px]">类别</TableHead>
                      <TableHead className="w-[80px]">子类</TableHead>
                      <TableHead>隐患描述</TableHead>
                      <TableHead className="w-[140px]">所属企业</TableHead>
                      <TableHead className="w-[80px]">状态</TableHead>
                      <TableHead className="w-[90px]">整改期限</TableHead>
                      <TableHead className="w-[70px]">发现人</TableHead>
                      <TableHead className="w-[60px] text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((h) => (
                      <TableRow key={h.id}>
                        <TableCell className="font-mono text-xs">{h.hazardNo}</TableCell>
                        <TableCell><HazardLevelBadge level={h.level} /></TableCell>
                        <TableCell className="text-xs">{HAZARD_CATEGORY_MAP[h.category]}</TableCell>
                        <TableCell className="text-xs">{h.subCategoryName}</TableCell>
                        <TableCell>
                          <Link
                            href={`/team/${teamId}/hazards/${h.id}`}
                            className="text-sm hover:text-primary transition-colors line-clamp-1 max-w-[200px]"
                          >
                            {h.description}
                          </Link>
                        </TableCell>
                        <TableCell className="text-xs truncate max-w-[140px]">{h.enterpriseName}</TableCell>
                        <TableCell><HazardStatusBadge status={h.status} /></TableCell>
                        <TableCell className="text-xs">{h.deadline}</TableCell>
                        <TableCell className="text-xs">{h.discoveredByName}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-muted-foreground hover:text-foreground"
                            onClick={() => {
                              setSelectedHazard(h);
                              setDetailOpen(true);
                            }}
                          >
                            <Eye className="size-3.5" />
                            <span className="ml-1">查看</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">共 {filtered.length} 条记录</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="xs" disabled>上一页</Button>
              <Button variant="outline" size="xs" className="bg-primary text-primary-foreground">1</Button>
              <Button variant="outline" size="xs" disabled>下一页</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 隐患详情弹窗 */}
      {selectedHazard && (
        <DetailDialog open={detailOpen} onOpenChange={setDetailOpen}>
          <DetailDialogContent className="max-w-[1000px]">
            <DetailDialogHeader
              title="隐患详情"
              description={`编号：${selectedHazard.hazardNo}`}
            />
            <DetailDialogBody>
              <div className="flex gap-6">
                {/* 主要信息 - 左侧可滚动 */}
                <div className="flex-1 space-y-4 max-h-[calc(85vh-180px)] overflow-y-auto pr-2">
                  <Card>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <HazardLevelBadge level={selectedHazard.level} />
                            <HazardStatusBadge status={selectedHazard.status} />
                          </div>
                          <h3 className="text-base font-semibold">{selectedHazard.description}</h3>
                        </div>
                      </div>

                      <Separator className="mb-4" />

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground mb-1">隐患类别</p>
                          <p>{HAZARD_CATEGORY_MAP[selectedHazard.category]} &gt; {selectedHazard.subCategoryName}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">所在位置</p>
                          <p className="flex items-center gap-1.5">
                            <MapPin className="size-3.5 text-muted-foreground" />
                            {selectedHazard.location}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">所属企业</p>
                          <p>{selectedHazard.enterpriseName}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">发现人</p>
                          <p className="flex items-center gap-1.5">
                            <User className="size-3.5 text-muted-foreground" />
                            {selectedHazard.discoveredByName}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">发现时间</p>
                          <p className="flex items-center gap-1.5">
                            <Calendar className="size-3.5 text-muted-foreground" />
                            {selectedHazard.discoveredAt}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">整改期限</p>
                          <p className={cn(
                            "flex items-center gap-1.5 font-medium",
                            selectedHazard.status !== "closed" && "text-status-warning"
                          )}>
                            <Calendar className="size-3.5" />
                            {selectedHazard.deadline}
                          </p>
                        </div>
                      </div>

                      {selectedHazard.legalBasis && (
                        <>
                          <Separator className="my-4" />
                          <div className="text-sm">
                            <p className="text-muted-foreground mb-1">违反法规</p>
                            <p>{selectedHazard.legalBasis}</p>
                          </div>
                        </>
                      )}

                      <Separator className="my-4" />

                      <div className="text-sm">
                        <p className="text-muted-foreground mb-1">整改建议</p>
                        <p className="bg-muted/50 rounded-md p-3">{selectedHazard.suggestion}</p>
                      </div>

                      {/* 现场照片 */}
                      <div className="mt-4">
                        <p className="text-sm text-muted-foreground mb-2">现场照片</p>
                        <div className="grid grid-cols-3 gap-2">
                          {selectedHazard.photos.map((_, i) => (
                            <div key={i} className="aspect-video rounded-md bg-muted flex items-center justify-center border">
                              <Camera className="size-6 text-muted-foreground/50" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* 侧边信息 - 右侧固定 */}
                <div className="w-64 shrink-0 space-y-4">
                  {/* 状态流转 */}
                  <Card>
                    <CardContent className="pt-4">
                      <p className="text-sm font-medium mb-3">状态流转</p>
                      <div className="relative space-y-3 pl-5">
                        <div className="absolute left-[7px] top-1 bottom-1 w-px bg-border" />
                        {[
                          { status: "已发现", time: selectedHazard.discoveredAt, active: true },
                          { status: "已通知", time: selectedHazard.status !== "discovered" ? selectedHazard.discoveredAt : undefined },
                          { status: "整改中", time: selectedHazard.status === "rectifying" ? "进行中" : undefined },
                          { status: "已提交整改", time: selectedHazard.status === "submitted" ? "待复查" : undefined },
                          { status: "已销号", time: selectedHazard.status === "closed" ? "完成" : undefined },
                        ].map((step, i) => (
                          <div key={i} className="relative flex items-start gap-2">
                            <div className={cn(
                              "absolute -left-3.5 top-1 size-2 rounded-full border-2 border-background",
                              step.time ? "bg-status-success" : "bg-muted"
                            )} />
                            <div>
                              <p className={cn("text-xs font-medium", !step.time && "text-muted-foreground")}>
                                {step.status}
                              </p>
                              {step.time && (
                                <p className="text-[10px] text-muted-foreground">{step.time}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* 整改责任 */}
                  <Card>
                    <CardContent className="pt-4 space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">整改责任人</p>
                        <p className="text-sm font-medium">{selectedHazard.responsiblePerson || "未指定"}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </DetailDialogBody>
            <DetailDialogFooter>
              <Button variant="outline" onClick={() => setDetailOpen(false)}>关闭</Button>
            </DetailDialogFooter>
          </DetailDialogContent>
        </DetailDialog>
      )}
    </div>
  );
}
