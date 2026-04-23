"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { MOCK_ORGANIZATIONS, MOCK_USERS, MOCK_CERTIFICATES } from "@/lib/mock-data";
import type { UserType, Certificate } from "@/lib/types";
import {
  ArrowLeft, Upload, Plus, Trash2, User as UserIcon,
} from "lucide-react";
import { toast } from "sonner";

// ─── 常量 ──────────────────────────────────────────────────────────────────────

const CITIES = ["北京市", "上海市", "杭州市", "深圳市", "广州市", "成都市"];

const INDUSTRIES = ["冶金", "化工", "建材", "机械", "轻工", "其他"];

const SUB_INDUSTRIES = ["工贸", "化工", "其他"];

const EDUCATIONS = ["高中", "大专", "本科", "硕士", "博士"];

const ORG_TYPE_MAP: Record<UserType, string> = {
  supervisor: "监管部门",
  inspector: "服务机构",
  enterprise: "企业单位",
};

// ─── 类型 ──────────────────────────────────────────────────────────────────────

interface CertRow {
  id: string;
  name: string;
  issuingAuthority: string;
  validStartDate: string;
  validEndDate: string;
}

interface OrgForm {
  // 管理员
  adminUserId: string;
  // 系统信息
  systemName: string;
  // 基本信息
  name: string;
  shortName: string;
  teamType: UserType | "";
  locationName: string;
  contactPerson: string;
  contactPhone: string;
  // 监管方
  supervisoryIndustry: string;
  supervisoryScope: string;
  // 服务方 / 履行方
  industry: string;
  subIndustry: string;
  creditCode: string;
  detailedAddress: string;
  companyIntro: string;
  businessScope: string;
  // 服务方人员补充
  highestEducation: string;
  safetyWorkYears: string;
  mainServiceItems: string;
  mainServiceFields: string;
  // 证书（服务方）
  certificates: CertRow[];
}

const EMPTY_FORM: OrgForm = {
  adminUserId: "",
  systemName: "",
  name: "",
  shortName: "",
  teamType: "",
  locationName: "",
  contactPerson: "",
  contactPhone: "",
  supervisoryIndustry: "",
  supervisoryScope: "",
  industry: "",
  subIndustry: "",
  creditCode: "",
  detailedAddress: "",
  companyIntro: "",
  businessScope: "",
  highestEducation: "",
  safetyWorkYears: "",
  mainServiceItems: "",
  mainServiceFields: "",
  certificates: [],
};

// ─── 辅助组件 ─────────────────────────────────────────────────────────────────

function OrgTypeBadge({ type }: { type: UserType }) {
  const map: Record<UserType, { label: string; className: string }> = {
    supervisor: { label: "监管部门", className: "bg-blue-500/10 text-blue-600 border-blue-500/30" },
    inspector: { label: "服务机构", className: "bg-green-500/10 text-green-600 border-green-500/30" },
    enterprise: { label: "企业单位", className: "bg-amber-500/10 text-amber-600 border-amber-500/30" },
  };
  const { label, className } = map[type];
  return <Badge variant="outline" className={className}>{label}</Badge>;
}

function FieldRow({ label, required, children }: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  );
}

// ─── 主页面 ───────────────────────────────────────────────────────────────────

