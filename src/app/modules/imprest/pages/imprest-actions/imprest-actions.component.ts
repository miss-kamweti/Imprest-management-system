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
  showModal = false;
  modalType: 'request' | 'pending' | 'approved' | 'rejected' | 'withdraw' = 'request';

  allImprests: Imprest[] = [];
  pendingImprests: Imprest[] = [];
  approvedImprests: Imprest[] = [];
  rejectedImprests: Imprest[] = [];

  currentUser = '';
  isAdminOrAccountant = false;

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

  openModal(type: 'request' | 'pending' | 'approved' | 'rejected' | 'withdraw'): void {
     this.modalType = type;
     this.showModal = true;
   }

   closeModal(): void {
     this.showModal = false;
   }

   goBack(): void {
     this.router.navigate(['/dashboard']);
   }
}
