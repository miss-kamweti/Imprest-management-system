import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryDashboardComponent } from './pages/dashboard/inventory-dashboard.component';
import { ProductModalComponent } from './components/product-modal/product-modal.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: InventoryDashboardComponent }
];

@NgModule({
  declarations: [InventoryDashboardComponent, ProductModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class InventoryModule { }
