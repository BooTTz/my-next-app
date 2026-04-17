/* ========================================
 * 工贸三方监管平台 - Zustand 全局状态管理
 * ======================================== */
import { create } from "zustand";
import type { User, Team, UserType } from "./types";
import { MOCK_USERS, MOCK_TEAMS } from "./mock-data";

interface AppState {
  /** 当前登录用户 */
  currentUser: User | null;
  /** 当前选中的团队 */
  currentTeam: Team | null;
  /** 当前在团队中的用户类型 */
  currentUserType: UserType;
  /** 用户加入的所有团队 */
  teams: Team[];
  /** 侧边栏是否折叠 */
  sidebarCollapsed: boolean;
  /** 登录 */
  login: (user: User) => void;
  /** 登出 */
  logout: () => void;
  /** 切换团队 */
  switchTeam: (team: Team, userType: UserType) => void;
  /** 切换用户类型（用于演示） */
  switchUserType: (userType: UserType) => void;
  /** 切换侧边栏 */
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentUser: MOCK_USERS[0], // 默认以李伟（监管方）登录
  currentTeam: MOCK_TEAMS[0],
  currentUserType: "supervisor",
  teams: MOCK_TEAMS,
  sidebarCollapsed: false,
  login: (user) => set({ currentUser: user }),
  logout: () => set({ currentUser: null, currentTeam: null }),
  switchTeam: (team, userType) => set({ currentTeam: team, currentUserType: userType }),
  switchUserType: (userType) => set({ currentUserType: userType }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
}));
