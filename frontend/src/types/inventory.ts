import { Product } from './product';

export interface Inventory {
  id: number;
  quantity: number;
  minStock: number;
  maxStock: number;
  lastRestockDate?: string;
  location?: string;
  createdAt?: string;
  updatedAt?: string;
  product?: Product;
}

export type InventoryPayload = Omit<Inventory, 'id' | 'createdAt' | 'updatedAt' | 'product'> & {
  productId: number;
};
