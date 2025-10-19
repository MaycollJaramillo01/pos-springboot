import { Order } from './order';
import { Product } from './product';

export interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product?: Product;
}

export type InvoiceStatus = 'DRAFT' | 'ISSUED' | 'PAID' | 'CANCELLED';
export type PaymentMethod = 'CASH' | 'CARD' | 'TRANSFER' | 'CHECK';

export interface Invoice {
  id: number;
  invoiceNumber: string;
  issueDate: string;
  dueDate?: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  taxRate: number;
  status: InvoiceStatus;
  paymentMethod: PaymentMethod;
  paymentDate?: string;
  notes?: string;
  xmlData?: string;
  createdAt?: string;
  order?: Order;
  invoiceItems?: InvoiceItem[];
}

export type InvoicePayload = Omit<Invoice, 'id' | 'order' | 'invoiceItems' | 'createdAt'> & {
  orderId: number;
  items?: Array<{
    productId: number;
    description: string;
    quantity: number;
    unitPrice: number;
  }>;
};
