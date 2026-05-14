import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {

    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');

    const allowedRoles = route.data['roles'];
    const userRole = user.role ? user.role.toLowerCase() : '';

    if (allowedRoles.some((role: string) => role.toLowerCase() === userRole)) {
      return true;
    }

    this.router.navigate(['/dashboard']);
    return false;
  }
}