# 工贸三方监管平台

面向监管方、服务方、履行方的工贸企业安全生产检查与协同监管平台。

## 功能特性

- **三方协作**：监管方发布检查计划、服务方执行现场检查、企业方完成隐患整改
- **检查计划管理**：支持日常检查、专项检查、双随机检查、节假日检查等多种类型
- **隐患全流程追踪**：发现 → 通知 → 整改 → 复查 → 销号
- **多角色仪表盘**：根据用户类型（监管方/服务方/履行方）展示不同视角的数据

## 技术栈

- **框架**: Next.js 16 + TypeScript
- **样式**: Tailwind CSS v4 + shadcn/ui
- **状态管理**: Zustand
- **后端服务**: Supabase (可选)
- **包管理**: pnpm

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 代码检查
pnpm lint
```

## 项目结构

```
src/
├── app/                    # Next.js App Router 页面
│   ├── (auth)/            # 认证相关页面
│   │   ├── login/         # 登录页
│   │   └── register/      # 注册页
│   ├── team/[teamId]/    # 团队工作空间
│   │   ├── dashboard/     # 仪表盘
│   │   ├── plans/        # 检查计划
│   │   ├── tasks/        # 检查任务
│   │   ├── hazards/      # 隐患管理
│   │   ├── reports/      # 报告管理
│   │   ├── members/      # 成员管理
│   │   ├── statistics/   # 统计分析
│   │   └── settings/     # 团队设置
│   └── workspace/        # 工作空间入口
├── components/
│   ├── ui/               # shadcn/ui 基础组件
│   ├── layout/           # 布局组件（侧边栏、顶栏）
│   ├── dashboard/        # 仪表盘组件
│   └── shared/           # 通用组件
├── lib/
│   ├── types.ts          # TypeScript 类型定义
│   ├── store.ts          # Zustand 状态管理
│   ├── mock-data.ts      # Mock 数据
│   ├── utils.ts          # 工具函数
│   └── supabase.ts       # Supabase 客户端
└── hooks/
    └── useHydrated.ts    # 水合状态 hook
```

## 环境变量

复制 `.env.local.example` 为 `.env.local` 并配置：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 演示账号

| 角色 | 姓名 | 手机号 |
|------|------|--------|
| 监管方 | 李伟 | 13800001001 |
| 服务方 | 张敏 | 13800001002 |
| 履行方 | 陈杰 | 13800001004 |

## 版本管理

详见 [CHANGELOG.md](./CHANGELOG.md)

## 许可证

MIT
