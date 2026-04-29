/* ========================================
 * 工贸三方监管平台 - Mock 数据
 * ======================================== */
import type {
  User, Team, TeamMember, Enterprise, InspectionPlan,
  InspectionTask, Hazard, InspectionReport, Notification,
  Workspace, RegionNode, TeamWorkspace, WorkspaceAdmin,
  Organization, Certificate, OrganizationStats,
  UserTodo, InspectionProject,
} from "./types";

// ============ 用户数据 ============
export const MOCK_USERS: User[] = [
  { id: "u1", username: "liwei", realName: "李伟", phone: "13800001001", status: "active", createdAt: "2024-06-01", lastLoginAt: "2025-04-15", avatar: "", platformRole: "org_admin", paidTier: "premium", gender: "male", cityCode: "330100", cityName: "浙江省杭州市" },
  { id: "u2", username: "zhangmin", realName: "张敏", phone: "13800001002", status: "active", createdAt: "2024-06-05", lastLoginAt: "2025-04-15", certNo: "AQ-2024-0021", platformRole: "user", paidTier: "standard", gender: "female" },
  { id: "u3", username: "wangqiang", realName: "王强", phone: "13800001003", status: "active", createdAt: "2024-07-10", lastLoginAt: "2025-04-14", certNo: "AQ-2024-0035", platformRole: "user", paidTier: "standard", gender: "male" },
  { id: "u4", username: "chenjie", realName: "陈杰", phone: "13800001004", status: "active", createdAt: "2024-08-01", lastLoginAt: "2025-04-13", platformRole: "user", paidTier: "free", gender: "male", avatar: "" },
  { id: "u5", username: "zhaoli", realName: "赵丽", phone: "13800001005", status: "active", createdAt: "2024-08-15", lastLoginAt: "2025-04-12", platformRole: "user", paidTier: "free", gender: "female" },
  { id: "u6", username: "sunhao", realName: "孙浩", phone: "13800001006", status: "active", createdAt: "2024-09-01", lastLoginAt: "2025-04-10", certNo: "AQ-2024-0048", platformRole: "user", gender: "male" },
  { id: "u7", username: "zhouxin", realName: "周鑫", phone: "13800001007", status: "active", createdAt: "2024-09-10", lastLoginAt: "2025-04-11", platformRole: "user", gender: "unknown" },
  { id: "u8", username: "wuming", realName: "吴明", phone: "13800001008", status: "active", createdAt: "2024-10-01", lastLoginAt: "2025-04-09", platformRole: "user" },
  {
    id: "user-superadmin",
    username: "superadmin",
    realName: "平台管理员",
    email: "admin@platform.com",
    phone: "13900000000",
    status: "active",
    platformRole: "super_admin",
    paidTier: "premium",
    gender: "male",
    avatar: "",
    createdAt: "2024-01-01T00:00:00Z",
    lastLoginAt: "2025-04-20T10:00:00Z",
  },
];

// ============ 工作组数据 ============
export const MOCK_WORKSPACES: Workspace[] = [
  { id: "ws1", name: "博兴县2025年度安全检查工作组", region: "滨州市博兴县", creatorId: "u1", status: "active", enterpriseCount: 5, serviceCount: 1, createdAt: "2025-01-10", updatedAt: "2025-04-15" },
  { id: "ws2", name: "博兴县冶金行业专项检查组", region: "滨州市博兴县", creatorId: "u1", status: "active", enterpriseCount: 3, serviceCount: 1, createdAt: "2025-02-15", updatedAt: "2025-04-10" },
];

// ============ 行政区划数据 ============
export const MOCK_REGIONS: RegionNode[] = [
  {
    id: "r0", workspaceId: "ws1", name: "博兴县2025年度安全检查工作组", sortOrder: 0, createdAt: "2025-01-10",
    children: [
      { id: "r1", workspaceId: "ws1", parentId: "r0", name: "博兴县", sortOrder: 1, createdAt: "2025-01-10",
        children: [
          { id: "r1-1", workspaceId: "ws1", parentId: "r1", name: "店子镇", sortOrder: 1, createdAt: "2025-01-12" },
          { id: "r1-2", workspaceId: "ws1", parentId: "r1", name: "兴福镇", sortOrder: 2, createdAt: "2025-01-12" },
          { id: "r1-3", workspaceId: "ws1", parentId: "r1", name: "湖滨镇", sortOrder: 3, createdAt: "2025-01-12" },
          { id: "r1-4", workspaceId: "ws1", parentId: "r1", name: "吕艺镇", sortOrder: 4, createdAt: "2025-01-12" },
          { id: "r1-5", workspaceId: "ws1", parentId: "r1", name: "城东街道", sortOrder: 5, createdAt: "2025-01-12" },
        ],
      },
    ],
  },
];

