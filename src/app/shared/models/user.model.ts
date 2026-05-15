export type UserRole = 'admin' | 'manager' | 'employee' | 'hr' | 'accountant';
export type UserStatus = 'active' | 'inactive' | 'archived';

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  permissions: string[];
  department?: string;
  status: UserStatus;
  createdAt?: string;
  updatedAt?: string;
  lastActivity?: string;
  isArchived?: boolean;
  storageWeight?: number;
}