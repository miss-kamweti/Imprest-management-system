import { Injectable } from '@angular/core';
import { Imprest } from '../models/imprest.model';

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
}