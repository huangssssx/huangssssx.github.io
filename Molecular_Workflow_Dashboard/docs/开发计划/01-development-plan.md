# Molecular Workflow Dashboard — 开发计划书

## 1. 总览

### 1.1 目标

以 7 个 Phase、按递增复杂度完成项目开发，确保每个 Phase 结束后都有可演示的交付物。

### 1.2 开发节奏

| Phase    | 名称         | 预估工时   | 核心产出                      |
| -------- | ------------ | ---------- | ----------------------------- |
| P1       | 基础框架搭建 | 3 天       | 可运行的空壳应用              |
| P2       | 仪表盘模块   | 4 天       | 完整 Dashboard 页面           |
| P3       | 管线编辑器   | 6 天       | 核心亮点模块                  |
| P4       | 数据可视化   | 5 天       | 图表 + 3D 查看器              |
| P5       | 协作模块     | 4 天       | 团队管理 + 评论 + 通知        |
| P6       | 测试与优化   | 4 天       | 覆盖率 > 70%，Lighthouse > 90 |
| P7       | 交付与收尾   | 2 天       | README + Vercel 部署          |
| **合计** |              | **~28 天** |                               |

> 工时为全职投入估算，兼职开发按比例延长。

---

## 2. Phase 1 — 基础框架搭建（3 天）

### 2.1 目标

建立项目骨架，配置全部工具链，完成布局组件和路由结构。Phase 1 结束后，应用可启动、可导航，但各页面为空状态。

### 2.2 任务清单

#### Day 1：项目初始化与工具链

| #   | 任务                     | 细节                                                                                                                                                                                                                                      | 验收标准            |
| --- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| 1.1 | 创建 Next.js 15 项目     | `npx create-next-app@latest` — App Router, TypeScript strict, Tailwind, ESLint                                                                                                                                                            | `pnpm dev` 正常启动 |
| 1.2 | 配置路径别名             | `tsconfig.json` 添加 `@/` 别名                                                                                                                                                                                                            | import 路径生效     |
| 1.3 | 安装核心依赖             | `@tanstack/react-query`, `zustand`, `react-hook-form`, `@hookform/resolvers`, `zod`, `axios`                                                                                                                                              | 无版本冲突          |
| 1.4 | 配置 shadcn/ui           | `npx shadcn@latest init` — New York style, CSS variables                                                                                                                                                                                  | 基础组件可引入      |
| 1.5 | 批量安装 shadcn 组件     | button, input, label, textarea, select, dialog, alert-dialog, toast, table, card, badge, tabs, avatar, dropdown-menu, command, breadcrumb, pagination, skeleton, progress, scroll-area, sheet, sidebar, separator, tooltip, popover, form | 所有组件可 import   |
| 1.6 | 配置 Prettier            | `.prettierrc` + Tailwind plugin (`prettier-plugin-tailwindcss`)                                                                                                                                                                           | `pnpm format` 正常  |
| 1.7 | 配置 Husky + lint-staged | pre-commit hook: ESLint + Prettier                                                                                                                                                                                                        | 提交时自动检查      |

#### Day 2：全局样式与设计 Token

| #    | 任务               | 细节                                                                          | 验收标准       |
| ---- | ------------------ | ----------------------------------------------------------------------------- | -------------- |
| 1.8  | 配置 Tailwind 主题 | 颜色系统 (CSS variables), 科学主题配色 (见 `06-component-architecture.md` §4) | CSS 变量可引用 |
| 1.9  | 配置字体           | Inter + JetBrains Mono，使用 `next/font/google`                               | 字体正确渲染   |
| 1.10 | 全局样式           | `globals.css` — reset, 基础排版, 滚动条样式                                   | 基础样式生效   |
| 1.11 | 暗色模式支持       | CSS 变量 dark 主题, `next-themes` 集成                                        | 切换主题正常   |

#### Day 3：布局、路由与 Mock 基础设施

