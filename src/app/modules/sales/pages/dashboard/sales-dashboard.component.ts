import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SalesService } from 'src/app/core/services/sales.service';

@Component({
  selector: 'app-sales-dashboard',
  templateUrl: './sales-dashboard.component.html',
  styleUrls: ['./sales-dashboard.component.scss']
})
export class SalesDashboardComponent implements OnInit {
  totalCustomers = 0;
  pendingOrders = 0;
  totalRevenue = 0;
  recentOrders: any[] = [];
  isPendingOrdersView = false;

  constructor(
    private salesService: SalesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.isPendingOrdersView = params['pendingOrders'] === 'true';
      this.loadData();
    });
  }

  loadData(): void {
    this.totalCustomers = this.salesService.getTotalCustomers();
    this.pendingOrders = this.salesService.getPendingOrdersCount();
    this.totalRevenue = this.salesService.getTotalRevenue();
    
    if (this.isPendingOrdersView) {
      this.recentOrders = this.salesService.getPendingOrders().reverse();
    } else {
      this.recentOrders = this.salesService.getOrders().slice(-5).reverse();
    }
  }
}