export default function OrgEditPage() {
  const params = useParams();
  const router = useRouter();
  const orgId = params.orgId as string;
  const isNew = orgId === "new";

  // 查找已有组织
  const existingOrg = useMemo(
    () => (isNew ? undefined : MOCK_ORGANIZATIONS.find((o) => o.id === orgId)),
    [isNew, orgId]
  );

  // 对应证书
  const existingCerts = useMemo<CertRow[]>(() => {
    if (isNew || !existingOrg) return [];
    return MOCK_CERTIFICATES
      .filter((c: Certificate) => c.orgId === orgId)
      .map((c: Certificate) => ({
        id: c.id,
        name: c.name,
        issuingAuthority: c.issuingAuthority,
        validStartDate: c.validStartDate,
        validEndDate: c.validEndDate,
      }));
  }, [isNew, existingOrg, orgId]);

  // 初始化表单
  const [form, setForm] = useState<OrgForm>(() => {
    if (isNew) return EMPTY_FORM;
    if (!existingOrg) return EMPTY_FORM;
    return {
      adminUserId: existingOrg.orgAdminUserId ?? "",
      systemName: existingOrg.systemName ?? "",
      name: existingOrg.name,
      shortName: existingOrg.shortName ?? "",
      teamType: existingOrg.teamType,
      locationName: existingOrg.locationName ?? "",
      contactPerson: existingOrg.contactPerson ?? "",
      contactPhone: existingOrg.contactPhone ?? "",
      supervisoryIndustry: existingOrg.supervisoryIndustry ?? "",
      supervisoryScope: existingOrg.supervisoryScope ?? "",
      industry: existingOrg.industry ?? "",
      subIndustry: existingOrg.subIndustry ?? "",
      creditCode: existingOrg.creditCode ?? "",
      detailedAddress: existingOrg.detailedAddress ?? "",
      companyIntro: existingOrg.companyIntro ?? "",
      businessScope: existingOrg.businessScope ?? "",
      highestEducation: existingOrg.highestEducation ?? "",
      safetyWorkYears: existingOrg.safetyWorkYears != null ? String(existingOrg.safetyWorkYears) : "",
      mainServiceItems: existingOrg.mainServiceItems ?? "",
      mainServiceFields: existingOrg.mainServiceFields ?? "",
      certificates: existingCerts,
    };
  });

  function setField<K extends keyof OrgForm>(key: K, value: OrgForm[K]) {
    setForm((s) => ({ ...s, [key]: value }));
  }

  // 证书行操作
  function addCertRow() {
    const newRow: CertRow = {
      id: `new-${Date.now()}`,
      name: "",
      issuingAuthority: "",
      validStartDate: "",
      validEndDate: "",
    };
    setField("certificates", [...form.certificates, newRow]);
  }

  function removeCertRow(id: string) {
    setField("certificates", form.certificates.filter((c) => c.id !== id));
  }

  function updateCertRow(id: string, key: keyof Omit<CertRow, "id">, value: string) {
    setField(
      "certificates",
      form.certificates.map((c) => (c.id === id ? { ...c, [key]: value } : c))
    );
  }

  // 当前管理员用户
  const adminUser = useMemo(
    () => MOCK_USERS.find((u) => u.id === form.adminUserId),
    [form.adminUserId]
  );

  // 验证
  function validate(): string | null {
    if (isNew && !form.adminUserId) return "请指定组织管理员";
    if (!form.name || form.name.length < 2 || form.name.length > 50) return "组织名称需2-50字符";
    if (!form.teamType) return "请选择组织类型";
    if (!form.contactPerson || form.contactPerson.length < 2 || form.contactPerson.length > 20) {
      return "主要联系人需2-20字符";
    }
    if (!/^1\d{10}$/.test(form.contactPhone)) return "联系人电话需为11位手机号";
    const needCredit = form.teamType === "inspector" || form.teamType === "enterprise";
    if (needCredit && !/^.{18}$/.test(form.creditCode)) return "社会信用代码需为18位";
    if (needCredit && !form.detailedAddress) return "详细地址不能为空";
    return null;
  }

  function handleSubmit() {
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }
    toast.success(isNew ? "组织创建成功" : "保存成功");
    router.push("/admin/organizations");
  }

  // 未找到组织（编辑模式）
  if (!isNew && !existingOrg) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push("/admin/organizations")}>
            <ArrowLeft className="size-4 mr-1" /> 返回
          </Button>
        </div>
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            组织不存在或已被删除
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-4xl">
      {/* 页面头部 */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => router.push("/admin/organizations")}>
          <ArrowLeft className="size-4 mr-1" /> 返回
        </Button>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            {isNew ? "新建组织" : "编辑组织"}
          </h1>
          {!isNew && existingOrg && (
            <p className="text-sm text-muted-foreground">{existingOrg.name}</p>
          )}
        </div>
      </div>

      {/* a. 指定组织管理员（仅新建模式） */}
      {isNew ? (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">指定组织管理员</CardTitle>
            <p className="text-sm text-muted-foreground">每个组织有且仅有一名组织管理员</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <FieldRow label="选择管理员" required>
              <Select value={form.adminUserId} onValueChange={(v) => setField("adminUserId", v ?? "")}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择用户..." />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_USERS.filter((u) => u.platformRole !== "super_admin").map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.realName}（{u.phone}）
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldRow>

            {adminUser && (
              <div className="flex items-center gap-3 rounded-md border bg-muted/40 p-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <UserIcon className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">{adminUser.realName}</p>
                  <p className="text-xs text-muted-foreground">{adminUser.phone}</p>
                  <p className="text-xs text-muted-foreground">{adminUser.username}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        /* 编辑模式：只读显示当前管理员 */
        existingOrg?.orgAdminUserId && (() => {
          const admin = MOCK_USERS.find((u) => u.id === existingOrg.orgAdminUserId);
          return admin ? (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">组织管理员</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 rounded-md border bg-muted/40 p-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <UserIcon className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{admin.realName}</p>
                    <p className="text-xs text-muted-foreground">{admin.phone}</p>
                    <p className="text-xs text-muted-foreground">{admin.username}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null;
        })()
      )}

      {/* b. 系统信息 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">系统信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-6">
            {/* Logo 上传占位 */}
            <div className="flex-shrink-0">
              <div className="flex size-[120px] flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed text-muted-foreground hover:bg-muted/40 cursor-pointer transition-colors">
                <Upload className="size-6" />
                <span className="text-xs">上传 Logo</span>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <FieldRow label="系统名称">
                <Input
                  placeholder="请输入系统名称"
                  value={form.systemName}
                  onChange={(e) => setField("systemName", e.target.value)}
                />
              </FieldRow>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* c. 基本信息 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">基本信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <FieldRow label="组织名称" required>
              <Input
                placeholder="2-50字符"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
              />
            </FieldRow>

            <FieldRow label="组织简称">
              <Input
                placeholder="2-20字符（选填）"
                value={form.shortName}
                onChange={(e) => setField("shortName", e.target.value)}
              />
            </FieldRow>

            <FieldRow label="组织类型" required>
              {isNew ? (
                <Select
                  value={form.teamType}
                  onValueChange={(v) => setField("teamType", (v ?? "") as UserType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="请选择组织类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supervisor">监管部门</SelectItem>
                    <SelectItem value="inspector">服务机构</SelectItem>
                    <SelectItem value="enterprise">企业单位</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex items-center h-9">
                  {form.teamType ? (
                    <OrgTypeBadge type={form.teamType} />
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                  <span className="ml-2 text-xs text-muted-foreground">（创建后不可修改）</span>
                </div>
              )}
            </FieldRow>

            <FieldRow label="所在位置">
              <Select
                value={form.locationName}
                onValueChange={(v) => setField("locationName", v ?? "")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择城市" />
                </SelectTrigger>
                <SelectContent>
                  {CITIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldRow>

            <FieldRow label="主要联系人" required>
              <Input
                placeholder="2-20字符"
                value={form.contactPerson}
                onChange={(e) => setField("contactPerson", e.target.value)}
              />
            </FieldRow>

            <FieldRow label="主要联系人电话" required>
              <Input
                placeholder="11位手机号"
                value={form.contactPhone}
                onChange={(e) => setField("contactPhone", e.target.value)}
              />
            </FieldRow>
          </div>
        </CardContent>
      </Card>

      {/* d. 差异化字段区 */}
      {form.teamType === "supervisor" && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">监管部门信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FieldRow label="监管行业">
              <Select
                value={form.supervisoryIndustry}
                onValueChange={(v) => setField("supervisoryIndustry", v ?? "")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择行业" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((i) => (
                    <SelectItem key={i} value={i}>{i}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldRow>
            <FieldRow label="监管范围描述">
              <Textarea
                placeholder="请输入监管范围描述（500字以内）"
                maxLength={500}
                rows={3}
                value={form.supervisoryScope}
                onChange={(e) => setField("supervisoryScope", e.target.value)}
              />
            </FieldRow>
          </CardContent>
        </Card>
      )}

      {form.teamType === "inspector" && (
        <>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">服务机构信息</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <FieldRow label="所属行业">
                  <Select
                    value={form.industry}
                    onValueChange={(v) => setField("industry", v ?? "")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="请选择行业" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRIES.map((i) => (
                        <SelectItem key={i} value={i}>{i}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldRow>

                <FieldRow label="细分行业">
                  <Select
                    value={form.subIndustry}
                    onValueChange={(v) => setField("subIndustry", v ?? "")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="请选择细分行业" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUB_INDUSTRIES.map((i) => (
                        <SelectItem key={i} value={i}>{i}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldRow>

                <FieldRow label="社会信用代码" required>
                  <Input
                    placeholder="18位统一社会信用代码"
                    maxLength={18}
                    value={form.creditCode}
                    onChange={(e) => setField("creditCode", e.target.value)}
                  />
                </FieldRow>

                <FieldRow label="最高学历">
                  <Select
                    value={form.highestEducation}
                    onValueChange={(v) => setField("highestEducation", v ?? "")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="请选择" />
                    </SelectTrigger>
                    <SelectContent>
                      {EDUCATIONS.map((e) => (
                        <SelectItem key={e} value={e}>{e}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldRow>

                <div className="col-span-2">
                  <FieldRow label="详细地址" required>
                    <Input
                      placeholder="请输入详细地址"
                      value={form.detailedAddress}
                      onChange={(e) => setField("detailedAddress", e.target.value)}
                    />
                  </FieldRow>
                </div>

                <FieldRow label="从事安全生产工作年限">
                  <Input
                    type="number"
                    min={0}
                    placeholder="年"
                    value={form.safetyWorkYears}
                    onChange={(e) => setField("safetyWorkYears", e.target.value)}
                  />
                </FieldRow>

                <div className="col-span-2">
                  <FieldRow label="公司简介">
                    <Textarea
                      placeholder="请输入公司简介（500字以内）"
                      maxLength={500}
                      rows={3}
                      value={form.companyIntro}
                      onChange={(e) => setField("companyIntro", e.target.value)}
                    />
                  </FieldRow>
                </div>

                <div className="col-span-2">
                  <FieldRow label="经营范围">
                    <Textarea
                      placeholder="请输入经营范围（500字以内）"
                      maxLength={500}
                      rows={3}
                      value={form.businessScope}
                      onChange={(e) => setField("businessScope", e.target.value)}
                    />
                  </FieldRow>
                </div>

                <div className="col-span-2">
                  <FieldRow label="主要服务项目">
                    <Textarea
                      placeholder="请输入主要服务项目"
                      rows={2}
                      value={form.mainServiceItems}
                      onChange={(e) => setField("mainServiceItems", e.target.value)}
                    />
                  </FieldRow>
                </div>

                <div className="col-span-2">
                  <FieldRow label="主要服务行业领域">
                    <Textarea
                      placeholder="请输入主要服务行业领域"
                      rows={2}
                      value={form.mainServiceFields}
                      onChange={(e) => setField("mainServiceFields", e.target.value)}
                    />
                  </FieldRow>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 证书管理子表 */}
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base">证书管理</CardTitle>
              <Button variant="outline" size="sm" onClick={addCertRow}>
                <Plus className="size-3.5 mr-1.5" />
                添加证书
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">序号</TableHead>
                      <TableHead>证书名称</TableHead>
                      <TableHead>发证机构</TableHead>
                      <TableHead className="w-[140px]">有效期开始</TableHead>
                      <TableHead className="w-[140px]">有效期结束</TableHead>
                      <TableHead className="w-[60px] text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {form.certificates.map((cert, idx) => (
                      <TableRow key={cert.id}>
                        <TableCell className="text-center text-sm text-muted-foreground">
                          {idx + 1}
                        </TableCell>
                        <TableCell>
                          <Input
                            placeholder="证书名称"
                            className="h-8"
                            value={cert.name}
                            onChange={(e) => updateCertRow(cert.id, "name", e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            placeholder="发证机构"
                            className="h-8"
                            value={cert.issuingAuthority}
                            onChange={(e) => updateCertRow(cert.id, "issuingAuthority", e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="date"
                            className="h-8"
                            value={cert.validStartDate}
                            onChange={(e) => updateCertRow(cert.id, "validStartDate", e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="date"
                            className="h-8"
                            value={cert.validEndDate}
                            onChange={(e) => updateCertRow(cert.id, "validEndDate", e.target.value)}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 text-destructive hover:text-destructive"
                            title="删除"
                            onClick={() => removeCertRow(cert.id)}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {form.certificates.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-6 text-muted-foreground text-sm"
                        >
                          暂无证书，点击{`"添加证书"`}新增
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {form.teamType === "enterprise" && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">企业单位信息</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <FieldRow label="所属行业">
                <Select
                  value={form.industry}
                  onValueChange={(v) => setField("industry", v ?? "")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="请选择行业" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((i) => (
                      <SelectItem key={i} value={i}>{i}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldRow>

              <FieldRow label="细分行业">
                <Select
                  value={form.subIndustry}
                  onValueChange={(v) => setField("subIndustry", v ?? "")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="请选择细分行业" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUB_INDUSTRIES.map((i) => (
                      <SelectItem key={i} value={i}>{i}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldRow>

              <FieldRow label="社会信用代码" required>
                <Input
                  placeholder="18位统一社会信用代码"
                  maxLength={18}
                  value={form.creditCode}
                  onChange={(e) => setField("creditCode", e.target.value)}
                />
              </FieldRow>

              <div className="col-span-2">
                <FieldRow label="详细地址" required>
                  <Input
                    placeholder="请输入详细地址"
                    value={form.detailedAddress}
                    onChange={(e) => setField("detailedAddress", e.target.value)}
                  />
                </FieldRow>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* e. 底部操作区 */}
      <div className="flex items-center justify-end gap-3 py-2">
        <Separator className="hidden" />
        <Button variant="outline" onClick={() => router.push("/admin/organizations")}>
          取消
        </Button>
        <Button onClick={handleSubmit}>
          {isNew ? "创建组织" : "保存"}
        </Button>
      </div>
    </div>
  );
}
