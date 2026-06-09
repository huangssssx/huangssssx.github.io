# E-Commerce Admin Dashboard — 独立模块化开发计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将现有 MERN Admin Dashboard 从"教科书式 CRUD demo"升级为"迷你电商 SaaS 平台后台"，涵盖产品/订单/客户管理、AI 智能助手、Stripe 支付流程、数据可视化、OAuth 社交登录、文件上传，最大化 Upwork 雇主吸引力。

**Architecture:** 保持现有 Vite + React + Express + MongoDB + Vercel 架构不变。

**核心设计原则 — 模块零依赖:**
- Phase 0 一次性改完所有共享文件（models / types / Layout / App / _server）
- Phase 1-7 各自只创建/修改自己模块内的文件，**永不触碰共享文件**
- Order 模型内嵌客户/商品数据（不引用其他集合），Dashboard 直接聚合自身数据
- 任意一个 Phase 可以**单独开发、单独测试、单独部署**

---

## 模块独立性保证

```
Phase 0 (共享层):  models + types + Layout导航 + App路由 + _server路由
                    ↓ 一次性完成，后续不再改
Phase 1 Products:  只动 api/products/* + client/src/pages/Product*
Phase 2 Orders:    只动 api/orders/*   + client/src/pages/Order*
Phase 3 Customers: 只动 api/customers/*+ client/src/pages/Customer*
Phase 4 Dashboard: 只动 api/dashboard/*+ client/src/pages/Dashboard* + Charts*
Phase 5 AI:        只动 api/ai/*       + client/src/components/AiAssistant*
Phase 6 Stripe:    只动 api/stripe/*   + client/src/pages/Pricing* + PaymentSuccess*
Phase 7 OAuth:     只动 api/auth/google+ client/src/pages/OAuth* + Login/Register
```

**零交叉引用设计:**
- Order 内嵌 `{ customerInfo: { name, email, phone } }` 而非 ObjectId ref Customer
- Order 内嵌 `items: [{ name, quantity, price }]` 而非 ObjectId ref Product
- Dashboard 聚合直接查 Order 集合，不 join 其他集合
- Customer / Product 模型完全独立，不引用其他业务模型

---

## 免费资源

| 服务 | 免费额度 | 获取地址 |
|---|---|---|
| Google Gemini API | 15 RPM, 1M tokens/min | https://aistudio.google.com/apikey |
| Stripe Test Mode | 无限制（测试卡号 4242424242424242） | https://dashboard.stripe.com/register |
| Google OAuth | 免费（开发模式） | https://console.cloud.google.com |
| Cloudinary | 25GB 存储/月 | https://cloudinary.com/users/register_free |

---

## File Structure（升级后）

