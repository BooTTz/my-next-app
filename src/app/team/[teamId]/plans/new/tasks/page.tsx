"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { PageHeader, ListToolbar } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  DetailDialog,
  DetailDialogContent,
  DetailDialogHeader,
  DetailDialogBody,
  DetailDialogFooter,
} from "@/components/shared/DetailDialog";
import { MOCK_ENTERPRISES, MOCK_MEMBERS } from "@/lib/mock-data";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

interface TaskForm {
  id: string;
  enterpriseId: string;
  enterpriseName: string;
  leadInspectorId: string;
  leadInspectorName: string;
  inspectorIds: string[];
  inspectorNames: string[];
  scheduledDate: string;
  checkItems: string;
}

export default function PlanTasksConfigPage() {
  const router = useRouter();
  const params = useParams();
  const teamId = params.teamId as string;
  const [search, setSearch] = useState("");
  const [tasks, setTasks] = useState<TaskForm[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // 新建任务表单
  const [formEnterpriseId, setFormEnterpriseId] = useState("");
  const [formLeadInspector, setFormLeadInspector] = useState("");
  const [formScheduledDate, setFormScheduledDate] = useState("");
  const [formCheckItems, setFormCheckItems] = useState("");

  const inspectors = MOCK_MEMBERS.filter((m) => m.userType === "inspector");
  const usedEnterprises = tasks.map((t) => t.enterpriseId);

  const resetForm = () => {
    setFormEnterpriseId("");
    setFormLeadInspector("");
    setFormScheduledDate("");
    setFormCheckItems("");
    setEditingIndex(null);
  };

  const handleAddTask = () => {
    if (!formEnterpriseId || !formLeadInspector || !formScheduledDate) {
      toast.error("请填写完整任务信息");
      return;
    }
    const enterprise = MOCK_ENTERPRISES.find((e) => e.id === formEnterpriseId);
    const leadInspector = inspectors.find((m) => m.userId === formLeadInspector);
    if (!enterprise || !leadInspector) return;

    const newTask: TaskForm = {
      id: `tmp-${Date.now()}`,
      enterpriseId: formEnterpriseId,
      enterpriseName: enterprise.name,
      leadInspectorId: formLeadInspector,
      leadInspectorName: leadInspector.user?.realName || "",
      inspectorIds: [formLeadInspector],
      inspectorNames: [leadInspector.user?.realName || ""],
      scheduledDate: formScheduledDate,
      checkItems: formCheckItems,
    };

    if (editingIndex !== null) {
      setTasks((prev) => prev.map((t, i) => (i === editingIndex ? newTask : t)));
    } else {
      setTasks((prev) => [...prev, newTask]);
    }

    resetForm();
    setAddOpen(false);
    toast.success(editingIndex !== null ? "任务已更新" : "任务已添加");
  };

  const handleRemoveTask = (index: number) => {
    setTasks((prev) => prev.filter((_, i) => i !== index));
    toast.success("任务已移除");
  };

  const handleSaveAll = () => {
    if (tasks.length === 0) {
      toast.error("请至少添加一个检查任务");
      return;
    }
    toast.success(`已保存 ${tasks.length} 个检查任务`);
    router.push(`/team/${teamId}/plans`);
  };

  return (
    <div className="space-y-4">
      {/* 返回按钮 */}
      <div className="flex items-center gap-4">
        <Link
          href={`/team/${teamId}/plans`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          返回检查计划
        </Link>
      </div>

      <PageHeader title="配置检查任务">
        <Button size="sm" onClick={() => { resetForm(); setAddOpen(true); }}>
          <Plus className="size-3.5" /> 添加任务
        </Button>
      </PageHeader>

      {/* 操作提示 */}
      <Card className="bg-muted/30">
        <CardContent className="p-3">
          <p className="text-sm text-muted-foreground">
            为当前检查计划配置具体的检查任务。每个任务对应一个被检查企业，需指定检查组长和计划检查日期。
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <ListToolbar
            searchPlaceholder="搜索企业名称..."
            searchValue={search}
            onSearchChange={setSearch}
          />

          <div className="mt-4 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">#</TableHead>
                  <TableHead>被检查企业</TableHead>
                  <TableHead className="w-[100px]">检查组长</TableHead>
                  <TableHead className="w-[120px]">检查人员</TableHead>
                  <TableHead className="w-[100px]">计划日期</TableHead>
                  <TableHead>检查内容</TableHead>
                  <TableHead className="w-[80px] text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-sm text-muted-foreground">
                      暂无检查任务，点击上方"添加任务"按钮开始配置
                    </TableCell>
                  </TableRow>
                ) : (
                  tasks
                    .filter(
                      (t) =>
                        !search || t.enterpriseName.includes(search)
                    )
                    .map((task, index) => (
                      <TableRow key={task.id}>
                        <TableCell className="text-xs text-muted-foreground">{index + 1}</TableCell>
                        <TableCell className="text-sm font-medium">{task.enterpriseName}</TableCell>
                        <TableCell className="text-sm">{task.leadInspectorName}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {task.inspectorNames.map((name) => (
                              <Badge key={name} variant="secondary" className="text-[10px] px-1.5">
                                {name}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs">{task.scheduledDate}</TableCell>
                        <TableCell className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {task.checkItems || "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-destructive hover:text-destructive"
                            onClick={() => handleRemoveTask(index)}
                            title="移除任务"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">共 {tasks.length} 个检查任务</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => router.push(`/team/${teamId}/plans`)}>
                取消
              </Button>
              <Button onClick={handleSaveAll}>
                <Save className="size-3.5" /> 保存全部任务
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 添加/编辑任务弹窗 */}
      <DetailDialog open={addOpen} onOpenChange={(open) => { if (!open) resetForm(); setAddOpen(open); }}>
        <DetailDialogContent className="max-w-[700px]">
          <DetailDialogHeader title={editingIndex !== null ? "编辑检查任务" : "添加检查任务"} />
          <DetailDialogBody>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>被检查企业 *</Label>
                <Select value={formEnterpriseId} onValueChange={(v) => setFormEnterpriseId(v ?? "")}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择被检查企业" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_ENTERPRISES.map((e) => (
                      <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>检查组长 *</Label>
                <Select value={formLeadInspector} onValueChange={(v) => setFormLeadInspector(v ?? "")}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择检查组长" />
                  </SelectTrigger>
                  <SelectContent>
                    {inspectors.map((m) => (
                      <SelectItem key={m.userId} value={m.userId}>
                        {m.user?.realName} ({m.roleName})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>计划检查日期 *</Label>
                <Input
                  type="date"
                  value={formScheduledDate}
                  onChange={(e) => setFormScheduledDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>检查内容</Label>
                <Input
                  placeholder="如：消防安全、用电安全、设备设施..."
                  value={formCheckItems}
                  onChange={(e) => setFormCheckItems(e.target.value)}
                />
              </div>
            </div>
          </DetailDialogBody>
          <DetailDialogFooter>
            <Button variant="outline" onClick={() => { resetForm(); setAddOpen(false); }}>取消</Button>
            <Button onClick={handleAddTask}>
              {editingIndex !== null ? "保存修改" : "添加"}
            </Button>
          </DetailDialogFooter>
        </DetailDialogContent>
      </DetailDialog>
    </div>
  );
}