// ============ 团队-工作组关联 ============
export const MOCK_TEAM_WORKSPACES: TeamWorkspace[] = [
  { id: "tw1", teamId: "t1", workspaceId: "ws1", regionId: "r1", joinedAt: "2025-01-15" },
  { id: "tw2", teamId: "t2", workspaceId: "ws1", regionId: "r1", joinedAt: "2025-01-18" },
  { id: "tw3", teamId: "t3", workspaceId: "ws1", regionId: "r1-1", joinedAt: "2025-01-20" },
  { id: "tw4", teamId: "t4", workspaceId: "ws1", regionId: "r1-3", joinedAt: "2025-02-01" },
  { id: "tw5", teamId: "t5", workspaceId: "ws1", regionId: "r1-2", joinedAt: "2025-02-05" },
  { id: "tw6", teamId: "t6", workspaceId: "ws1", regionId: "r1-4", joinedAt: "2025-02-10" },
  { id: "tw7", teamId: "t7", workspaceId: "ws1", regionId: "r1-5", joinedAt: "2025-02-15" },
  { id: "tw8", teamId: "t1", workspaceId: "ws2", regionId: "r0", joinedAt: "2025-02-20" },
  { id: "tw9", teamId: "t3", workspaceId: "ws2", regionId: "r0", joinedAt: "2025-02-22" },
];

// ============ 团队数据 ============
export const MOCK_TEAMS: Team[] = [
  { id: "t1", name: "博兴县应急管理局", description: "博兴县安全生产监管部门", region: "博兴县", teamType: "supervisor", creatorId: "u1", inviteCode: "BX2025", status: "active", createdAt: "2025-01-10", memberCount: 2, workspaceIds: ["ws1", "ws2"], supervisoryIndustry: "工贸行业" },
  { id: "t2", name: "博兴安全技术服务有限公司", description: "地方安全管理服务机构", region: "博兴县", teamType: "inspector", creatorId: "u2", inviteCode: "AQFW2025", status: "active", createdAt: "2025-01-15", memberCount: 3, workspaceIds: ["ws1"], qualification: "AQ-2024-0021", mainServiceField: "工贸行业安全检查", agencyStaffCount: 15 },
  { id: "t3", name: "博兴县鑫盛金属制品有限公司", description: "冶金行业企业", region: "博兴县", teamType: "enterprise", creatorId: "u4", inviteCode: "XS2025", status: "active", createdAt: "2025-01-20", memberCount: 2, workspaceIds: ["ws1", "ws2"], industryType: "冶金", subIndustryField: "金属制品", scale: "medium" },
  { id: "t4", name: "山东博兴华宇建材有限公司", description: "建材行业企业", region: "博兴县", teamType: "enterprise", creatorId: "u4", inviteCode: "HY2025", status: "active", createdAt: "2025-02-01", memberCount: 1, workspaceIds: ["ws1"], industryType: "建材", subIndustryField: "建筑材料", scale: "large" },
  { id: "t5", name: "博兴县天成机械加工厂", description: "机械加工企业", region: "博兴县", teamType: "enterprise", creatorId: "u4", inviteCode: "TC2025", status: "active", createdAt: "2025-02-05", memberCount: 1, workspaceIds: ["ws1"], industryType: "机械", subIndustryField: "机械加工", scale: "small" },
  { id: "t6", name: "博兴县宏达纺织有限公司", description: "纺织行业企业", region: "博兴县", teamType: "enterprise", creatorId: "u4", inviteCode: "HD2025", status: "active", createdAt: "2025-02-10", memberCount: 1, workspaceIds: ["ws1"], industryType: "纺织", subIndustryField: "纺织品制造", scale: "medium" },
  { id: "t7", name: "博兴县兴隆轻工制品有限公司", description: "轻工行业企业", region: "博兴县", teamType: "enterprise", creatorId: "u4", inviteCode: "XL2025", status: "active", createdAt: "2025-02-15", memberCount: 1, workspaceIds: ["ws1"], industryType: "轻工", subIndustryField: "轻工制品", scale: "small" },
];

// ============ 演示账号 ============
export const DEMO_ACCOUNTS = [
  { username: "demo_supervisor", password: "demo123", realName: "演示-监管部门", userType: "supervisor" as const, userId: "u1" },
  { username: "demo_inspector", password: "demo123", realName: "演示-服务机构", userType: "inspector" as const, userId: "u2" },
  { username: "demo_enterprise", password: "demo123", realName: "演示-企业单位", userType: "enterprise" as const, userId: "u4" },
];

