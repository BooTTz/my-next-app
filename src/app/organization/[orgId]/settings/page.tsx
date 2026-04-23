"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import {
  ArrowLeft,
  Upload,
  Trash2,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { useAppStore } from "@/lib/store";
import { useHydrated } from "@/hooks/useHydrated";
import { MOCK_ORGANIZATIONS, MOCK_CERTIFICATES } from "@/lib/mock-data";
import type { UserType, Organization, Certificate } from "@/lib/types";
import { USER_TYPE_MAP } from "@/lib/types";

/* =========================================
 * 辅助类型与常量
 * ========================================= */

interface CertFormItem {
  id: string;
  seqNo: number;
  name: string;
  issuingAuthority: string;
  validStartDate: string;
  validEndDate: string;
}

const TYPE_STYLES: Record<UserType, string> = {
  supervisor: "bg-blue-500/10 text-blue-600",
  inspector: "bg-green-500/10 text-green-600",
  enterprise: "bg-amber-500/10 text-amber-600",
};

const INDUSTRY_OPTIONS = [
  { value: "metallurgy", label: "冶金" },
  { value: "nonFerrous", label: "有色金属" },
  { value: "buildingMaterials", label: "建材" },
  { value: "machinery", label: "机械" },
  { value: "lightIndustry", label: "轻工" },
  { value: "textiles", label: "纺织" },
  { value: "tobacco", label: "烟草" },
  { value: "commerceTrade", label: "商贸" },
];

const SUB_INDUSTRY_OPTIONS = [
  { value: "工贸", label: "工贸" },
  { value: "化工", label: "化工" },
  { value: "其他", label: "其他" },
];

const CITY_OPTIONS = [
  { value: "330100", label: "浙江省杭州市" },
  { value: "370500", label: "山东省滨州市" },
  { value: "110100", label: "北京市" },
  { value: "310100", label: "上海市" },
];

const EDUCATION_OPTIONS = [
  { value: "高中及以下", label: "高中及以下" },
  { value: "大专", label: "大专" },
  { value: "本科", label: "本科" },
  { value: "硕士", label: "硕士" },
  { value: "博士", label: "博士" },
];

/* =========================================
 * 证书管理子组件
 * ========================================= */

