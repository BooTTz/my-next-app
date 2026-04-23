# 工贸三方监管平台 UI 设计规范

## 一、概述

本文档定义了工贸三方监管平台的 UI 设计规范，确保全平台视觉一致性和用户体验连贯性。

---

## 二、颜色系统

### 2.1 语义颜色变量

平台使用 CSS 变量定义语义颜色，确保深色模式自动适配。

```css
/* 状态颜色 */
--status-info: #3B82F6;      /* 信息 */
--status-success: #22C55E;   /* 成功 */
--status-warning: #F59E0B;   /* 警告 */
--status-danger: #EF4444;    /* 危险/错误 */
--status-neutral: #9CA3AF;   /* 中性 */
--status-light: #D1D5DB;     /* 浅色 */
```

### 2.2 角色颜色系统

平台三大角色使用专属颜色，便于用户快速识别身份：

| 角色 | 主色 | 用途 |
|------|------|------|
| **监管部门** | `#3B82F6` (蓝色) | 监管方相关元素 |
| **服务机构** | `#22C55E` (绿色) | 机构相关元素 |
| **企业单位** | `#F59E0B` (橙色) | 企业相关元素 |

**使用方式：**

```tsx
// 角色标签
<span className="role-badge-supervisor">监管部门</span>
<span className="role-badge-inspector">服务机构</span>
<span className="role-badge-enterprise">企业单位</span>

// 角色图标
<Users className="icon-supervisor" />  {/* 蓝色 */}
<FileCheck className="icon-inspector" /> {/* 绿色 */}
<Building className="icon-enterprise" /> {/* 橙色 */}
```

### 2.3 深色模式

所有颜色变量在 `.dark` 类下自动切换，无需手动适配。

---

## 三、图标规范

### 3.1 图标库

**必须使用 Lucide React 图标库**，禁止使用 Emoji。

```tsx
// ✅ 正确
import { Users, Settings, Bell } from "lucide-react";
<Users className="size-5" />

// ❌ 错误
<span>👤</span>
```

### 3.2 图标尺寸规范

| 场景 | 尺寸 | Tailwind 类 |
|------|------|-------------|
| 辅助小图标 | 10-12px | `size-3` / `size-3.5` |
| 主要图标 | 14px | `size-4` |
| 大图标 | 16px | `size-5` |
| 装饰图标 | 20px+ | `size-5`+ |

### 3.3 图标颜色

```tsx
// 图标颜色优先级
<Icon className="text-primary" />           {/* 主要强调 */}
<Icon className="text-muted-foreground" />  {/* 次要辅助 */}
<Icon className="icon-supervisor" />         {/* 角色色 */}
<Icon className="icon-inspector" />
<Icon className="icon-enterprise" />
```

---

## 四、组件规范

### 4.1 页面标题 (PageHeader)

**用途**：页面级标题区域，包含标题、操作按钮。

```tsx
import { PageHeader } from "@/components/shared/PageHeader";

// 基础用法
<PageHeader title="隐患管理" />

// 带数量徽章
<PageHeader title="隐患整改" badge={3} />

// 带操作按钮
<PageHeader title="检查计划管理">
  <Button size="sm">新建</Button>
</PageHeader>
```

**Props**:
- `title`: 标题文字
- `badge`: 可选，数量徽章（string | number）
- `children`: 右侧操作按钮

### 4.2 状态徽章 (StatusBadge)

**使用场景**：任务状态、隐患等级、报告状态等实体状态展示。

```tsx
import StatusBadge, { 
  TaskStatusBadge, 
  HazardStatusBadge, 
  ReportStatusBadge,
  HazardLevelBadge 
} from "@/components/shared/StatusBadge";

// 通用
<StatusBadge variant="info" label="进行中" />
<StatusBadge variant="success" label="已完成" />
<StatusBadge variant="warning" label="待处理" />
<StatusBadge variant="danger" label="已过期" />

// 专用组件
<TaskStatusBadge status="inspecting" />
<HazardLevelBadge level="major" />
```

