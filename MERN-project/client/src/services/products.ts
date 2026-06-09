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
