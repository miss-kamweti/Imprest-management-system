import { Component, OnInit } from '@angular/core';
import { ImprestService } from '../../../services/imprest.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  total = 0;
  approved = 0;
  pending = 0;
  rejected = 0;

  user: any;

  constructor(private service: ImprestService) {}

  ngOnInit(): void {

    this.user = JSON.parse(localStorage.getItem('currentUser') || '{}');

    const data = this.service.getImprests();

    // ADMIN VIEW
    if (this.user.role === 'admin') {

      this.total = data.length;

      this.approved = data.filter(d =>
        (d.status || '').toLowerCase().trim() === 'approved'
      ).length;

      this.pending = data.filter(d =>
        (d.status || '').toLowerCase().trim() === 'pending'
      ).length;

      this.rejected = data.filter(d =>
        (d.status || '').toLowerCase().trim() === 'rejected'
      ).length;
    }

    // EMPLOYEE VIEW (ONLY THEIR OWN)
    else {

      const mine = data.filter(d =>
        d.createdBy === this.user.username
      );

      this.total = mine.length;

      this.approved = mine.filter(d =>
        (d.status || '').toLowerCase().trim() === 'approved'
      ).length;

      this.pending = mine.filter(d =>
        (d.status || '').toLowerCase().trim() === 'pending'
      ).length;

      this.rejected = mine.filter(d =>
        (d.status || '').toLowerCase().trim() === 'rejected'
      ).length;
    }
  }
}