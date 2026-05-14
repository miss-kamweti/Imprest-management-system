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
        address: 'Nairobi, Kenya',
        creditLimit: 100000,
        status: 'active'
      },
      {
        id: 2,
        name: 'Tech Solutions Ltd',
        email: 'accounts@techsolutions.co.ke',
        phone: '+254 722717776',
        address: 'Mombasa, Kenya',
        creditLimit: 50000,
        status: 'active'
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
    return data ? JSON.parse(data) : [];
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