### 4.2 确认对话框 (ConfirmDialog)

**必须使用场景**：删除、取消、放弃更改等不可逆操作。

```tsx
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { useState } from "react";

function DeleteButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        删除
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="确认删除"
        description="此操作不可撤销，确定要删除吗？"
        variant="danger"
        confirmText="删除"
        onConfirm={handleDelete}
      />
    </>
  );
}
```

**variant 类型**：
- `danger`：删除、永久移除等危险操作
- `warning`：警告性操作
- `info`：信息确认
- `edit`：编辑确认

### 4.3 空状态 (EmptyState)

**必须使用场景**：列表、数据为空时展示。

```tsx
import EmptyState, { ListEmpty, SearchEmpty, RefreshEmpty } from "@/components/shared/EmptyState";

// 通用空状态
<EmptyState
  title="暂无数据"
  description="当前没有相关内容"
  icon={Inbox}
/>

// 列表空状态
<ListEmpty onAdd={handleCreate} addLabel="新建" />

// 搜索无结果
<SearchEmpty keyword={keyword} onClear={handleClear} />

// 加载失败
<RefreshEmpty onRefresh={handleRefresh} />
```

### 4.4 加载按钮 (LoadingButton)

**必须使用场景**：异步操作需要等待反馈时。

```tsx
import { LoadingButton } from "@/components/ui/loading-button";

<LoadingButton 
  loading={isSubmitting}
  loadingText="提交中..."
  onClick={handleSubmit}
>
  提交
</LoadingButton>
```

---

## 五、布局规范

### 5.1 顶部区域布局

顶部区域包含面包屑和用户操作按钮，结构紧凑：

```tsx
// layout.tsx 结构
<div className="flex items-center justify-between border-b bg-card px-4">
  <PageBreadcrumb items={breadcrumbs} />
  <TopBarActions />  {/* 主题切换、通知、用户菜单 */}
</div>
```

**组件说明**:
- `PageBreadcrumb`: 轻量级面包屑导航，移除背景和边框
- `TopBarActions`: 整合主题切换、通知铃铛、用户下拉菜单

### 5.2 页面容器

页面主内容区使用 `page-container` 限制最大宽度：

```tsx
// 全宽页面
<div className="page-container">
  {/* 内容 */}
</div>

// 窄版页面（表单、详情）
<div className="page-container-narrow">
  {/* 内容 */}
</div>
```

### 5.3 响应式网格

| 场景 | 断点 | 类名 |
|------|------|------|
| 统计卡片 | `grid-cols-2 lg:grid-cols-4` | 使用 `.grid-stats` |
| 双列卡片 | `grid-cols-1 md:grid-cols-2` | 使用 `.grid-cards-2` |
| 三列卡片 | `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` | 使用 `.grid-cards` |
| 四列卡片 | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` | 使用 `.grid-cards-4` |

### 5.4 卡片悬浮效果

可点击卡片使用 `card-hover` 工具类：

```tsx
// ✅ 正确
<Card className="card-hover" onClick={handleClick}>
  <CardContent>内容</CardContent>
</Card>

