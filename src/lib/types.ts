/* ========================================
 * 工贸三方监管平台 - 全局类型定义
 * ======================================== */

// ============ 枚举类型 ============

// 平台角色
export type PlatformRole = "super_admin" | "org_admin" | "user";

// 付费等级
export type PaidTier = "free" | "standard" | "premium";

// 性别
export type Gender = "male" | "female" | "unknown";

/** 用户账号状态 */
export type UserStatus = "active" | "disabled" | "pending";

/** 团队中的用户类型 */
export type UserType = "supervisor" | "inspector" | "enterprise";

/** 工作组状态 */
export type WorkspaceStatus = "active" | "archived";

/** 团队状态 */
export type TeamStatus = "active" | "archived";

/** 组织节点类型 */
export type OrgNodeType = "department" | "group";

/** 检查计划类型 */
export type PlanType = "routine" | "special" | "random" | "holiday";

/** 检查计划状态 */
export type PlanStatus = "draft" | "published" | "in_progress" | "completed" | "archived";

/** 检查任务状态 */
export type TaskStatus =
  | "created"
  | "assigned"
  | "accepted"
  | "inspecting"
  | "report_drafting"
  | "report_submitted"
  | "report_rejected"
  | "under_review"
  | "rectifying"
  | "completed"
  | "overdue"
  | "cancelled";

/** 隐患等级 */
export type HazardLevel = "major" | "general";

/** 隐患大类 */
export type HazardCategory = "management" | "onsite";

/** 隐患子类 - 基础管理类 */
export type ManagementSubCategory =
  | "m01" | "m02" | "m03" | "m04" | "m05" | "m06"
  | "m07" | "m08" | "m09" | "m10" | "m11" | "m12";

/** 隐患子类 - 现场管理类 */
export type OnsiteSubCategory =
  | "o01" | "o02" | "o03" | "o04" | "o05" | "o06"
  | "o07" | "o08" | "o09" | "o10" | "o11";

export type HazardSubCategory = ManagementSubCategory | OnsiteSubCategory;

/** 隐患状态 */
export type HazardStatus =
  | "discovered"
  | "notified"
  | "rectifying"
  | "submitted"
  | "review_failed"
  | "closed"
  | "overdue";

/** 检查结论 */
export type InspectionConclusion = "qualified" | "basically_qualified" | "unqualified";

/** 安全等级 */
export type SafetyLevel = "A" | "B" | "C" | "D";

/** 企业规模 */
export type EnterpriseScale = "large" | "medium" | "small" | "micro";

/** 风险等级 */
export type RiskLevel = "red" | "orange" | "yellow" | "blue";

/** 行业分类 */
export type Industry =
  | "metallurgy"
  | "nonFerrous"
  | "buildingMaterials"
  | "machinery"
  | "lightIndustry"
  | "textiles"
  | "tobacco"
  | "commerceTrade";

/** 报告状态 */
export type ReportStatus = "draft" | "submitted" | "approved" | "rejected";

/** 复查结果 */
export type ReviewResult = "passed" | "failed";

/** 通知类型 */
export type NotificationType =
  | "plan_published"
  | "task_started"
  | "hazard_found"
  | "rectification_submitted"
  | "review_failed"
  | "hazard_closed"
  | "report_submitted"
  | "report_approved"
  | "report_rejected"
  | "task_overdue"
  | "rectification_overdue"
  | "major_hazard";

// ============ 实体类型 ============

/** 用户 */
export interface User {
  id: string;
  username: string;
  realName: string;
  phone: string;
  email?: string;
  avatar?: string;
  idCard?: string;
  certNo?: string;
  status: UserStatus;
  createdAt: string;
  lastLoginAt?: string;
  platformRole: PlatformRole;
  paidTier?: PaidTier;
  gender?: Gender;
  birthDate?: string;
  cityCode?: string;
  cityName?: string;
}

/** 工作组角色 */
export type WorkspaceRole = "admin" | "member";

/** 团队角色 */
export type TeamRole = "admin" | "member";

/** 工作组管理员 */
export interface WorkspaceAdmin {
  userId: string;
  userType: UserType;
  roleName: string;
  user?: User;
}

/** 工作组 */
export interface Workspace {
  id: string;
  name: string;
  region: string;
  creatorId: string;
  status: WorkspaceStatus;
  enterpriseCount?: number;
  serviceCount?: number;
  createdAt: string;
  updatedAt: string;
}

/** 行政区划节点 */
export interface RegionNode {
  id: string;
  workspaceId: string;
  parentId?: string;
  name: string;
  sortOrder: number;
  createdAt: string;
  children?: RegionNode[];
}

/** 团队-工作组关联 */
export interface TeamWorkspace {
  id: string;
  teamId: string;
  workspaceId: string;
  regionId: string;
  joinedAt: string;
}

