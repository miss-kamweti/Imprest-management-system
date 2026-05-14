import { Injectable } from '@angular/core';
import { Product } from '../../shared/models/inventory.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private storageKey = 'inventory_products';

  constructor() {}

  getProducts(): Product[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : this.getDefaultProducts();
  }

  private getDefaultProducts(): Product[] {
    return [
      {
        id: 1,
        sku: 'OFF-001',
        name: 'Office Supplies',
        category: 'Stationery',
        unitPrice: 1500,
        costPrice: 1200,
        quantityOnHand: 50,
        reorderLevel: 10,
        unit: 'pcs',
        status: 'active'
      },
      {
        id: 2,
        sku: 'PAP-001',
        name: 'Printer Paper A4',
        category: 'Stationery',
        unitPrice: 800,
        costPrice: 650,
        quantityOnHand: 5,
        reorderLevel: 20,
        unit: 'ream',
        status: 'active'
      },
      {
        id: 3,
        sku: 'PEN-001',
        name: 'Ballpoint Pens',
        category: 'Stationery',
        unitPrice: 300,
        costPrice: 200,
        quantityOnHand: 25,
        reorderLevel: 15,
        unit: 'box',
        status: 'active'
      }
    ];
  }

  addProduct(product: Product): void {
    const products = this.getProducts();
    const newId = Math.max(...products.map(p => p.id), 0) + 1;
    products.push({ ...product, id: newId });
    this.saveProducts(products);
  }

  updateProduct(product: Product): void {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index !== -1) {
      products[index] = product;
      this.saveProducts(products);
    }
  }

  deleteProduct(id: number): void {
    const products = this.getProducts().filter(p => p.id !== id);
    this.saveProducts(products);
  }

  getLowStockProducts(): Product[] {
    return this.getProducts().filter(p => p.quantityOnHand <= p.reorderLevel);
  }

  getOutOfStockProducts(): Product[] {
    return this.getProducts().filter(p => p.quantityOnHand === 0);
  }

  getTotalProducts(): number {
    return this.getProducts().length;
  }

  getTotalInventoryValue(): number {
    return this.getProducts().reduce((sum, p) => sum + (p.quantityOnHand * p.unitPrice), 0);
  }

  private saveProducts(products: Product[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(products));
  }
}
