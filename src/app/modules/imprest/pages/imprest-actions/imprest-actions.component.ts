import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { ImprestService } from 'src/app/core/services/imprest.service';
import { Imprest } from 'src/app/shared/models/imprest.model';

@Component({
  selector: 'app-imprest-actions',
  templateUrl: './imprest-actions.component.html',
  styleUrls: ['./imprest-actions.component.scss']
})
export class ImprestActionsComponent implements OnInit {
  // Inline view state (replaces modal popup)
  selectedView: 'none' | 'request' | 'pending' | 'approved' | 'rejected' | 'withdraw' = 'none';

  allImprests: Imprest[] = [];
  pendingImprests: Imprest[] = [];
  approvedImprests: Imprest[] = [];
  rejectedImprests: Imprest[] = [];

  currentUser = '';
  isAdminOrAccountant = false;

  // Request form fields
  requestAmount = 0;
  requestPurpose = '';
  requestDate = '';

  // Withdraw form fields
  selectedImprestId: number | null = null;
  withdrawAmount = 0;
  withdrawReason = '';

  constructor(
    private router: Router,
    public auth: AuthService,
    private imprestService: ImprestService
  ) {}

  ngOnInit(): void {
    const stored = localStorage.getItem('currentUser');
    this.currentUser = stored ? JSON.parse(stored).username : '';
    const role = stored ? JSON.parse(stored).role?.toLowerCase() : '';
    this.isAdminOrAccountant = ['admin', 'accountant'].includes(role);
    this.requestDate = new Date().toISOString().split('T')[0];
    this.loadImprests();
  }

  loadImprests(): void {
    this.allImprests = this.imprestService.getImprests();
    const filtered = this.isAdminOrAccountant
      ? this.allImprests
      : this.allImprests.filter(i => i.createdBy === this.currentUser);

    this.pendingImprests = filtered.filter(i => i.status === 'Pending');
    this.approvedImprests = filtered.filter(i => i.status === 'Approved');
    this.rejectedImprests = filtered.filter(i => i.status === 'Rejected');
  }

  // Inline view toggle (replaces openModal / closeModal)
  selectView(view: 'request' | 'pending' | 'approved' | 'rejected' | 'withdraw'): void {
    this.selectedView = this.selectedView === view ? 'none' : view;
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  // --- Request Imprest ---
  onSubmitRequest(): void {
    if (this.requestAmount <= 0 || !this.requestPurpose.trim()) return;
    const newId = Math.max(...this.allImprests.map(i => i.id), 0) + 1;
    this.imprestService.addImprest({
      id: newId,
      employeeName: this.currentUser,
      amount: this.requestAmount,
      purpose: this.requestPurpose,
      date: this.requestDate,
      status: 'Pending',
      createdBy: this.currentUser
    });
    this.requestAmount = 0;
    this.requestPurpose = '';
    this.requestDate = new Date().toISOString().split('T')[0];
    this.loadImprests();
    this.selectedView = 'none';
  }

  // --- Withdraw Imprest ---
  getAvailableImprests(): Imprest[] {
    return this.allImprests.filter(
      i => i.status === 'Approved' && (i.amount - (i.withdrawnAmount || 0)) > 0
    );
  }

  getSelectedImprest(): Imprest | undefined {
    return this.allImprests.find(i => i.id === this.selectedImprestId);
  }

  getRemaining(imp?: Imprest): number {
    const target = imp || this.getSelectedImprest();
    if (!target) return 0;
    return target.amount - (target.withdrawnAmount || 0);
  }

  onSubmitWithdraw(): void {
    if (!this.selectedImprestId || this.withdrawAmount <= 0 || !this.withdrawReason.trim()) return;
    this.imprestService.withdrawImprest(
      this.selectedImprestId,
      this.withdrawAmount,
      this.withdrawReason,
      { username: this.currentUser }
    );
    this.selectedImprestId = null;
    this.withdrawAmount = 0;
    this.withdrawReason = '';
    this.loadImprests();
    this.selectedView = 'none';
  }

  onWithdrawImprestChange(): void {
    this.withdrawAmount = 0;
    this.withdrawReason = '';
  }
}
