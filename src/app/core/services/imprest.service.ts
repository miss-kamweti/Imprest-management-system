import { Injectable } from '@angular/core';
import { Imprest } from '../../shared/models/imprest.model';

@Injectable({
  providedIn: 'root'
})
export class ImprestService {

  private storageKey = 'imprests';

  constructor() {}

  getImprests(): Imprest[] {
    const data = localStorage.getItem(this.storageKey);

    return data ? JSON.parse(data) : [];
  }

  addImprest(imprest: Imprest) {

    const imprests = this.getImprests();

    imprests.push(imprest);

    localStorage.setItem(
      this.storageKey,
      JSON.stringify(imprests)
    );
  }

  updateStatus(id: number, status: 'Approved' | 'Rejected') {

    const imprests = this.getImprests();

    const updated = imprests.map(imprest => {

      if (imprest.id === id) {
        return {
          ...imprest,
          status
        };
      }

      return imprest;
    });

    localStorage.setItem(
      this.storageKey,
      JSON.stringify(updated)
    );
  }

  // Get total approved amount for an employee
  getTotalApprovedImprest(employeeName: string): number {
    const imprests = this.getImprests();
    return imprests
      .filter(i => i.employeeName === employeeName && i.status === 'Approved')
      .reduce((sum, i) => sum + i.amount, 0);
  }

  // Get total withdrawn amount for an employee
  getTotalWithdrawn(employeeName: string): number {
    const imprests = this.getImprests();
    return imprests
      .filter(i => i.employeeName === employeeName && i.status === 'Withdrawn')
      .reduce((sum, i) => sum + (i.withdrawnAmount || i.amount), 0);
  }

  // Get remaining balance (approved - withdrawn)
  getRemainingBalance(employeeName: string): number {
    return this.getTotalApprovedImprest(employeeName) - this.getTotalWithdrawn(employeeName);
  }

  // Process withdrawal with reason (supports partial withdrawals)
  withdrawImprest(id: number, amount: number, reason: string, user: any) {
    const imprests = this.getImprests();
    const updated = imprests.map(imprest => {
      if (imprest.id === id) {
        const currentWithdrawn = imprest.withdrawnAmount || 0;
        const newWithdrawn = currentWithdrawn + amount;
        const newStatus = newWithdrawn >= imprest.amount ? 'Withdrawn' : 'Approved';
        return {
          ...imprest,
          status: newStatus,
          withdrawnAmount: newWithdrawn,
          withdrawalDate: new Date().toISOString(),
          withdrawalReason: reason,
          withdrawnBy: user.username
        };
      }
      return imprest;
    });
    localStorage.setItem(this.storageKey, JSON.stringify(updated));
  }

  // Submit withdrawal request for accountant approval
  submitWithdrawalRequest(id: number, amount: number, reason: string, user: any) {
    const imprests = this.getImprests();
    const updated = imprests.map(imprest => {
      if (imprest.id === id) {
        return {
          ...imprest,
          status: 'Withdrawal Pending' as const,
          pendingWithdrawalAmount: amount,
          withdrawalReason: reason,
          withdrawnBy: user.username
        };
      }
      return imprest;
    });
    localStorage.setItem(this.storageKey, JSON.stringify(updated));
  }

  // Accountant approves a pending withdrawal
  approveWithdrawal(id: number) {
    const imprests = this.getImprests();
    const updated = imprests.map(imprest => {
      if (imprest.id === id && imprest.status === 'Withdrawal Pending') {
        const currentWithdrawn = imprest.withdrawnAmount || 0;
        const newWithdrawn = currentWithdrawn + (imprest.pendingWithdrawalAmount || 0);
        const newStatus = newWithdrawn >= imprest.amount ? 'Withdrawn' : 'Approved';
        return {
          ...imprest,
          status: newStatus,
          withdrawnAmount: newWithdrawn,
          withdrawalDate: new Date().toISOString(),
          pendingWithdrawalAmount: undefined
        };
      }
      return imprest;
    });
    localStorage.setItem(this.storageKey, JSON.stringify(updated));
  }

  // Accountant rejects a pending withdrawal
  rejectWithdrawal(id: number) {
    const imprests = this.getImprests();
    const updated = imprests.map(imprest => {
      if (imprest.id === id && imprest.status === 'Withdrawal Pending') {
        return {
          ...imprest,
          status: 'Approved',
          pendingWithdrawalAmount: undefined,
          withdrawalReason: undefined,
          withdrawnBy: undefined
        };
      }
      return imprest;
    });
    localStorage.setItem(this.storageKey, JSON.stringify(updated));
  }

  // Get imprests by employee
  getImprestsByEmployee(employeeName: string): Imprest[] {
    return this.getImprests().filter(i => i.employeeName === employeeName);
  }
}