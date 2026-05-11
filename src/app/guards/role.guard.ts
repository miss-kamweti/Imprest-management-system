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

    if (allowedRoles.includes(user.role)) {
      return true;
    }

    this.router.navigate(['/dashboard']);
    return false;
  }
}