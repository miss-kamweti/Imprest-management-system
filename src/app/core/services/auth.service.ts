import { Injectable } from '@angular/core';
import { User, UserRole } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  getUser(): User | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  setUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  clearUser(): void {
    localStorage.removeItem('currentUser');
  }

  isLoggedIn(): boolean {
    return !!this.getUser();
  }

  hasRole(role: UserRole): boolean {
    const userRole = this.getUser()?.role;
    return userRole ? userRole.toLowerCase() === role.toLowerCase() : false;
  }

  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  isManager(): boolean {
    return this.hasRole('manager');
  }

  isEmployee(): boolean {
    return this.hasRole('employee');
  }

  isHR(): boolean {
    return this.hasRole('hr');
  }

  isAccountant(): boolean {
    return this.hasRole('accountant');
  }

  hasPermission(permission: string): boolean {
    const user = this.getUser();
    return user?.permissions?.includes(permission) ?? false;
  }

  logout(): void {
    this.clearUser();
  }
}