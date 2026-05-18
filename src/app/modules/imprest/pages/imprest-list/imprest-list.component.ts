import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImprestService } from 'src/app/core/services/imprest.service';

@Component({
  selector: 'app-imprest-list',
  templateUrl: './imprest-list.component.html'
})
export class ImprestListComponent implements OnInit {

  imprests: any[] = [];
  isAdmin = false;
  isAccountant = false;
  currentUser: any;

  totalCount = 0;
  pendingCount = 0;
  approvedCount = 0;
  rejectedCount = 0;

  showModal = false;
  modalType: 'actions' | 'request' | 'withdraw' | 'approved' | 'pending' | 'rejected' = 'actions';

  constructor(private service: ImprestService, private router: Router) {}

  ngOnInit(): void {

    this.currentUser = JSON.parse(
      localStorage.getItem('currentUser') || '{}'
    );

    this.isAdmin = this.currentUser.role?.toLowerCase() === 'admin';
    this.isAccountant = this.currentUser.role?.toLowerCase() === 'accountant';

    this.loadImprests();
  }

  openActionsModal() {
    this.modalType = 'actions';
    this.showModal = true;
  }

  openModal(type: 'request' | 'withdraw' | 'approved' | 'pending' | 'rejected') {
    this.modalType = type;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  loadImprests(): void {

    const data = this.service.getImprests();

    // ADMIN & ACCOUNTANT SEE EVERYTHING
    if (this.isAdmin || this.isAccountant) {
      this.imprests = data;
    }

    // EMPLOYEE SEES ONLY OWN
    else {
      this.imprests = data.filter(
        x => x.createdBy === this.currentUser.username
      );
    }

    this.updateCounts();
  }

  private updateCounts(): void {
    this.totalCount = this.imprests.length;
    this.pendingCount = this.imprests.filter(i => i.status === 'Pending').length;
    this.approvedCount = this.imprests.filter(i => i.status === 'Approved').length;
    this.rejectedCount = this.imprests.filter(i => i.status === 'Rejected').length;
  }

  approve(id: number): void {
     if (confirm('Are you sure you want to approve this imprest request?')) {
       this.service.updateStatus(id, 'Approved');
       this.loadImprests();
     }
   }

   reject(id: number): void {
     if (confirm('Are you sure you want to reject this imprest request?')) {
       this.service.updateStatus(id, 'Rejected');
       this.loadImprests();
     }
   }

  // Calculate remaining balance for an imprest
  getRemainingForImprest(imprest: any): number {
    return imprest.amount - (imprest.withdrawnAmount || 0);
  }

  // Check if imprest can be withdrawn
  canWithdraw(imprest: any): boolean {
    return imprest.status === 'Approved' && this.getRemainingForImprest(imprest) > 0;
  }

  // Navigate to withdraw page
   navigateToWithdraw(imprest: any): void {
     this.router.navigate(['/withdraw-imprest']);
   }
}