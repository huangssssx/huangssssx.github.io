# 功能模块需求 — Dashboard（仪表盘）

## 1. 模块概述

仪表盘是用户登录后的首页，提供组织级数据概览、快捷操作入口、近期活动流。展示 Server Components + Streaming 的能力。

---

## 2. 页面列表

### 2.1 仪表盘首页 `/dashboard`

**布局结构：**

```
┌──────────────────────────────────────────────────┐
│  Sidebar  │  Header: 欢迎语 + Org Switcher       │
│           │──────────────────────────────────────│
│  · 首页   │  Stats Cards (4列)                    │
│  · 项目   │  [项目数] [运行中] [已完成] [团队成员] │
│  · 分子库 │──────────────────────────────────────│
│  · 团队   │  ┌─────────────┐ ┌─────────────────┐ │
│  · 设置   │  │ 近期项目    │ │ 计算活动图表     │ │
│           │  │ (列表/卡片) │ │ (Recharts 折线) │ │
│           │  │             │ │                 │ │
│           │  └─────────────┘ └─────────────────┘ │
│           │──────────────────────────────────────│
│           │  Activity Feed (近期活动流)            │
│           │  · 张三 运行了 Docking Pipeline       │
│           │  · 李四 创建了新项目 Drug Discovery   │
│           │  · 王五 上传了 3 个分子文件           │
└──────────────────────────────────────────────────┘
```

**功能需求：**

| 区域          | 功能                           | 技术实现                                |
| ------------- | ------------------------------ | --------------------------------------- |
| Org Switcher  | 切换当前组织上下文             | Client Component, URL 参数或 Context    |
| Stats Cards   | 展示关键指标数字，支持动画计数 | Server Component, Suspense boundary     |
| 近期项目      | 展示最近访问/创建的项目卡片    | Server Component + React Query prefetch |
| 活动图表      | 7天/30天计算任务趋势           | Recharts AreaChart, Client Component    |
| Activity Feed | 团队近期操作日志               | Server Component, 流式加载              |

**数据结构：**

```typescript
interface DashboardStats {
  totalProjects: number
  activeRuns: number
  completedRuns: number
  teamMembers: number
}

interface Activity {
  id: string
  userId: string
  userName: string
  userAvatar: string
  action:
    | 'created_project'
    | 'ran_pipeline'
    | 'uploaded_molecule'
    | 'added_comment'
    | 'completed_run'
  target: string
  timestamp: Date
}
```

---

## 3. API 接口

| 方法 | 路径                             | 说明         | 实现方式                    |
| ---- | -------------------------------- | ------------ | --------------------------- |
| GET  | `/api/dashboard/stats`           | 获取统计数据 | Server Component 直接调用   |
| GET  | `/api/dashboard/recent-projects` | 获取近期项目 | React Query                 |
| GET  | `/api/dashboard/activity-chart`  | 获取图表数据 | React Query                 |
| GET  | `/api/dashboard/activity-feed`   | 获取活动流   | React Query infinite scroll |

---

## 4. 交互细节

### 4.1 Stats Cards

- 数字加载时有 **计数动画**（从 0 到目标值）
- 使用 `Suspense` 包裹，加载时显示 Skeleton
- hover 时有微妙的阴影变化

### 4.2 Org Switcher

- 下拉选择器，展示用户所属的所有组织
- 切换后整个 Dashboard 数据刷新（React Query invalidation）
- 当前组织名称显示在 Header 中

### 4.3 Activity Feed

- 无限滚动加载更多
- 相对时间显示（"2 分钟前"）
- 点击可跳转到对应资源

---

## 5. 响应式设计

| 断点     | 布局变化                          |
| -------- | --------------------------------- |
| ≥ 1280px | 侧边栏展开 + 4列 Stats + 双列内容 |
| ≥ 768px  | 侧边栏收缩为图标 + 2列 Stats      |
| < 768px  | 侧边栏隐藏（汉堡菜单）+ 单列布局  |

---

## 6. 性能要求

- Stats Cards：使用 Server Component 直出 HTML，避免 CLS
- 图表：懒加载（dynamic import），不阻塞首屏
- Activity Feed：虚拟滚动或分页加载，DOM 节点 < 100
- 整体 LCP < 2.5s
