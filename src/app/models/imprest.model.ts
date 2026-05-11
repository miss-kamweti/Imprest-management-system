export interface Imprest {
  id: number;
  employeeName: string;
  amount: number;
  purpose: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdBy: string;
}