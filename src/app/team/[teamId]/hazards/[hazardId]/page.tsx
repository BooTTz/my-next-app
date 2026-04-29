"use client";

import { use } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { HazardLevelBadge, HazardStatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MOCK_HAZARDS } from "@/lib/mock-data";
import { HAZARD_CATEGORY_MAP } from "@/lib/types";
import {
  ArrowLeft, MapPin, User, Calendar, FileText, Camera,
  CheckCircle2, XCircle, Upload,
} from "lucide-react";
import { toast } from "sonner";

export default function HazardDetailPage({ params }: { params: Promise<{ teamId: string; hazardId: string }> }) {
  const { teamId, hazardId } = use(params);
  const hazard = MOCK_HAZARDS.find((h) => h.id === hazardId) || MOCK_HAZARDS[0];

  return (
    <div className="space-y-4">
      <PageHeader title="隐患详情" backHref={`/team/${teamId}/hazards`} backLabel="返回列表">
        <div className="flex items-center gap-2">
          {hazard.status === "pending_acceptance" && (
            <>
              <Button variant="outline" size="sm" onClick={() => toast.error("已退回整改")}>
                <XCircle className="size-3.5" /> 退回整改
              </Button>
              <Button size="sm" onClick={() => toast.success("复查通过，隐患已验收")}>
                <CheckCircle2 className="size-3.5" /> 复查通过
              </Button>
            </>
          )}
        </div>
      </PageHeader>

      <div className="grid grid-cols-3 gap-4">
        {/* 隐患信息 */}
        <div className="col-span-2 space-y-4">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-sm text-muted-foreground">{hazard.hazardNo}</span>
                    <HazardLevelBadge level={hazard.level} />
                    <HazardStatusBadge status={hazard.status} />
                  </div>
                  <h2 className="text-base font-semibold">{hazard.description}</h2>
                </div>
              </div>

              <Separator className="mb-4" />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">隐患类别</p>
                  <p>{HAZARD_CATEGORY_MAP[hazard.category]} &gt; {hazard.subCategoryName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">所在位置</p>
                  <p className="flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-muted-foreground" />
                    {hazard.location}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">所属企业</p>
                  <p>{hazard.enterpriseName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">发现人</p>
                  <p className="flex items-center gap-1.5">
                    <User className="size-3.5 text-muted-foreground" />
                    {hazard.discoveredByName}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">发现时间</p>
                  <p className="flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-muted-foreground" />
                    {hazard.discoveredAt}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">整改期限</p>
                  <p className="flex items-center gap-1.5 font-medium text-status-warning">
                    <Calendar className="size-3.5" />
                    {hazard.deadline}
                  </p>
                </div>
              </div>

              {hazard.legalBasis && (
                <>
                  <Separator className="my-4" />
                  <div className="text-sm">
                    <p className="text-muted-foreground mb-1">违反法规</p>
                    <p>{hazard.legalBasis}</p>
                  </div>
                </>
              )}

              <Separator className="my-4" />

              <div className="text-sm">
                <p className="text-muted-foreground mb-1">整改建议</p>
                <p className="bg-muted/50 rounded-md p-3">{hazard.suggestion}</p>
              </div>

              {/* 现场照片 */}
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">现场照片</p>
                <div className="grid grid-cols-3 gap-2">
                  {hazard.photos.map((_, i) => (
                    <div key={i} className="aspect-video rounded-md bg-muted flex items-center justify-center border">
                      <Camera className="size-6 text-muted-foreground/50" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 整改提交区域（企业方可操作） */}
          {["pending_rectification", "rectifying"].includes(hazard.status) && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">提交整改</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>整改内容 *</Label>
                  <Textarea placeholder="请描述整改措施和完成情况..." rows={3} />
                </div>
                <div className="space-y-2">
                  <Label>整改后照片 *</Label>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Upload className="size-3.5" /> 上传照片
                    </Button>
                    <span className="text-xs text-muted-foreground">支持 jpg/png，单张不超过 10MB</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>整改完成日期 *</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>整改投入费用（元）</Label>
                    <Input type="number" placeholder="0.00" />
                  </div>
                </div>
                <Button onClick={() => toast.success("整改已提交，等待复查")}>
                  提交整改
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 侧边信息 */}
        <div className="space-y-4">
          {/* 状态流转 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">状态流转</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-3 pl-5">
                <div className="absolute left-[7px] top-1 bottom-1 w-px bg-border" />
                {[
                  { status: "待整改", time: hazard.status === "pending_rectification" ? "待整改" : undefined, active: true },
                  { status: "反馈整改", time: hazard.status !== "pending_rectification" ? "已反馈" : undefined },
                  { status: "待验收", time: hazard.status === "pending_acceptance" ? "待复查" : undefined },
                  { status: "已验收", time: hazard.status === "accepted" ? "完成" : undefined },
                ].map((step, i) => (
                  <div key={i} className="relative flex items-start gap-2">
                    <div className={`absolute -left-3.5 top-1 size-2 rounded-full border-2 border-card ${
                      step.time ? "bg-status-success" : "bg-muted"
                    }`} />
                    <div>
                      <p className={`text-xs font-medium ${step.time ? "" : "text-muted-foreground"}`}>
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
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">整改信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground mb-0.5">整改责任人</p>
                <p className="font-medium">{hazard.responsiblePerson || "未指定"}</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground mb-0.5">关联任务</p>
                <Link href={`/team/${teamId}/tasks/${hazard.taskId}`} className="text-primary text-xs hover:underline">
                  查看检查任务
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
