# 版本更新记录

## v1.1.7 (2026-04-29)

**标签**: `v1.1.7`  
**对应提交**: `9061b16`  
**GitHub**: https://github.com/BooTTz/my-next-app/releases/tag/v1.1.7

### 包含内容
- **工作台页面重构**：统一重构所有角色（监管方/服务方/履行方）工作台
- **导航路由调整**：`/team/[teamId]/dashboard` 更名为 `/team/[teamId]/workspace`
- **面包屑系统升级**：集成面包屑配置到全局路由系统
- **详情页弹窗化**：隐患详情、用户详情等改为弹窗展示
- **UI组件优化**：DetailDialog、PageHeader 等组件完善

### 改动文件
- `src/app/team/[teamId]/workspace/page.tsx` - 重命名自 dashboard
- `src/app/workspace/` - 工作台页面重构
- `src/components/dashboard/*.tsx` - 各角色仪表盘优化
- `src/components/layout/AppSidebar.tsx` - 侧边栏优化
- `src/lib/breadcrumb-config.ts` - 面包屑配置更新

### 如何恢复到此版本
```bash
# 方式1：创建新分支恢复（推荐）
git checkout -b restore-v1.1.7 v1.1.7

# 方式2：直接重置（慎用，会丢失之后的提交）
git reset --hard v1.1.7
```

---

## v1.1.6 (2026-04-28)

**标签**: `v1.1.6`
**对应提交**: `75ee236`
**GitHub**: https://github.com/BooTTz/my-next-app/releases/tag/v1.1.6

### 包含内容
- **侧边栏优化**：移除顶部工作组选择器，简化导航结构
- **面包屑调整**：工作台页面不显示面包屑，保持简洁
- **三方统计可点击**：底部企业/机构/监管统计入口可点击跳转至工作组设置页面
- **新增组件**：`RoleThemeProvider.tsx` 角色主题配置组件

### 改动文件
- `src/components/layout/AppSidebar.tsx` - 侧边栏重构
- `src/components/layout/PageBreadcrumb.tsx` - 面包屑优化
- `src/lib/breadcrumb-config.ts` - 面包屑配置调整
- `src/components/shared/RoleThemeProvider.tsx` - 新增

### 如何恢复到此版本
```bash
# 方式1：创建新分支恢复（推荐）
git checkout -b restore-v1.1.6 v1.1.6

# 方式2：直接重置（慎用，会丢失之后的提交）
git reset --hard v1.1.6
```

---

## v1.1.5 (2026-04-23)

### 包含内容
- **个人中心页面重构**：三栏布局调整（左侧：组织+工作组，右侧：统计+个人基本信息+我的待办）
- **我的待办功能**：从左侧移动到右侧"个人基本信息"下方
- **面包屑导航优化**：移除首页层级，根目录直接是工作台
- **状态管理修复**：
  - 修复 `userTeamIds` 统计逻辑，使用 `MOCK_MEMBERS` 正确统计用户所属团队
  - 修复 `updateTodo` 双向状态变化的 `pendingCount` 更新
- **类型安全增强**：新增 `TodoStatus` 类型定义
- **数据更新**：待办数据日期从 2025年 更新为 2026年
- **UI 细节修复**：
  - 修复 BottomBar 监管方数量硬编码问题
  - 统一 workspace 页面待处理数量使用 `userStats.pendingCount`
  - 修复 JSX 中文引号转义问题
- **代码质量**：修复 TypeScript 类型错误和 ESLint 警告

### 改动文件
- `src/app/profile/page.tsx` - 个人中心页面重构
- `src/app/page.tsx` - 根页面简化
- `src/app/workspace/` - 工作台页面和布局
- `src/lib/breadcrumb-config.ts` - 面包屑配置优化
- `src/components/layout/` - 布局组件重构
- `src/lib/store.ts` - 状态管理修复
- `src/lib/types.ts` - 类型定义增强
- `src/lib/mock-data.ts` - 数据更新
- `src/hooks/useHydrated.ts` - ESLint 修复

---

## v1.1.3 (2026-04-22)