// ============ 团队成员 ============
export const MOCK_MEMBERS: TeamMember[] = [
  { teamId: "t1", userId: "u1", userType: "supervisor", roleName: "管理员", joinedAt: "2025-01-10", user: MOCK_USERS[0] },
  { teamId: "t1", userId: "u5", userType: "supervisor", roleName: "成员", joinedAt: "2025-01-12", user: MOCK_USERS[4] },
  { teamId: "t2", userId: "u2", userType: "inspector", roleName: "管理员", joinedAt: "2025-01-15", user: MOCK_USERS[1] },
  { teamId: "t2", userId: "u3", userType: "inspector", roleName: "成员", joinedAt: "2025-01-15", user: MOCK_USERS[2] },
  { teamId: "t2", userId: "u6", userType: "inspector", roleName: "成员", joinedAt: "2025-01-18", user: MOCK_USERS[5] },
  { teamId: "t3", userId: "u4", userType: "enterprise", roleName: "管理员", joinedAt: "2025-01-20", user: MOCK_USERS[3] },
  { teamId: "t3", userId: "u7", userType: "enterprise", roleName: "成员", joinedAt: "2025-01-22", user: MOCK_USERS[6] },
  { teamId: "t4", userId: "u8", userType: "enterprise", roleName: "管理员", joinedAt: "2025-02-01", user: MOCK_USERS[7] },
];

// ============ 工作组管理员数据 ============
export const MOCK_WORKSPACE_ADMINS: WorkspaceAdmin[] = [
  { userId: "u1", userType: "supervisor", roleName: "管理员", user: MOCK_USERS[0] },
  { userId: "u5", userType: "supervisor", roleName: "成员", user: MOCK_USERS[4] },
];

// ============ 企业数据 ============
export const MOCK_ENTERPRISES: Enterprise[] = [
  { id: "e1", teamId: "t3", name: "博兴县鑫盛金属制品有限公司", creditCode: "91371625MA3EXAMPLE1", legalPerson: "陈杰", safetyDirector: "周鑫", safetyDirectorPhone: "13800001007", industry: "metallurgy", scale: "medium", employeeCount: 280, address: "博兴县经济开发区金属产业园A区12号", riskLevel: "orange", status: "active", createdAt: "2025-01-20" },
  { id: "e2", teamId: "t4", name: "山东博兴华宇建材有限公司", creditCode: "91371625MA3EXAMPLE2", legalPerson: "刘建国", safetyDirector: "吴明", safetyDirectorPhone: "13800001008", industry: "buildingMaterials", scale: "large", employeeCount: 520, address: "博兴县城东工业区建材路8号", riskLevel: "yellow", status: "active", createdAt: "2025-01-22" },
  { id: "e3", teamId: "t5", name: "博兴县天成机械加工厂", creditCode: "91371625MA3EXAMPLE3", legalPerson: "马天成", safetyDirector: "李安全", safetyDirectorPhone: "13800002001", industry: "machinery", scale: "small", employeeCount: 85, address: "博兴县湖滨镇工业园区机械路3号", riskLevel: "yellow", status: "active", createdAt: "2025-02-01" },
  { id: "e4", teamId: "t6", name: "博兴县宏达纺织有限公司", creditCode: "91371625MA3EXAMPLE4", legalPerson: "赵宏达", safetyDirector: "张安", safetyDirectorPhone: "13800002002", industry: "textiles", scale: "medium", employeeCount: 350, address: "博兴县吕艺镇纺织产业园D区", riskLevel: "blue", status: "active", createdAt: "2025-02-05" },
  { id: "e5", teamId: "t7", name: "博兴县兴隆轻工制品有限公司", creditCode: "91371625MA3EXAMPLE5", legalPerson: "钱兴隆", safetyDirector: "孙建设", safetyDirectorPhone: "13800002003", industry: "lightIndustry", scale: "small", employeeCount: 120, address: "博兴县店子镇轻工产业区16号", riskLevel: "blue", status: "active", createdAt: "2025-02-10" },
];

