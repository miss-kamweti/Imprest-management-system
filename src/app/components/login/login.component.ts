import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {

  username = '';
  password = '';

  constructor(private router: Router) {}

  login(): void {

    const u = this.username.trim().toLowerCase();
    const p = this.password;

    // 🔐 ADMIN LOGIN
    if (u === 'kinuthia' && p === 'kinuthia123') {

      localStorage.setItem('currentUser', JSON.stringify({
        username: 'kinuthia',
        role: 'admin'
      }));

      this.router.navigate(['/dashboard']);
      return;
    }

    // 👤 EMPLOYEE LOGIN (ANY VALID USERNAME)
    if (u && p) {

      localStorage.setItem('currentUser', JSON.stringify({
        username: this.username,   // keep original case
        role: 'employee'
      }));

      this.router.navigate(['/request-imprest']);
      return;
    }

    alert('Invalid login details');
  }
}