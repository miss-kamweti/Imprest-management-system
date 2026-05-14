import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RequestImprestComponent } from './pages/request-imprest/request-imprest.component';
import { ImprestListComponent } from './pages/imprest-list/imprest-list.component';
import { WithdrawImprestComponent } from './pages/withdraw-imprest/withdraw-imprest.component';

@NgModule({
  declarations: [
    RequestImprestComponent,
    ImprestListComponent,
    WithdrawImprestComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class ImprestModule { } 