| #    | 任务                                        | 细节                                                                                                                                       | 验收标准           |
| ---- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------ |
| 1.12 | 根布局 `app/layout.tsx`                     | QueryClientProvider, ThemeProvider, Toaster, 全局字体                                                                                      | Provider 嵌套正确  |
| 1.13 | 认证路由组 `app/(auth)/`                    | login, register 页面占位                                                                                                                   | 路由可达           |
| 1.14 | Dashboard 布局 `app/(dashboard)/layout.tsx` | Sidebar + Header + Main 区域，响应式                                                                                                       | 三栏布局正确       |
| 1.15 | Sidebar 组件                                | 导航菜单（首页/项目/分子库/团队/设置）, 折叠/展开, 当前路由高亮, 响应式（见 `02-dashboard.md` §5）                                         | 导航交互正常       |
| 1.16 | Header 组件                                 | Org Switcher 占位, 通知铃铛占位, 用户头像下拉                                                                                              | 布局正确           |
| 1.17 | 搭建路由结构                                | 所有路由页面创建占位文件（见 `01-project-overview.md` §4 项目结构）                                                                        | 所有 URL 可访问    |
| 1.18 | MSW 基础设施                                | 安装 `msw`, 创建 `mocks/handlers.ts`, `mocks/browser.ts`, `mocks/server.ts`                                                                | MSW 可拦截请求     |
| 1.19 | TypeScript 类型定义                         | 创建 `types/` 下所有核心类型（DashboardStats, Pipeline, PipelineNode, MoleculeResult, TeamMember, Comment, Notification 等，见各模块文档） | 类型可引用且无错误 |
| 1.20 | API 客户端封装                              | `lib/api/client.ts` — 基于 axios/fetch 的 typed client, 错误处理                                                                           | 请求函数可调用     |
| 1.21 | Zod Schema 定义                             | `lib/validations/` — 所有表单/接口的 Zod schema                                                                                            | schema 可用        |

### 2.3 Phase 1 里程碑

```
pnpm dev → 启动应用 → 侧边栏导航 → 各路由可达 → MSW 拦截请求
```

---

## 3. Phase 2 — 仪表盘模块（4 天）

### 3.1 目标

完成 Dashboard 首页和项目列表页，展示 Server Components + React Query + Suspense Streaming 能力。

### 3.2 任务清单

#### Day 1：Dashboard 首页 — Stats + Skeleton

| #   | 任务               | 细节                                                                                    | 依赖文档               |
| --- | ------------------ | --------------------------------------------------------------------------------------- | ---------------------- |
| 2.1 | Mock 数据          | `mocks/fixtures/dashboard.ts` — stats, recent-projects, activity-chart, activity-feed   | `02-dashboard.md` §2   |
| 2.2 | MSW handlers       | Dashboard 相关 4 个 API handler                                                         | `02-dashboard.md` §3   |
| 2.3 | API 函数           | `lib/api/dashboard.ts` — getStats, getRecentProjects, getActivityChart, getActivityFeed | —                      |
| 2.4 | React Query hooks  | `lib/hooks/use-dashboard.ts` — 4 个 hook（useQuery / useInfiniteQuery）                 | —                      |
| 2.5 | Stats Cards 组件   | Server Component, Suspense boundary, Skeleton 加载态, 计数动画 (Client Component 包裹)  | `02-dashboard.md` §4.1 |
| 2.6 | Dashboard 页面组装 | `app/(dashboard)/page.tsx` — Stats Cards + Suspense                                     | —                      |

#### Day 2：Dashboard 首页 — 项目列表 + 活动图表

| #    | 任务                 | 细节                                                               | 依赖文档               |
| ---- | -------------------- | ------------------------------------------------------------------ | ---------------------- |
| 2.7  | Recent Projects 组件 | 项目卡片列表, Server Component + React Query prefetch              | `02-dashboard.md` §2   |
| 2.8  | Activity Chart 组件  | Recharts AreaChart, 7天/30天切换, Client Component, dynamic import | `02-dashboard.md` §4   |
| 2.9  | Org Switcher 组件    | 下拉选择器, Context 管理当前组织, 切换后 invalidateQueries         | `02-dashboard.md` §4.2 |
| 2.10 | Dashboard 页面完善   | 双列布局: 左侧近期项目 + 右侧活动图表                              | —                      |

