import { Component } from '@angular/core';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'imprest-management';

  // controls sidebar state
  isSidebarOpen = false;

  constructor(public auth: AuthService) {}

  // toggle sidebar when menu button is clicked
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  // close sidebar (useful when clicking a menu item)
  closeSidebar(): void {
    this.isSidebarOpen = false;
  }
}