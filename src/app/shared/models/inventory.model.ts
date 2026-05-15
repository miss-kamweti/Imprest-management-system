export interface Product {
  id: number;
  sku: string;
  name: string;
  description?: string;
  category: string;
  unitPrice: number;
  costPrice: number;
  quantityOnHand: number;
  reorderLevel: number;
  unit: string;
}

export interface StockMovement {
  id: number;
  productId: number;
  productName: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reference?: string;
  date: string;
  createdBy: string;
}

export interface PurchaseOrder {
  id: number;
  poNumber: string;
  vendorId: number;
  vendorName: string;
  orderDate: string;
  expectedDate: string;
  status: 'draft' | 'pending' | 'received' | 'cancelled';
  items: PurchaseOrderItem[];
  total: number;
}

export interface PurchaseOrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}