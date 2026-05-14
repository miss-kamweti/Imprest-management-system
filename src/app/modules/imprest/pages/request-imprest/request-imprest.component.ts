import { Component } from '@angular/core';
import { ImprestService } from 'src/app/core/services/imprest.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-request-imprest',
  templateUrl: './request-imprest.component.html'
})
export class RequestImprestComponent {

  imprest = {
    employeeName: '',
    amount: 0,
    purpose: ''
  };

  constructor(private service: ImprestService, private userService: UserService) {}

  submit(): void {

    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');

    const newImprest = {
      id: Date.now(),
      employeeName: this.imprest.employeeName,
      amount: this.imprest.amount,
      purpose: this.imprest.purpose,
      date: new Date().toISOString(),
      status: 'Pending' as 'Pending',
      createdBy: user.username
    };

    this.service.addImprest(newImprest);

    // Track user activity
    this.userService.recordUserActivity(user.username);

    this.imprest = { employeeName: '', amount: 0, purpose: '' };
  }
}