**标签**: `v1.1.3`  
**对应提交**: `d4298f9`
**GitHub**: https://github.com/BooTTz/my-next-app/releases/tag/v1.1.3

### 包含内容
- **新增 DetailDialog 组件**：统一 16:9 横向比例弹窗组件，包含 Header/Body/Footer 结构
- **隐患管理页面**：详情从独立页面改为弹窗展示
- **成员管理页面**：查看详情改为弹窗展示
- **用户管理页面**：查看详情改为弹窗展示
- **组织管理页面**：查看详情改为弹窗展示
- **列表操作优化**：统一使用"查看"按钮，替代下拉菜单

### 如何恢复到此版本
```bash
# 方式1：创建新分支恢复（推荐）
git checkout -b restore-v1.1.3 v1.1.3

# 方式2：直接重置（慎用，会丢失之后的提交）
git reset --hard v1.1.3
```

---

## v1.1.2 (2026-04-22)

**标签**: `v1.1.2`  
**对应提交**: `a1db13c`
**GitHub**: https://github.com/BooTTz/my-next-app/releases/tag/v1.1.2

### 包含内容
- **管理后台模块**：新增 `/admin` 页面，包含用户管理、组织管理功能
- **组织管理模块**：新增 `/organization/[orgId]` 页面，支持组织详情查看和设置
- **个人中心模块**：新增 `/profile` 页面
- **面包屑导航系统**：新增 PageBreadcrumb 组件和 useBreadcrumbs hook
- **底部导航栏**：新增 BottomBar 组件
- **悬停操作菜单**：新增 HoverActionMenu 组件
- **组织卡片组件**：新增 OrganizationCard 组件
- **新增 UI 组件**：breadcrumb、skeleton、switch
- **工作组页面增强**：完善各子页面功能
- **Mock 数据扩展**：新增组织相关数据
- **版本号更新**：应用版本号更新至 v1.1.2

### 如何恢复到此版本
```bash
# 方式1：创建新分支恢复（推荐）
git checkout -b restore-v1.1.2 v1.1.2

# 方式2：直接重置（慎用，会丢失之后的提交）
git reset --hard v1.1.2
```

---

## v1.0.5 (2026-04-21)

**标签**: `v1.0.5`  
**对应提交**: `76ac9aa`
**GitHub**: https://github.com/BooTTz/my-next-app/releases/tag/v1.0.5

### 包含内容
- **工作组管理页面重构**：卡片尺寸优化，减小视觉占用
- **团队列表跳转优化**：查看按钮跳转至团队详情页（而非工作台）
- **团队详情页功能完善**：新增 Tab 切换（基本信息/成员列表/组织架构树）
- **组织架构树展示**：按监管方/服务方/履行方分组展示成员
- **导航栏清理**：移除成员管理入口，整合至团队详情页
- **浅色模式侧边栏**：改为白色背景，提升视觉一致性
- **Radix UI 兼容修复**：DropdownMenuLabel 改用 div 替代，DropdownMenuItem 事件改用 onSelect
- **返回按钮补全**：团队详情页、工作台页面添加返回按钮
- **版本号更新**：应用版本号更新至 v1.0.5

### 如何恢复到此版本
```bash
# 方式1：创建新分支恢复（推荐）
git checkout -b restore-v1.0.5 v1.0.5

# 方式2：直接重置（慎用，会丢失之后的提交）
git reset --hard v1.0.5
```

---

## v1.1.1 (2026-04-21)

**标签**: `v1.1.1`  
**对应提交**: 待推送后补充
**GitHub**: https://github.com/BooTTz/my-next-app/releases/tag/v1.1.1

### 包含内容
- **左侧导航栏工作组整合**：AppSidebar 顶部区域改为工作组选择器，显示当前工作组名称，可切换工作组
- **工作组管理入口**：监管方可在侧边栏直接进入工作组管理页面
- **TopBar 简化**：移除中间导航链接和重复的工作组选择器，改为显示团队名称
- **工作组管理页面增强**：新增编辑工作组信息功能，完善信息卡片（增加所属区域、创建时间、服务机构数量）
- **团队成员页面重构**：基于当前团队过滤成员显示，新增团队信息卡片
- **新增团队详情页**：`/team/[teamId]` 页面展示团队基本信息、统计、成员列表等
- **类型定义增强**：新增 TeamRole、WorkspaceAdmin 类型
- **Mock 数据扩展**：新增工作组管理员数据
- **版本号更新**：应用版本号更新至 v1.1.1

