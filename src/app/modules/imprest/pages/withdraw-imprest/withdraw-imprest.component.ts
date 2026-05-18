import { Component, OnInit } from '@angular/core';
import { ImprestService } from 'src/app/core/services/imprest.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-withdraw-imprest',
  templateUrl: './withdraw-imprest.component.html'
})
export class WithdrawImprestComponent implements OnInit {
  availableImprests: any[] = [];
  pendingWithdrawals: any[] = [];
  selectedImprest: any = null;
  withdrawal = {
    amount: 0,
    reason: ''
  };
  remainingBalance = 0;
  currentUser: any;
  isAccountant = false;
  isAdmin = false;

  constructor(private service: ImprestService, private authService: AuthService, private userService: UserService) {}

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.isAccountant = this.currentUser.role?.toLowerCase() === 'accountant';
    this.isAdmin = this.currentUser.role?.toLowerCase() === 'admin';
    this.loadAvailableImprests();
    this.loadPendingWithdrawals();
  }

  loadAvailableImprests(): void {
    const allImprests = this.service.getImprests();

    if (this.isAccountant || this.isAdmin) {
      this.availableImprests = allImprests.filter(imp => imp.status === 'Approved');
    } else {
      this.availableImprests = allImprests.filter(imp =>
        imp.createdBy === this.currentUser.username && imp.status === 'Approved'
      );
    }

    if (this.selectedImprest && !this.availableImprests.find(imp => imp.id === this.selectedImprest.id)) {
      this.selectedImprest = null;
      this.withdrawal = { amount: 0, reason: '' };
      this.remainingBalance = 0;
    } else if (this.selectedImprest) {
      this.calculateRemaining();
    }
  }

  loadPendingWithdrawals(): void {
    const allImprests = this.service.getImprests();
    const pending = allImprests.filter(imp =>
      imp.status === 'Withdrawal Pending'
    );
    // Non-admin / non-accountant users only see their own pending withdrawals
    this.pendingWithdrawals = this.isAccountant || this.isAdmin
      ? pending
      : pending.filter(imp => imp.createdBy === this.currentUser.username);
  }

  onImprestChange(): void {
    this.calculateRemaining();
    this.withdrawal = { amount: 0, reason: '' };
  }

  calculateRemaining(): void {
    if (this.selectedImprest) {
      const withdrawn = this.selectedImprest.withdrawnAmount || 0;
      this.remainingBalance = this.selectedImprest.amount - withdrawn;
    }
  }

  onAmountInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.withdrawal.amount = input.valueAsNumber;
  }

  onReasonInput(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.withdrawal.reason = textarea.value;
  }

  submit(): void {
    if (!this.selectedImprest) {
      alert('Please select an imprest');
      return;
    }
    const amount = Number(this.withdrawal.amount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount greater than 0');
      return;
    }
    if (amount > this.remainingBalance) {
      alert('Amount exceeds remaining balance');
      return;
    }
    if (!this.withdrawal.reason || this.withdrawal.reason.length < 10) {
      alert('Please provide a detailed reason (minimum 10 characters)');
      return;
    }

    if (this.isAccountant || this.isAdmin) {
      this.service.withdrawImprest(
        this.selectedImprest.id,
        amount,
        this.withdrawal.reason,
        this.currentUser
      );
      this.userService.recordUserActivity(this.currentUser.username);
      alert('Withdrawal approved and processed successfully');
    } else {
      this.service.submitWithdrawalRequest(
        this.selectedImprest.id,
        amount,
        this.withdrawal.reason,
        this.currentUser
      );
      this.userService.recordUserActivity(this.currentUser.username);
      alert('Withdrawal request submitted for approval');
    }

    this.withdrawal = { amount: 0, reason: '' };
    this.loadAvailableImprests();
    this.loadPendingWithdrawals();
  }

  approveWithdrawal(imprestId: number): void {
    this.service.approveWithdrawal(imprestId);
    this.userService.recordUserActivity(this.currentUser.username);
    this.loadPendingWithdrawals();
    this.loadAvailableImprests();
  }

  rejectWithdrawal(imprestId: number): void {
    this.service.rejectWithdrawal(imprestId);
    this.userService.recordUserActivity(this.currentUser.username);
    this.loadPendingWithdrawals();
    this.loadAvailableImprests();
  }
}