#### Day 3：Activity Feed

| #    | 任务                 | 细节                                               | 依赖文档                            |
| ---- | -------------------- | -------------------------------------------------- | ----------------------------------- |
| 2.11 | Activity Feed 组件   | 无限滚动, useInfiniteQuery, 相对时间显示, 点击跳转 | `02-dashboard.md` §4.3              |
| 2.12 | DateDisplay 共享组件 | 相对时间 / 绝对时间格式化                          | `06-component-architecture.md` §3.2 |
| 2.13 | Dashboard 页面完成   | Activity Feed 区域                                 | —                                   |

#### Day 4：项目列表页

| #    | 任务               | 细节                                                                                 | 依赖文档                            |
| ---- | ------------------ | ------------------------------------------------------------------------------------ | ----------------------------------- |
| 2.14 | 项目相关 Mock 数据 | `mocks/fixtures/projects.ts`                                                         | —                                   |
| 2.15 | 项目 MSW handlers  | 项目 CRUD API handlers                                                               | —                                   |
| 2.16 | 项目 API + hooks   | `lib/api/projects.ts`, `lib/hooks/use-projects.ts`                                   | —                                   |
| 2.17 | DataTable 共享组件 | 基于 shadcn Table, 支持排序/筛选/分页 (TanStack Table)                               | `06-component-architecture.md` §3.2 |
| 2.18 | 项目列表页         | `app/(dashboard)/projects/page.tsx` — DataTable 展示项目, 搜索/筛选, 新建项目 Dialog | —                                   |
| 2.19 | 项目详情页骨架     | `app/(dashboard)/projects/[id]/page.tsx` — 基本信息展示                              | —                                   |
| 2.20 | 响应式适配         | Dashboard 和项目列表页响应式（三断点, 见 `02-dashboard.md` §5）                      | —                                   |

### 3.3 Phase 2 里程碑

```
Dashboard 首页: Stats(动画) + 项目卡片 + 图表 + Activity Feed(无限滚动)
Org Switcher: 切换组织 → 数据刷新
项目列表: 表格 + 搜索 + 筛选 + 新建
```

---

## 4. Phase 3 — 管线编辑器（6 天）

### 4.1 目标

完成管线编辑器——项目的核心亮点模块。展示 React Flow 复杂交互 + React Query 实时数据流。

### 4.2 任务清单

#### Day 1：管线列表 + 基础编辑器壳

| #   | 任务              | 细节                                                                                                                  | 依赖文档              |
| --- | ----------------- | --------------------------------------------------------------------------------------------------------------------- | --------------------- |
| 3.1 | 管线 Mock 数据    | `mocks/fixtures/pipelines.ts` — Pipeline, PipelineNode, PipelineEdge, PipelineRun                                     | `03-pipeline.md` §3   |
| 3.2 | 管线 MSW handlers | 管线 CRUD + 运行相关 API handlers (8 个接口)                                                                          | `03-pipeline.md` §4   |
| 3.3 | 管线 API + hooks  | `lib/api/pipelines.ts`, `lib/hooks/use-pipelines.ts`                                                                  | —                     |
| 3.4 | 管线列表页        | DataTable 展示管线, 状态 Badge, 新建/删除管线 Dialog                                                                  | `03-pipeline.md` §2.1 |
| 3.5 | 编辑器页面壳      | `app/(dashboard)/projects/[id]/pipelines/[pipelineId]/page.tsx` — Toolbar + 左侧节点面板 + Canvas 区域 + Bottom Panel | `03-pipeline.md` §2.2 |
| 3.6 | 安装 React Flow   | `@xyflow/react` — 配置基本 Canvas                                                                                     | —                     |

#### Day 2-3：节点拖拽与连线

