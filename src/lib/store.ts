/* ========================================
 * 工贸三方监管平台 - Zustand 全局状态管理
 * v1.1.0 - 新增工作组层级，移除角色切换
 * v1.1.2 - 添加用户待办和统计相关状态
 * ======================================== */
import { create } from "zustand";
import type { User, Team, UserType, Workspace, Organization, BreadcrumbItem, UserTodo, TodoStatus } from "./types";
import { MOCK_USERS, MOCK_TEAMS, MOCK_WORKSPACES, MOCK_TEAM_WORKSPACES, MOCK_USER_TODOS, MOCK_MEMBERS } from "./mock-data";

interface AppState {
  /** 当前登录用户 */
  currentUser: User | null;
  /** 当前选中的团队 */
  currentTeam: Team | null;
  /** 当前在团队中的用户类型 */
  currentUserType: UserType;
  /** 当前选中的工作组 */
  currentWorkspace: Workspace | null;
  /** 用户可访问的工作组列表 */
  workspaces: Workspace[];
  /** 用户加入的所有团队 */
  teams: Team[];
  /** 当前组织 */
  currentOrganization: Organization | null;
  /** 面包屑 */
  breadcrumbs: BreadcrumbItem[];
  /** 侧边栏是否折叠 */
  sidebarCollapsed: boolean;
  /** 上次退出时的工作组ID */
  lastWorkspaceId: string | null;
  /** 用户待办列表 */
  userTodos: UserTodo[];
  /** 用户统计信息 */
  userStats: {
    teamCount: number;
    workspaceCount: number;
    pendingCount: number;
  };
  /** 登录 */
  login: (user: User) => void;
  /** 登出 */
  logout: () => void;
  /** 切换团队（根据团队类型自动确定 userType） */
  switchTeam: (team: Team) => void;
  /** 切换工作组 */
  switchWorkspace: (workspace: Workspace) => void;
  /** 设置当前组织 */
  setCurrentOrganization: (org: Organization | null) => void;
  /** 设置面包屑 */
  setBreadcrumbs: (items: BreadcrumbItem[]) => void;
  /** 切换侧边栏 */
  toggleSidebar: () => void;
  /** 设置上次退出时的工作组 */
  setLastWorkspaceId: (workspaceId: string | null) => void;
  /** 获取当前工作组内的团队列表 */
  getTeamsInWorkspace: (workspaceId: string) => Team[];
  /** 获取用户的工作组列表（根据组织） */
  getWorkspacesByOrganization: (orgId: string) => Workspace[];
  /** 更新用户待办 */
  updateTodo: (todoId: string, status: TodoStatus) => void;
  /** 更新用户信息 */
  updateCurrentUser: (user: Partial<User>) => void;
}

/** 根据团队类型推断用户类型 */
function getUserTypeFromTeam(team: Team): UserType {
  return team.teamType;
}

/** 获取用户可访问的工作组 */
function getUserWorkspaces(userId: string): Workspace[] {
  // 获取用户所属团队关联的工作组
  const userTeamIds = MOCK_TEAMS
    .filter((t) => t.creatorId === userId || t.memberCount !== undefined)
    .map((t) => t.id);

  const userWorkspaceIds = MOCK_TEAM_WORKSPACES
    .filter((tw) => userTeamIds.includes(tw.teamId))
    .map((tw) => tw.workspaceId);

  const uniqueWorkspaceIds = [...new Set(userWorkspaceIds)];
  return MOCK_WORKSPACES.filter((ws) => uniqueWorkspaceIds.includes(ws.id));
}

/** 获取用户的默认团队 */
function getUserDefaultTeam(userId: string): Team | null {
  // 找到用户创建的团队或第一个关联的团队
  const userTeam = MOCK_TEAMS.find((t) => t.creatorId === userId);
  if (userTeam) return userTeam;

  const userTeamId = MOCK_TEAM_WORKSPACES
    .filter((tw) => {
      const team = MOCK_TEAMS.find((t) => t.id === tw.teamId);
      return team !== undefined;
    })
    .map((tw) => tw.teamId)[0];

  return MOCK_TEAMS.find((t) => t.id === userTeamId) || null;
}

export const isSuperAdmin = () => {
  const user = useAppStore.getState().currentUser;
  return user?.platformRole === "super_admin";
};

export const isOrgAdmin = () => {
  const user = useAppStore.getState().currentUser;
  return user?.platformRole === "org_admin";
};

