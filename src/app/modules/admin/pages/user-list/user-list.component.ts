import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../shared/models/user.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  allUsers: User[] = [];
  displayedColumns: string[] = ['id', 'username', 'email', 'role', 'department', 'status', 'actions'];
  showForm = false;
  selectedUser: User | null = null;
  currentPage = 0;
  pageSize = 20;
  totalPages = 0;
  totalUsers = 0;
  searchForm: FormGroup;
  searchQuery = '';
  roleFilter: string = 'all';
  Math = Math;

  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      query: [''],
      role: ['all']
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.allUsers = this.userService.getUsers();
    this.applyFiltersAndPagination();
  }

  applyFiltersAndPagination(): void {
    let filtered = this.allUsers;

    if (this.searchQuery) {
      const lower = this.searchQuery.toLowerCase();
      filtered = filtered.filter(u =>
        u.username.toLowerCase().includes(lower) ||
        u.email.toLowerCase().includes(lower) ||
        u.department?.toLowerCase().includes(lower)
      );
    }

    if (this.roleFilter !== 'all') {
      filtered = filtered.filter(u => u.role === this.roleFilter);
    }

    this.totalUsers = filtered.length;
    this.totalPages = Math.ceil(this.totalUsers / this.pageSize);
    const start = this.currentPage * this.pageSize;
    this.users = filtered.slice(start, start + this.pageSize);
  }

  onSearch(): void {
    this.searchQuery = this.searchForm.get('query')?.value || '';
    this.currentPage = 0;
    this.applyFiltersAndPagination();
  }

  onRoleFilterChange(): void {
    this.roleFilter = this.searchForm.get('role')?.value || 'all';
    this.currentPage = 0;
    this.applyFiltersAndPagination();
  }

  resetFilters(): void {
    this.searchForm.reset({
      query: '',
      role: 'all'
    });
    this.searchQuery = '';
    this.roleFilter = 'all';
    this.currentPage = 0;
    this.applyFiltersAndPagination();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.applyFiltersAndPagination();
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.applyFiltersAndPagination();
    }
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.applyFiltersAndPagination();
    }
  }

  addUser(): void {
    this.selectedUser = null;
    this.showForm = true;
  }

  editUser(user: User): void {
    this.selectedUser = { ...user };
    this.showForm = true;
  }

  saveUser(user: User): void {
    if (this.selectedUser) {
      const existingUser = this.userService.getUserById(this.selectedUser.id);
      if (existingUser) {
        const updatedUser: User = {
          ...user,
          storageWeight: existingUser.storageWeight
        };
        this.userService.updateUser(updatedUser);
      }
    } else {
      this.userService.addUser(user);
    }
    this.loadUsers();
    this.showForm = false;
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        this.userService.deleteUser(id);
        this.loadUsers();
      } catch (e: any) {
        alert(e.message);
      }
    }
  }

  
  cancelForm(): void {
    this.showForm = false;
  }

  get roles(): string[] {
    return ['admin', 'manager', 'employee', 'hr', 'accountant'];
  }
}