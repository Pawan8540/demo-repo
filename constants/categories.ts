import { ExpenseCategory } from '@/types/finance';

export const EXPENSE_CATEGORIES: {
  id: ExpenseCategory;
  label: string;
  icon: string;
  color: string;
}[] = [
  { id: 'food', label: 'Food & Dining', icon: 'utensils', color: '#FF6B6B' },
  { id: 'transport', label: 'Transport', icon: 'car', color: '#4ECDC4' },
  { id: 'shopping', label: 'Shopping', icon: 'shopping-bag', color: '#45B7D1' },
  { id: 'entertainment', label: 'Entertainment', icon: 'tv', color: '#96CEB4' },
  { id: 'health', label: 'Health', icon: 'heart', color: '#FFEAA7' },
  { id: 'bills', label: 'Bills', icon: 'file-text', color: '#DFE6E9' },
  { id: 'education', label: 'Education', icon: 'book', color: '#A29BFE' },
  { id: 'other', label: 'Other', icon: 'more-horizontal', color: '#B2BEC3' },
];

export const getCategoryInfo = (categoryId: ExpenseCategory) => {
  return EXPENSE_CATEGORIES.find(cat => cat.id === categoryId) || EXPENSE_CATEGORIES[7];
};
