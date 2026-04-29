# 功能模块需求 — Collaboration（协作与团队管理）

## 1. 模块概述

协作模块支持多用户在同一平台上的团队协作，包括团队管理、评论系统、通知中心。展示**多租户 SaaS 架构 + Server Actions** 的能力。

---

## 2. 页面列表

### 2.1 团队管理 `/team`

**布局：**

```
┌──────────────────────────────────────────────────┐
│  Header: 团队管理                                  │
│  [邀请成员] 按钮                                   │
├──────────────────────────────────────────────────┤
│  搜索框 + 角色筛选                                  │
│                                                  │
│  ┌─────┐──────────────────────────────────────┐  │
│  │ 头像 │ 张三 (zhang@example.com)            │  │
│  │      │ Admin · 加入于 2024-01-15           │  │
│  │      │ [管理角色] [移除]                    │  │
│  ├─────┤──────────────────────────────────────┤  │
│  │ 头像 │ 李四 (li@example.com)               │  │
│  │      │ Editor · 加入于 2024-03-20          │  │
│  │      │ [管理角色] [移除]                    │  │
│  └─────┘──────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

**功能：**

#### A. 成员列表
- 展示团队成员列表（头像、姓名、邮箱、角色、加入时间）
- 搜索成员
- 按角色筛选
- 分页

#### B. 邀请成员
- 点击 "邀请成员" 打开 Dialog
- 输入邮箱 + 选择角色
- 使用 React Hook Form + Zod 校验
- 使用 **Server Action** 提交
- 成功后乐观更新列表（React Query `optimistic update`）

#### C. 管理角色
- 下拉菜单切换角色（admin / editor / viewer）
- 权限校验：只有 admin 可以修改角色
- 使用 **Server Action** 提交

#### D. 移除成员
- 确认弹窗（AlertDialog）
- 使用 **Server Action** 提交

### 2.2 组织设置 `/settings/organization`

**功能：**
- 组织名称/Logo 编辑
- 计划与用量（Mock 数据）
- 危险操作区（删除组织）

### 2.3 个人设置 `/settings/profile`

**功能：**
- 个人信息编辑（姓名、头像）
- 通知偏好设置
- API Key 管理（Mock 展示）

---

## 3. 评论系统

### 3.1 位置
- 项目详情页底部
- 分子详情页底部
- 管线运行日志面板中

### 3.2 功能

```
┌──────────────────────────────────────────────────┐
│  评论 (12)                                        │
├──────────────────────────────────────────────────┤
│  [头像] 张三 · 2 小时前                            │
│  这个对接结果看起来不错，建议检查一下 Lipinski 规则 │
│  [回复] [👍 3] [删除]                              │
│                                                   │
│    [头像] 李四 · 1 小时前                          │
│    同意，LogP 值在合理范围内                        │
│    [回复] [👍 1]                                   │
│                                                   │
│  [头像] 王五 · 30 分钟前                           │
│  我重新跑了一遍，结果更优了                          │
│  [回复] [👍] [删除]                                │
│                                                   │
│  ┌─────────────────────────────────────────────┐ │
│  │ 输入评论... 支持 @mention                    │ │
│  │                                    [发送]   │ │
│  └─────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

**功能清单：**
- 评论列表（按时间倒序）
- 回复（支持 1 级嵌套）
- @mention（输入 @ 弹出成员列表）
- 点赞（emoji reaction）
- 删除自己的评论
- 实时更新（React Query invalidation）

---

## 4. 通知系统

### 4.1 通知铃铛（Header 右上角）

```
┌─────────────────────────────┐
│ 🔔 3                        │  ← 未读数 badge
├─────────────────────────────┤
│ · 管线 #42 运行完成 ✓       │  ← 点击跳转
│ · 李四 邀请你加入项目 ABC    │  ← 点击接受/拒绝
│ · 你的评论被 @张三 回复了    │  ← 点击跳转
├─────────────────────────────┤
│ [全部已读] [查看全部]        │
└─────────────────────────────┘
```

### 4.2 通知类型

| 类型 | 说明 | 操作 |
|---|---|---|
| pipeline_completed | 管线运行完成 | 跳转到结果页 |
| pipeline_failed | 管线运行失败 | 跳转到日志 |
| member_invited | 新成员加入 | 无 |
| comment_reply | 评论被回复 | 跳转到评论 |
| mention | 被 @提及 | 跳转到对应位置 |
| role_changed | 角色变更 | 跳转到团队页 |

---

## 5. 数据结构

```typescript
interface TeamMember {
  id: string
  userId: string
  name: string
  email: string
  avatar: string
  role: 'admin' | 'editor' | 'viewer'
  joinedAt: Date
}

interface Invitation {
  id: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  status: 'pending' | 'accepted' | 'expired'
  invitedBy: string
  createdAt: Date
  expiresAt: Date
}

interface Comment {
  id: string
  parentId?: string
  authorId: string
  authorName: string
  authorAvatar: string
  content: string
  mentions: string[]
  reactions: { emoji: string; users: string[] }[]
  createdAt: Date
  updatedAt?: Date
}

interface Notification {
  id: string
  type: 'pipeline_completed' | 'pipeline_failed' | 'member_invited' | 'comment_reply' | 'mention' | 'role_changed'
  title: string
  description: string
  read: boolean
  link?: string
  createdAt: Date
}
```

---

## 6. API 接口

### 团队管理

| 方法 | 路径 | 说明 | 实现方式 |
|---|---|---|---|
| GET | `/api/team/members` | 成员列表 | React Query |
| POST | `/api/team/invite` | 邀请成员 | Server Action |
| PATCH | `/api/team/members/:id/role` | 修改角色 | Server Action |
| DELETE | `/api/team/members/:id` | 移除成员 | Server Action |

### 评论

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/comments?resource=:type&id=:id` | 评论列表 |
| POST | `/api/comments` | 发表评论 |
| DELETE | `/api/comments/:id` | 删除评论 |
| POST | `/api/comments/:id/reactions` | 添加反应 |

### 通知

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/notifications` | 通知列表 |
| PATCH | `/api/notifications/:id/read` | 标记已读 |
| PATCH | `/api/notifications/read-all` | 全部已读 |

---

## 7. 权限矩阵

| 操作 | Admin | Editor | Viewer |
|---|---|---|---|
| 邀请成员 | ✓ | ✗ | ✗ |
| 修改角色 | ✓ | ✗ | ✗ |
| 移除成员 | ✓ | ✗ | ✗ |
| 创建项目 | ✓ | ✓ | ✗ |
| 编辑管线 | ✓ | ✓ | ✗ |
| 运行管线 | ✓ | ✓ | ✗ |
| 查看结果 | ✓ | ✓ | ✓ |
| 发表评论 | ✓ | ✓ | ✓ |
| 删除自己的评论 | ✓ | ✓ | ✓ |
| 删除他人评论 | ✓ | ✗ | ✗ |

---

## 8. 性能要求

- 评论列表使用虚拟滚动
- 通知铃铛数据使用 React Query 后台刷新（`refetchInterval: 30000`）
- 成员列表支持即时搜索（debounce 300ms）
