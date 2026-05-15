import { Component, OnInit } from '@angular/core';
import { SalesService } from 'src/app/core/services/sales.service';
import { Customer, SalesOrder, SalesOrderItem } from 'src/app/shared/models/sales.model';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {
  customers: Customer[] = [];
  selectedCustomer: Customer | null = null;
  customerOrders: SalesOrder[] = [];
  customerOrderItems: SalesOrderItem[] = [];

  constructor(private salesService: SalesService) {}

  ngOnInit(): void {
    this.customers = this.salesService.getCustomers();
  }

  viewDetails(customer: Customer): void {
    this.selectedCustomer = customer;
    this.customerOrders = this.salesService
      .getOrders()
      .filter(o => o.customerId === customer.id)
      .reverse();
    this.customerOrderItems = this.customerOrders.flatMap(o => o.items);
  }

  closeDetails(): void {
    this.selectedCustomer = null;
    this.customerOrders = [];
    this.customerOrderItems = [];
  }

  isPaid(order: SalesOrder): boolean {
    return order.status === 'delivered' || order.status === 'shipped';
  }

  isDelivered(order: SalesOrder): boolean {
    return order.status === 'delivered';
  }
}