| #    | 任务                | 细节                                                                                        | 依赖文档                |
| ---- | ------------------- | ------------------------------------------------------------------------------------------- | ----------------------- |
| 3.7  | 节点面板            | 左侧面板: 6 种节点类型分类展示, 可拖拽                                                      | `03-pipeline.md` §2.2.A |
| 3.8  | 自定义节点组件      | 6 种节点各自的外观组件 (MoleculeInput, Docking, Optimization, Filter, PropertyCalc, Export) | `03-pipeline.md` §2.2.A |
| 3.9  | 自定义边组件        | 带类型校验颜色标识                                                                          | `03-pipeline.md` §2.2.B |
| 3.10 | 拖拽创建节点        | 从节点面板拖到 Canvas 创建节点                                                              | —                       |
| 3.11 | 节点连线            | 输出端口 → 输入端口, 类型兼容校验                                                           | `03-pipeline.md` §2.2.B |
| 3.12 | 删除节点/连线       | 选中后 Delete 键或右键菜单删除                                                              | —                       |
| 3.13 | Mini Map + Controls | React Flow 内置控件                                                                         | —                       |

#### Day 4：节点配置 + 自动保存

| #    | 任务           | 细节                                                                          | 依赖文档                     |
| ---- | -------------- | ----------------------------------------------------------------------------- | ---------------------------- |
| 3.14 | 节点配置面板   | Bottom Panel 切换到 "节点配置" Tab, 每种节点不同表单                          | `03-pipeline.md` §2.2.C      |
| 3.15 | 配置表单       | React Hook Form + Zod, 各节点配置项                                           | `03-pipeline.md` §2.2.A 表格 |
| 3.16 | 自动保存       | 节点移动/连线/配置变更后 debounce 500ms 保存, useMutation + invalidateQueries | `03-pipeline.md` §5.4        |
| 3.17 | 保存状态指示器 | "已保存" / "保存中..." / "未保存" 状态显示                                    | —                            |
| 3.18 | 撤销/重做      | Zustand 历史栈, Ctrl+Z / Ctrl+Shift+Z 快捷键                                  | `03-pipeline.md` §5.3        |

#### Day 5：运行管线 + 实时状态

| #    | 任务            | 细节                                                             | 依赖文档                |
| ---- | --------------- | ---------------------------------------------------------------- | ----------------------- |
| 3.19 | 运行配置 Dialog | 点击运行 → 选择参数覆盖 → 确认                                   | `03-pipeline.md` §2.2.D |
| 3.20 | 节点实时状态    | pending(灰) → running(蓝脉冲) → completed(绿✓) → failed(红✗)     | `03-pipeline.md` §2.2.D |
| 3.21 | 状态轮询        | React Query `refetchInterval: 2000`, 运行中管线轮询状态          | `03-pipeline.md` §5.2   |
| 3.22 | 运行日志面板    | Bottom Panel "运行日志" Tab, useInfiniteQuery 增量加载, 虚拟滚动 | `03-pipeline.md` §5.2   |

#### Day 6：运行历史 + 收尾

| #    | 任务               | 细节                                                             | 依赖文档              |
| ---- | ------------------ | ---------------------------------------------------------------- | --------------------- |
| 3.23 | 运行历史页面       | DataTable 展示运行历史, 状态/触发人/耗时, 查看详情/重新运行/取消 | `03-pipeline.md` §2.3 |
| 3.24 | 性能优化           | 画布节点 > 50 时保持流畅, startTransition 包裹非紧急更新         | `03-pipeline.md` §6   |
| 3.25 | 管线编辑器集成测试 | 拖拽创建节点、连线、配置表单提交                                 | —                     |

### 4.3 Phase 3 里程碑

```
管线列表: 表格 + 新建/删除
管线编辑器: 拖拽节点 → 连线 → 配置 → 自动保存 → 撤销重做
运行管线: 运行 → 节点实时状态变化 → 日志流 → 运行历史
```

---

## 5. Phase 4 — 数据可视化（5 天）

### 5.1 目标

完成结果展示页面，包含多类型图表和 3D 分子查看器。展示复杂数据可视化能力。

### 5.2 任务清单

#### Day 1：结果总览 + 图表

