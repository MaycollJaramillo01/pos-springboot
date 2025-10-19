import { Product } from './product';

export interface OrderItem {
  id: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  description?: string;
  product?: Product;
}

export interface Order {
  id: number;
  orderNumber: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  totalAmount: number;
  shippingAddress?: string;
  billingAddress?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  orderItems?: OrderItem[];
}

export type OrderPayload = Omit<Order, 'id' | 'orderItems' | 'createdAt' | 'updatedAt'> & {
  items?: Array<{
    productId: number;
    quantity: number;
    unitPrice: number;
    description?: string;
  }>;
  taxRate?: number;
};
