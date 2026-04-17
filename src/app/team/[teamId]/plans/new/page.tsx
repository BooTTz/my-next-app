"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { MOCK_ENTERPRISES, MOCK_MEMBERS } from "@/lib/mock-data";
import { ArrowLeft, Save, Send } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function NewPlanPage() {
  const router = useRouter();
  const [selectedEnterprises, setSelectedEnterprises] = useState<string[]>([]);

  const handleSubmit = (isDraft: boolean) => {
    toast.success(isDraft ? "计划已保存为草稿" : "计划已发布，任务已下达");
    router.push("/team/t1/plans");
  };

  const inspectors = MOCK_MEMBERS.filter((m) => m.userType === "inspector");

  return (
    <div className="space-y-4">
      <PageHeader title="新建检查计划">
        <Link href="/team/t1/plans">
          <Button variant="outline" size="sm">
            <ArrowLeft className="size-3.5" /> 返回列表
          </Button>
        </Link>
      </PageHeader>

      <div className="grid grid-cols-3 gap-4">
        {/* 主要表单 */}
        <div className="col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>计划名称 *</Label>
                  <Input placeholder="请输入检查计划名称" />
                </div>
                <div className="space-y-2">
                  <Label>检查类型 *</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="选择检查类型" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="routine">日常检查</SelectItem>
                      <SelectItem value="special">专项检查</SelectItem>
                      <SelectItem value="random">双随机检查</SelectItem>
                      <SelectItem value="holiday">节假日检查</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>计划年度 *</Label>
                  <Select defaultValue="2025">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>开始日期 *</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>结束日期 *</Label>
                  <Input type="date" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>计划说明</Label>
                <Textarea placeholder="请输入检查计划的详细说明..." rows={3} />
              </div>
              <div className="space-y-2">
                <Label>检查范围</Label>
                <Textarea placeholder="请描述本次检查的范围..." rows={2} />
              </div>
              <div className="space-y-2">
                <Label>检查依据</Label>
                <Textarea placeholder="引用的法规标准，如《安全生产法》等..." rows={2} />
              </div>
            </CardContent>
          </Card>

          {/* 被检查企业选择 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">选择被检查企业 *</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {MOCK_ENTERPRISES.map((e) => (
                  <label
                    key={e.id}
                    className="flex items-center gap-3 rounded-md border p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      checked={selectedEnterprises.includes(e.id)}
                      onCheckedChange={(checked) => {
                        setSelectedEnterprises((prev) =>
                          checked ? [...prev, e.id] : prev.filter((id) => id !== e.id)
                        );
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{e.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {e.address} · {e.safetyDirector} · {e.safetyDirectorPhone}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 侧边信息 */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">操作</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" onClick={() => handleSubmit(false)}>
                <Send className="size-3.5" /> 发布计划
              </Button>
              <Button variant="outline" className="w-full" onClick={() => handleSubmit(true)}>
                <Save className="size-3.5" /> 保存草稿
              </Button>
              <Separator className="my-3" />
              <p className="text-xs text-muted-foreground">
                发布后将自动为每个被检查企业创建检查任务，并通知对应的服务方人员。
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">分配检查人员</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {inspectors.map((m) => (
                  <label key={m.userId} className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox defaultChecked />
                    <span>{m.user?.realName}</span>
                    <span className="text-xs text-muted-foreground">({m.roleName})</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
