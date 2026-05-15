import { Component, EventEmitter, Output } from '@angular/core';
import { Product } from 'src/app/shared/models/inventory.model';

@Component({
  selector: 'app-product-modal',
  templateUrl: './product-modal.component.html',
  styleUrls: ['./product-modal.component.scss']
})
export class ProductModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Product>();

  product: Product = {
    id: 0,
    sku: '',
    name: '',
    description: '',
    category: '',
    unitPrice: 0,
    costPrice: 0,
    quantityOnHand: 0,
    reorderLevel: 0,
    unit: 'pcs'
  };

  categories = ['Stationery', 'Electronics', 'Furniture', 'Cleaning', 'Beverages', 'Other'];
  units = ['pcs', 'box', 'ream', 'bottle', 'can', 'set', 'kg', 'litre'];

  onClose(): void {
    this.close.emit();
  }

  onSave(): void {
    if (this.product.sku && this.product.name && this.product.category) {
      this.save.emit(this.product);
      this.close.emit();
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close.emit();
    }
  }
}
