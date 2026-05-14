export type LeaveStatus = 'pending' | 'approved' | 'rejected';
export type LeaveType = 'annual' | 'sick' | 'emergency' | 'maternity' | 'paternity';

export interface Employee {
  id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department: string;
  position: string;
  hireDate: string;
  salary: number;
  status: 'active' | 'inactive' | 'terminated';
  managerId?: number;
}

export interface LeaveRequest {
  id: number;
  employeeId: number;
  employeeName: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  approvedBy?: string;
  approvedDate?: string;
}

export interface Payroll {
  id: number;
  employeeId: number;
  period: string;
  grossSalary: number;
  deductions: Deduction[];
  netSalary: number;
  status: 'draft' | 'processed' | 'paid';
}

export interface Deduction {
  name: string;
  amount: number;
  type: 'tax' | 'insurance' | 'loan' | 'other';
}