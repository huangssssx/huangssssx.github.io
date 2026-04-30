# 组件架构与设计规范

## 1. 组件分层架构

```
┌─────────────────────────────────────────────────────┐
│                    Pages (路由页面)                    │
│   Server Components + Client Components 混合          │
├─────────────────────────────────────────────────────┤
│                 Feature Components                    │
│   业务功能组件（PipelineEditor, MoleculeViewer 等）    │
├─────────────────────────────────────────────────────┤
│                 Shared Components                     │
│   跨功能复用的业务组件（ProjectCard, StatusBadge 等）  │
├─────────────────────────────────────────────────────┤
│                   UI Components                       │
│   shadcn/ui 基础组件 + 自定义封装                      │
│   (Button, Dialog, Table, Form, Command...)          │
├─────────────────────────────────────────────────────┤
│                   Primitives                          │
│   Radix UI 原语 (VisuallyHidden, Slot, etc.)          │
└─────────────────────────────────────────────────────┘
```

---

## 2. Server/Client Component 策略

### 2.1 默认规则

| 规则                  | 说明                                                            |
| --------------------- | --------------------------------------------------------------- |
| 默认 Server Component | 所有组件默认为 Server Component                                 |
| 需要交互才转 Client   | 只有需要 `useState`、`useEffect`、事件处理的才加 `"use client"` |
| 最小化 Client 边界    | `"use client"` 放在尽可能深的组件上                             |

### 2.2 具体分配

**Server Components（数据获取、静态渲染）：**

- 页面布局（Sidebar, Header）
- Stats Cards
- 项目列表（首屏）
- Activity Feed（首屏）
- 分子详情的属性面板

**Client Components（交互、动态）：**

- Org Switcher（下拉选择）
- 图表组件（Recharts）
- 管线编辑器（React Flow）
- 3D 分子查看器
- 表单组件
- 通知铃铛
- 评论输入框

### 2.3 数据流模式

```
Server Component (数据获取)
  │
  ├── 直接传递 props 给子组件
  │
  └── 通过 React Query prefetch → Hydration
        │
        └── Client Component (交互)
              │
              ├── useQuery (读取)
              ├── useMutation (变更)
              └── queryClient.invalidateQueries (刷新)
```

---

## 3. shadcn/ui 组件使用规范

### 3.1 需要安装的组件

```bash
# 基础
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add textarea
npx shadcn@latest add select
npx shadcn@latest add checkbox
npx shadcn@latest add switch
npx shadcn@latest add separator

# 反馈
npx shadcn@latest add dialog
npx shadcn@latest add alert-dialog
npx shadcn@latest add toast
npx shadcn@latest add sonner
npx shadcn@latest add alert

# 数据展示
npx shadcn@latest add table
npx shadcn@latest add card
npx shadcn@latest add badge
npx shadcn@latest add avatar
npx shadcn@latest add tabs
npx shadcn@latest add tooltip
npx shadcn@latest add popover
npx shadcn@latest add hover-card

# 导航
npx shadcn@latest add dropdown-menu
npx shadcn@latest add command
npx shadcn@latest add navigation-menu
npx shadcn@latest add breadcrumb
npx shadcn@latest add pagination

# 表单
npx shadcn@latest add form
npx shadcn@latest add calendar
npx shadcn@latest add date-picker

# 其他
npx shadcn@latest add skeleton
npx shadcn@latest add spinner
npx shadcn@latest add progress
npx shadcn@latest add scroll-area
npx shadcn@latest add sheet
npx shadcn@latest add sidebar
```

### 3.2 自定义组件封装

在 `components/shared/` 下封装业务组件：

| 组件            | 基于                   | 说明                           |
| --------------- | ---------------------- | ------------------------------ |
| `ConfirmDialog` | AlertDialog            | 通用确认弹窗                   |
| `DataTable`     | Table + TanStack Table | 通用数据表格（排序/筛选/分页） |
| `EmptyState`    | Card                   | 空状态占位                     |
| `LoadingState`  | Skeleton               | 加载状态                       |
| `ErrorState`    | Alert                  | 错误状态                       |
| `PageHeader`    | 自定义                 | 页面标题 + 面包屑 + 操作按钮   |
| `StatusBadge`   | Badge                  | 状态标签（颜色映射）           |
| `UserAvatar`    | Avatar + Tooltip       | 用户头像 + 名称                |
| `SearchInput`   | Input + Command        | 搜索输入框                     |
| `DateDisplay`   | 自定义                 | 相对时间/绝对时间显示          |

