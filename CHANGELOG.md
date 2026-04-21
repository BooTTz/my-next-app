# 版本更新记录

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
