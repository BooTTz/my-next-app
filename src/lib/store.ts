/* ========================================
 * 工贸三方监管平台 - Zustand 全局状态管理
 * v1.1.0 - 新增工作组层级，移除角色切换
 * ======================================== */
import { create } from "zustand";
import type { User, Team, UserType, Workspace } from "./types";
import { MOCK_USERS, MOCK_TEAMS, MOCK_WORKSPACES, MOCK_TEAM_WORKSPACES } from "./mock-data";

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
  /** 侧边栏是否折叠 */
  sidebarCollapsed: boolean;
  /** 登录 */
  login: (user: User) => void;
  /** 登出 */
  logout: () => void;
  /** 切换团队（根据团队类型自动确定 userType） */
  switchTeam: (team: Team) => void;
  /** 切换工作组 */
  switchWorkspace: (workspace: Workspace) => void;
  /** 切换侧边栏 */
  toggleSidebar: () => void;
  /** 获取当前工作组内的团队列表 */
  getTeamsInWorkspace: (workspaceId: string) => Team[];
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

export const useAppStore = create<AppState>((set, get) => {
  const defaultUser = MOCK_USERS[0];
  const defaultTeam = getUserDefaultTeam(defaultUser.id);
  const defaultWorkspaces = getUserWorkspaces(defaultUser.id);

  return {
    currentUser: defaultUser,
    currentTeam: defaultTeam,
    currentUserType: defaultTeam ? getUserTypeFromTeam(defaultTeam) : "supervisor",
    currentWorkspace: defaultWorkspaces[0] || null,
    workspaces: defaultWorkspaces,
    teams: MOCK_TEAMS,
    sidebarCollapsed: false,
    login: (user) => {
      const userWorkspaces = getUserWorkspaces(user.id);
      const userTeam = getUserDefaultTeam(user.id);
      set({
        currentUser: user,
        currentTeam: userTeam,
        currentUserType: userTeam ? getUserTypeFromTeam(userTeam) : "supervisor",
        workspaces: userWorkspaces,
        currentWorkspace: userWorkspaces[0] || null,
      });
    },
    logout: () => set({ currentUser: null, currentTeam: null, currentWorkspace: null }),
    switchTeam: (team) => set({
      currentTeam: team,
      currentUserType: getUserTypeFromTeam(team),
    }),
    switchWorkspace: (workspace) => set({ currentWorkspace: workspace }),
    toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
    getTeamsInWorkspace: (workspaceId: string) => {
      const teamIds = MOCK_TEAM_WORKSPACES
        .filter((tw) => tw.workspaceId === workspaceId)
        .map((tw) => tw.teamId);
      return get().teams.filter((t) => teamIds.includes(t.id));
    },
  };
});
