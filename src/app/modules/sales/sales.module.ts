import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesDashboardComponent } from './pages/dashboard/sales-dashboard.component';
import { CustomerListComponent } from './pages/customer-list/customer-list.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: SalesDashboardComponent }
];

@NgModule({
  declarations: [SalesDashboardComponent, CustomerListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class SalesModule { }