```
MERN-project/
├── client/src/
│   ├── components/
│   │   ├── Layout.tsx              # Phase 0: 一次加完所有导航
│   │   ├── DataTable.tsx           # 保留
│   │   ├── Modal.tsx               # 保留
│   │   ├── Toast.tsx               # 保留
│   │   ├── ProtectedRoute.tsx      # 保留
│   │   ├── FileUpload.tsx          # Phase 1
│   │   ├── Charts.tsx              # Phase 4
│   │   └── AiAssistant.tsx         # Phase 5
│   ├── pages/
│   │   ├── Login.tsx               # Phase 7: 加 OAuth 按钮
│   │   ├── Register.tsx            # Phase 7: 加 OAuth 按钮
│   │   ├── Dashboard.tsx           # Phase 0: 占位 → Phase 4: 重写
│   │   ├── Products.tsx            # Phase 1
│   │   ├── ProductDetail.tsx       # Phase 1
│   │   ├── Orders.tsx              # Phase 2
│   │   ├── OrderDetail.tsx         # Phase 2
│   │   ├── Customers.tsx           # Phase 3
│   │   ├── Pricing.tsx             # Phase 6
│   │   ├── PaymentSuccess.tsx      # Phase 6
│   │   ├── OAuthCallback.tsx       # Phase 7
│   │   ├── Items.tsx               # 保留
│   │   └── ItemDetail.tsx          # 保留
│   ├── services/
│   │   ├── api.ts                  # 保留
│   │   ├── auth.ts                 # Phase 7: 加 googleAuth
│   │   ├── items.ts                # 保留
│   │   ├── products.ts             # Phase 1
│   │   ├── orders.ts               # Phase 2
│   │   ├── customers.ts            # Phase 3
│   │   ├── ai.ts                   # Phase 5
│   │   └── stripe.ts               # Phase 6
│   ├── context/
│   │   └── AuthContext.tsx          # Phase 7: 加 googleLogin
│   ├── types/
│   │   └── index.ts                # Phase 0: 一次加完所有类型
│   ├── App.tsx                     # Phase 0: 一次加完所有路由
│   ├── main.tsx                    # 保留
│   └── index.css                   # 保留
│
├── api/
│   ├── _lib/
│   │   ├── db.ts                   # 保留
│   │   ├── auth.ts                 # 保留
│   │   ├── models/
│   │   │   ├── User.ts             # Phase 0: 加字段
│   │   │   ├── Item.ts             # 保留
│   │   │   ├── Product.ts          # Phase 0
│   │   │   ├── Order.ts            # Phase 0 (内嵌设计)
│   │   │   └── Customer.ts         # Phase 0
│   │   └── middleware/
│   │       ├── upload.ts           # Phase 0 (工具函数)
│   │       └── stripe.ts           # Phase 0 (工具函数)
│   ├── auth/
│   │   ├── register.ts             # 保留
│   │   ├── login.ts                # 保留
│   │   └── google.ts               # Phase 7
│   ├── products/
│   │   ├── index.ts                # Phase 1
│   │   └── [id].ts                 # Phase 1
│   ├── orders/
│   │   ├── index.ts                # Phase 2
│   │   └── [id].ts                 # Phase 2
│   ├── customers/
│   │   ├── index.ts                # Phase 3
│   │   └── [id].ts                 # Phase 3
│   ├── dashboard/
│   │   └── stats.ts                # Phase 4
│   ├── ai/
│   │   └── chat.ts                 # Phase 5
│   ├── stripe/
│   │   ├── checkout.ts             # Phase 6
│   │   └── webhook.ts              # Phase 6
│   ├── upload.ts                   # Phase 0 (工具 API)
│   ├── _server.ts                  # Phase 0: 一次注册所有路由
│   └── package.json                # Phase 0: 一次安装所有依赖
│
├── vercel.json                     # 保留
└── .env.example                    # Phase 0
```

---

## Phase 0: 共享层（一次性完成）

**目标:** 完成所有共享文件修改。完成后，后续每个 Phase 只管自己的模块文件，**零共享文件修改**。

**Files:**
- Create: `api/_lib/models/Product.ts`, `Order.ts`, `Customer.ts`
- Create: `api/_lib/middleware/upload.ts`, `stripe.ts`
- Create: `api/upload.ts`
- Modify: `api/_lib/models/User.ts`
- Modify: `api/_server.ts` — 一次注册所有路由
- Modify: `api/package.json` — 一次安装所有依赖
- Modify: `client/src/types/index.ts` — 一次加完所有类型
- Modify: `client/src/App.tsx` — 一次加完所有路由
- Modify: `client/src/components/Layout.tsx` — 一次加完所有导航
- Modify: `client/src/pages/Dashboard.tsx` — 改为占位页
- Modify: `.env.example`

- [ ] **Step 0.1: 安装后端全部新依赖**

```bash
cd api && npm install stripe multer cloudinary && npm install -D @types/multer
```

- [ ] **Step 0.2: 安装前端全部新依赖**

```bash
cd client && npm install recharts
```

- [ ] **Step 0.3: 创建 Product 模型**

Create `api/_lib/models/Product.ts`:

```typescript
import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  status: 'active' | 'draft' | 'archived';
  owner: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, default: 'uncategorized', trim: true },
  stock: { type: Number, default: 0, min: 0 },
  images: [{ type: String }],
  status: { type: String, enum: ['active', 'draft', 'archived'], default: 'active' },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

ProductSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
```

- [ ] **Step 0.4: 创建 Order 模型（内嵌设计，零外部引用）**

Create `api/_lib/models/Order.ts`:

```typescript
import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  orderNumber: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  owner: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  orderNumber: { type: String, required: true, unique: true },
  customerInfo: {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: '' },
  },
  items: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  }],
  totalAmount: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  paymentStatus: { type: String, enum: ['unpaid', 'paid', 'refunded'], default: 'unpaid' },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

OrderSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
```

