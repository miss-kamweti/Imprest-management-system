import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User, UserRole, UserStatus } from '../../../../shared/models/user.model';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit {
  @Input() user: User | null = null;
  @Output() save = new EventEmitter<User>();
  @Output() cancel = new EventEmitter<void>();

  userForm: FormGroup;
  roles: UserRole[] = ['admin', 'manager', 'employee', 'hr', 'accountant'];
  statusOptions: UserStatus[] = ['active', 'inactive'];

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['employee', Validators.required],
      department: [''],
      status: ['active', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.user) {
      this.userForm.patchValue({
        username: this.user.username,
        email: this.user.email,
        role: this.user.role,
        department: this.user.department,
        status: this.user.status === 'archived' ? 'inactive' : this.user.status
      });
    }
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      const userData: User = {
        id: this.user?.id || 0,
        username: formValue.username,
        email: formValue.email,
        password: this.user?.password || 'default123',
        role: formValue.role,
        department: formValue.department,
        status: formValue.status,
        permissions: this.user?.permissions || [],
        isArchived: this.user?.isArchived || false,
        lastActivity: this.user?.lastActivity,
        createdAt: this.user?.createdAt
      };
      this.save.emit(userData);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}