import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinancialDashboardComponent } from './pages/dashboard/financial-dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { ImprestService } from '../../core/services/imprest.service';

const routes: Routes = [
  { path: '', component: FinancialDashboardComponent }
];

@NgModule({
  declarations: [FinancialDashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  providers: [ImprestService]
})
export class FinancialModule { }