- [ ] **Step 0.5: 创建 Customer 模型（独立，不引用 Order）**

Create `api/_lib/models/Customer.ts`:

```typescript
import mongoose, { Document, Schema } from 'mongoose';

export interface ICustomer extends Document {
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  totalOrders: number;
  totalSpent: number;
  notes: string;
  status: 'active' | 'inactive';
  owner: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, default: '' },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  totalOrders: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  notes: { type: String, default: '' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

CustomerSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Customer || mongoose.model<ICustomer>('Customer', CustomerSchema);
```

- [ ] **Step 0.6: 修改 User 模型**

Modify `api/_lib/models/User.ts` — 在 `IUser` interface 添加:

```typescript
avatar: string;
provider: 'local' | 'google';
providerId: string;
role: 'admin' | 'user';
```

在 `UserSchema` 中添加字段:

```typescript
avatar: { type: String, default: '' },
provider: { type: String, enum: ['local', 'google'], default: 'local' },
providerId: { type: String, default: '' },
role: { type: String, enum: ['admin', 'user'], default: 'admin' },
```

- [ ] **Step 0.7: 创建上传中间件工具**

Create `api/_lib/middleware/upload.ts`:

```typescript
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import type { UploadApiResponse } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

export async function uploadToCloudinary(buffer: Buffer, folder: string): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder, resource_type: 'image' }, (err, result: UploadApiResponse) => {
        if (err) return reject(err);
        resolve(result.secure_url);
      })
      .end(buffer);
  });
}
```

Create `api/_lib/middleware/stripe.ts`:

```typescript
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil' as any,
});
```

- [ ] **Step 0.8: 创建上传 API 工具**

Create `api/upload.ts`:

```typescript
import type { Request, Response } from 'express';
import { requireAuth } from './_lib/auth.js';
import { upload, uploadToCloudinary } from './_lib/middleware/upload.js';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    requireAuth(req);
    await new Promise<void>((resolve, reject) => {
      upload.single('file')(req, res, (err) => (err ? reject(err) : resolve()));
    });
    if (!req.file) return res.status(400).json({ error: 'No file provided' });
    const url = await uploadToCloudinary(req.file.buffer, 'products');
    return res.status(200).json({ url });
  } catch (err: any) {
    if (err.message === 'No token provided') return res.status(401).json({ error: 'Authentication required' });
    return res.status(500).json({ error: err.message || 'Upload failed' });
  }
}
```

- [ ] **Step 0.9: 一次性注册所有路由到 _server.ts**

Rewrite `api/_server.ts`:

```typescript
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import register from './auth/register';
import login from './auth/login';
import itemsHandler from './items/index';
import itemHandler from './items/[id]';
import uploadHandler from './upload';
import productsHandler from './products/index';
import productHandler from './products/[id]';
import ordersHandler from './orders/index';
import orderHandler from './orders/[id]';
import customersHandler from './customers/index';
import customerHandler from './customers/[id]';
import statsHandler from './dashboard/stats';
import aiChatHandler from './ai/chat';
import checkoutHandler from './stripe/checkout';
import webhookHandler from './stripe/webhook';
import googleHandler from './auth/google';

const app = express();

app.use(cors());
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.post('/api/auth/google', googleHandler);

app.post('/api/upload', uploadHandler);

app.get('/api/items', itemsHandler);
app.post('/api/items', itemsHandler);
app.get('/api/items/:id', itemHandler);
app.put('/api/items/:id', itemHandler);
app.delete('/api/items/:id', itemHandler);

app.get('/api/products', productsHandler);
app.post('/api/products', productsHandler);
app.get('/api/products/:id', productHandler);
app.put('/api/products/:id', productHandler);
app.delete('/api/products/:id', productHandler);

app.get('/api/orders', ordersHandler);
app.post('/api/orders', ordersHandler);
app.get('/api/orders/:id', orderHandler);
app.put('/api/orders/:id', orderHandler);
app.delete('/api/orders/:id', orderHandler);

app.get('/api/customers', customersHandler);
app.post('/api/customers', customersHandler);
app.get('/api/customers/:id', customerHandler);
app.put('/api/customers/:id', customerHandler);
app.delete('/api/customers/:id', customerHandler);

app.get('/api/dashboard/stats', statsHandler);
app.post('/api/ai/chat', aiChatHandler);
app.post('/api/stripe/checkout', checkoutHandler);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
```

