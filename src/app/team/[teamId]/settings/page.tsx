"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { MOCK_TEAMS } from "@/lib/mock-data";
import { Copy, Save, Shield, Users, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const team = MOCK_TEAMS[0];

  return (
    <div className="space-y-4">
      <PageHeader title="团队设置" description="管理团队基本信息和权限配置" />

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">
          {/* 基本信息 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>团队名称</Label>
                  <Input defaultValue={team.name} />
                </div>
                <div className="space-y-2">
                  <Label>所属区域</Label>
                  <Input defaultValue={team.region} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>团队描述</Label>
                <Textarea defaultValue={team.description || ""} rows={3} />
              </div>
              <Button size="sm" onClick={() => toast.success("设置已保存")}>
                <Save className="size-3.5" /> 保存修改
              </Button>
            </CardContent>
          </Card>

          {/* 角色权限 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Shield className="size-4" /> 角色权限管理
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { name: "团队管理员", desc: "全部权限", type: "所有" },
                  { name: "监管负责人", desc: "计划创建、任务验收、报告查看、统计", type: "监管方" },
                  { name: "监管人员", desc: "计划查看、任务验收、报告查看", type: "监管方" },
                  { name: "检查组长", desc: "任务全流程、隐患录入、报告生成", type: "服务方" },
                  { name: "检查员", desc: "任务执行、隐患录入", type: "服务方" },
                  { name: "企业负责人", desc: "整改全流程、报告查看、企业管理", type: "履行方" },
                  { name: "企业安全员", desc: "整改操作、报告查看", type: "履行方" },
                ].map((role) => (
                  <div key={role.name} className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{role.name}</span>
                        <Badge variant="secondary" className="text-[10px]">{role.type}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{role.desc}</p>
                    </div>
                    <Button variant="ghost" size="xs" className="text-xs">
                      编辑权限
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 侧边 */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">邀请码</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md bg-muted p-3 text-center">
                <p className="text-2xl font-mono font-bold tracking-widest">{team.inviteCode}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-3"
                onClick={() => {
                  navigator.clipboard.writeText(team.inviteCode);
                  toast.success("邀请码已复制");
                }}
              >
                <Copy className="size-3.5" /> 复制邀请码
              </Button>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                将此邀请码分享给成员，加入时选择对应用户类型
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">团队信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">创建时间</span>
                <span>{team.createdAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">成员数</span>
                <span className="flex items-center gap-1">
                  <Users className="size-3" /> {team.memberCount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">团队状态</span>
                <Badge variant="secondary" className="text-[10px] bg-status-success/10 text-status-success">
                  活跃
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-status-danger/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-status-danger">危险操作</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" size="sm" className="w-full" onClick={() => toast.error("团队归档需要二次确认")}>
                <Trash2 className="size-3.5" /> 归档团队
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
