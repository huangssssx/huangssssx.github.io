# 部署与交付标准

## 1. 部署方案

### 1.1 平台：Vercel

| 配置             | 值                           |
| ---------------- | ---------------------------- |
| Framework Preset | Next.js                      |
| Build Command    | `next build`                 |
| Output Directory | `.next`                      |
| Node.js Version  | 20.x                         |
| Region           | 自动选择（或按目标用户选区） |

### 1.2 环境变量

```env
NEXT_PUBLIC_APP_URL=https://molecular-dashboard.vercel.app
NEXT_PUBLIC_APP_NAME=Molecular Workflow Dashboard
```

> 本项目为纯前端 Demo，所有 API 通过 MSW + Next.js API Routes 模拟，无需真实后端环境变量。

---

## 2. 性能标准

### 2.1 Core Web Vitals 目标

| 指标                            | 目标    | 当前措施                       |
| ------------------------------- | ------- | ------------------------------ |
| LCP (Largest Contentful Paint)  | < 2.5s  | Server Component 直出关键内容  |
| FID (First Input Delay)         | < 100ms | 最小化 Client JS 体积          |
| CLS (Cumulative Layout Shift)   | < 0.1   | Skeleton 占位 + 固定尺寸       |
| INP (Interaction to Next Paint) | < 200ms | startTransition 包裹非紧急更新 |

### 2.2 Lighthouse 目标

| 类别           | 目标分 |
| -------------- | ------ |
| Performance    | > 90   |
| Accessibility  | > 90   |
| Best Practices | > 90   |
| SEO            | > 80   |

### 2.3 性能优化手段

**加载优化：**

- Server Components 减少客户端 JS
- `dynamic()` 懒加载重型组件（3D 查看器、图表）
- 图片：Next.js `<Image>` 自动优化
- 字体：`next/font` 优化加载
- 路由预取：`<Link prefetch>`

**运行时优化：**

- React Query 缓存减少重复请求
- `useDeferredValue` / `startTransition` 优化搜索
- 虚拟滚动处理大数据列表
- Web Worker 处理数据计算（如有需要）

---

## 3. README 规范

README 是面试官的第一印象，必须包含：

### 3.1 结构

```markdown
# Molecular Workflow Dashboard

## 一句话描述

> 一个面向化学研究的 SaaS 平台 Demo，展示 Next.js 15 全栈能力

## 截图 / GIF

（放置 2-3 张核心页面截图或操作 GIF）

## 技术栈

| 技术                    | 用途 |
| ----------------------- | ---- |
| Next.js 15 (App Router) | ...  |
| React 19                | ...  |
| ...                     | ...  |

## 核心功能

- 多租户仪表盘（Server Components + Streaming）
- 可视化管线编辑器（React Flow + 实时状态）
- 分子结构 3D 可视化（3D Mol\*）
- 团队协作（评论、通知、权限管理）

## 技术亮点

### Server/Client Component 混合渲染

（解释你的策略）

### React Query 数据流

（解释你的缓存和乐观更新策略）

### 类型安全的 API 层

（解释你的 typed client + Zod 校验）

## 测试

- 单元测试：XX 个 (覆盖率 XX%)
- E2E 测试：XX 个
- 运行：`pnpm test` / `pnpm test:e2e`

## 本地运行

pnpm install
pnpm dev

## 部署

（Vercel 链接）

## License

MIT
```

---

## 4. 交付清单

### Phase 1：基础框架（项目骨架）

- [x] Next.js 15 项目初始化
- [x] TypeScript strict 配置
- [x] Tailwind + shadcn/ui 配置
- [x] 布局组件（Sidebar + Header）
- [x] 路由结构搭建
- [x] MSW Mock API 基础设施
- [x] ESLint + Prettier + Husky

### Phase 2：仪表盘模块

- [ ] Dashboard 首页（Stats + 图表 + Activity Feed）
- [ ] Org Switcher
- [ ] 项目列表页

### Phase 3：管线编辑器

- [ ] 管线列表
- [ ] 管线编辑器（React Flow + 自定义节点）
- [ ] 节点配置面板
- [ ] 运行管线 + 实时状态

### Phase 4：数据可视化

- [ ] 结果总览（图表）
- [ ] 分子列表（表格）
- [ ] 分子详情（3D 查看器）
- [ ] 属性分布图

### Phase 5：协作模块

- [ ] 团队管理（CRUD）
- [ ] 评论系统
- [ ] 通知系统

### Phase 6：测试与优化

- [ ] 单元测试（> 70% 覆盖率）
- [ ] E2E 测试（关键路径）
- [ ] 性能优化（Lighthouse > 90）
- [ ] 可访问性审计

### Phase 7：交付

- [ ] README 完善
- [ ] 部署到 Vercel
- [ ] 技术博客（可选）

---

## 5. 项目时间规划

| Phase   | 内容       | 优先级 |
| ------- | ---------- | ------ |
| Phase 1 | 基础框架   | P0     |
| Phase 2 | 仪表盘     | P0     |
| Phase 3 | 管线编辑器 | P0     |
| Phase 4 | 数据可视化 | P1     |
| Phase 5 | 协作模块   | P1     |
| Phase 6 | 测试与优化 | P0     |
| Phase 7 | 交付       | P0     |

> Phase 1-3 是核心，必须高质量完成。Phase 4-5 展示广度。Phase 6-7 保证交付质量。