// ============ 项目数据 ============
export const MOCK_PROJECTS: InspectionProject[] = [
  { id: "prj1", teamId: "t1", projectNo: "XM-2025-001", name: "2025年度工贸行业综合监管项目", description: "对辖区内工贸企业开展年度综合安全检查与监管", assignedToTeamId: "t2", assignedToTeamName: "博兴安全技术服务有限公司", status: "in_progress", createdAt: "2025-01-10", planCount: 2, completedPlanCount: 1 },
  { id: "prj2", teamId: "t1", projectNo: "XM-2025-002", name: "有限空间作业安全专项整治项目", description: "重点检查涉及有限空间作业的企业安全管理情况", assignedToTeamId: "t2", assignedToTeamName: "博兴安全技术服务有限公司", status: "in_progress", createdAt: "2025-02-20", planCount: 1, completedPlanCount: 0 },
  { id: "prj3", teamId: "t1", projectNo: "XM-2025-003", name: "2025年春节前安全生产保障项目", description: "春节前安全生产专项保障工作", assignedToTeamId: "t2", assignedToTeamName: "博兴安全技术服务有限公司", status: "completed", createdAt: "2025-01-05", completedAt: "2025-02-06", planCount: 1, completedPlanCount: 1 },
  { id: "prj4", teamId: "t1", projectNo: "XM-2025-004", name: "2025年度双随机抽查监管项目", description: "按照双随机一公开要求开展年度抽查监管", assignedToTeamId: "t2", assignedToTeamName: "博兴安全技术服务有限公司", status: "created", createdAt: "2025-03-15", planCount: 1, completedPlanCount: 0 },
];

// ============ 检查计划 ============
export const MOCK_PLANS: InspectionPlan[] = [
  { id: "p1", teamId: "t1", planNo: "JHBX-2025-001", name: "2025年度工贸企业日常安全检查计划（第一季度）", type: "routine", year: 2025, startDate: "2025-01-15", endDate: "2025-03-31", description: "针对辖区内工贸企业开展日常安全生产检查", scope: "博兴县全部在产工贸企业", basis: "《安全生产法》《工贸行业安全生产监管办法》", creatorId: "u1", creatorName: "李伟", status: "in_progress", projectId: "prj1", projectName: "2025年度工贸行业综合监管项目", createdAt: "2025-01-12", updatedAt: "2025-01-15", taskCount: 5, completedTaskCount: 2 },
  { id: "p2", teamId: "t1", planNo: "JHBX-2025-002", name: "2025年春节前安全生产专项检查", type: "holiday", year: 2025, startDate: "2025-01-20", endDate: "2025-02-05", description: "春节前安全生产专项检查，重点检查消防安全、用电安全等", scope: "全县重点工贸企业", basis: "关于做好2025年春节期间安全生产工作的通知", creatorId: "u1", creatorName: "李伟", status: "completed", projectId: "prj3", projectName: "2025年春节前安全生产保障项目", createdAt: "2025-01-10", updatedAt: "2025-02-06", taskCount: 3, completedTaskCount: 3 },
  { id: "p3", teamId: "t1", planNo: "JHBX-2025-003", name: "有限空间作业安全专项检查", type: "special", year: 2025, startDate: "2025-03-01", endDate: "2025-04-30", description: "重点检查涉及有限空间作业的企业安全管理情况", scope: "涉及有限空间作业的工贸企业", basis: "《工贸企业有限空间作业安全管理与监督暂行规定》", creatorId: "u1", creatorName: "李伟", status: "published", projectId: "prj2", projectName: "有限空间作业安全专项整治项目", createdAt: "2025-02-20", updatedAt: "2025-02-25", taskCount: 4, completedTaskCount: 0 },
  { id: "p4", teamId: "t1", planNo: "JHBX-2025-004", name: "2025年度工贸企业双随机检查计划", type: "random", year: 2025, startDate: "2025-04-01", endDate: "2025-06-30", description: "按照双随机一公开要求开展安全检查", scope: "随机抽取被检查企业和检查人员", creatorId: "u1", creatorName: "李伟", status: "draft", projectId: "prj4", projectName: "2025年度双随机抽查监管项目", createdAt: "2025-03-15", updatedAt: "2025-03-15", taskCount: 0, completedTaskCount: 0 },
  { id: "p5", teamId: "t1", planNo: "JHBX-2025-005", name: "2025年第二季度日常安全检查计划", type: "routine", year: 2025, startDate: "2025-04-01", endDate: "2025-06-30", description: "第二季度工贸企业常规安全检查", creatorId: "u1", creatorName: "李伟", status: "draft", projectId: "prj1", projectName: "2025年度工贸行业综合监管项目", createdAt: "2025-03-20", updatedAt: "2025-03-20", taskCount: 0, completedTaskCount: 0 },
];

