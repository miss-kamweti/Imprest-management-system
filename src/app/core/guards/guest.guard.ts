import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const userString = localStorage.getItem('currentUser');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        if (user && user.role) {
          if (user.role === 'admin') {
            this.router.navigate(['/dashboard']);
          } else if (user.role === 'hr') {
            this.router.navigate(['/users']);
          } else {
            this.router.navigate(['/request-imprest']);
          }
          return false; // prevent access to login
        }
      } catch (e) {
        // Handle invalid JSON gracefully by allowing access
      }
    }
    return true; // allow access to login
  }
}
