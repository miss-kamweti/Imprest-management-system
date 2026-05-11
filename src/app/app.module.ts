import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { DashboardComponent } from './modules/dashboard/dashboard/dashboard.component';
import { RequestImprestComponent } from './modules/imprest/request-imprest/request-imprest.component';
import { ImprestListComponent } from './modules/imprest/imprest-list/imprest-list.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';


// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoginComponent } from './components/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    RequestImprestComponent,
    ImprestListComponent,
    SidebarComponent
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,

    // Material Modules
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],

  providers: [],

  bootstrap: [AppComponent]
})
export class AppModule { }