// ============ 检查任务 ============
export const MOCK_TASKS: InspectionTask[] = [
  { id: "tk1", teamId: "t1", planId: "p1", planName: "2025年度工贸企业日常安全检查计划（第一季度）", taskNo: "RW-2025-001", enterpriseId: "e1", enterpriseName: "博兴县鑫盛金属制品有限公司", inspectorIds: ["u2","u3"], inspectorNames: ["张敏","王强"], leadInspectorId: "u2", leadInspectorName: "张敏", scheduledDate: "2025-02-10", actualStartDate: "2025-02-10", actualEndDate: "2025-02-10", status: "completed", conclusion: "basically_qualified", safetyLevel: "B", createdAt: "2025-01-15", updatedAt: "2025-02-12", hazardCount: 8, rectifiedCount: 8 },
  { id: "tk2", teamId: "t1", planId: "p1", planName: "2025年度工贸企业日常安全检查计划（第一季度）", taskNo: "RW-2025-002", enterpriseId: "e2", enterpriseName: "山东博兴华宇建材有限公司", inspectorIds: ["u2","u6"], inspectorNames: ["张敏","孙浩"], leadInspectorId: "u2", leadInspectorName: "张敏", scheduledDate: "2025-02-15", actualStartDate: "2025-02-15", actualEndDate: "2025-02-16", status: "completed", conclusion: "qualified", safetyLevel: "A", createdAt: "2025-01-15", updatedAt: "2025-02-18", hazardCount: 3, rectifiedCount: 3 },
  { id: "tk3", teamId: "t1", planId: "p1", planName: "2025年度工贸企业日常安全检查计划（第一季度）", taskNo: "RW-2025-003", enterpriseId: "e3", enterpriseName: "博兴县天成机械加工厂", inspectorIds: ["u3","u6"], inspectorNames: ["王强","孙浩"], leadInspectorId: "u3", leadInspectorName: "王强", scheduledDate: "2025-03-05", actualStartDate: "2025-03-05", status: "rectifying", createdAt: "2025-01-15", updatedAt: "2025-03-08", hazardCount: 12, rectifiedCount: 7 },
  { id: "tk4", teamId: "t1", planId: "p1", planName: "2025年度工贸企业日常安全检查计划（第一季度）", taskNo: "RW-2025-004", enterpriseId: "e4", enterpriseName: "博兴县宏达纺织有限公司", inspectorIds: ["u2","u3"], inspectorNames: ["张敏","王强"], leadInspectorId: "u2", leadInspectorName: "张敏", scheduledDate: "2025-03-15", status: "inspecting", createdAt: "2025-01-15", updatedAt: "2025-03-15", hazardCount: 5, rectifiedCount: 0 },
  { id: "tk5", teamId: "t1", planId: "p1", planName: "2025年度工贸企业日常安全检查计划（第一季度）", taskNo: "RW-2025-005", enterpriseId: "e5", enterpriseName: "博兴县兴隆轻工制品有限公司", inspectorIds: ["u6"], inspectorNames: ["孙浩"], leadInspectorId: "u6", leadInspectorName: "孙浩", scheduledDate: "2025-03-25", status: "assigned", createdAt: "2025-01-15", updatedAt: "2025-01-15", hazardCount: 0, rectifiedCount: 0 },
  { id: "tk6", teamId: "t1", planId: "p2", planName: "2025年春节前安全生产专项检查", taskNo: "RW-2025-006", enterpriseId: "e1", enterpriseName: "博兴县鑫盛金属制品有限公司", inspectorIds: ["u2","u3","u6"], inspectorNames: ["张敏","王强","孙浩"], leadInspectorId: "u2", leadInspectorName: "张敏", scheduledDate: "2025-01-22", actualStartDate: "2025-01-22", actualEndDate: "2025-01-22", status: "completed", conclusion: "basically_qualified", safetyLevel: "B", createdAt: "2025-01-10", updatedAt: "2025-01-25", hazardCount: 6, rectifiedCount: 6 },
  { id: "tk7", teamId: "t1", planId: "p3", planName: "有限空间作业安全专项检查", taskNo: "RW-2025-007", enterpriseId: "e1", enterpriseName: "博兴县鑫盛金属制品有限公司", inspectorIds: ["u2","u3"], inspectorNames: ["张敏","王强"], leadInspectorId: "u2", leadInspectorName: "张敏", scheduledDate: "2025-03-10", status: "inspecting", createdAt: "2025-02-25", updatedAt: "2025-03-02", hazardCount: 0, rectifiedCount: 0 },
  { id: "tk8", teamId: "t1", planId: "p3", planName: "有限空间作业安全专项检查", taskNo: "RW-2025-008", enterpriseId: "e3", enterpriseName: "博兴县天成机械加工厂", inspectorIds: ["u6"], inspectorNames: ["孙浩"], leadInspectorId: "u6", leadInspectorName: "孙浩", scheduledDate: "2025-03-20", status: "assigned", createdAt: "2025-02-25", updatedAt: "2025-02-25", hazardCount: 0, rectifiedCount: 0 },
];

