export interface User {
  id: string;
  email: string;
  name: string;
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
