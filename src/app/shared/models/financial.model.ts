export type AccountType = 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';

export interface Account {
  code: string;
  name: string;
  type: AccountType;
  balance: number;
  parentId?: string;
  isActive: boolean;
}

export interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
  accountId: string;
  reference?: string;
  createdBy: string;
}

export interface JournalEntry {
  id: number;
  date: string;
  description: string;
  transactions: Transaction[];
  reference?: string;
  status: 'draft' | 'posted' | 'cancelled';
  createdBy: string;
}