export type ExpenseCategory = 
  | 'food'
  | 'transport'
  | 'shopping'
  | 'entertainment'
  | 'health'
  | 'bills'
  | 'education'
  | 'other';

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;
  createdAt: string;
}

export interface Debt {
  id: string;
  personName: string;
  amount: number;
  description: string;
  date: string;
  isPaid: boolean;
  createdAt: string;
}

export interface Credit {
  id: string;
  personName: string;
  amount: number;
  description: string;
  date: string;
  isReturned: boolean;
  createdAt: string;
}

export interface MonthlyStats {
  month: string;
  totalExpenses: number;
  totalDebts: number;
  totalCredits: number;
  categoryBreakdown: Record<ExpenseCategory, number>;
}

export interface FinancialInsight {
  type: 'warning' | 'tip' | 'success';
  title: string;
  message: string;
}