// ============ 隐患数据 ============
export const MOCK_HAZARDS: Hazard[] = [
  { id: "h1", teamId: "t1", taskId: "tk1", enterpriseId: "e1", enterpriseName: "博兴县鑫盛金属制品有限公司", hazardNo: "YH-2025-001", level: "general", category: "management", subCategory: "m06", subCategoryName: "教育培训", description: "部分特种作业人员安全培训记录不完整，3名电焊工未按期复训", location: "行政办公楼-人力资源部", photos: ["/mock/hazard1.jpg"], legalBasis: "《安全生产法》第二十八条", suggestion: "立即组织未复训人员参加培训考核，建立完善培训台账", deadline: "2025-02-28", responsiblePerson: "周鑫", status: "accepted", discoveredAt: "2025-02-10", discoveredBy: "u2", discoveredByName: "张敏", createdAt: "2025-02-10" },
  { id: "h2", teamId: "t1", taskId: "tk1", enterpriseId: "e1", enterpriseName: "博兴县鑫盛金属制品有限公司", hazardNo: "YH-2025-002", level: "major", category: "onsite", subCategory: "o07", subCategoryName: "用电安全", description: "二车间配电箱门未关闭，内部线路杂乱，存在漏电风险", location: "二号生产车间-配电区域", photos: ["/mock/hazard2.jpg"], legalBasis: "《用电安全管理规程》", suggestion: "立即关闭配电箱，整理内部线路，安装漏电保护装置", deadline: "2025-02-20", responsiblePerson: "周鑫", status: "accepted", discoveredAt: "2025-02-10", discoveredBy: "u3", discoveredByName: "王强", createdAt: "2025-02-10" },
  { id: "h3", teamId: "t1", taskId: "tk3", enterpriseId: "e3", enterpriseName: "博兴县天成机械加工厂", hazardNo: "YH-2025-003", level: "major", category: "onsite", subCategory: "o01", subCategoryName: "设备设施", description: "数控车床安全防护罩缺失，操作人员暴露在旋转部件危险区域内", location: "机加工车间-A线", photos: ["/mock/hazard3.jpg"], legalBasis: "《机械安全 防护装置固定式和活动式防护装置设计与制造一般要求》", suggestion: "立即停止使用该设备，恢复安全防护罩后方可投入使用", deadline: "2025-03-20", responsiblePerson: "李安全", status: "rectifying", discoveredAt: "2025-03-05", discoveredBy: "u3", discoveredByName: "王强", createdAt: "2025-03-05" },
  { id: "h4", teamId: "t1", taskId: "tk3", enterpriseId: "e3", enterpriseName: "博兴县天成机械加工厂", hazardNo: "YH-2025-004", level: "general", category: "onsite", subCategory: "o04", subCategoryName: "安全标识", description: "危险作业区域缺少安全警示标识，设备操作区域未设置安全标线", location: "机加工车间整体", photos: ["/mock/hazard4.jpg"], suggestion: "在所有危险区域设置明显的安全警示标识和安全标线", deadline: "2025-03-25", responsiblePerson: "李安全", status: "pending_acceptance", discoveredAt: "2025-03-05", discoveredBy: "u6", discoveredByName: "孙浩", createdAt: "2025-03-05" },
  { id: "h5", teamId: "t1", taskId: "tk3", enterpriseId: "e3", enterpriseName: "博兴县天成机械加工厂", hazardNo: "YH-2025-005", level: "general", category: "management", subCategory: "m03", subCategoryName: "安全责任制", description: "企业全员安全生产责任制文件未更新，部分岗位安全职责不明确", location: "行政管理-安全管理制度", photos: ["/mock/hazard5.jpg"], suggestion: "修订全员安全生产责任制，明确各岗位安全职责并组织学习签字", deadline: "2025-03-30", responsiblePerson: "李安全", status: "accepted", discoveredAt: "2025-03-05", discoveredBy: "u3", discoveredByName: "王强", createdAt: "2025-03-05" },
  { id: "h6", teamId: "t1", taskId: "tk3", enterpriseId: "e3", enterpriseName: "博兴县天成机械加工厂", hazardNo: "YH-2025-006", level: "general", category: "onsite", subCategory: "o06", subCategoryName: "消防安全", description: "消防通道堆放杂物，灭火器2具已过期未更换", location: "成品仓库", photos: ["/mock/hazard6.jpg"], suggestion: "清理消防通道，更换过期灭火器，确保消防通道畅通", deadline: "2025-03-15", responsiblePerson: "李安全", status: "accepted", discoveredAt: "2025-03-05", discoveredBy: "u6", discoveredByName: "孙浩", createdAt: "2025-03-05" },
  { id: "h7", teamId: "t1", taskId: "tk4", enterpriseId: "e4", enterpriseName: "博兴县宏达纺织有限公司", hazardNo: "YH-2025-007", level: "general", category: "onsite", subCategory: "o10", subCategoryName: "粉尘防爆", description: "纺织车间粉尘收集装置维护不及时，集尘管道有积尘现象", location: "纺织一车间", photos: ["/mock/hazard7.jpg"], suggestion: "定期清理集尘管道，建立粉尘收集装置维护保养制度", deadline: "2025-04-05", responsiblePerson: "张安", status: "pending_rectification", discoveredAt: "2025-03-15", discoveredBy: "u2", discoveredByName: "张敏", createdAt: "2025-03-15" },
  { id: "h8", teamId: "t1", taskId: "tk3", enterpriseId: "e3", enterpriseName: "博兴县天成机械加工厂", hazardNo: "YH-2025-008", level: "general", category: "management", subCategory: "m09", subCategoryName: "应急管理", description: "应急演练记录显示本年度未开展综合应急演练", location: "安全管理档案", photos: ["/mock/hazard8.jpg"], suggestion: "制定年度应急演练计划并在规定时间内完成至少一次综合应急演练", deadline: "2025-04-15", responsiblePerson: "李安全", status: "rectifying", discoveredAt: "2025-03-05", discoveredBy: "u3", discoveredByName: "王强", createdAt: "2025-03-05" },
];