/** 团队 */
export interface Team {
  id: string;
  name: string;
  description?: string;
  region: string;
  /** 团队类型：监管方/服务方/履行方 */
  teamType: UserType;
  creatorId: string;
  inviteCode: string;
  status: TeamStatus;
  createdAt: string;
  memberCount?: number;
  /** 所属工作组ID列表 */
  workspaceIds?: string[];
  /** 监管行业（监管方） */
  supervisoryIndustry?: string;
  /** 机构资质（服务方） */
  qualification?: string;
  /** 主要服务领域（服务方） */
  mainServiceField?: string;
  /** 机构人数（服务方） */
  agencyStaffCount?: number;
  /** 行业类型（履行方） */
  industryType?: string;
  /** 细分行业领域（履行方） */
  subIndustryField?: string;
  /** 企业规模（履行方） */
  scale?: EnterpriseScale;
}

/** 证书 */
export interface Certificate {
  id: string;
  orgId: string;
  seqNo: number;
  name: string;
  issuingAuthority: string;
  validStartDate: string;
  validEndDate: string;
  photos?: string[];
}

/** 组织（Team 超集） */
export interface Organization extends Team {
  systemLogo?: string;
  systemName?: string;
  shortName?: string;
  locationCode?: string;
  locationName?: string;
  contactPerson?: string;
  contactPhone?: string;
  orgAdminUserId?: string;
  creditCode?: string;
  detailedAddress?: string;
  longitude?: number;
  latitude?: number;
  industry?: string;
  subIndustry?: string;
  companyIntro?: string;
  businessScope?: string;
  certificates?: Certificate[];
  highestEducation?: string;
  safetyWorkYears?: number;
  mainServiceItems?: string;
  mainServiceFields?: string;
  supervisoryScope?: string;
}

/** 组织统计 */
export interface OrganizationStats {
  orgId: string;
  supervisorCount: number;
  inspectorCount: number;
  enterpriseCount: number;
  workspaceCount: number;
  // 监管方视角
  inProgressPlanCount: number;
  rectifyingEnterpriseCount: number;
  inspectingInspectorCount: number;
  healthyEnterpriseCount: number;
  // 服务方视角
  inProgressTaskCount: number;
  recentInspectedEnterprise?: {
    id: string;
    name: string;
    inspectedAt: string;
  };
  pendingRectificationEnterpriseCount: number;
  pendingRectificationHazardCount: number;
  // 履行方视角
  involvedTaskCount: number;
  recentTaskName?: string;
  pendingHazardCount: number;
}

/** 面包屑 */
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/** 团队成员 */
export interface TeamMember {
  teamId: string;
  userId: string;
  userType: UserType;
  roleId?: string;
  roleName?: string;
  orgNodeId?: string;
  joinedAt: string;
  user?: User;
}

/** 组织节点 */
export interface OrgNode {
  id: string;
  teamId: string;
  parentId?: string;
  name: string;
  type: OrgNodeType;
  sortOrder: number;
  children?: OrgNode[];
  memberCount?: number;
}

/** 企业 */
export interface Enterprise {
  id: string;
  teamId: string;
  name: string;
  creditCode: string;
  legalPerson: string;
  safetyDirector: string;
  safetyDirectorPhone: string;
  industry: Industry;
  scale: EnterpriseScale;
  employeeCount?: number;
  address: string;
  longitude?: number;
  latitude?: number;
  riskLevel?: RiskLevel;
  businessLicense?: string;
  safetyLicense?: string;
  status: "active" | "inactive";
  createdAt: string;
}

/** 检查计划 */
export interface InspectionPlan {
  id: string;
  teamId: string;
  planNo: string;
  name: string;
  type: PlanType;
  year: number;
  startDate: string;
  endDate: string;
  description?: string;
  scope?: string;
  basis?: string;
  creatorId: string;
  creatorName?: string;
  status: PlanStatus;
  createdAt: string;
  updatedAt: string;
  taskCount?: number;
  completedTaskCount?: number;
}

/** 检查任务 */
export interface InspectionTask {
  id: string;
  teamId: string;
  planId: string;
  planName?: string;
  taskNo: string;
  enterpriseId: string;
  enterpriseName?: string;
  inspectorIds: string[];
  inspectorNames?: string[];
  leadInspectorId: string;
  leadInspectorName?: string;
  scheduledDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  checkItems?: string;
  status: TaskStatus;
  conclusion?: InspectionConclusion;
  safetyLevel?: SafetyLevel;
  remark?: string;
  createdAt: string;
  updatedAt: string;
  hazardCount?: number;
  rectifiedCount?: number;
}

/** 隐患 */
export interface Hazard {
  id: string;
  teamId: string;
  taskId: string;
  enterpriseId: string;
  enterpriseName?: string;
  hazardNo: string;
  level: HazardLevel;
  category: HazardCategory;
  subCategory: HazardSubCategory;
  subCategoryName?: string;
  description: string;
  location: string;
  photos: string[];
  legalBasis?: string;
  standardBasis?: string;
  basisFiles?: string[];
  suggestion: string;
  deadline: string;
  responsiblePerson?: string;
  status: HazardStatus;
  discoveredAt: string;
  discoveredBy: string;
  discoveredByName?: string;
  createdAt: string;
}

