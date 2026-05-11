import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './modules/dashboard/dashboard/dashboard.component';
import { RequestImprestComponent } from './modules/imprest/request-imprest/request-imprest.component';
import { ImprestListComponent } from './modules/imprest/imprest-list/imprest-list.component';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [

  { path: 'login', component: LoginComponent },

  { path: 'dashboard', component: DashboardComponent },

  { path: 'request-imprest', component: RequestImprestComponent,   canActivate: [RoleGuard],
  data: { roles: ['employee', 'admin'] } },

  { path: 'imprest-list', component: ImprestListComponent, canActivate: [RoleGuard],
  data: { roles: ['admin'] } },

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
  path: 'imprest-list',
  component: ImprestListComponent,
  canActivate: [RoleGuard],
  data: { roles: ['admin'] }
}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}