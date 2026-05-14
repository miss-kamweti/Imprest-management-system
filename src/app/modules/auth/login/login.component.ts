import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {

  username = '';
  password = '';

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) {}

  login(): void {

    const u = this.username.trim();
    const p = this.password;

    if (!u || !p) {
      alert('Please enter both username and password');
      return;
    }

  
    if (u.toLowerCase() === 'kinuthia' && p === 'kinuthia123') {

      localStorage.setItem('currentUser', JSON.stringify({
        username: 'kinuthia',
        role: 'admin'
      }));

      this.router.navigate(['/dashboard']);
      return;
    }

    const allUsers = this.userService.getUsers();
    const matchedUser = allUsers.find(
      user => user.username.toLowerCase() === u.toLowerCase()
    );

    if (matchedUser) {
      this.authService.setUser({
        id: matchedUser.id,
        username: matchedUser.username,
        email: matchedUser.email,
        role: matchedUser.role,
        permissions: matchedUser.permissions,
        department: matchedUser.department,
        status: matchedUser.status
      });

      if (matchedUser.role === 'admin') {
        this.router.navigate(['/dashboard']);
      } else if (matchedUser.role === 'hr') {
        this.router.navigate(['/users']);
      } else {
        this.router.navigate(['/request-imprest']);
      }
      return;
    }

   
    const newId = Math.max(...this.userService.getUsers().map(usr => usr.id), 0) + 1;
    this.userService.addUser({
      id: newId,
      username: u,
      email: `${u.toLowerCase()}@company.com`,
      role: 'employee',
      permissions: ['imprest_request'],
      department: 'Unknown',
      status: 'active'
    });

    const newUser = this.userService.getUsers().find(
      user => user.username.toLowerCase() === u.toLowerCase()
    );

    if (newUser) {
      this.authService.setUser(newUser);
    } else {
      // Fallback: set user directly
      this.authService.setUser({
        id: Date.now(),
        username: u,
        email: `${u.toLowerCase()}@wholesalers.com`,
        role: 'employee',
        permissions: ['imprest_request'],
        department: 'Unknown',
        status: 'active'
      });
    }

    this.router.navigate(['/request-imprest']);
  }
}