/** 整改记录 */
export interface RectificationRecord {
  id: string;
  hazardId: string;
  rectifyContent: string;
  rectifyPhotos: string[];
  rectifyDate: string;
  rectifiedBy: string;
  rectifiedByName?: string;
  cost?: number;
}

/** 复查记录 */
export interface ReviewRecord {
  id: string;
  hazardId: string;
  result: ReviewResult;
  reviewContent: string;
  reviewPhotos?: string[];
  reviewedAt: string;
  reviewedBy: string;
  reviewedByName?: string;
}

/** 检查报告 */
export interface InspectionReport {
  id: string;
  teamId: string;
  taskId: string;
  reportNo: string;
  generatedBy: string;
  generatedByName?: string;
  generatedAt: string;
  status: ReportStatus;
  shareLink?: string;
  version: number;
  enterpriseName?: string;
  taskNo?: string;
  planName?: string;
}

/** 通知 */
export interface Notification {
  id: string;
  teamId: string;
  userId: string;
  type: NotificationType;
  title: string;
  content: string;
  isRead: boolean;
  relatedId?: string;
  relatedType?: string;
  createdAt: string;
}

// ============ 辅助映射 ============

export const WORKSPACE_STATUS_MAP: Record<WorkspaceStatus, string> = {
  active: "活跃", archived: "已归档",
};

export const USER_TYPE_MAP: Record<UserType, string> = {
  supervisor: "监管方",
  inspector: "服务方",
  enterprise: "履行方",
};

export const PLAN_TYPE_MAP: Record<PlanType, string> = {
  routine: "日常检查",
  special: "专项检查",
  random: "双随机检查",
  holiday: "节假日检查",
};

export const PLAN_STATUS_MAP: Record<PlanStatus, string> = {
  draft: "草稿",
  published: "已发布",
  in_progress: "执行中",
  completed: "已完成",
  archived: "已归档",
};

export const TASK_STATUS_MAP: Record<TaskStatus, string> = {
  created: "已创建",
  assigned: "已下达",
  accepted: "已接收",
  inspecting: "检查中",
  report_drafting: "报告编制中",
  report_submitted: "报告已提交",
  report_rejected: "报告退回",
  under_review: "审核中",
  rectifying: "整改中",
  completed: "已完成",
  overdue: "已逾期",
  cancelled: "已取消",
};

export const HAZARD_LEVEL_MAP: Record<HazardLevel, string> = {
  major: "重大隐患",
  general: "一般隐患",
};

export const HAZARD_STATUS_MAP: Record<HazardStatus, string> = {
  discovered: "已发现",
  notified: "已通知",
  rectifying: "整改中",
  submitted: "已提交整改",
  review_failed: "复查不通过",
  closed: "已销号",
  overdue: "已逾期",
};

export const HAZARD_CATEGORY_MAP: Record<HazardCategory, string> = {
  management: "基础管理类",
  onsite: "现场管理类",
};

export const MANAGEMENT_SUB_MAP: Record<ManagementSubCategory, string> = {
  m01: "资质证照", m02: "管理机构", m03: "安全责任制", m04: "管理制度",
  m05: "操作规程", m06: "教育培训", m07: "管理档案", m08: "安全投入",
  m09: "应急管理", m10: "特种设备管理", m11: "职业卫生管理", m12: "相关方管理",
};

export const ONSITE_SUB_MAP: Record<OnsiteSubCategory, string> = {
  o01: "设备设施", o02: "工艺安全", o03: "场所环境", o04: "安全标识",
  o05: "操作行为", o06: "消防安全", o07: "用电安全", o08: "有限空间",
  o09: "危化品管理", o10: "粉尘防爆", o11: "辅助动力",
};

export const INDUSTRY_MAP: Record<Industry, string> = {
  metallurgy: "冶金", nonFerrous: "有色金属", buildingMaterials: "建材",
  machinery: "机械", lightIndustry: "轻工", textiles: "纺织",
  tobacco: "烟草", commerceTrade: "商贸",
};

export const SCALE_MAP: Record<EnterpriseScale, string> = {
  large: "大型", medium: "中型", small: "小型", micro: "微型",
};

export const RISK_LEVEL_MAP: Record<RiskLevel, string> = {
  red: "红色（重大风险）", orange: "橙色（较大风险）",
  yellow: "黄色（一般风险）", blue: "蓝色（低风险）",
};

export const REPORT_STATUS_MAP: Record<ReportStatus, string> = {
  draft: "草稿", submitted: "已提交", approved: "已审核通过", rejected: "已退回",
};

export const CONCLUSION_MAP: Record<InspectionConclusion, string> = {
  qualified: "合格", basically_qualified: "基本合格", unqualified: "不合格",
};

export const SAFETY_LEVEL_MAP: Record<SafetyLevel, string> = {
  A: "A级（优秀）", B: "B级（良好）", C: "C级（一般）", D: "D级（较差）",
};