// ============ 检查报告 ============
export const MOCK_REPORTS: InspectionReport[] = [
  { id: "r1", teamId: "t1", taskId: "tk1", reportNo: "BG-2025-001", generatedBy: "u2", generatedByName: "张敏", generatedAt: "2025-02-12", status: "approved", version: 1, enterpriseName: "博兴县鑫盛金属制品有限公司", taskNo: "RW-2025-001", planName: "2025年度工贸企业日常安全检查计划（第一季度）" },
  { id: "r2", teamId: "t1", taskId: "tk2", reportNo: "BG-2025-002", generatedBy: "u2", generatedByName: "张敏", generatedAt: "2025-02-18", status: "approved", version: 1, enterpriseName: "山东博兴华宇建材有限公司", taskNo: "RW-2025-002", planName: "2025年度工贸企业日常安全检查计划（第一季度）" },
  { id: "r3", teamId: "t1", taskId: "tk6", reportNo: "BG-2025-003", generatedBy: "u2", generatedByName: "张敏", generatedAt: "2025-01-25", status: "approved", version: 2, enterpriseName: "博兴县鑫盛金属制品有限公司", taskNo: "RW-2025-006", planName: "2025年春节前安全生产专项检查" },
  { id: "r4", teamId: "t1", taskId: "tk3", reportNo: "BG-2025-004", generatedBy: "u3", generatedByName: "王强", generatedAt: "2025-03-10", status: "submitted", version: 1, enterpriseName: "博兴县天成机械加工厂", taskNo: "RW-2025-003", planName: "2025年度工贸企业日常安全检查计划（第一季度）" },
];

// ============ 通知数据 ============
export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "n1", teamId: "t1", userId: "u1", type: "report_submitted", title: "检查报告已提交", content: "检查报告BG-2025-004已提交，请审核", isRead: false, relatedId: "r4", createdAt: "2025-03-10 14:30:00" },
  { id: "n2", teamId: "t1", userId: "u1", type: "major_hazard", title: "发现重大隐患", content: "博兴县天成机械加工厂发现重大隐患：数控车床安全防护罩缺失", isRead: false, relatedId: "h3", createdAt: "2025-03-05 11:20:00" },
  { id: "n3", teamId: "t1", userId: "u2", type: "rectification_submitted", title: "整改已提交", content: "博兴县天成机械加工厂已提交隐患YH-2025-004整改，请复查", isRead: false, relatedId: "h4", createdAt: "2025-03-22 09:15:00" },
  { id: "n4", teamId: "t1", userId: "u4", type: "hazard_found", title: "检查发现隐患", content: "检查发现5条隐患，请尽快整改", isRead: true, relatedId: "tk4", createdAt: "2025-03-15 16:00:00" },
  { id: "n5", teamId: "t1", userId: "u2", type: "task_overdue", title: "任务即将逾期", content: "任务RW-2025-005将于3天后到期，请关注", isRead: true, relatedId: "tk5", createdAt: "2025-03-22 08:00:00" },
  { id: "n6", teamId: "t1", userId: "u1", type: "hazard_closed", title: "隐患已销号", content: "隐患YH-2025-001已通过复查并销号", isRead: true, relatedId: "h1", createdAt: "2025-02-28 14:00:00" },
];