### 如何恢复到此版本
```bash
# 方式1：创建新分支恢复（推荐）
git checkout -b restore-v1.1.1 v1.1.1

# 方式2：直接重置（慎用，会丢失之后的提交）
git reset --hard v1.1.1
```

---

## v1.1.0 (2026-04-21)

**标签**: `v1.1.0`  
**对应提交**: 待推送后补充
**GitHub**: https://github.com/BooTTz/my-next-app/releases/tag/v1.1.0

### 包含内容
- **工作组层级重构**：引入工作组（Workspace）概念，用户→团队→工作组的新架构
- **行政区划管理**：新增行政区划树组件，支持树形结构展示和节点选择
- **深色/亮色主题切换**：集成 next-themes，支持主题切换和跟随系统设置
- **演示账号系统**：三个预设角色（监管方/服务方/履行方）快速切换
- **移除角色切换按钮**：改为演示账号切换方式
- **工作组管理页面**：新增 `/workspace/settings` 页面，包含组织信息、监管方、服务方、履行方四个标签页
- **个人工作台更新**：展示工作组而非团队，增加快速角色切换功能
- **类型定义增强**：新增 Workspace、RegionNode、TeamWorkspace 类型，更新 Team 类型
- **Mock 数据扩展**：新增工作组、行政区划、团队关联、演示账号数据
- **版本号更新**：应用版本号更新至 v1.1.0

### 如何恢复到此版本
```bash
# 方式1：创建新分支恢复（推荐）
git checkout -b restore-v1.1.0 v1.1.0

# 方式2：直接重置（慎用，会丢失之后的提交）
git reset --hard v1.1.0
```

---

## v1.0.2 (2026-04-21)

**标签**: `v1.0.2`  
**对应提交**: `9ab63d0`  
**GitHub**: https://github.com/BooTTz/my-next-app/releases/tag/v1.0.2

### 包含内容
- 项目结构审计与问题修复
- 更新 README.md 为项目说明文档
- 清理 .next 缓存解决 TypeScript 类型引用错误
- 新增产品经理代理配置（.qoder/agents/）
- 新增迭代 v1.1.0 设计说明文档

### 如何恢复到此版本
```bash
# 方式1：创建新分支恢复（推荐）
git checkout -b restore-v1.0.2 v1.0.2

# 方式2：直接重置（慎用，会丢失之后的提交）
git reset --hard v1.0.2
```

---

## v1.0.1 (2026-04-17)

**标签**: `v1.0.1`  
**对应提交**: `24bacb2`  
**GitHub**: https://github.com/BooTTz/my-next-app/releases/tag/v1.0.1

### 包含内容
- 新增版本管理规范到 Vibe-Qoder.md
- 初始化 CHANGELOG.md 版本记录文档
- 新增项目设计方案文档（specs 目录）

### 如何恢复到此版本
```bash
# 方式1：创建新分支恢复（推荐）
git checkout -b restore-v1.0.1 v1.0.1

# 方式2：直接重置（慎用，会丢失之后的提交）
git reset --hard v1.0.1
```

---

## v1.0.0 (2026-04-17)

**标签**: `v1.0.0`  
**对应提交**: `f5f1433`  
**GitHub**: https://github.com/BooTTz/my-next-app/releases/tag/v1.0.0

### 包含内容
- 安全管理系统基础页面（仪表盘、隐患、任务、计划等）
- Supabase 客户端集成
- TypeScript 类型错误修复
- 连接测试页面 `/test-supabase`

### 如何恢复到此版本
```bash
# 方式1：创建新分支恢复（推荐）
git checkout -b restore-v1.0.0 v1.0.0

# 方式2：直接重置（慎用，会丢失之后的提交）
git reset --hard v1.0.0
```
