export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  creditLimit: number;
  status: 'active' | 'inactive';
}

export interface SalesOrder {
  id: number;
  orderNumber: string;
  customerId: number;
  customerName: string;
  orderDate: string;
  status: 'draft' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  items: SalesOrderItem[];
  total: number;
}

export interface SalesOrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  orderId: number;
  customerId: number;
  customerName: string;
  invoiceDate: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  items: SalesOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  paidAmount: number;
}