- [ ] **Step 0.10: 创建所有 API 占位文件**

**关键:** `_server.ts` import 了还不存在的文件，必须创建占位文件才能启动服务器。

Create `api/products/index.ts` (占位):

```typescript
import type { Request, Response } from 'express';
export default async function handler(req: Request, res: Response) {
  return res.status(501).json({ error: 'Not implemented yet — complete Phase 1' });
}
```

Create `api/products/[id].ts` (占位 — 同上)

Create `api/orders/index.ts` (占位 — 同上)
Create `api/orders/[id].ts` (占位 — 同上)

Create `api/customers/index.ts` (占位 — 同上)
Create `api/customers/[id].ts` (占位 — 同上)

Create `api/dashboard/stats.ts` (占位 — 同上)
Create `api/ai/chat.ts` (占位 — 同上)
Create `api/stripe/checkout.ts` (占位 — 同上)
Create `api/stripe/webhook.ts` (占位 — 同上)
Create `api/auth/google.ts` (占位 — 同上)

共 12 个占位文件，全部返回 `501 Not implemented yet — complete Phase N`。

- [ ] **Step 0.11: 一次性更新前端类型定义**

Rewrite `client/src/types/index.ts` — 保留现有类型，追加所有新类型:

```typescript
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Item {
  _id: string;
  title: string;
  description: string;
  status: 'active' | 'archived' | 'draft';
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface ItemsResponse {
  items: Item[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ItemFormData {
  title: string;
  description: string;
  status: 'active' | 'archived' | 'draft';
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  status: 'active' | 'draft' | 'archived';
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  status: 'active' | 'draft' | 'archived';
}

export interface ProductsResponse {
  products: Product[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

export interface Order {
  _id: string;
  orderNumber: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderFormData {
  customerInfo: { name: string; email: string; phone: string };
  items: Array<{ name: string; quantity: number; price: number }>;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface OrdersResponse {
  orders: Order[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  totalOrders: number;
  totalSpent: number;
  notes: string;
  status: 'active' | 'inactive';
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  notes: string;
}

export interface CustomersResponse {
  customers: Customer[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  recentOrders: Order[];
  revenueByMonth: Array<{ month: string; revenue: number }>;
  ordersByStatus: Array<{ status: string; count: number }>;
  topProducts: Array<{ name: string; sold: number; revenue: number }>;
}

export interface AiChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
```

- [ ] **Step 0.12: 一次性更新 App.tsx — 所有路由**

