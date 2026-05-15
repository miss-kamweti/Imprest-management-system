import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { RequestImprestComponent } from './pages/request-imprest/request-imprest.component';
import { ImprestListComponent } from './pages/imprest-list/imprest-list.component';
import { WithdrawImprestComponent } from './pages/withdraw-imprest/withdraw-imprest.component';
import { ImprestActionsComponent } from './pages/imprest-actions/imprest-actions.component';
import { ImprestModalComponent } from './components/imprest-modal.component';

@NgModule({
  declarations: [
    RequestImprestComponent,
    ImprestListComponent,
    WithdrawImprestComponent,
    ImprestActionsComponent,
    ImprestModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    ImprestModalComponent
  ]
})
export class ImprestModule { }
