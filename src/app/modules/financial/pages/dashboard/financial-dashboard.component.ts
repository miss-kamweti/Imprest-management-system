import { Component, OnInit } from '@angular/core';
import { ImprestService } from '../../../../core/services/imprest.service';
import { Imprest } from '../../../../shared/models/imprest.model';

interface DisplayImprest {
  employeeName: string;
  amount: number;
  formattedAmount: string;
  purpose: string;
  date: string;
  status: string;
  statusClass: string;
  pendingWithdrawalAmount?: number;
  formattedPendingAmount?: string;
  withdrawalReason?: string;
  id: number;
}

@Component({
  selector: 'app-financial-dashboard',
  templateUrl: './financial-dashboard.component.html',
  styleUrls: ['./financial-dashboard.component.scss']
})
export class FinancialDashboardComponent implements OnInit {

  totalImprests = 0;
  approvedAmount = 0;
  formattedApprovedAmount = '0';
  pendingRequests = 0;
  totalWithdrawn = 0;
  pendingWithdrawals = 0;
  recentImprests: DisplayImprest[] = [];
  pendingWithdrawalList: DisplayImprest[] = [];

  currentUser: any;

  constructor(private service: ImprestService) { }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.loadData();
  }

  private formatNumber(n: number): string {
    return n.toLocaleString('en-US');
  }

  private getStatusClass(status: string): string {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Withdrawn': return 'bg-blue-100 text-blue-800';
      case 'Withdrawal Pending': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  private formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  loadData(): void {
    const data: Imprest[] = this.service.getImprests();

    this.totalImprests = data.length;

    this.approvedAmount = data
      .filter((d: Imprest) => d.status === 'Approved')
      .reduce((sum: number, d: Imprest) => sum + d.amount, 0);
    this.formattedApprovedAmount = this.formatNumber(this.approvedAmount);

    this.pendingRequests = data.filter((d: Imprest) => d.status === 'Pending').length;

    this.totalWithdrawn = data
      .filter((d: Imprest) => d.status === 'Withdrawn')
      .reduce((sum: number, d: Imprest) => sum + (d.withdrawnAmount || d.amount || 0), 0);

    this.pendingWithdrawals = data.filter((d: Imprest) => d.status === 'Withdrawal Pending').length;

    this.pendingWithdrawalList = data
      .filter((d: Imprest) => d.status === 'Withdrawal Pending')
      .map((d: Imprest) => ({
        id: d.id,
        employeeName: d.employeeName,
        amount: d.amount,
        formattedAmount: this.formatNumber(d.amount),
        purpose: d.purpose,
        date: this.formatDate(d.date),
        status: d.status,
        statusClass: this.getStatusClass(d.status),
        pendingWithdrawalAmount: d.pendingWithdrawalAmount,
        formattedPendingAmount: this.formatNumber(d.pendingWithdrawalAmount || 0),
        withdrawalReason: d.withdrawalReason
      }));

    this.recentImprests = [...data]
      .sort((a: Imprest, b: Imprest) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10)
      .map((d: Imprest) => ({
        id: d.id,
        employeeName: d.employeeName,
        amount: d.amount,
        formattedAmount: this.formatNumber(d.amount),
        purpose: d.purpose,
        date: this.formatDate(d.date),
        status: d.status,
        statusClass: this.getStatusClass(d.status)
      }));
  }

  approveWithdrawal(id: number): void {
    this.service.approveWithdrawal(id);
    this.loadData();
  }

  rejectWithdrawal(id: number): void {
    this.service.rejectWithdrawal(id);
    this.loadData();
  }
}