Rewrite `client/src/App.tsx`:

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Items from './pages/Items';
import ItemDetail from './pages/ItemDetail';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Customers from './pages/Customers';
import Pricing from './pages/Pricing';
import PaymentSuccess from './pages/PaymentSuccess';
import OAuthCallback from './pages/OAuthCallback';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth/callback" element={<OAuthCallback />} />
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/items" element={<Items />} />
              <Route path="/items/:id" element={<ItemDetail />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/:id" element={<OrderDetail />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/payment/success" element={<PaymentSuccess />} />
            </Route>
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
```

- [ ] **Step 0.13: 创建所有前端占位页面**

每个占位页面结构相同，只显示模块名和 "Coming soon — complete Phase N"。

Create `client/src/pages/Products.tsx`:

```typescript
export default function Products() {
  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-white tracking-tight">Products</h1>
      <p className="text-slate-500 text-sm mt-2">Coming soon — complete Phase 1</p>
    </div>
  );
}
```

Create `client/src/pages/ProductDetail.tsx` (同上，改名为 "Product Detail")

Create `client/src/pages/Orders.tsx` (同上，Phase 2)

Create `client/src/pages/OrderDetail.tsx` (同上)

Create `client/src/pages/Customers.tsx` (同上，Phase 3)

Create `client/src/pages/Pricing.tsx` (同上，Phase 6)

Create `client/src/pages/PaymentSuccess.tsx` (同上)

Create `client/src/pages/OAuthCallback.tsx` (同上，Phase 7)

- [ ] **Step 0.14: 一次性更新 Layout — 所有导航项**

Modify `client/src/components/Layout.tsx` — 替换 `navItems`:

```typescript
const navItems = [
  { to: '/', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { to: '/products', label: 'Products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { to: '/orders', label: 'Orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { to: '/customers', label: 'Customers', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { to: '/items', label: 'Items', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
];
```

在 header 用户区域 Logout 按钮前添加 Upgrade 按钮:

```typescript
<Link
  to="/pricing"
  className="text-xs font-medium px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-400 hover:to-orange-500 transition-all"
>
  Upgrade
</Link>
```

- [ ] **Step 0.15: 更新 .env.example**

```
# 数据库
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority

# 认证
JWT_SECRET=<random-32-char-string>
GOOGLE_CLIENT_ID=<from-google-console>
GOOGLE_CLIENT_SECRET=<from-google-console>

# AI
GEMINI_API_KEY=<get-from-https://aistudio.google.com/apikey>

# 支付
STRIPE_SECRET_KEY=sk_test_<from-stripe-dashboard>
STRIPE_WEBHOOK_SECRET=whsec_<from-stripe-cli>
STRIPE_PRICE_ID_PRO=price_<create-in-stripe-dashboard>
STRIPE_PRICE_ID_ENTERPRISE=price_<create-in-stripe-dashboard>

# 文件上传
CLOUDINARY_CLOUD_NAME=<from-cloudinary-dashboard>
CLOUDINARY_API_KEY=<from-cloudinary-dashboard>
CLOUDINARY_API_SECRET=<from-cloudinary-api-key>
```

在 `client/` 创建 `.env`:

```
VITE_GOOGLE_CLIENT_ID=<your-google-client-id>
```

- [ ] **Step 0.16: 验证项目可正常启动**

```bash
cd api && npm run dev     # 应启动成功，所有路由返回 501
cd client && npm run dev  # 应启动成功，所有页面显示占位
```

- [ ] **Step 0.17: Commit**

```bash
git add -A
git commit -m "feat(phase-0): shared foundation - models, types, routes, placeholders"
```

---

## Phase 1: 产品管理模块（含文件上传）

**独立性:** 只修改 `api/products/*` + `client/src/pages/Product*` + `client/src/components/FileUpload.tsx` + `client/src/services/products.ts`。不触碰任何共享文件。

- [ ] **Step 1.1: 替换 `api/products/index.ts` — 列表 + 创建**

替换占位文件为完整实现。参照 `api/items/index.ts` 模式:
- GET: 分页 + search(name) + category 过滤 + status 过滤
- POST: 校验 name 必填 + price >= 0，创建产品

- [ ] **Step 1.2: 替换 `api/products/[id].ts` — 详情/更新/删除**

参照 `api/items/[id].ts`:
- GET / PUT / DELETE 标准 CRUD

- [ ] **Step 1.3: 创建 `client/src/services/products.ts`**

```typescript
import api from './api';
import type { ProductsResponse, Product, ProductFormData } from '../types';

export async function fetchProducts(params: {
  page?: number; limit?: number; search?: string; category?: string; status?: string;
}): Promise<ProductsResponse> {
  const { data } = await api.get<ProductsResponse>('/products', { params });
  return data;
}

export async function fetchProduct(id: string): Promise<{ product: Product }> {
  const { data } = await api.get<{ product: Product }>(`/products/${id}`);
  return data;
}

export async function createProduct(formData: ProductFormData): Promise<{ product: Product }> {
  const { data } = await api.post<{ product: Product }>('/products', formData);
  return data;
}

export async function updateProduct(id: string, formData: Partial<ProductFormData>): Promise<{ product: Product }> {
  const { data } = await api.put<{ product: Product }>(`/products/${id}`, formData);
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/products/${id}`);
}

export async function uploadImage(file: File): Promise<{ url: string }> {
  const form = new FormData();
  form.append('file', file);
  const { data } = await api.post<{ url: string }>('/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
```

- [ ] **Step 1.4: 创建 `client/src/components/FileUpload.tsx`**

Props: `images: string[]` / `onChange: (images: string[]) => void` / `max?: number`
- 拖拽上传区域（虚线边框）
- 点击上传
- 缩略图预览 + 删除按钮
- 上传中 loading 状态

- [ ] **Step 1.5: 替换 `client/src/pages/Products.tsx` — 产品列表 + CRUD**

参照 `Items.tsx`:
- 表格: 图片缩略图 | 产品名 | 分类 | 价格 | 库存 | 状态 | 操作
- 搜索 + 分类过滤 + 状态过滤
- 创建/编辑 Modal: name, description, price, category, stock, status, FileUpload
- 删除确认 Modal

- [ ] **Step 1.6: 替换 `client/src/pages/ProductDetail.tsx`**

参照 `ItemDetail.tsx`:
- 图片画廊
- 产品信息（名称、价格、库存、分类、状态）
- 描述
- 编辑/删除操作

- [ ] **Step 1.7: 验证并 Commit**

测试: 创建产品 → 上传图片 → 编辑 → 查看详情 → 删除

```bash
git add api/products/ client/src/services/products.ts client/src/components/FileUpload.tsx client/src/pages/Products.tsx client/src/pages/ProductDetail.tsx
git commit -m "feat(phase-1): Products module with image upload"
```

---

## Phase 2: 订单管理模块

**独立性:** 只修改 `api/orders/*` + `client/src/pages/Order*` + `client/src/services/orders.ts`。不触碰其他模块。Order 内嵌客户/商品数据，无外部依赖。

- [ ] **Step 2.1: 替换 `api/orders/index.ts`**

- GET: 分页 + search(orderNumber/customerName) + status 过滤
- POST: 自动生成 orderNumber(`ORD-${Date.now()}`)，接收 customerInfo + items + shippingAddress，自动算 totalAmount

- [ ] **Step 2.2: 替换 `api/orders/[id].ts`**

- GET: 返回完整订单
- PUT: 仅更新 status / paymentStatus
- DELETE: 设 status = 'cancelled'

- [ ] **Step 2.3: 创建 `client/src/services/orders.ts`**

fetchOrders / fetchOrder / createOrder / updateOrderStatus / cancelOrder

- [ ] **Step 2.4: 替换 `client/src/pages/Orders.tsx`**

- 表格: 订单号 | 客户名 | 总金额 | 状态 badge | 支付状态 | 日期 | 操作
- 状态 badge 配色: pending=amber, processing=blue, shipped=purple, delivered=emerald, cancelled=red
- 创建订单 Modal: customerInfo + 动态添加 items + shippingAddress
- 状态 + 搜索过滤

- [ ] **Step 2.5: 替换 `client/src/pages/OrderDetail.tsx`**

- 订单信息卡片
- 商品列表表格（名称/数量/单价/小计）
- 客户信息 + 收货地址
- 状态流转按钮（pending→processing→shipped→delivered）

- [ ] **Step 2.6: 验证并 Commit**

测试: 创建订单 → 查看详情 → 状态流转 → 取消

```bash
git add api/orders/ client/src/services/orders.ts client/src/pages/Orders.tsx client/src/pages/OrderDetail.tsx
git commit -m "feat(phase-2): Orders module with status management"
```

---

## Phase 3: 客户管理模块

**独立性:** 只修改 `api/customers/*` + `client/src/pages/Customers.tsx` + `client/src/services/customers.ts`。

- [ ] **Step 3.1: 替换 `api/customers/index.ts`**

- GET: 分页 + search(name/email) + status 过滤
- POST: 标准 CRUD

- [ ] **Step 3.2: 替换 `api/customers/[id].ts`**

- GET / PUT / DELETE 标准

- [ ] **Step 3.3: 创建 `client/src/services/customers.ts`**

fetchCustomers / fetchCustomer / createCustomer / updateCustomer / deleteCustomer

- [ ] **Step 3.4: 替换 `client/src/pages/Customers.tsx`**

- 表格: 姓名 | 邮箱 | 电话 | 订单数 | 消费总额 | 状态 | 操作
- 创建/编辑 Modal: name, email, phone, address, notes

- [ ] **Step 3.5: 验证并 Commit**

```bash
git add api/customers/ client/src/services/customers.ts client/src/pages/Customers.tsx
git commit -m "feat(phase-3): Customers management module"
```

---

## Phase 4: Dashboard 数据可视化

**独立性:** 只修改 `api/dashboard/stats.ts` + `client/src/pages/Dashboard.tsx` + `client/src/components/Charts.tsx`。
Dashboard 聚合只查 Order/Product/Customer 集合（直接 MongoDB aggregate，不依赖其他 API handler），即使集合为空也正常返回零值。

- [ ] **Step 4.1: 替换 `api/dashboard/stats.ts`**

聚合查询:
- 总收入（Order sum totalAmount，空集合返回 0）
- 总订单/产品/客户数（countDocuments，空集合返回 0）
- 月收入趋势（Order aggregate by month，空返回 []）
- 订单状态分布（Order groupBy status，空返回 []）
- 热销产品 TOP 5（Order items aggregate，空返回 []）
- 最近 5 笔订单

- [ ] **Step 4.2: 创建 `client/src/components/Charts.tsx`**

- `RevenueChart` — Recharts AreaChart，月收入趋势
- `OrderStatusChart` — Recharts PieChart，订单状态分布
- `TopProductsChart` — Recharts BarChart，热销产品
- 统一暗色主题

- [ ] **Step 4.3: 重写 `client/src/pages/Dashboard.tsx`**

- 顶部 4 统计卡片: 总收入 | 总订单 | 总产品 | 总客户
- 中间: 收入趋势图 + 订单状态饼图
- 底部: 热销产品柱状图 + 最近订单表格

- [ ] **Step 4.4: 验证并 Commit**

测试: 新集合为空时 Dashboard 正常显示零值；创建订单后图表更新

```bash
git add api/dashboard/ client/src/pages/Dashboard.tsx client/src/components/Charts.tsx
git commit -m "feat(phase-4): Dashboard with data visualization (Recharts)"
```

---

## Phase 5: AI 智能助手

**独立性:** 只修改 `api/ai/chat.ts` + `client/src/components/AiAssistant.tsx` + `client/src/services/ai.ts`。

> Gemini API Key: https://aistudio.google.com/apikey → Create API Key → 复制到 .env

- [ ] **Step 5.1: 替换 `api/ai/chat.ts`**

- POST: 接收 messages 数组
- 组装 Gemini 格式（system prompt + 历史消息）
- 调用 `gemini-2.0-flash:generateContent`
- 返回 AI 回复文本

- [ ] **Step 5.2: 创建 `client/src/services/ai.ts`**

```typescript
import api from './api';
export async function sendChatMessage(messages: Array<{ role: 'user' | 'assistant'; content: string }>): Promise<string> {
  const { data } = await api.post<{ reply: string }>('/ai/chat', { messages });
  return data.reply;
}
```

- [ ] **Step 5.3: 创建 `client/src/components/AiAssistant.tsx`**

- 右下角悬浮按钮（渐变紫色）
- 展开聊天窗口（400x500px）
- 消息列表 + 输入框 + 发送
- 预设快捷提问: "分析销售趋势" / "推荐定价策略" / "库存建议"

- [ ] **Step 5.4: 在 Layout 中引入 AiAssistant**

Modify `client/src/components/Layout.tsx` — 在 return JSX 最外层 div 末尾（`</div>` 之前）添加 `<AiAssistant />`。

> **注意:** 这是 Phase 0 之后唯一一次修改 Layout。仅添加一行 `<AiAssistant />`，不影响已有导航。

- [ ] **Step 5.5: 验证并 Commit**

测试: 点击 AI 按钮 → 发送消息 → 收到回复

```bash
git add api/ai/ client/src/services/ai.ts client/src/components/AiAssistant.tsx client/src/components/Layout.tsx
git commit -m "feat(phase-5): AI assistant powered by Google Gemini"
```

---

## Phase 6: Stripe 支付流程

**独立性:** 只修改 `api/stripe/*` + `client/src/pages/Pricing.tsx` + `PaymentSuccess.tsx` + `client/src/services/stripe.ts`。

> Stripe Test Mode: 注册 → 切换 Test Mode → 创建 2 个产品（Pro $29/mo, Enterprise $99/mo）→ 拿 Price ID

- [ ] **Step 6.1: 替换 `api/stripe/checkout.ts`**

- POST: 接收 priceId → 创建 Checkout Session → 返回 session.url

- [ ] **Step 6.2: 替换 `api/stripe/webhook.ts`**

- 验证签名 + 处理 checkout.session.completed
- console.log 记录（demo 级）

- [ ] **Step 6.3: 创建 `client/src/services/stripe.ts`**

```typescript
import api from './api';
export async function createCheckoutSession(priceId: string): Promise<{ url: string }> {
  const { data } = await api.post<{ url: string }>('/stripe/checkout', { priceId });
  return data;
}
```

- [ ] **Step 6.4: 替换 `client/src/pages/Pricing.tsx`**

- 3 列定价卡片: Free / Pro / Enterprise
- 渐变边框高亮推荐方案
- Subscribe 按钮 → createCheckoutSession → 跳转 Stripe Checkout
- 测试卡号: 4242 4242 4242 4242

- [ ] **Step 6.5: 替换 `client/src/pages/PaymentSuccess.tsx`**

- 成功图标 + 感谢消息 + 返回 Dashboard 按钮

- [ ] **Step 6.6: 验证并 Commit**

测试: 点击 Subscribe → Stripe 页面 → 输入测试卡号 → 成功页

```bash
git add api/stripe/ client/src/services/stripe.ts client/src/pages/Pricing.tsx client/src/pages/PaymentSuccess.tsx
git commit -m "feat(phase-6): Stripe payment flow with pricing page"
```

---

## Phase 7: Google OAuth 社交登录

**独立性:** 只修改 `api/auth/google.ts` + `client/src/pages/OAuthCallback.tsx` + `Login.tsx` + `Register.tsx` + `services/auth.ts` + `context/AuthContext.tsx`。

> Google OAuth: console.cloud.google.com → Credentials → OAuth 2.0 Client ID → redirect URI: `http://localhost:5173/auth/callback`

- [ ] **Step 7.1: 替换 `api/auth/google.ts`**

- POST: 接收 code + redirectUri
- 向 Google 换 access_token
- 获取用户信息
- findOneAndUpdate (upsert) 用户
- 返回 JWT

- [ ] **Step 7.2: 更新 `client/src/services/auth.ts` — 追加 googleAuth**

- [ ] **Step 7.3: 更新 `client/src/context/AuthContext.tsx` — 追加 googleLogin**

- [ ] **Step 7.4: 替换 `client/src/pages/OAuthCallback.tsx`**

- 从 URL 获取 code → 调用 googleLogin → 跳转 Dashboard

- [ ] **Step 7.5: 更新 `client/src/pages/Login.tsx` — 添加 Google 登录按钮**

在 Sign in 按钮后添加分割线 + Google 按钮（白底 + Google logo）

- [ ] **Step 7.6: 更新 `client/src/pages/Register.tsx` — 添加 Google 登录按钮**

同 Login 页

- [ ] **Step 7.7: 验证并 Commit**

测试: Google 按钮 → Google 授权 → 回调 → 自动登录

```bash
git add api/auth/google.ts client/src/services/auth.ts client/src/context/AuthContext.tsx client/src/pages/OAuthCallback.tsx client/src/pages/Login.tsx client/src/pages/Register.tsx
git commit -m "feat(phase-7): Google OAuth social login"
```

---

## 模块独立性矩阵

| | Products | Orders | Customers | Dashboard | AI | Stripe | OAuth |
|---|---|---|---|---|---|---|---|
| **依赖 Phase 0?** | 是 | 是 | 是 | 是 | 是 | 是 | 是 |
| **依赖其他 Phase?** | 否 | 否 | 否 | 否 | 否 | 否 | 否 |
| **修改共享文件?** | 否 | 否 | 否 | 否 | 1行* | 否 | 否 |
| **可独立开发?** | 是 | 是 | 是 | 是 | 是 | 是 | 是 |
| **可独立测试?** | 是 | 是 | 是 | 是 | 是 | 是 | 是 |
| **可独立部署?** | 是 | 是 | 是 | 是 | 是 | 是 | 是 |

*Phase 5 在 Layout 末尾添加一行 `<AiAssistant />`，不影响已有代码。

## 预估时间

| Phase | 时间 | 难度 |
|---|---|---|
| Phase 0: 共享层 | 2-3h | 低（大量占位文件） |
| Phase 1: 产品模块 | 4-6h | 中 |
| Phase 2: 订单模块 | 3-4h | 中 |
| Phase 3: 客户模块 | 2-3h | 低 |
| Phase 4: 数据可视化 | 3-4h | 中 |
| Phase 5: AI 助手 | 2-3h | 低 |
| Phase 6: Stripe | 3-4h | 中 |
| Phase 7: OAuth | 2-3h | 中 |
| **总计** | **~20-30h** | |

## 开发顺序建议

虽然每个 Phase 独立，推荐按此顺序（由核心到锦上添花）:

```
Phase 0 (必须首先) → Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Phase 7
```

但如果你今天只有 2 小时，可以只做 Phase 0 + Phase 5（AI 助手），立刻就能跑通一个有 AI 功能的 demo。