| #   | 任务               | 细节                                                                             | 依赖文档                   |
| --- | ------------------ | -------------------------------------------------------------------------------- | -------------------------- |
| 4.1 | 分子结果 Mock 数据 | `mocks/fixtures/molecules.ts` — MoleculeResult, PropertyDistribution             | `04-visualization.md` §3   |
| 4.2 | 结果 API + hooks   | `lib/api/results.ts`, `lib/hooks/use-results.ts`                                 | `04-visualization.md` §5   |
| 4.3 | 结果 MSW handlers  | 6 个结果相关 API handlers                                                        | —                          |
| 4.4 | 结果总览页面       | Tabs: 概览/分子列表/属性分布/对比分析, Stats Cards + 得分分布直方图 + Top10 排名 | `04-visualization.md` §2.1 |
| 4.5 | 属性散点图         | Recharts ScatterChart, LogP vs Score                                             | `04-visualization.md` §2.1 |

#### Day 2：分子列表

| #   | 任务            | 细节                                                                       | 依赖文档                   |
| --- | --------------- | -------------------------------------------------------------------------- | -------------------------- |
| 4.6 | 分子列表页      | DataTable + SVG 缩略图列, 排序(得分/属性), 筛选(属性范围), 分页(20/50/100) | `04-visualization.md` §2.2 |
| 4.7 | 分子 SVG 缩略图 | Mock 预生成 SVG 或使用 SMILES 渲染库                                       | —                          |

#### Day 3：3D 分子查看器

| #    | 任务          | 细节                                                                           | 依赖文档                   |
| ---- | ------------- | ------------------------------------------------------------------------------ | -------------------------- |
| 4.8  | 安装 3D Mol\* | `3dmol` 或 `$3Dmol` 包                                                         | `04-visualization.md` §2.3 |
| 4.9  | 3D 查看器组件 | Three.js/3D Mol\* 渲染, 旋转/缩放, 显示模式切换(球棍/线框/表面), 测量距离/角度 | `04-visualization.md` §2.3 |
| 4.10 | 分子详情页    | 左侧 3D 查看器 + 右侧属性面板, Tabs: 属性详情/运行历史/相似分子                | `04-visualization.md` §2.3 |
| 4.11 | 懒加载 3D     | `dynamic(() => import(...), { ssr: false })`                                   | —                          |

#### Day 4：属性分布 + 对比分析

| #    | 任务         | 细节                                                               | 依赖文档                   |
| ---- | ------------ | ------------------------------------------------------------------ | -------------------------- |
| 4.12 | 属性分布页面 | 多属性并排分布图, 属性选择器, hover 数值, brush 范围选择, 导出 PNG | `04-visualization.md` §2.4 |
| 4.13 | 对比分析页面 | 选择 2-5 分子, 雷达图(Recharts RadarChart), 并排 3D 结构, 差异高亮 | `04-visualization.md` §2.5 |

#### Day 5：可视化模块收尾

| #    | 任务               | 细节                                      | 依赖文档                 |
| ---- | ------------------ | ----------------------------------------- | ------------------------ |
| 4.14 | 性能优化           | 分子列表虚拟滚动, 图表数据聚合, 3D 懒加载 | `04-visualization.md` §6 |
| 4.15 | 图表交互打磨       | tooltip, brush, zoom, 动画过渡            | —                        |
| 4.16 | 可视化模块单元测试 | 工具函数 + hooks 测试                     | —                        |

### 5.3 Phase 4 里程碑

```
结果总览: Stats + 直方图 + Top10 + 散点图
分子列表: 表格 + SVG 缩略图 + 排序筛选分页
分子详情: 3D 查看器(多模式) + 属性面板
属性分布: 多属性并排图 + 导出
对比分析: 雷达图 + 并排 3D
```

---

## 6. Phase 5 — 协作模块（4 天）

### 6.1 目标

完成团队管理、评论系统、通知系统。展示 Server Actions + 多租户权限控制。

### 6.2 任务清单

#### Day 1：团队管理

