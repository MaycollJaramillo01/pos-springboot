import { Category } from './category';

export interface Product {
  id: number;
  sku: string;
  brand?: string;
  name: string;
  description?: string;
  barCode: string;
  measureUnit?: string;
  costPrice?: number;
  isActive?: boolean;
  taxPercentage?: number;
  productCategories?: Category[];
  createdAt?: string;
  updatedAt?: string;
}

export type ProductPayload = Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'productCategories'> & {
  categoryIds?: number[];
};
