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