| #   | 任务                | 细节                                                                      | 依赖文档                       |
| --- | ------------------- | ------------------------------------------------------------------------- | ------------------------------ |
| 5.1 | 团队 Mock 数据      | `mocks/fixtures/team.ts` — TeamMember, Invitation                         | `05-collaboration.md` §5       |
| 5.2 | 团队 MSW handlers   | 成员 CRUD + 邀请 handlers                                                 | `05-collaboration.md` §6       |
| 5.3 | 团队 API + hooks    | `lib/api/team.ts`, `lib/hooks/use-team.ts`                                | —                              |
| 5.4 | 成员列表页面        | DataTable 展示成员, 搜索(角色筛选), 头像+姓名+邮箱+角色+加入时间          | `05-collaboration.md` §2.1.A   |
| 5.5 | 邀请成员            | Dialog + React Hook Form + Zod, **Server Action** 提交, optimistic update | `05-collaboration.md` §2.1.B   |
| 5.6 | 管理角色 + 移除成员 | 下拉菜单切换角色, AlertDialog 确认移除, **Server Action** 提交            | `05-collaboration.md` §2.1.C/D |

#### Day 2：评论系统

| #    | 任务              | 细节                                                 | 依赖文档                   |
| ---- | ----------------- | ---------------------------------------------------- | -------------------------- |
| 5.7  | 评论 Mock 数据    | `mocks/fixtures/comments.ts` — Comment, 嵌套回复     | `05-collaboration.md` §5   |
| 5.8  | 评论 MSW handlers | 评论 CRUD + reactions handlers                       | `05-collaboration.md` §6   |
| 5.9  | 评论 API + hooks  | `lib/api/comments.ts`, `lib/hooks/use-comments.ts`   | —                          |
| 5.10 | 评论列表组件      | 时间倒序, 1 级嵌套回复, 头像+姓名+时间+内容          | `05-collaboration.md` §3.2 |
| 5.11 | @mention 功能     | 输入 @ 弹出成员列表, 选择后插入                      | `05-collaboration.md` §3.2 |
| 5.12 | Emoji Reaction    | 点赞/emoji 反应, 多用户统计                          | `05-collaboration.md` §3.2 |
| 5.13 | 评论集成          | 将评论组件嵌入项目详情页 + 分子详情页 + 管线日志面板 | —                          |

#### Day 3：通知系统

| #    | 任务              | 细节                                                                                 | 依赖文档                   |
| ---- | ----------------- | ------------------------------------------------------------------------------------ | -------------------------- |
| 5.14 | 通知 Mock 数据    | `mocks/fixtures/notifications.ts` — Notification, 6 种类型                           | `05-collaboration.md` §5   |
| 5.15 | 通知 MSW handlers | 通知列表 + 标记已读 + 全部已读                                                       | `05-collaboration.md` §6   |
| 5.16 | 通知 API + hooks  | `lib/api/notifications.ts`, `lib/hooks/use-notifications.ts`, refetchInterval: 30000 | —                          |
| 5.17 | 通知铃铛组件      | Header 右上角, 未读数 badge, 下拉通知列表, 点击跳转, 全部已读                        | `05-collaboration.md` §4   |
| 5.18 | 通知类型处理      | 6 种通知类型各自的操作 (跳转/接受/拒绝)                                              | `05-collaboration.md` §4.2 |

#### Day 4：权限 + 设置页面 + 收尾

| #    | 任务             | 细节                                                                        | 依赖文档                   |
| ---- | ---------------- | --------------------------------------------------------------------------- | -------------------------- |
| 5.19 | 权限系统         | 角色(admin/editor/viewer)权限矩阵, 权限 hook (`usePermission`), UI 条件渲染 | `05-collaboration.md` §7   |
| 5.20 | 组织设置页       | 组织名称/Logo 编辑, 计划与用量(Mock), 危险操作区                            | `05-collaboration.md` §2.2 |
| 5.21 | 个人设置页       | 个人信息编辑, 通知偏好, API Key 管理(Mock)                                  | `05-collaboration.md` §2.3 |
| 5.22 | 分子库页面       | 分子库列表 + 搜索 + 上传占位                                                | —                          |
| 5.23 | 协作模块单元测试 | hooks + 权限逻辑测试                                                        | —                          |

### 6.3 Phase 5 里程碑