// ❌ 错误
<Card className="cursor-pointer hover:shadow-md ...">
```

---

## 六、交互规范

### 6.1 表单验证

- 错误提示显示在输入框下方
- 提交前进行验证
- 错误字段自动获得焦点

### 6.2 危险操作

- 删除必须使用 `ConfirmDialog` 确认
- 确认对话框需明确说明后果
- 危险按钮使用 `variant="destructive"`

### 6.3 加载状态

- 异步操作显示 `LoadingButton`
- 超过 1 秒的操作显示骨架屏
- 禁用操作中的按钮防止重复提交

---

## 七、响应式断点

| 断点 | 宽度 | 场景 |
|------|------|------|
| `sm` | ≥640px | 小屏平板 |
| `md` | ≥768px | 平板 |
| `lg` | ≥1024px | 小屏笔记本 |
| `xl` | ≥1280px | 桌面 |
| `2xl` | ≥1536px | 大屏桌面 |

---

## 八、无障碍规范

### 8.1 颜色对比

- 正文文本与背景对比度 ≥ 4.5:1
- 大文本（≥18px）对比度 ≥ 3:1
- 不要仅用颜色传达信息

### 8.2 焦点状态

- 所有交互元素可见焦点环
- Tab 顺序符合视觉顺序
- 禁用元素不可获得焦点

### 8.3 替代文本

- 图标按钮需提供 `aria-label`
- 图片需提供 `alt` 属性

---

## 九、文件结构

```
src/
├── app/
│   ├── globals.css          # 全局样式、变量定义
│   └── ...
├── components/
│   ├── layout/              # 布局组件
│   │   ├── AppSidebar.tsx
│   │   ├── TopBar.tsx       # 顶部操作栏（含 TopBarActions）
│   │   └── PageBreadcrumb.tsx
│   ├── ui/                 # 基础 UI 组件
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── loading-button.tsx
│   │   └── alert-dialog.tsx
│   └── shared/             # 业务组件
│       ├── StatusBadge.tsx
│       ├── ConfirmDialog.tsx
│       ├── EmptyState.tsx
│       └── PageHeader.tsx
└── lib/
    └── types.ts            # 类型定义
```

---

## 十、常见问题

### Q: 硬编码颜色 vs CSS 变量

**❌ 错误做法：**
```tsx
className="bg-blue-500 text-blue-600"
className="text-red-500"
```

**✅ 正确做法：**
```tsx
className="bg-role-supervisor-bg-subtle text-role-supervisor-foreground"
className="text-destructive"
```

### Q: 多处重复的空状态实现

**❌ 错误做法：**
```tsx
<p className="text-sm text-muted-foreground text-center py-8">暂无成员</p>
<p className="text-sm text-muted-foreground text-center py-6">暂无任务</p>
```

**✅ 正确做法：**
```tsx
<ListEmpty />
<EmptyState variant="task" title="暂无任务" />
```

### Q: 缺少确认的删除操作

**❌ 错误做法：**
```tsx
<Button onClick={() => deleteItem(id)}>删除</Button>
```

**✅ 正确做法：**
```tsx
<Button variant="destructive" onClick={() => setShowDeleteConfirm(true)}>
  删除
</Button>
<ConfirmDialog 
  open={showDeleteConfirm}
  onOpenChange={setShowDeleteConfirm}
  title="确认删除"
  variant="danger"
  onConfirm={() => deleteItem(id)}
/>
```

---

## 附录 A：CSS 变量速查表

| 变量名 | 用途 | 示例 |
|--------|------|------|
| `--status-info` | 信息状态 | `#3B82F6` |
| `--status-success` | 成功状态 | `#22C55E` |
| `--status-warning` | 警告状态 | `#F59E0B` |
| `--status-danger` | 危险状态 | `#EF4444` |
| `--color-role-supervisor` | 监管部门色 | `#3B82F6` |
| `--color-role-inspector` | 服务机构色 | `#22C55E` |
| `--color-role-enterprise` | 企业单位色 | `#F59E0B` |

---

## 附录 B：工具类速查表

| 类名 | 用途 | 使用场景 |
|------|------|----------|
| `.input-search` | 搜索框统一样式 | 搜索输入框 |
| `.card-hover` | 卡片悬浮效果 | 可点击卡片 |
| `.page-container` | 页面容器（全宽） | 页面根元素 |
| `.page-container-narrow` | 页面容器（窄版） | 表单、详情页 |
| `.grid-stats` | 统计卡片网格 | 4列统计 |
| `.grid-cards` | 卡片网格 | 3列卡片 |
| `.grid-cards-2` | 双列网格 | 2列布局 |
| `.role-badge-*` | 角色标签 | 角色标识 |
| `.icon-*` | 角色图标 | 角色图标色 |
