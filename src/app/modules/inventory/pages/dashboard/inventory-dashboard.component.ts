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
  totalProducts = 0;
  totalValue = 0;
  lowStockCount = 0;
  outOfStockCount = 0;
  showAddModal = false;

  constructor(
    private inventoryService: InventoryService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const allProducts = this.inventoryService.getProducts();
    const lowStock = this.inventoryService.getLowStockProducts();

    this.products = allProducts;
    this.totalProducts = this.inventoryService.getTotalProducts();
    this.totalValue = this.inventoryService.getTotalInventoryValue();
    this.lowStockCount = lowStock.length;
    this.outOfStockCount = this.inventoryService.getOutOfStockProducts().length;
  }

  openAddModal(): void {
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  onProductSaved(product: Product): void {
    this.inventoryService.addProduct(product);
    this.loadData();
  }
}