// ============ 组织数据 ============
export const MOCK_ORGANIZATIONS: Organization[] = MOCK_TEAMS.map((team, index) => ({
  ...team,
  systemLogo: "",
  systemName: team.name + "安全管理系统",
  shortName: team.name.substring(0, 4),
  contactPerson: ["张三", "李四", "王五", "赵六", "钱七"][index % 5],
  contactPhone: `138000${String(10000 + index).slice(-5)}`,
  orgAdminUserId: team.creatorId,
  locationCode: "330100",
  locationName: "浙江省杭州市",
}));

// ============ 证书数据 ============
export const MOCK_CERTIFICATES: Certificate[] = [
  {
    id: "cert-1",
    orgId: MOCK_TEAMS[1]?.id || "team-2",
    seqNo: 1,
    name: "安全生产许可证",
    issuingAuthority: "应急管理部",
    validStartDate: "2024-01-01",
    validEndDate: "2027-01-01",
    photos: [],
  },
  {
    id: "cert-2",
    orgId: MOCK_TEAMS[1]?.id || "team-2",
    seqNo: 2,
    name: "安全评价资质",
    issuingAuthority: "省应急管理厅",
    validStartDate: "2024-06-01",
    validEndDate: "2026-06-01",
    photos: [],
  },
];

// ============ 组织统计数据 ============
export const MOCK_ORGANIZATION_STATS: OrganizationStats[] = [
  {
    orgId: MOCK_TEAMS[0]?.id || "t1",
    supervisorCount: 2,
    inspectorCount: 3,
    enterpriseCount: 5,
    workspaceCount: 2,
    inProgressPlanCount: 3,
    rectifyingEnterpriseCount: 2,
    inspectingInspectorCount: 2,
    healthyEnterpriseCount: 3,
    inProgressTaskCount: 0,
    pendingRectificationEnterpriseCount: 0,
    pendingRectificationHazardCount: 0,
    involvedTaskCount: 0,
    pendingHazardCount: 0,
  },
  {
    orgId: MOCK_TEAMS[1]?.id || "t2",
    supervisorCount: 0,
    inspectorCount: 3,
    enterpriseCount: 0,
    workspaceCount: 1,
    inProgressPlanCount: 0,
    rectifyingEnterpriseCount: 0,
    inspectingInspectorCount: 0,
    healthyEnterpriseCount: 0,
    inProgressTaskCount: 4,
    recentInspectedEnterprise: {
      id: "e1",
      name: "博兴县鑫盛金属制品有限公司",
      inspectedAt: "2025-02-10",
    },
    pendingRectificationEnterpriseCount: 1,
    pendingRectificationHazardCount: 2,
    involvedTaskCount: 0,
    pendingHazardCount: 0,
  },
  {
    orgId: MOCK_TEAMS[2]?.id || "t3",
    supervisorCount: 0,
    inspectorCount: 0,
    enterpriseCount: 0,
    workspaceCount: 2,
    inProgressPlanCount: 0,
    rectifyingEnterpriseCount: 0,
    inspectingInspectorCount: 0,
    healthyEnterpriseCount: 0,
    inProgressTaskCount: 0,
    pendingRectificationEnterpriseCount: 0,
    pendingRectificationHazardCount: 0,
    involvedTaskCount: 3,
    recentTaskName: "2025年度工贸企业日常安全检查",
    pendingHazardCount: 5,
  },
];

// ============ 用户待办数据 ============
export const MOCK_USER_TODOS: UserTodo[] = [
  { id: "todo-1", type: "task", title: "检查任务待完成", description: "完成博兴县天成机械加工厂安全检查", relatedId: "tk3", deadline: "2026-04-28", status: "pending", createdAt: "2026-04-20" },
  { id: "todo-2", type: "hazard", title: "重大隐患待整改", description: "数控车床安全防护罩缺失需立即整改", relatedId: "h3", deadline: "2026-04-26", status: "pending", createdAt: "2026-04-20" },
  { id: "todo-3", type: "report", title: "检查报告待提交", description: "提交博兴县天成机械加工厂检查报告", relatedId: "r4", deadline: "2026-04-30", status: "pending", createdAt: "2026-04-19" },
  { id: "todo-4", type: "rectification", title: "隐患整改待提交", description: "提交安全标识缺失隐患的整改材料", relatedId: "h4", deadline: "2026-04-27", status: "pending", createdAt: "2026-04-18" },
  { id: "todo-5", type: "task", title: "检查任务待接收", description: "接收有限空间作业安全专项检查任务", relatedId: "tk7", deadline: "2026-04-25", status: "pending", createdAt: "2026-04-17" },
  { id: "todo-6", type: "hazard", title: "应急演练待完成", description: "组织综合应急演练并提交记录", relatedId: "h8", deadline: "2026-05-05", status: "pending", createdAt: "2026-04-15" },
];
