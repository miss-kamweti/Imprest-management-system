export interface Imprest {
  id: number;
  employeeName: string;
  amount: number;
  purpose: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Withdrawn' | 'Withdrawal Pending';
  createdBy: string;
  withdrawnAmount?: number;
  withdrawalDate?: string;
  withdrawalReason?: string;
  withdrawnBy?: string;
  pendingWithdrawalAmount?: number;
}