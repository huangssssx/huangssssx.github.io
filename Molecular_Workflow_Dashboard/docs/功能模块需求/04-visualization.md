# 功能模块需求 — Visualization（数据可视化）

## 1. 模块概述

数据可视化模块用于展示管线计算结果，包括分子结构 3D 查看器和计算结果图表。这是展示**复杂数据可视化能力**的关键模块。

---

## 2. 页面列表

### 2.1 结果总览 `/projects/[id]/results`

**布局：**

```
┌──────────────────────────────────────────────────┐
│  Header: 项目名称 > 结果总览                       │
│  Tabs: [概览] [分子列表] [属性分布] [对比分析]      │
├──────────────────────────────────────────────────┤
│                                                  │
│  Tab: 概览                                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │ 总分子数  │ │ 通过筛选  │ │ 平均得分  │        │
│  │  1,247   │ │   342    │ │  -7.8    │        │
│  └──────────┘ └──────────┘ └──────────┘        │
│                                                  │
│  ┌─────────────────┐ ┌────────────────────┐     │
│  │ 得分分布直方图    │ │ Top 10 分子排名    │     │
│  │ (Recharts Bar)  │ │ (条形图)           │     │
│  └─────────────────┘ └────────────────────┘     │
│                                                  │
│  ┌─────────────────────────────────────────┐    │
│  │ 属性散点图 (LogP vs Score)               │    │
│  │ (Recharts Scatter)                       │    │
│  └─────────────────────────────────────────┘    │
└──────────────────────────────────────────────────┘
```

### 2.2 分子列表 `/projects/[id]/results/molecules`

**功能：**

- 数据表格，列：序号、SMILES、分子图、得分、关键属性、状态
- 分子图使用 SVG 缩略图（RDKit 渲染或预生成）
- 排序（按得分/属性排序）
- 筛选（属性范围筛选）
- 分页（每页 20/50/100）
- 点击行展开 3D 查看器

### 2.3 分子详情 `/projects/[id]/results/molecules/[moleculeId]`

**布局：**

```
┌──────────────────────────────────────────────────┐
│  Header: 分子名称 + 属性标签                       │
├─────────────────────┬────────────────────────────┤
│                     │                            │
│  3D 分子查看器      │  属性面板                   │
│  (Three.js/Mol*)   │  · 分子量: 350.2           │
│                     │  · LogP: 3.2              │
│  支持操作:          │  · TPSA: 67.5             │
│  · 旋转/缩放       │  · 氢键供体: 2             │
│  · 显示模式切换     │  · 氢键受体: 4             │
│    (球棍/线框/表面) │  · 溶解度: -5.2           │
│  · 测量距离/角度    │  · Lipinski: ✓ Pass       │
│                     │                            │
├─────────────────────┴────────────────────────────┤
│  Tabs: [属性详情] [运行历史] [相似分子]            │
└──────────────────────────────────────────────────┘
```

### 2.4 属性分布 `/projects/[id]/results/distribution`

**功能：**

- 多属性并排分布图
- 属性选择器（勾选要展示的属性）
- 交互：hover 显示详细数值，brush 选择范围
- 导出图表为 PNG

### 2.5 对比分析 `/projects/[id]/results/comparison`

**功能：**

- 选择 2-5 个分子进行并排对比
- 雷达图展示多维属性
- 并排 3D 结构对比
- 差异高亮

---

## 3. 数据结构

```typescript
interface MoleculeResult {
  id: string
  projectId: string
  runId: string
  smiles: string
  name?: string
  score: number
  properties: {
    molecularWeight: number
    logP: number
    tpsa: number
    hydrogenBondDonors: number
    hydrogenBondAcceptors: number
    solubility: number
    lipinskiViolations: number
    [key: string]: number | string | boolean
  }
  thumbnailSvg?: string
  status: 'pass' | 'fail' | 'pending'
}

interface PropertyDistribution {
  property: string
  values: { bin: string; count: number }[]
}
```

---

## 4. 图表类型与技术实现

| 图表           | 库                             | 交互                      |
| -------------- | ------------------------------ | ------------------------- |
| 得分分布直方图 | Recharts BarChart              | hover tooltip, brush 缩放 |
| Top 10 排名    | Recharts BarChart (horizontal) | 点击跳转分子详情          |
| 属性散点图     | Recharts ScatterChart          | zoom, 点选, lasso         |
| 属性分布       | Recharts AreaChart (多叠加)    | hover, 属性切换           |
| 雷达图         | Recharts RadarChart            | 对比模式                  |
| 3D 分子结构    | 3D Mol\* (3dmol.js)            | 旋转, 缩放, 显示模式      |

---

## 5. API 接口

| 方法 | 路径                                                        | 说明                       |
| ---- | ----------------------------------------------------------- | -------------------------- |
| GET  | `/api/projects/:id/results/summary`                         | 结果概览统计               |
| GET  | `/api/projects/:id/results/molecules`                       | 分子列表（分页/排序/筛选） |
| GET  | `/api/projects/:id/results/molecules/:moleculeId`           | 分子详情                   |
| GET  | `/api/projects/:id/results/molecules/:moleculeId/structure` | 3D 结构数据                |
| GET  | `/api/projects/:id/results/distribution`                    | 属性分布数据               |
| GET  | `/api/projects/:id/results/comparison`                      | 对比数据                   |

---

## 6. 性能要求

- 分子列表虚拟滚动（> 1000 条数据时）
- 3D 查看器懒加载，不阻塞页面
- 图表数据聚合在前端完成（减少请求）
- SVG 缩略图使用 CDN 缓存
