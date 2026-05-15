import { Component, OnInit } from '@angular/core';
import { ImprestService } from '../../../core/services/imprest.service';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {


  totalImprests = 0;
  approvedImprests = 0;
  pendingImprests = 0;
  rejectedImprests = 0;
  withdrawnImprests = 0;
  totalApprovedAmount = 0;
  totalPendingAmount = 0;
  totalWithdrawnAmount = 0;
  recentImprests: any[] = [];


  users: User[] = [];
  activeUsers = 0;
  inactiveUsers = 0;

  pieGradient = '';

  user: any;
  isAdmin = false;
  isEmployee = false;

  constructor(
    private service: ImprestService,
    private userService: UserService
  ) {}

  ngOnInit(): void {

    this.user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.isAdmin = this.user.role?.toLowerCase() === 'admin';
    this.isEmployee = this.user.role?.toLowerCase() === 'employee';

    const data = this.service.getImprests();

    const relevantImprests = this.isAdmin
      ? data
      : data.filter(d => d.createdBy === this.user.username);

    
    this.totalImprests = relevantImprests.length;
    this.approvedImprests = relevantImprests.filter(d => d.status === 'Approved').length;
    this.pendingImprests = relevantImprests.filter(d => d.status === 'Pending').length;
    this.rejectedImprests = relevantImprests.filter(d => d.status === 'Rejected').length;
    this.withdrawnImprests = relevantImprests.filter(d => d.status === 'Withdrawn').length;

    this.totalApprovedAmount = relevantImprests
      .filter(d => d.status === 'Approved')
      .reduce((sum, d) => sum + (d.amount || 0), 0);

    this.totalPendingAmount = relevantImprests
      .filter(d => d.status === 'Pending')
      .reduce((sum, d) => sum + (d.amount || 0), 0);

    this.totalWithdrawnAmount = relevantImprests
      .filter(d => d.status === 'Withdrawn')
      .reduce((sum, d) => sum + (d.withdrawnAmount || d.amount || 0), 0);

  
    this.recentImprests = [...relevantImprests]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

   
    if (this.isAdmin) {
       const allUsers = this.userService.getUsers();
       this.activeUsers = allUsers.filter(u => u.status === 'active').length;
       this.inactiveUsers = allUsers.filter(u => u.status === 'inactive').length;
       this.users = allUsers.slice(0, 5);
     }

     this.calculatePieGradient();
   }

   calculatePieGradient(): void {
      const total = this.totalImprests || 1;
      const approved = (this.approvedImprests / total) * 100;
      const pending = (this.pendingImprests / total) * 100;
      const rejected = (this.rejectedImprests / total) * 100;
      const withdrawn = (this.withdrawnImprests / total) * 100;

      const segments: string[] = [];
      let current = 0;

      if (approved > 0) {
        segments.push(`#22c55e ${current}deg ${current + approved}deg`);
        current += approved;
      }
      if (pending > 0) {
        segments.push(`#eab308 ${current}deg ${current + pending}deg`);
        current += pending;
      }
      if (rejected > 0) {
        segments.push(`#ef4444 ${current}deg ${current + rejected}deg`);
        current += rejected;
      }
      if (withdrawn > 0) {
        segments.push(`#3b82f6 ${current}deg ${current + withdrawn}deg`);
      }

      this.pieGradient = `conic-gradient(${segments.join(', ')})`;
    }
}