export const useAppStore = create<AppState>((set, get) => {
  const defaultUser = MOCK_USERS[0];
  const defaultTeam = getUserDefaultTeam(defaultUser.id);
  const defaultWorkspaces = getUserWorkspaces(defaultUser.id);
  const defaultLastWorkspace = defaultWorkspaces[0]?.id || null;

  // 获取用户加入的团队数量
  const userTeamIds = new Set([
    ...MOCK_TEAMS.filter((t) => t.creatorId === defaultUser.id).map((t) => t.id),
    ...MOCK_TEAM_WORKSPACES.map((tw) => tw.teamId),
  ]);
  const uniqueTeamIds = [...userTeamIds];

  return {
    currentUser: defaultUser,
    currentTeam: defaultTeam,
    currentUserType: defaultTeam ? getUserTypeFromTeam(defaultTeam) : "supervisor",
    currentWorkspace: defaultWorkspaces[0] || null,
    workspaces: defaultWorkspaces,
    teams: MOCK_TEAMS,
    currentOrganization: defaultTeam ? { ...defaultTeam } as Organization : null,
    breadcrumbs: [],
    sidebarCollapsed: false,
    lastWorkspaceId: defaultLastWorkspace,
    userTodos: MOCK_USER_TODOS,
    userStats: {
      teamCount: uniqueTeamIds.length,
      workspaceCount: defaultWorkspaces.length,
      pendingCount: MOCK_USER_TODOS.filter((t) => t.status === "pending").length,
    },
    login: (user) => {
      const userWorkspaces = getUserWorkspaces(user.id);
      const userTeam = getUserDefaultTeam(user.id);
      const userTeamIds = new Set([
        ...MOCK_TEAMS.filter((t) => t.creatorId === user.id).map((t) => t.id),
        ...MOCK_MEMBERS.filter((m) => m.userId === user.id).map((m) => m.teamId),
      ]);
      set({
        currentUser: user,
        currentTeam: userTeam,
        currentUserType: userTeam ? getUserTypeFromTeam(userTeam) : "supervisor",
        workspaces: userWorkspaces,
        currentWorkspace: userWorkspaces[0] || null,
        lastWorkspaceId: userWorkspaces[0]?.id || null,
        currentOrganization: userTeam ? { ...userTeam } as Organization : null,
        userStats: {
          teamCount: [...userTeamIds].length,
          workspaceCount: userWorkspaces.length,
          pendingCount: MOCK_USER_TODOS.filter((t) => t.status === "pending").length,
        },
      });
    },
    logout: () => set({
      currentUser: null,
      currentTeam: null,
      currentWorkspace: null,
      currentOrganization: null,
      breadcrumbs: [],
    }),
    switchTeam: (team) => {
      const orgWorkspaces = get().getWorkspacesByOrganization(team.id);
      set({
        currentTeam: team,
        currentUserType: getUserTypeFromTeam(team),
        currentOrganization: team as Organization,
        workspaces: orgWorkspaces,
        currentWorkspace: orgWorkspaces[0] || null,
        lastWorkspaceId: orgWorkspaces[0]?.id || get().lastWorkspaceId,
      });
    },
    switchWorkspace: (workspace) => set({ currentWorkspace: workspace }),
    setCurrentOrganization: (org) => {
      if (org) {
        const orgWorkspaces = get().getWorkspacesByOrganization(org.id);
        set({
          currentOrganization: org,
          workspaces: orgWorkspaces,
          currentWorkspace: orgWorkspaces[0] || null,
        });
      } else {
        set({ currentOrganization: null, workspaces: [], currentWorkspace: null });
      }
    },
    setBreadcrumbs: (items) => set({ breadcrumbs: items }),
    toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
    setLastWorkspaceId: (workspaceId) => set({ lastWorkspaceId: workspaceId }),
    getTeamsInWorkspace: (workspaceId: string) => {
      const teamIds = MOCK_TEAM_WORKSPACES
        .filter((tw) => tw.workspaceId === workspaceId)
        .map((tw) => tw.teamId);
      return get().teams.filter((t) => teamIds.includes(t.id));
    },
    getWorkspacesByOrganization: (orgId: string) => {
      const workspaceIds = MOCK_TEAM_WORKSPACES
        .filter((tw) => tw.teamId === orgId)
        .map((tw) => tw.workspaceId);
      return MOCK_WORKSPACES.filter((ws) => workspaceIds.includes(ws.id));
    },
    updateTodo: (todoId: string, status: TodoStatus) => {
      const todo = get().userTodos.find((t) => t.id === todoId);
      const oldStatus = todo?.status;
      set((s) => ({
        userTodos: s.userTodos.map((t) => (t.id === todoId ? { ...t, status } : t)),
        userStats: {
          ...s.userStats,
          pendingCount:
            oldStatus === "pending" && status !== "pending"
              ? s.userStats.pendingCount - 1
              : oldStatus !== "pending" && status === "pending"
              ? s.userStats.pendingCount + 1
              : s.userStats.pendingCount,
        },
      }));
    },
    updateCurrentUser: (userData: Partial<User>) => {
      const currentUser = get().currentUser;
      if (currentUser) {
        set({ currentUser: { ...currentUser, ...userData } });
      }
    },
  };
});
