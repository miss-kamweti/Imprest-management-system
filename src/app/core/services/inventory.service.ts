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
        unit: 'pcs'
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
        unit: 'ream'
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
        unit: 'box'
      },
      {
        id: 4,
        sku: 'ELC-001',
        name: 'Laptop Dell Latitude 5520',
        category: 'Electronics',
        unitPrice: 95000,
        costPrice: 82000,
        quantityOnHand: 12,
        reorderLevel: 5,
        unit: 'pcs'
      },
      {
        id: 5,
        sku: 'ELC-002',
        name: 'Wireless Mouse',
        category: 'Electronics',
        unitPrice: 2500,
        costPrice: 1800,
        quantityOnHand: 40,
        reorderLevel: 10,
        unit: 'pcs'
      },
      {
        id: 6,
        sku: 'ELC-003',
        name: 'USB-C Hub 7-in-1',
        category: 'Electronics',
        unitPrice: 4500,
        costPrice: 3200,
        quantityOnHand: 30,
        reorderLevel: 8,
        unit: 'pcs'
      },
      {
        id: 7,
        sku: 'FUR-001',
        name: 'Ergonomic Office Chair',
        category: 'Furniture',
        unitPrice: 22000,
        costPrice: 17000,
        quantityOnHand: 8,
        reorderLevel: 5,
        unit: 'pcs'
      },
      {
        id: 8,
        sku: 'FUR-002',
        name: 'Standing Desk 120cm',
        category: 'Furniture',
        unitPrice: 35000,
        costPrice: 28000,
        quantityOnHand: 6,
        reorderLevel: 3,
        unit: 'pcs'
      },
      {
        id: 9,
        sku: 'CLN-001',
        name: 'Hand Sanitizer 500ml',
        category: 'Cleaning',
        unitPrice: 600,
        costPrice: 380,
        quantityOnHand: 100,
        reorderLevel: 30,
        unit: 'bottle'
      },
      {
        id: 10,
        sku: 'CLN-002',
        name: 'Disinfectant Spray 750ml',
        category: 'Cleaning',
        unitPrice: 850,
        costPrice: 550,
        quantityOnHand: 60,
        reorderLevel: 20,
        unit: 'bottle'
      },
      {
        id: 11,
        sku: 'SNK-001',
        name: 'Bottled Water 500ml',
        category: 'Beverages',
        unitPrice: 150,
        costPrice: 90,
        quantityOnHand: 200,
        reorderLevel: 50,
        unit: 'bottle'
      },
      {
        id: 12,
        sku: 'SNK-002',
        name: 'Energy Drink 250ml',
        category: 'Beverages',
        unitPrice: 300,
        costPrice: 180,
        quantityOnHand: 150,
        reorderLevel: 40,
        unit: 'can'
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
