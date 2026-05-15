import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './modules/auth/login/login.component';
import { DashboardComponent } from './modules/dashboard/dashboard/dashboard.component';
import { RequestImprestComponent } from './modules/imprest/pages/request-imprest/request-imprest.component';
import { ImprestListComponent } from './modules/imprest/pages/imprest-list/imprest-list.component';
import { RoleGuard } from './core/guards/role.guard';

import { GuestGuard } from './core/guards/guest.guard';
import { AuthGuard } from './core/guards/auth.guard';

import { UserListComponent } from './modules/admin/pages/user-list/user-list.component';
import { WithdrawImprestComponent } from './modules/imprest/pages/withdraw-imprest/withdraw-imprest.component';
import { InventoryDashboardComponent } from './modules/inventory/pages/dashboard/inventory-dashboard.component';
import  { SalesDashboardComponent } from './modules/sales/pages/dashboard/sales-dashboard.component';
import { ImprestActionsComponent } from './modules/imprest/pages/imprest-actions/imprest-actions.component';
import {CustomerListComponent } from './modules/sales/pages/customer-list/customer-list.component'

const routes: Routes = [

  { path: 'login', component: LoginComponent, canActivate: [GuestGuard] },

  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },

  { path: 'users', component: UserListComponent, canActivate: [RoleGuard], data: { roles: ['admin', 'hr'] } },

  { path: 'request-imprest', component: RequestImprestComponent,   canActivate: [RoleGuard],
  data: { roles: ['employee', 'admin', 'manager', 'hr', 'accountant'] } },

  { path: 'imprest-list', component: ImprestListComponent, canActivate: [RoleGuard],
  data: { roles: ['admin', 'manager', 'hr', 'accountant', 'employee'] } },

  { path: 'withdraw-imprest', component: WithdrawImprestComponent, canActivate: [AuthGuard] },

  { path: 'imprest-actions', component: ImprestActionsComponent, canActivate: [RoleGuard],
  data: { roles: ['employee', 'admin', 'manager', 'hr', 'accountant'] } },

  { path: 'inventory', component: InventoryDashboardComponent, canActivate: [RoleGuard], data: { roles: ['admin', 'manager'] } },

  { path: 'sales', component: SalesDashboardComponent, canActivate: [RoleGuard], data: { roles: ['admin', 'manager'] } },

  { path: 'customers', component: CustomerListComponent, canActivate: [RoleGuard], data: { roles: ['admin', 'manager'] } },

  { path: '', redirectTo: 'login', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}