---

## 4. 设计 Token（Tailwind 配置）

### 4.1 颜色系统

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;

  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;

  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;

  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;

  --destructive: 0 84.2% 60.2%;

  --success: 142.1 76.2% 36.3%;
  --warning: 38 92% 50%;
  --info: 221.2 83.2% 53.3%;

  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;

  --border: 214.3 31.8% 91.4%;
  --ring: 221.2 83.2% 53.3%;

  --sidebar-background: 0 0% 98%;
  --sidebar-foreground: 240 5.3% 26.1%;
  --sidebar-border: 220 13% 91%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... dark mode tokens */
}
```

### 4.2 科学主题配色

| 用途        | 颜色               | 说明     |
| ----------- | ------------------ | -------- |
| 蛋白质/受体 | `#6366f1` (indigo) | 主色调   |
| 配体/分子   | `#06b6d4` (cyan)   | 辅助色   |
| 成功/Pass   | `#22c55e` (green)  | 筛选通过 |
| 失败/Fail   | `#ef4444` (red)    | 筛选失败 |
| 警告        | `#f59e0b` (amber)  | 需要关注 |
| 运行中      | `#3b82f6` (blue)   | 动态状态 |

---

## 5. 排版规范

| 元素    | 字号            | 字重 | 行高 |
| ------- | --------------- | ---- | ---- |
| H1      | 2.25rem (36px)  | 700  | 1.2  |
| H2      | 1.875rem (30px) | 600  | 1.3  |
| H3      | 1.5rem (24px)   | 600  | 1.4  |
| H4      | 1.25rem (20px)  | 500  | 1.4  |
| Body    | 0.875rem (14px) | 400  | 1.6  |
| Small   | 0.75rem (12px)  | 400  | 1.5  |
| Caption | 0.625rem (10px) | 500  | 1.4  |

**字体：**

- 主字体：Inter（Google Fonts）
- 等宽字体：JetBrains Mono（代码/日志展示）

---

## 6. 间距系统

基于 Tailwind 默认 4px 网格：

| Token | 值   | 用途           |
| ----- | ---- | -------------- |
| `1`   | 4px  | 紧凑间距       |
| `2`   | 8px  | 图标与文字间距 |
| `3`   | 12px | 表单元素间距   |
| `4`   | 16px | 卡片内边距     |
| `6`   | 24px | 区块间距       |
| `8`   | 32px | 大区块间距     |
| `12`  | 48px | 页面级间距     |

---

## 7. 动效规范

| 动效类型 | 时长  | 缓动        | 使用场景             |
| -------- | ----- | ----------- | -------------------- |
| 微交互   | 150ms | ease-out    | hover, focus         |
| 过渡     | 200ms | ease-in-out | 展开/收起            |
| 动画     | 300ms | ease-in-out | 页面切换             |
| 强调动画 | 500ms | ease-in-out | 状态变化（节点运行） |

**禁止：**

- 无限循环动画（除非状态指示器）
- 过度的弹跳效果
- 大面积的闪烁

---

## 8. 可访问性（a11y）规范

| 要求       | 实现方式                                 |
| ---------- | ---------------------------------------- |
| 键盘导航   | 所有交互元素可通过 Tab/Enter/Escape 操作 |
| ARIA 标签  | 图标按钮必须有 `aria-label`              |
| 颜色对比度 | 文字对比度 ≥ 4.5:1 (WCAG AA)             |
| Focus 管理 | Dialog 打开后 focus trap, 关闭后还原     |
| 屏幕阅读器 | 使用 `sr-only` 提供隐藏描述              |
| 减少动效   | `prefers-reduced-motion` 媒体查询支持    |
