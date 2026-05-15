import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ImprestService } from 'src/app/core/services/imprest.service';
import { Imprest } from 'src/app/shared/models/imprest.model';

@Component({
  selector: 'app-imprest-modal',
  templateUrl: './imprest-modal.component.html',
  styleUrls: ['./imprest-modal.component.scss']
})
export class ImprestModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();
  @Input() type: 'pending' | 'request' | 'withdraw' | 'approved' | 'rejected' | 'actions' = 'pending';

  imprests: Imprest[] = [];
  filteredImprests: Imprest[] = [];
  currentUser = '';

  
  requestAmount = 0;
  requestPurpose = '';
  requestDate = '';

 
  selectedImprestId: number | null = null;
  withdrawAmount = 0;
  withdrawReason = '';

  constructor(private imprestService: ImprestService) {}

  ngOnInit(): void {
     const stored = localStorage.getItem('currentUser');
     this.currentUser = stored ? JSON.parse(stored).username : 'current-user';
     const isAdminOrAccountant = stored && ['admin', 'accountant'].includes(JSON.parse(stored).role?.toLowerCase());
     const allImprests = this.imprestService.getImprests();
     this.imprests = isAdminOrAccountant ? allImprests : allImprests.filter(i => i.createdBy === this.currentUser);
     this.requestDate = new Date().toISOString().split('T')[0];
     this.applyFilter();
   }

  private applyFilter(): void {
    switch (this.type) {
      case 'pending':
        this.filteredImprests = this.imprests.filter(i => i.status === 'Pending');
        break;
      case 'approved':
         this.filteredImprests = this.imprests.filter(i => i.status === 'Approved');
         break;
       case 'rejected':
         this.filteredImprests = this.imprests.filter(i => i.status === 'Rejected');
         break;
       case 'withdraw':
         this.filteredImprests = this.imprests.filter(i => i.status === 'Approved' && (i.amount - (i.withdrawnAmount || 0)) > 0);
         break;
      default:
        this.filteredImprests = [];
    }
  }

  onClose(): void {
    this.close.emit();
  }

  onSubmitRequest(): void {
    if (this.requestAmount <= 0 || !this.requestPurpose.trim()) return;
    const newId = Math.max(...this.imprests.map(i => i.id), 0) + 1;
    this.imprestService.addImprest({
      id: newId,
      employeeName: this.currentUser,
      amount: this.requestAmount,
      purpose: this.requestPurpose,
      date: this.requestDate,
      status: 'Pending',
      createdBy: this.currentUser
    });
    this.imprests = this.imprestService.getImprests();
    this.requestAmount = 0;
    this.requestPurpose = '';
    this.save.emit();
    this.close.emit();
  }

  onSubmitWithdraw(): void {
    if (!this.selectedImprestId || this.withdrawAmount <= 0 || !this.withdrawReason.trim()) return;
    this.imprestService.withdrawImprest(
      this.selectedImprestId,
      this.withdrawAmount,
      this.withdrawReason,
      { username: this.currentUser }
    );
    this.imprests = this.imprestService.getImprests();
    this.selectedImprestId = null;
    this.withdrawAmount = 0;
    this.withdrawReason = '';
    this.save.emit();
    this.close.emit();
  }

  getAvailableImprests(): Imprest[] {
    return this.imprests.filter(i => i.status === 'Approved' && (i.amount - (i.withdrawnAmount || 0)) > 0);
  }

  getSelectedImprest(): Imprest | undefined {
    return this.imprests.find(i => i.id === this.selectedImprestId);
  }

  getRemaining(): number {
    const imp = this.getSelectedImprest();
    return imp ? imp.amount - (imp.withdrawnAmount || 0) : 0;
  }
}
