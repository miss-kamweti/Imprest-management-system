import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryDashboardComponent } from './pages/dashboard/inventory-dashboard.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: InventoryDashboardComponent }
];

@NgModule({
  declarations: [InventoryDashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class InventoryModule { }