```
团队管理: 成员列表 + 邀请(Server Action) + 角色管理 + 移除
评论系统: 评论/回复 + @mention + Emoji Reaction
通知系统: 铃铛 + 未读 + 跳转
权限: 角色矩阵 → UI 条件渲染
设置: 组织设置 + 个人设置
```

---

## 7. Phase 6 — 测试与优化（4 天）

### 7.1 目标

补全所有测试，达到覆盖率 > 70%，完成性能和可访问性优化，确保 Lighthouse 四项均 > 90。

### 7.2 任务清单

#### Day 1：单元测试补全

| #   | 任务            | 细节                                                                          | 依赖文档                      |
| --- | --------------- | ----------------------------------------------------------------------------- | ----------------------------- |
| 6.1 | 测试基础设施    | `tests/setup.ts`, `tests/utils.tsx` (QueryClient wrapper), `vitest.config.ts` | `07-testing-strategy.md` §5   |
| 6.2 | 工具函数测试    | `lib/utils/` 所有函数 — 覆盖率 > 90%                                          | `07-testing-strategy.md` §2.1 |
| 6.3 | Zod Schema 测试 | `lib/validations/` 所有 schema — 覆盖率 > 90%                                 | `07-testing-strategy.md` §2.3 |
| 6.4 | Hooks 测试      | `lib/hooks/` 所有自定义 hooks — 覆盖率 > 80%                                  | `07-testing-strategy.md` §2.2 |

#### Day 2：组件集成测试

| #   | 任务               | 细节                                               | 依赖文档                      |
| --- | ------------------ | -------------------------------------------------- | ----------------------------- |
| 6.5 | 共享组件测试       | DataTable, StatusBadge, SearchInput, PageHeader 等 | `07-testing-strategy.md` §3.1 |
| 6.6 | 表单集成测试       | 邀请成员表单, 管线配置表单 (valid/invalid input)   | `07-testing-strategy.md` §3.3 |
| 6.7 | Dashboard 组件测试 | Stats Cards, Activity Feed                         | —                             |
| 6.8 | 管线编辑器组件测试 | 自定义节点, 配置面板                               | —                             |

#### Day 3：E2E 测试

| #    | 任务            | 细节                                          | 依赖文档                      |
| ---- | --------------- | --------------------------------------------- | ----------------------------- |
| 6.9  | Playwright 配置 | `playwright.config.ts`, 基础 setup            | `07-testing-strategy.md` §4   |
| 6.10 | 核心工作流 E2E  | 登录 → Dashboard → 创建项目 → 创建管线 → 运行 | `07-testing-strategy.md` §4.1 |
| 6.11 | 团队管理 E2E    | 邀请成员 → 修改角色 → 移除成员                | `07-testing-strategy.md` §4.1 |
| 6.12 | 数据可视化 E2E  | 查看结果 → 打开 3D 查看器 → 对比分析          | `07-testing-strategy.md` §4.1 |
| 6.13 | 协作 E2E        | 评论 → 回复 → 点赞                            | `07-testing-strategy.md` §4.1 |
| 6.14 | 可访问性 E2E    | Axe-core 审计关键页面                         | `07-testing-strategy.md` §4.3 |

#### Day 4：性能优化

| #    | 任务            | 细节                                            | 依赖文档                             |
| ---- | --------------- | ----------------------------------------------- | ------------------------------------ |
| 6.15 | Bundle 分析     | `@next/bundle-analyzer`, 识别大包               | `08-deployment-and-delivery.md` §2.3 |
| 6.16 | 懒加载优化      | dynamic import 重型组件 (3D, 图表, React Flow)  | `08-deployment-and-delivery.md` §2.3 |
| 6.17 | 图片/字体优化   | Next Image, next/font 优化                      | `08-deployment-and-delivery.md` §2.3 |
| 6.18 | 虚拟滚动        | 大数据列表使用虚拟滚动                          | `08-deployment-and-delivery.md` §2.3 |
| 6.19 | Lighthouse 审计 | 4 项指标均 > 90, 否则针对性优化                 | `08-deployment-and-delivery.md` §2.2 |
| 6.20 | CI 配置         | GitHub Actions: tsc + lint + test + build + e2e | `07-testing-strategy.md` §6          |

