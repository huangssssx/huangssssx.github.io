import api from './api';
import type { ItemsResponse, Item, ItemFormData } from '../types';

export async function fetchItems(params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}): Promise<ItemsResponse> {
  const { data } = await api.get<ItemsResponse>('/items', { params });
  return data;
}

export async function fetchItem(id: string): Promise<{ item: Item }> {
  const { data } = await api.get<{ item: Item }>(`/items/${id}`);
  return data;
}

export async function createItem(formData: ItemFormData): Promise<{ item: Item }> {
  const { data } = await api.post<{ item: Item }>('/items', formData);
  return data;
}

export async function updateItem(id: string, formData: Partial<ItemFormData>): Promise<{ item: Item }> {
  const { data } = await api.put<{ item: Item }>(`/items/${id}`, formData);
  return data;
}

export async function deleteItem(id: string): Promise<void> {
  await api.delete(`/items/${id}`);
}