function CertificateTable({
  certs,
  onChange,
}: {
  certs: CertFormItem[];
  onChange: (certs: CertFormItem[]) => void;
}) {
  const handleAdd = () => {
    const newCert: CertFormItem = {
      id: `cert-${Date.now()}`,
      seqNo: certs.length + 1,
      name: "",
      issuingAuthority: "",
      validStartDate: "",
      validEndDate: "",
    };
    onChange([...certs, newCert]);
  };

  const handleRemove = (index: number) => {
    const next = certs.filter((_, i) => i !== index);
    // 重新计算序号
    const renumbered = next.map((c, i) => ({ ...c, seqNo: i + 1 }));
    onChange(renumbered);
  };

  const handleFieldChange = (
    index: number,
    field: keyof CertFormItem,
    value: string
  ) => {
    const next = [...certs];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>证书管理</Label>
        <Button type="button" size="sm" variant="outline" onClick={handleAdd}>
          <Plus className="size-4 mr-1" />
          添加证书
        </Button>
      </div>
      {certs.length > 0 ? (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">序号</TableHead>
                <TableHead>证书名称</TableHead>
                <TableHead>发证机构</TableHead>
                <TableHead>有效期开始</TableHead>
                <TableHead>有效期结束</TableHead>
                <TableHead className="w-16">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {certs.map((cert, idx) => (
                <TableRow key={cert.id}>
                  <TableCell>{cert.seqNo}</TableCell>
                  <TableCell>
                    <Input
                      value={cert.name}
                      onChange={(e) =>
                        handleFieldChange(idx, "name", e.target.value)
                      }
                      placeholder="证书名称"
                      className="min-w-[120px]"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={cert.issuingAuthority}
                      onChange={(e) =>
                        handleFieldChange(idx, "issuingAuthority", e.target.value)
                      }
                      placeholder="发证机构"
                      className="min-w-[120px]"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="date"
                      value={cert.validStartDate}
                      onChange={(e) =>
                        handleFieldChange(idx, "validStartDate", e.target.value)
                      }
                      className="min-w-[130px]"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="date"
                      value={cert.validEndDate}
                      onChange={(e) =>
                        handleFieldChange(idx, "validEndDate", e.target.value)
                      }
                      className="min-w-[130px]"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(idx)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                      <span className="sr-only">删除</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">暂无证书，点击{`"添加证书"`}按钮新增</p>
      )}
    </div>
  );
}

/* =========================================
 * 差异化字段组件
 * ========================================= */

function SupervisorFields({
  data,
  onChange,
}: {
  data: Organization;
  onChange: (field: keyof Organization, value: string | number) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="supervisory-industry">监管行业</Label>
        <Input
          id="supervisory-industry"
          value={data.supervisoryIndustry ?? ""}
          onChange={(e) => onChange("supervisoryIndustry", e.target.value)}
          placeholder="请输入监管行业"
        />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="supervisory-scope">监管范围描述</Label>
        <Textarea
          id="supervisory-scope"
          value={data.supervisoryScope ?? ""}
          onChange={(e) => onChange("supervisoryScope", e.target.value)}
          placeholder="请输入监管范围描述"
          rows={3}
        />
      </div>
    </div>
  );
}

function InspectorFields({
  data,
  certs,
  onChange,
  onCertsChange,
}: {
  data: Organization;
  certs: CertFormItem[];
  onChange: (field: keyof Organization, value: string | number) => void;
  onCertsChange: (certs: CertFormItem[]) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="industry">所属行业</Label>
          <Select
            value={data.industry ?? ""}
            onValueChange={(v) => onChange("industry", v ?? "")}
          >
            <SelectTrigger id="industry">
              <SelectValue placeholder="请选择所属行业" />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRY_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="sub-industry">细分行业</Label>
          <Select
            value={data.subIndustry ?? ""}
            onValueChange={(v) => onChange("subIndustry", v ?? "")}
          >
            <SelectTrigger id="sub-industry">
              <SelectValue placeholder="请选择细分行业" />
            </SelectTrigger>
            <SelectContent>
              {SUB_INDUSTRY_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="credit-code">社会信用代码</Label>
          <Input
            id="credit-code"
            value={data.creditCode ?? ""}
            onChange={(e) => onChange("creditCode", e.target.value)}
            placeholder="18位社会信用代码"
            maxLength={18}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="detailed-address">详细地址</Label>
          <Input
            id="detailed-address"
            value={data.detailedAddress ?? ""}
            onChange={(e) => onChange("detailedAddress", e.target.value)}
            placeholder="请输入详细地址"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="company-intro">公司简介</Label>
          <Textarea
            id="company-intro"
            value={data.companyIntro ?? ""}
            onChange={(e) => onChange("companyIntro", e.target.value)}
            placeholder="请输入公司简介"
            rows={3}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="business-scope">经营范围</Label>
          <Textarea
            id="business-scope"
            value={data.businessScope ?? ""}
            onChange={(e) => onChange("businessScope", e.target.value)}
            placeholder="请输入经营范围"
            rows={3}
          />
        </div>
      </div>

      <CertificateTable certs={certs} onChange={onCertsChange} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="highest-education">最高学历</Label>
          <Select
            value={data.highestEducation ?? ""}
            onValueChange={(v) => onChange("highestEducation", v ?? "")}
          >
            <SelectTrigger id="highest-education">
              <SelectValue placeholder="请选择最高学历" />
            </SelectTrigger>
            <SelectContent>
              {EDUCATION_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="safety-work-years">安全生产工作年限</Label>
          <Input
            id="safety-work-years"
            type="number"
            value={data.safetyWorkYears ?? ""}
            onChange={(e) => onChange("safetyWorkYears", Number(e.target.value))}
            placeholder="请输入工作年限"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="main-service-items">主要服务项目</Label>
          <Textarea
            id="main-service-items"
            value={data.mainServiceItems ?? ""}
            onChange={(e) => onChange("mainServiceItems", e.target.value)}
            placeholder="请输入主要服务项目"
            rows={2}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="main-service-fields">主要服务行业领域</Label>
          <Textarea
            id="main-service-fields"
            value={data.mainServiceFields ?? ""}
            onChange={(e) => onChange("mainServiceFields", e.target.value)}
            placeholder="请输入主要服务行业领域"
            rows={2}
          />
        </div>
      </div>
    </div>
  );
}

function EnterpriseFields({
  data,
  onChange,
}: {
  data: Organization;
  onChange: (field: keyof Organization, value: string | number) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="industry">所属行业</Label>
        <Select
          value={data.industry ?? ""}
          onValueChange={(v) => onChange("industry", v ?? "")}
        >
          <SelectTrigger id="industry">
            <SelectValue placeholder="请选择所属行业" />
          </SelectTrigger>
          <SelectContent>
            {INDUSTRY_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="sub-industry">细分行业</Label>
        <Select
          value={data.subIndustry ?? ""}
          onValueChange={(v) => onChange("subIndustry", v ?? "")}
        >
          <SelectTrigger id="sub-industry">
            <SelectValue placeholder="请选择细分行业" />
          </SelectTrigger>
          <SelectContent>
            {SUB_INDUSTRY_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="credit-code">社会信用代码</Label>
        <Input
          id="credit-code"
          value={data.creditCode ?? ""}
          onChange={(e) => onChange("creditCode", e.target.value)}
          placeholder="请输入社会信用代码"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="detailed-address">详细地址</Label>
        <Input
          id="detailed-address"
          value={data.detailedAddress ?? ""}
          onChange={(e) => onChange("detailedAddress", e.target.value)}
          placeholder="请输入详细地址"
        />
      </div>
    </div>
  );
}

/* =========================================
 * 主页面
 * ========================================= */

export default function OrganizationSettingsPage() {
  const router = useRouter();
  const params = useParams();
  const { currentUser } = useAppStore();
  const hydrated = useHydrated();

  const orgId = params.orgId as string;
  const org = MOCK_ORGANIZATIONS.find((o) => o.id === orgId);

  // 表单状态
  const [formData, setFormData] = useState<Organization | undefined>(org ? { ...org } : undefined);
  const [certs, setCerts] = useState<CertFormItem[]>(() => {
    if (!org) return [];
    const orgCerts = MOCK_CERTIFICATES.filter((c) => c.orgId === org.id);
    return orgCerts.map((c) => ({
      id: c.id,
      seqNo: c.seqNo,
      name: c.name,
      issuingAuthority: c.issuingAuthority,
      validStartDate: c.validStartDate,
      validEndDate: c.validEndDate,
    }));
  });

  const canManage =
    currentUser?.platformRole === "org_admin" ||
    currentUser?.platformRole === "super_admin";

  const handleBack = () => {
    router.push(`/organization/${orgId}`);
  };

  const handleFieldChange = useCallback(
    (field: keyof Organization, value: string | number) => {
      setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
    },
    []
  );

  const handleSave = () => {
    if (!formData) return;
    if (!formData.name.trim()) {
      toast.error("组织名称不能为空");
      return;
    }
    if (!formData.contactPerson?.trim()) {
      toast.error("主要联系人不能为空");
      return;
    }
    if (!formData.contactPhone?.trim()) {
      toast.error("主要联系人电话不能为空");
      return;
    }
    toast.success("保存成功");
  };

  if (!hydrated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!org || !formData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-lg text-muted-foreground">未找到该组织信息</p>
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="size-4 mr-2" />
          返回
        </Button>
      </div>
    );
  }

  if (!canManage) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handleBack} className="gap-1">
            <ArrowLeft className="size-4" />
            返回
          </Button>
          <h1 className="text-xl font-bold">组织信息编辑</h1>
        </div>
        <Card className="py-12">
          <CardContent className="flex flex-col items-center justify-center gap-2 text-center">
            <p className="text-muted-foreground">您没有权限编辑此信息</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderTypeFields = () => {
    switch (formData.teamType) {
      case "supervisor":
        return <SupervisorFields data={formData} onChange={handleFieldChange} />;
      case "inspector":
        return (
          <InspectorFields
            data={formData}
            certs={certs}
            onChange={handleFieldChange}
            onCertsChange={setCerts}
          />
        );
      case "enterprise":
        return <EnterpriseFields data={formData} onChange={handleFieldChange} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 页面头部 */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={handleBack} className="gap-1">
          <ArrowLeft className="size-4" />
          返回
        </Button>
        <h1 className="text-xl font-bold">组织信息编辑</h1>
      </div>

      {/* 系统信息区 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">系统信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarFallback
                className={`text-xl font-bold ${formData.teamType ? TYPE_STYLES[formData.teamType] : "bg-muted text-muted-foreground"}`}
              >
                {formData.systemLogo ? (
                  <img src={formData.systemLogo} alt="logo" className="size-full object-cover rounded-full" />
                ) : (
                  formData.name.charAt(0)
                )}
              </AvatarFallback>
            </Avatar>
            <Button type="button" variant="outline" size="sm">
              <Upload className="size-4 mr-2" />
              上传 Logo
            </Button>
          </div>
          <div className="space-y-2">
            <Label htmlFor="system-name">系统名称</Label>
            <Input
              id="system-name"
              value={formData.systemName ?? ""}
              onChange={(e) => handleFieldChange("systemName", e.target.value)}
              placeholder="请输入系统名称"
            />
          </div>
        </CardContent>
      </Card>

      {/* 基本信息区 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">基本信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="org-name">
                组织名称 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="org-name"
                value={formData.name}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                placeholder="请输入组织名称"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="short-name">组织简称</Label>
              <Input
                id="short-name"
                value={formData.shortName ?? ""}
                onChange={(e) => handleFieldChange("shortName", e.target.value)}
                placeholder="请输入组织简称"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="org-type">组织类型</Label>
              <Input
                id="org-type"
                value={USER_TYPE_MAP[formData.teamType]}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">所在位置</Label>
              <Select
                value={formData.locationCode ?? ""}
                onValueChange={(v) => {
                  handleFieldChange("locationCode", v ?? "");
                  const city = CITY_OPTIONS.find((c) => c.value === v);
                  handleFieldChange("locationName", city?.label ?? "");
                }}
              >
                <SelectTrigger id="location">
                  <SelectValue placeholder="请选择所在城市" />
                </SelectTrigger>
                <SelectContent>
                  {CITY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-person">
                主要联系人 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="contact-person"
                value={formData.contactPerson ?? ""}
                onChange={(e) => handleFieldChange("contactPerson", e.target.value)}
                placeholder="请输入主要联系人"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-phone">
                主要联系人电话 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="contact-phone"
                value={formData.contactPhone ?? ""}
                onChange={(e) => handleFieldChange("contactPhone", e.target.value)}
                placeholder="请输入联系电话"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 差异化字段区 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">扩展信息</CardTitle>
        </CardHeader>
        <CardContent>{renderTypeFields()}</CardContent>
      </Card>

      {/* 底部操作 */}
      <div className="flex items-center justify-end gap-3 pb-6">
        <Button variant="outline" onClick={handleBack}>
          取消
        </Button>
        <Button onClick={handleSave}>保存</Button>
      </div>
    </div>
  );
}