### 7.3 Phase 6 里程碑

```
单元测试覆盖率 > 70%
E2E 覆盖 6 条关键路径
Lighthouse: Performance > 90, A11y > 90, BP > 90, SEO > 80
CI Pipeline 通过
```

---

## 8. Phase 7 — 交付与收尾（2 天）

### 8.1 任务清单

| #   | 任务            | 细节                                                              | 依赖文档                           |
| --- | --------------- | ----------------------------------------------------------------- | ---------------------------------- |
| 7.1 | README 编写     | 按模板完成: 描述/截图/技术栈/核心功能/技术亮点/测试/本地运行/部署 | `08-deployment-and-delivery.md` §3 |
| 7.2 | 截图/GIF        | 核心页面截图 2-3 张, 关键交互 GIF 1-2 个                          | —                                  |
| 7.3 | Vercel 部署     | 配置项目, 环境变量, 域名, 部署成功                                | `08-deployment-and-delivery.md` §1 |
| 7.4 | 最终验证        | 部署环境全功能验证, Lighthouse 审计                               | —                                  |
| 7.5 | 技术博客 (可选) | 记录核心技术决策和实现思路                                        | —                                  |

---

## 9. 依赖关系图

```
P1 基础框架
 ├── P2 仪表盘 ──────────────────┐
 ├── P3 管线编辑器 ──────────────┤
 │    └── (P3 完成后才有运行数据)  │
 └── P4 数据可视化 ──────────────┤
                                  │
 P5 协作模块 (可与 P2-P4 并行) ──┤
                                  │
                            P6 测试与优化
                                  │
                            P7 交付与收尾
```

**关键路径：** P1 → P3 → P6 → P7

**并行建议：** P5 可与 P2/P4 并行开发；P4 依赖 P3 的运行数据（Mock 可提前准备）。

---

## 10. 风险与应对

| 风险                              | 概率 | 影响 | 应对策略                                                    |
| --------------------------------- | ---- | ---- | ----------------------------------------------------------- |
| React Flow 自定义节点复杂度超预期 | 中   | 高   | 预留 Day 6 缓冲；先实现核心 3 种节点，后续补充              |
| 3D Mol\* 集成困难                 | 中   | 中   | 备选方案：使用静态 SVG/图片替代；或使用 `react-three-fiber` |
| MSW + Next.js App Router 兼容问题 | 低   | 高   | Next.js API Routes 作为 Mock 方案 B                         |
| 测试覆盖率难以达标                | 中   | 中   | Phase 2-5 同步编写核心测试，Phase 6 补全                    |
| Lighthouse 性能指标不达标         | 低   | 中   | 提前使用 dynamic import, Server Components 策略             |

---

## 11. 技术能力映射

本计划的设计确保每个 Phase 都能精准对标 Chiral 岗位所需能力：

| 岗位要求                               | 覆盖 Phase | 展示方式                              |
| -------------------------------------- | ---------- | ------------------------------------- |
| Next.js App Router + Server Components | P1, P2     | Dashboard 首页 Server/Client 混合渲染 |
| Server Actions                         | P5         | 邀请成员、角色管理、评论提交          |
| TanStack React Query                   | P2-P5      | 数据获取、缓存、乐观更新、轮询        |
| Tailwind + shadcn/ui                   | P1-P5      | 全项目贯穿使用                        |
| React Hook Form + Zod                  | P3, P5     | 管线配置表单、邀请成员表单            |
| 复杂交互 UI                            | P3, P4     | 管线拖拽编辑器、3D 查看器             |
| 测试 (Vitest + Playwright)             | P6         | 覆盖率 > 70%                          |
| 多租户 SaaS                            | P2, P5     | Org Switcher + 角色权限矩阵           |
| 可访问性                               | P6         | WCAG AA + Axe-core 审计               |
| 性能优化                               | P6         | Lighthouse > 90 + Core Web Vitals     |
