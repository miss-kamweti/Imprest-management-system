import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {

  showEmployeeActions = false;
  showUserManagement = false;
  showInventory = false;
  showSales = false;

  constructor(
    private router: Router,
    public auth: AuthService
  ) {}

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  isManager(): boolean {
    return this.auth.isManager();
  }

  isEmployee(): boolean {
    return this.auth.isEmployee();
  }

  isHR(): boolean {
    return this.auth.isHR();
  }

  isAccountant(): boolean {
    return this.auth.isAccountant();
  }

  toggleEmployeeActions(): void {
    this.showEmployeeActions = !this.showEmployeeActions;
  }

  toggleUserManagement(): void {
    this.showUserManagement = !this.showUserManagement;
  }

  toggleInventory(): void {
    this.showInventory = !this.showInventory;
  }

  toggleSales(): void {
    this.showSales = !this.showSales;
  }
}