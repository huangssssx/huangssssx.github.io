# 测试策略与质量标准

## 1. 测试金字塔

```
        ╱  E2E Tests  ╲           ← 少量，关键路径
       ╱  (Playwright)  ╲            5-10 个
      ╱────────────────────╲
     ╱  Integration Tests  ╲     ← 适量，核心逻辑
    ╱  (Vitest + TL + MSW)  ╲       20-30 个
   ╱──────────────────────────╲
  ╲   Unit Tests (Vitest)    ╱   ← 大量，纯函数/工具
   ╲                          ╱       50+ 个
    ╲────────────────────────╱
```

### 测试覆盖率目标

| 层级            | 覆盖率目标 | 说明              |
| --------------- | ---------- | ----------------- |
| 总体            | > 70%      | 行覆盖率          |
| `lib/` 工具函数 | > 90%      | 纯函数，易于测试  |
| `lib/hooks/`    | > 80%      | 自定义 Hooks      |
| `components/`   | > 60%      | UI 组件核心交互   |
| `app/` 页面     | E2E 覆盖   | 通过 E2E 测试覆盖 |

---

## 2. 单元测试（Vitest）

### 2.1 测试范围

**必须测试：**

- `lib/utils/` 所有工具函数
- `lib/validations/` 所有 Zod schema
- `lib/hooks/` 所有自定义 Hooks
- `types/` 类型守卫函数
- 数据转换/格式化函数

**示例：**

```typescript
// lib/utils/format-date.test.ts
import { describe, it, expect } from 'vitest'
import { formatRelativeTime } from './format-date'

describe('formatRelativeTime', () => {
  it('returns "just now" for < 1 minute', () => {
    const result = formatRelativeTime(new Date())
    expect(result).toBe('just now')
  })

  it('returns "5 minutes ago"', () => {
    const date = new Date(Date.now() - 5 * 60 * 1000)
    expect(formatRelativeTime(date)).toBe('5 minutes ago')
  })
})
```

### 2.2 Hook 测试

```typescript
// lib/hooks/use-pipeline-status.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { wrapper } from '@/test/utils'
import { usePipelineStatus } from './use-pipeline-status'

describe('usePipelineStatus', () => {
  it('fetches pipeline status', async () => {
    const { result } = renderHook(() => usePipelineStatus('pipeline-1'), {
      wrapper,
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
  })
})
```

### 2.3 Zod Schema 测试

```typescript
// lib/validations/pipeline.test.ts
import { describe, it, expect } from 'vitest'
import { createPipelineSchema } from './pipeline'

describe('createPipelineSchema', () => {
  it('validates a valid pipeline', () => {
    const result = createPipelineSchema.safeParse({
      name: 'My Pipeline',
      description: 'Test pipeline',
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty name', () => {
    const result = createPipelineSchema.safeParse({
      name: '',
      description: 'Test',
    })
    expect(result.success).toBe(false)
  })
})
```

---

## 3. 集成测试（Vitest + Testing Library + MSW）

### 3.1 组件测试

**测试模式：** 渲染组件 → 模拟用户交互 → 断言 UI 变化

```typescript
// components/shared/data-table.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DataTable } from './data-table'

describe('DataTable', () => {
  it('renders table with data', () => {
    render(
      <DataTable
        columns={[{ key: 'name', label: 'Name' }]}
        data={[{ name: 'Pipeline A' }]}
      />
    )
    expect(screen.getByText('Pipeline A')).toBeInTheDocument()
  })

  it('sorts by column on header click', async () => {
    const user = userEvent.setup()
    render(<DataTable {...props} />)

    await user.click(screen.getByText('Name'))
    expect(screen.getAllByRole('row')[1]).toHaveTextContent('A Pipeline')
  })
})
```

### 3.2 API Mock（MSW）

```typescript
// mocks/handlers.ts
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/dashboard/stats', () => {
    return HttpResponse.json({
      totalProjects: 12,
      activeRuns: 3,
      completedRuns: 47,
      teamMembers: 8,
    })
  }),

  http.get('/api/projects', () => {
    return HttpResponse.json({
      data: mockProjects,
      pagination: { page: 1, pageSize: 20, total: 50 },
    })
  }),
]
```

### 3.3 表单集成测试

```typescript
// 测试邀请成员表单
describe('InviteMemberDialog', () => {
  it('submits valid invitation', async () => {
    const user = userEvent.setup()
    render(<InviteMemberDialog />)

    await user.click(screen.getByRole('button', { name: /invite member/i }))
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.click(screen.getByRole('button', { name: /send/i }))

    expect(screen.getByText(/invitation sent/i)).toBeInTheDocument()
  })

  it('shows validation error for invalid email', async () => {
    // ...
  })
})
```

---

## 4. E2E 测试（Playwright）

### 4.1 关键路径测试

| 测试用例                   | 覆盖路径   |
| -------------------------- | ---------- |
| 用户登录 → 查看仪表盘      | 基础导航   |
| 创建项目 → 创建管线 → 运行 | 核心工作流 |
| 邀请成员 → 修改角色        | 团队管理   |
| 查看结果 → 打开 3D 查看器  | 数据可视化 |
| 搜索项目 → 筛选结果        | 搜索与筛选 |
| 评论 → 回复 → 点赞         | 协作功能   |

### 4.2 示例

```typescript
// e2e/pipeline-workflow.spec.ts
import { test, expect } from '@playwright/test'

test('complete pipeline workflow', async ({ page }) => {
  await page.goto('/projects')

  // 创建项目
  await page.click('button:has-text("New Project")')
  await page.fill('[name="name"]', 'Test Drug Discovery')
  await page.fill('[name="description"]', 'Test pipeline project')
  await page.click('button:has-text("Create")')
  await expect(page.locator('text=Test Drug Discovery')).toBeVisible()

  // 进入项目，创建管线
  await page.click('text=Test Drug Discovery')
  await page.click('button:has-text("New Pipeline")')
  await page.fill('[name="name"]', 'Docking Pipeline')
  await page.click('button:has-text("Create")')

  // 拖拽节点（验证管线编辑器可用）
  await expect(page.locator('.react-flow')).toBeVisible()

  // 运行管线
  await page.click('button:has-text("Run")')
  await page.click('button:has-text("Confirm")')

  // 验证运行状态变化
  await expect(page.locator('[data-status="running"]')).toBeVisible({
    timeout: 5000,
  })
})
```

### 4.3 可访问性测试

```typescript
// e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('dashboard has no accessibility violations', async ({ page }) => {
  await page.goto('/dashboard')
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})
```

---

## 5. 测试工具配置

### 5.1 Vitest 配置要点

```typescript
// vitest.config.ts
{
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/mocks/**', 'src/types/**'],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
      },
    },
  },
}
```

### 5.2 测试辅助工具

```typescript
// tests/utils.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  })
}

export const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

---

## 6. 质量门禁

### PR 合并前必须通过

| 检查       | 标准                        |
| ---------- | --------------------------- |
| TypeScript | `tsc --noEmit` 零错误       |
| ESLint     | `eslint .` 零 error         |
| 单元测试   | `vitest run` 全部通过       |
| 覆盖率     | 不低于主分支                |
| E2E 测试   | `playwright test` 全部通过  |
| Lighthouse | Performance > 90, A11y > 90 |

### CI 流程（GitHub Actions）

```
Push / PR
  ├── TypeScript Check
  ├── ESLint Check
  ├── Unit Tests + Coverage
  ├── Build Check
  └── E2E Tests (Playwright)
```
