import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InventoryService } from 'src/app/core/services/inventory.service';
import { Product } from 'src/app/shared/models/inventory.model';

@Component({
  selector: 'app-inventory-dashboard',
  templateUrl: './inventory-dashboard.component.html',
  styleUrls: ['./inventory-dashboard.component.scss']
})
export class InventoryDashboardComponent implements OnInit {
  products: Product[] = [];
  lowStockProducts: Product[] = [];
  totalProducts = 0;
  totalValue = 0;
  lowStockCount = 0;
  outOfStockCount = 0;
  isLowStockView = false;

  constructor(
    private inventoryService: InventoryService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.isLowStockView = params['lowStock'] === 'true';
      this.loadData();
    });
  }

  loadData(): void {
    const allProducts = this.inventoryService.getProducts();
    const lowStock = this.inventoryService.getLowStockProducts();

    if (this.isLowStockView) {
      this.products = lowStock;
    } else {
      this.products = allProducts;
    }

    this.lowStockProducts = lowStock;
    this.totalProducts = this.inventoryService.getTotalProducts();
    this.totalValue = this.inventoryService.getTotalInventoryValue();
    this.lowStockCount = lowStock.length;
    this.outOfStockCount = this.inventoryService.getOutOfStockProducts().length;
  }
}