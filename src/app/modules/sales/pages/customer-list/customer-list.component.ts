import { Component, OnInit } from '@angular/core';
import { SalesService } from 'src/app/core/services/sales.service';
import { Customer, Invoice } from 'src/app/shared/models/sales.model';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {
  customers: Customer[] = [];
  selectedCustomer: Customer | null = null;
  customerInvoices: Invoice[] = [];

  constructor(private salesService: SalesService) {}

  ngOnInit(): void {
    this.customers = this.salesService.getCustomers();
  }

  viewDetails(customer: Customer): void {
    this.selectedCustomer = customer;
    this.customerInvoices = this.salesService.getInvoicesByCustomer(customer.id);
  }

  closeDetails(): void {
    this.selectedCustomer = null;
    this.customerInvoices = [];
  }
}