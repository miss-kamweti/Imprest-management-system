import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  getUser(): any {
    return JSON.parse(localStorage.getItem('currentUser') || '{}');
  }

  isAdmin(): boolean {
    return this.getUser()?.role === 'admin';
  }

  isEmployee(): boolean {
    return this.getUser()?.role === 'employee';
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('currentUser');
  }
}