# 功能模块需求 — Pipeline（计算管线编辑器）

## 1. 模块概述

管线编辑器是本项目的**核心亮点模块**，对标 Chiral 的 "computational pipelines" 能力。用户可以通过可视化拖拽方式编排计算步骤，监控执行状态，查看运行日志。

这是展示**复杂交互 UI + React Query 实时数据流**的关键模块。

---

## 2. 页面列表

### 2.1 管线列表 `/projects/[id]/pipelines`

**布局：** 标准表格 + 筛选

| 列 | 说明 |
|---|---|
| 名称 | 管线名称，点击进入编辑器 |
| 状态 | draft / ready / running / completed / failed |
| 步骤数 | 管线包含的计算节点数 |
| 最近运行 | 上次执行的时间 |
| 创建时间 | — |

**功能：**
- 新建管线（Dialog 表单）
- 搜索/筛选（状态筛选）
- 删除管线（确认弹窗）
- 批量操作

### 2.2 管线编辑器 `/projects/[id]/pipelines/[pipelineId]`

**布局：**

```
┌──────────────────────────────────────────────────────┐
│  Toolbar: [保存] [运行] [撤销] [重做] | 管线名称      │
├──────────┬───────────────────────────────────────────┤
│          │                                           │
│  节点    │         Canvas 画布                        │
│  面板    │                                           │
│          │   ┌──────┐    ┌──────┐    ┌──────┐       │
│  · 输入  │   │Input │───>│Process│──>│Output│       │
│  · 计算  │   │SMILES│    │Docker │    │CSV   │       │
│  · 输出  │   └──────┘    └──────┘    └──────┘       │
│  · 工具  │                                           │
│          │   ┌──────┐    ┌──────┐                   │
│          │   │Filter│───>│Log   │                   │
│          │   │Props │    │Gen   │                    │
│          │   └──────┘    └──────┘                   │
│          │                                           │
├──────────┴───────────────────────────────────────────┤
│  Bottom Panel: [节点配置] / [运行日志] / [运行历史]    │
└──────────────────────────────────────────────────────┘
```

**功能需求：**

#### A. 节点拖拽
- 从左侧节点面板拖拽到画布创建节点
- 支持的节点类型：

| 节点类型 | 图标 | 说明 | 配置项 |
|---|---|---|---|
| Molecule Input | 🧪 | 分子数据输入 | SMILES 字符串 / 文件上传 |
| Docking | 🔗 | 分子对接计算 | 蛋白质受体、对接参数 |
| Optimization | ⚡ | 分子优化 | 优化算法、迭代次数 |
| Filter | 🔍 | 结果筛选 | 属性条件、阈值 |
| Property Calculator | 📊 | 属性计算 | 分子量、LogP、TPSA 等 |
| Export | 📤 | 数据导出 | 格式（CSV/JSON/SDF） |

#### B. 连线
- 从节点输出端口拖到另一个节点输入端口
- 类型校验：输出类型与输入类型必须兼容
- 删除连线：点击连线后按 Delete 或右键菜单

#### C. 节点配置
- 点击节点打开底部配置面板
- 每种节点有不同的配置表单
- 表单使用 React Hook Form + Zod 校验
- 实时保存（debounce 500ms）

#### D. 运行管线
- 点击 "运行" 按钮
- 弹出运行配置 Dialog（选择参数覆盖）
- 运行后节点实时显示状态：
  - `pending` → 灰色
  - `running` → 蓝色脉冲动画
  - `completed` → 绿色 ✓
  - `failed` → 红色 ✗ + 错误信息
- 底部面板切换到 "运行日志" Tab
- 使用 React Query 轮询（每 2 秒）获取运行状态

### 2.3 运行历史 `/projects/[id]/pipelines/[pipelineId]/runs`

| 列 | 说明 |
|---|---|
| Run # | 运行序号 |
| 状态 | running / completed / failed / cancelled |
| 触发人 | 谁启动的 |
| 开始时间 | — |
| 耗时 | 完成用时 |
| 操作 | 查看详情 / 重新运行 / 取消 |

---

## 3. 数据结构

```typescript
interface Pipeline {
  id: string
  projectId: string
  name: string
  description: string
  status: 'draft' | 'ready' | 'running' | 'completed' | 'failed'
  nodes: PipelineNode[]
  edges: PipelineEdge[]
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

interface PipelineNode {
  id: string
  type: 'molecule_input' | 'docking' | 'optimization' | 'filter' | 'property_calc' | 'export'
  position: { x: number; y: number }
  data: Record<string, unknown>
  status?: 'pending' | 'running' | 'completed' | 'failed'
}

interface PipelineEdge {
  id: string
  source: string
  target: string
  sourcePort: string
  targetPort: string
}

interface PipelineRun {
  id: string
  pipelineId: string
  status: 'running' | 'completed' | 'failed' | 'cancelled'
  triggeredBy: string
  startedAt: Date
  completedAt?: Date
  logs: RunLog[]
  nodeResults: Record<string, NodeResult>
}

interface RunLog {
  timestamp: Date
  level: 'info' | 'warn' | 'error'
  nodeId?: string
  message: string
}
```

---

## 4. API 接口

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/projects/:id/pipelines` | 管线列表 |
| POST | `/api/projects/:id/pipelines` | 创建管线 |
| GET | `/api/projects/:id/pipelines/:pipelineId` | 管线详情 |
| PATCH | `/api/projects/:id/pipelines/:pipelineId` | 更新管线（保存节点/连线） |
| DELETE | `/api/projects/:id/pipelines/:pipelineId` | 删除管线 |
| POST | `/api/projects/:id/pipelines/:pipelineId/runs` | 触发运行 |
| GET | `/api/projects/:id/pipelines/:pipelineId/runs` | 运行历史 |
| GET | `/api/projects/:id/pipelines/:pipelineId/runs/:runId` | 运行详情（含实时状态） |

---

## 5. 技术实现要点

### 5.1 画布渲染
- 使用 **React Flow** 作为管线图基础库
- 自定义节点组件（每种类型不同外观）
- 自定义边组件（带类型校验颜色）
- Mini Map + Controls

### 5.2 实时状态
- 运行中管线通过 React Query `refetchInterval: 2000` 轮询
- 节点状态变化时有过渡动画
- 日志流使用 `useInfiniteQuery` 增量加载

### 5.3 撤销/重做
- 使用 `zustand` 维护操作历史栈
- 支持 `Ctrl+Z` / `Ctrl+Shift+Z` 快捷键

### 5.4 自动保存
- 节点移动/连线变更后 debounce 自动保存
- 使用 `useMutation` + `queryClient.invalidateQueries`
- 保存状态指示器（"已保存" / "保存中..." / "未保存"）

---

## 6. 性能要求

- 画布节点 > 50 个时仍保持 60fps
- 自动保存不阻塞 UI（使用 `startTransition`）
- 运行日志虚拟滚动，最多保留 10000 条
