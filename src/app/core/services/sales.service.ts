import { Injectable } from '@angular/core';
import { Customer, SalesOrder, Invoice } from '../../shared/models/sales.model';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private customersKey = 'sales_customers';
  private ordersKey = 'sales_orders';
  private invoicesKey = 'sales_invoices';

  constructor() {}

  // Customers
  getCustomers(): Customer[] {
    const data = localStorage.getItem(this.customersKey);
    return data ? JSON.parse(data) : this.getDefaultCustomers();
  }

  getCustomerById(id: number): Customer | undefined {
    return this.getCustomers().find(c => c.id === id);
  }

  private getDefaultCustomers(): Customer[] {
    return [
      {
        id: 1,
        name: 'Mary Leakey High School',
        email: 'mary.leakey@gmail.com',
        phone: '+254 700 765856',
        address: 'Kiambu, Kenya',
        creditLimit: 100000
      },
      {
        id: 2,
        name: 'EMTech  Ltd',
        email: 'emtchhouse@yahoo.co.ke',
        phone: '+254 722717776',
        address: 'Mombasa, Kenya',
        creditLimit: 50000
      },
      {
        id: 3,
        name: 'Safaricom Enterprises',
        email: 'supplies@safaricom.co.ke',
        phone: '+254 722 000000',
        address: 'Nairobi, Kenya',
        creditLimit: 250000
      },
      {
        id: 4,
        name: 'Kenya Power & Lighting',
        email: 'supply@kplc.co.ke',
        phone: '+254 703 111222',
        address: 'Nairobi, Kenya',
        creditLimit: 300000
      },
      {
        id: 5,
        name: 'Cooperative Bank of Kenya',
        email: 'ops@co-opbank.co.ke',
        phone: '+254 711 050500',
        address: 'Nairobi, Kenya',
        creditLimit: 200000
      },
      {
        id: 6,
        name: 'Nakumatt Holdings',
        email: 'orders@nakumatt.co.ke',
        phone: '+254 722 333444',
        address: 'Nairobi, Kenya',
        creditLimit: 150000
      },
      {
        id: 7,
        name: 'KCB Bank Group',
        email: 'supply@kcbgroup.co.ke',
        phone: '+254 711 111000',
        address: 'Nairobi, Kenya',
        creditLimit: 350000
      },
      {
        id: 8,
        name: 'Equity Bank Kenya',
        email: 'procurement@equitybank.co.ke',
        phone: '+254 703 100000',
        address: 'Nairobi, Kenya',
        creditLimit: 280000
      },
      {
        id: 9,
        name: 'Jumia Kenya',
        email: 'vendor@jumia.co.ke',
        phone: '+254 700 111222',
        address: 'Nairobi, Kenya',
        creditLimit: 120000
      },
      {
        id: 10,
        name: 'Naivas Supermarket',
        email: 'supply@naivas.co.ke',
        phone: '+254 722 444555',
        address: 'Nairobi, Kenya',
        creditLimit: 180000
      }
    ];
  }

  addCustomer(customer: Customer): void {
    const customers = this.getCustomers();
    const newId = Math.max(...customers.map(c => c.id), 0) + 1;
    customers.push({ ...customer, id: newId });
    this.saveCustomers(customers);
  }

  updateCustomer(customer: Customer): void {
    const customers = this.getCustomers();
    const index = customers.findIndex(c => c.id === customer.id);
    if (index !== -1) {
      customers[index] = customer;
      this.saveCustomers(customers);
    }
  }

  deleteCustomer(id: number): void {
    const customers = this.getCustomers().filter(c => c.id !== id);
    this.saveCustomers(customers);
  }

  // Orders
  getOrders(): SalesOrder[] {
    const data = localStorage.getItem(this.ordersKey);
    return data ? JSON.parse(data) : this.getDefaultOrders();
  }

  private getDefaultOrders(): SalesOrder[] {
    return [
      {
        id: 1,
        orderNumber: 'SO-2026-001',
        customerId: 1,
        customerName: 'Mary Leakey High School',
        orderDate: '2026-05-01',
        status: 'delivered',
        items: [
          { productId: 1, productName: 'Office Supplies', quantity: 10, unitPrice: 1500, total: 15000 },
          { productId: 2, productName: 'Printer Paper A4', quantity: 20, unitPrice: 800, total: 16000 }
        ],
        total: 31000
      },
      {
        id: 2,
        orderNumber: 'SO-2026-002',
        customerId: 1,
        customerName: 'Mary Leakey High School',
        orderDate: '2026-05-10',
        status: 'shipped',
        items: [
          { productId: 4, productName: 'Laptop Dell Latitude 5520', quantity: 2, unitPrice: 95000, total: 190000 }
        ],
        total: 190000
      },
      {
        id: 3,
        orderNumber: 'SO-2026-003',
        customerId: 2,
        customerName: 'EMTech Ltd',
        orderDate: '2026-05-05',
        status: 'confirmed',
        items: [
          { productId: 5, productName: 'Wireless Mouse', quantity: 15, unitPrice: 2500, total: 37500 },
          { productId: 6, productName: 'USB-C Hub 7-in-1', quantity: 10, unitPrice: 4500, total: 45000 }
        ],
        total: 82500
      },
      {
        id: 4,
        orderNumber: 'SO-2026-004',
        customerId: 3,
        customerName: 'Safaricom Enterprises',
        orderDate: '2026-05-08',
        status: 'delivered',
        items: [
          { productId: 7, productName: 'Ergonomic Office Chair', quantity: 10, unitPrice: 22000, total: 220000 },
          { productId: 8, productName: 'Standing Desk 120cm', quantity: 5, unitPrice: 35000, total: 175000 }
        ],
        total: 395000
      },
      {
        id: 5,
        orderNumber: 'SO-2026-005',
        customerId: 4,
        customerName: 'Kenya Power & Lighting',
        orderDate: '2026-05-12',
        status: 'draft',
        items: [
          { productId: 9, productName: 'Hand Sanitizer 500ml', quantity: 50, unitPrice: 600, total: 30000 },
          { productId: 10, productName: 'Disinfectant Spray 750ml', quantity: 30, unitPrice: 850, total: 25500 }
        ],
        total: 55500
      },
      {
        id: 6,
        orderNumber: 'SO-2026-006',
        customerId: 5,
        customerName: 'Cooperative Bank of Kenya',
        orderDate: '2026-05-14',
        status: 'shipped',
        items: [
          { productId: 11, productName: 'Bottled Water 500ml', quantity: 100, unitPrice: 150, total: 15000 },
          { productId: 12, productName: 'Energy Drink 250ml', quantity: 80, unitPrice: 300, total: 24000 }
        ],
        total: 39000
      }
    ];
  }

  createOrder(order: SalesOrder): void {
    const orders = this.getOrders();
    const newId = Math.max(...orders.map(o => o.id), 0) + 1;
    orders.push({ ...order, id: newId });
    this.saveOrders(orders);
  }

  updateOrderStatus(id: number, status: SalesOrder['status']): void {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === id);
    if (order) {
      order.status = status;
      this.saveOrders(orders);
    }
  }

  getPendingOrders(): SalesOrder[] {
    return this.getOrders().filter(o => o.status === 'draft' || o.status === 'confirmed');
  }

  // Invoices
  getInvoices(): Invoice[] {
    const data = localStorage.getItem(this.invoicesKey);
    return data ? JSON.parse(data) : this.getDefaultInvoices();
  }

  getInvoicesByCustomer(customerId: number): Invoice[] {
    return this.getInvoices().filter(i => i.customerId === customerId);
  }

  private getDefaultInvoices(): Invoice[] {
    return [
      {
        id: 1,
        invoiceNumber: 'INV-2026-001',
        orderId: 101,
        customerId: 1,
        customerName: 'Mary Leakey High School',
        invoiceDate: '2026-05-01',
        dueDate: '2026-05-31',
        status: 'paid',
        items: [
          { productId: 1, productName: 'Office Supplies', quantity: 10, unitPrice: 1500, total: 15000 }
        ],
        subtotal: 15000,
        tax: 2400,
        total: 17400,
        paidAmount: 17400
      },
      {
        id: 2,
        invoiceNumber: 'INV-2026-002',
        orderId: 102,
        customerId: 1,
        customerName: 'Mary Leakey High School',
        invoiceDate: '2026-05-10',
        dueDate: '2026-06-10',
        status: 'sent',
        items: [
          { productId: 2, productName: 'Printer Paper A4', quantity: 20, unitPrice: 800, total: 16000 }
        ],
        subtotal: 16000,
        tax: 2560,
        total: 18560,
        paidAmount: 0
      }
    ];
  }

  getTotalCustomers(): number {
    return this.getCustomers().length;
  }

  getTotalRevenue(): number {
    return this.getOrders()
      .filter(o => o.status === 'delivered')
      .reduce((sum, o) => sum + o.total, 0);
  }

  getPendingOrdersCount(): number {
    return this.getPendingOrders().length;
  }

  private saveCustomers(customers: Customer[]): void {
    localStorage.setItem(this.customersKey, JSON.stringify(customers));
  }

  private saveOrders(orders: SalesOrder[]): void {
    localStorage.setItem(this.ordersKey, JSON.stringify(orders));
  }

  private saveInvoices(invoices: Invoice[]): void {
    localStorage.setItem(this.invoicesKey, JSON.stringify(invoices));
  }
}
