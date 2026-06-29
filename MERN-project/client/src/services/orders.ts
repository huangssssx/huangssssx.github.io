import api from './api';
import type { OrdersResponse, Order, OrderFormData } from '../types';

export async function fetchOrders(params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}): Promise<OrdersResponse> {
  const { data } = await api.get<OrdersResponse>('/orders', { params });
  return data;
}

export async function fetchOrder(id: string): Promise<{ order: Order }> {
  const { data } = await api.get<{ order: Order }>(`/orders/${id}`);
  return data;
}

export async function createOrder(formData: OrderFormData): Promise<{ order: Order }> {
  const { data } = await api.post<{ order: Order }>('/orders', formData);
  return data;
}

export async function updateOrderStatus(id: string, data: { status?: string; paymentStatus?: string }): Promise<{ order: Order }> {
  const { data: res } = await api.put<{ order: Order }>(`/orders/${id}/status`, data);
  return res;
}

export async function cancelOrder(id: string): Promise<void> {
  await api.delete(`/orders/${id}`);
}
