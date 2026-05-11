import { Component, OnInit } from '@angular/core';
import { ImprestService } from 'src/app/services/imprest.service';

@Component({
  selector: 'app-imprest-list',
  templateUrl: './imprest-list.component.html'
})
export class ImprestListComponent implements OnInit {

  imprests: any[] = [];
  isAdmin = false;
  currentUser: any;

  constructor(private service: ImprestService) {}

  ngOnInit(): void {

    this.currentUser = JSON.parse(
      localStorage.getItem('currentUser') || '{}'
    );

    this.isAdmin = this.currentUser.role === 'admin';

    this.loadImprests();
  }

  loadImprests(): void {

    const data = this.service.getImprests();

    // ADMIN SEES EVERYTHING
    if (this.isAdmin) {
      this.imprests = data;
    }

    // EMPLOYEE SEES ONLY OWN
    else {
      this.imprests = data.filter(
        x => x.createdBy === this.currentUser.username
      );
    }
  }

  approve(id: number): void {
    this.service.updateStatus(id, 'Approved');
    this.loadImprests();
  }

  reject(id: number): void {
    this.service.updateStatus(id, 'Rejected');
    this.loadImprests();
  }
}