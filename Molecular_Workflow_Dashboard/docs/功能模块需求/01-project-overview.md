# Molecular Workflow Dashboard — 项目概述

## 1. 项目背景

本项目是一个面向化学与生命科学领域的 **SaaS 平台 Demo**，对标 Chiral (chiral.one) 的产品形态。平台允许研究人员在浏览器中运行计算管线、可视化分子结构、管理团队协作。

本项目的核心目的：**作为求职作品集，精准展示候选人具备 Chiral 岗位所需的全部技术能力。**

---

## 2. 项目定位

| 维度      | 说明                                              |
| --------- | ------------------------------------------------- |
| 产品类型  | 科学计算 SaaS 平台（Multi-tenant）                |
| 用户角色  | 研究员、实验室管理员、组织管理员                  |
| 核心场景  | 计算管线编排 → 执行监控 → 结果可视化 → 团队协作   |
| Demo 定位 | 完整展示技术能力，不依赖真实后端（使用 Mock API） |

---

## 3. 技术栈

### 3.1 核心框架

| 技术       | 版本         | 用途                        |
| ---------- | ------------ | --------------------------- |
| Next.js    | 15.x         | 全栈 React 框架，App Router |
| React      | 19.x         | UI 库                       |
| TypeScript | 5.x (strict) | 类型安全                    |
| Node.js    | 20.x+        | 运行时                      |

### 3.2 UI 与样式

| 技术                | 用途             |
| ------------------- | ---------------- |
| Tailwind CSS 4.x    | 原子化样式       |
| shadcn/ui           | 组件库基础       |
| Radix UI            | 无头组件原语     |
| Lucide Icons        | 图标             |
| Recharts / Nivo     | 数据可视化图表   |
| Three.js / 3D Mol\* | 分子结构 3D 渲染 |

### 3.3 数据与状态

| 技术                  | 用途                       |
| --------------------- | -------------------------- |
| TanStack React Query  | 服务端状态管理、缓存、同步 |
| Zustand               | 客户端 UI 状态（如有需要） |
| React Hook Form + Zod | 表单管理与数据校验         |
| Zod                   | API 响应 schema 校验       |

### 3.4 测试

| 技术                      | 用途                |
| ------------------------- | ------------------- |
| Vitest                    | 单元测试 / 组件测试 |
| Testing Library           | React 组件测试      |
| Playwright                | E2E 测试            |
| MSW (Mock Service Worker) | API Mock            |

### 3.5 工程化

| 技术                | 用途                     |
| ------------------- | ------------------------ |
| ESLint + Prettier   | 代码规范                 |
| Husky + lint-staged | Git Hooks                |
| Turbopack           | 开发构建（Next.js 内置） |
| Vercel              | 部署平台                 |

---

## 4. 项目结构

```
molecular-workflow-dashboard/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # 认证路由组
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/              # 主应用路由组
│   │   │   ├── layout.tsx            # 侧边栏 + 顶栏布局
│   │   │   ├── page.tsx              # 仪表盘首页
│   │   │   ├── projects/             # 项目管理
│   │   │   │   ├── page.tsx          # 项目列表
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx      # 项目详情
│   │   │   │       ├── pipeline/     # 管线编辑器
│   │   │   │       ├── results/      # 结果可视化
│   │   │   │       └── settings/     # 项目设置
│   │   │   ├── molecules/            # 分子库
│   │   │   ├── team/                 # 团队管理
│   │   │   └── settings/             # 个人/组织设置
│   │   ├── api/                      # API Routes (Mock)
│   │   ├── layout.tsx                # 根布局
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                       # shadcn/ui 组件
│   │   ├── shared/                   # 通用业务组件
│   │   ├── dashboard/                # 仪表盘专用组件
│   │   ├── pipeline/                 # 管线编辑器组件
│   │   ├── visualization/            # 可视化组件
│   │   └── collaboration/            # 协作组件
│   ├── lib/
│   │   ├── api/                      # API 客户端（typed）
│   │   ├── hooks/                    # 自定义 Hooks
│   │   ├── utils/                    # 工具函数
│   │   └── validations/             # Zod schemas
│   ├── types/                        # TypeScript 类型定义
│   ├── mocks/                        # MSW handlers + fixtures
│   └── styles/                       # 全局样式变量
├── tests/
│   ├── unit/                         # 单元测试
│   ├── integration/                  # 集成测试
│   └── e2e/                          # Playwright E2E
├── docs/                             # 项目文档
├── public/                           # 静态资源
└── ...config files
```

---

## 5. 多租户模型

```
Organization (组织)
  └── Team (团队)
       └── Member (成员) — 角色: admin / editor / viewer
            └── Project (项目)
                 └── Pipeline (管线)
                      └── Run (执行记录)
```

| 角色   | 权限                         |
| ------ | ---------------------------- |
| admin  | 管理组织、邀请成员、删除项目 |
| editor | 创建项目、编辑管线、运行计算 |
| viewer | 查看项目、查看结果、添加评论 |

---

## 6. 交付标准

### 必须达成

- [ ] 所有核心页面功能完整可交互
- [ ] TypeScript strict mode 零错误
- [ ] 测试覆盖率 > 70%
- [ ] Lighthouse 四项指标均 > 90
- [ ] 完整的 README（含架构说明、截图、技术亮点）
- [ ] 成功部署到 Vercel

### 加分目标

- [ ] Storybook 组件文档
- [ ] 技术博客文章
- [ ] CI/CD pipeline（GitHub Actions）
- [ ] 国际化（i18n）支持
