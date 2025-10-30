import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Expense, Debt, Credit, MonthlyStats, FinancialInsight, ExpenseCategory } from '@/types/finance';

const STORAGE_KEYS = {
  EXPENSES: 'expenses',
  DEBTS: 'debts',
  CREDITS: 'credits',
};

export const [FinanceProvider, useFinance] = createContextHook(() => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [credits, setCredits] = useState<Credit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [expensesData, debtsData, creditsData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.EXPENSES),
        AsyncStorage.getItem(STORAGE_KEYS.DEBTS),
        AsyncStorage.getItem(STORAGE_KEYS.CREDITS),
      ]);

      if (expensesData) setExpenses(JSON.parse(expensesData));
      if (debtsData) setDebts(JSON.parse(debtsData));
      if (creditsData) setCredits(JSON.parse(creditsData));
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveExpenses = async (newExpenses: Expense[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(newExpenses));
      setExpenses(newExpenses);
    } catch (error) {
      console.error('Failed to save expenses:', error);
    }
  };

  const saveDebts = async (newDebts: Debt[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.DEBTS, JSON.stringify(newDebts));
      setDebts(newDebts);
    } catch (error) {
      console.error('Failed to save debts:', error);
    }
  };

  const saveCredits = async (newCredits: Credit[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CREDITS, JSON.stringify(newCredits));
      setCredits(newCredits);
    } catch (error) {
      console.error('Failed to save credits:', error);
    }
  };

  const addExpense = useCallback((expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    saveExpenses([newExpense, ...expenses]);
  }, [expenses]);

  const deleteExpense = useCallback((id: string) => {
    saveExpenses(expenses.filter(e => e.id !== id));
  }, [expenses]);

  const addDebt = useCallback((debt: Omit<Debt, 'id' | 'createdAt'>) => {
    const newDebt: Debt = {
      ...debt,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    saveDebts([newDebt, ...debts]);
  }, [debts]);

  const markDebtAsPaid = useCallback((id: string) => {
    saveDebts(debts.map(d => d.id === id ? { ...d, isPaid: true } : d));
  }, [debts]);

  const deleteDebt = useCallback((id: string) => {
    saveDebts(debts.filter(d => d.id !== id));
  }, [debts]);

  const addCredit = useCallback((credit: Omit<Credit, 'id' | 'createdAt'>) => {
    const newCredit: Credit = {
      ...credit,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    saveCredits([newCredit, ...credits]);
  }, [credits]);

  const markCreditAsReturned = useCallback((id: string) => {
    saveCredits(credits.map(c => c.id === id ? { ...c, isReturned: true } : c));
  }, [credits]);

  const deleteCredit = useCallback((id: string) => {
    saveCredits(credits.filter(c => c.id !== id));
  }, [credits]);

  const monthlyStats = useMemo((): MonthlyStats => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    const monthExpenses = expenses.filter(e => e.date.startsWith(currentMonth));
    const monthDebts = debts.filter(d => d.date.startsWith(currentMonth));
    const monthCredits = credits.filter(c => c.date.startsWith(currentMonth));

    const categoryBreakdown: Record<ExpenseCategory, number> = {
      food: 0,
      transport: 0,
      shopping: 0,
      entertainment: 0,
      health: 0,
      bills: 0,
      education: 0,
      other: 0,
    };

    monthExpenses.forEach(expense => {
      categoryBreakdown[expense.category] += expense.amount;
    });

    return {
      month: currentMonth,
      totalExpenses: monthExpenses.reduce((sum, e) => sum + e.amount, 0),
      totalDebts: monthDebts.reduce((sum, d) => sum + d.amount, 0),
      totalCredits: monthCredits.reduce((sum, c) => sum + c.amount, 0),
      categoryBreakdown,
    };
  }, [expenses, debts, credits]);

  const insights = useMemo((): FinancialInsight[] => {
    const results: FinancialInsight[] = [];
    const stats = monthlyStats;

    if (stats.totalExpenses > 50000) {
      results.push({
        type: 'warning',
        title: 'High Monthly Spending',
        message: `You've spent ₹${stats.totalExpenses.toLocaleString()} this month. Consider reviewing your expenses.`,
      });
    }

    const unpaidDebts = debts.filter(d => !d.isPaid);
    if (unpaidDebts.length > 0) {
      const totalUnpaid = unpaidDebts.reduce((sum, d) => sum + d.amount, 0);
      results.push({
        type: 'warning',
        title: 'Outstanding Debts',
        message: `You have ₹${totalUnpaid.toLocaleString()} in unpaid debts from ${unpaidDebts.length} person(s).`,
      });
    }

    const unreturnedCredits = credits.filter(c => !c.isReturned);
    if (unreturnedCredits.length > 0) {
      const totalUnreturned = unreturnedCredits.reduce((sum, c) => sum + c.amount, 0);
      results.push({
        type: 'tip',
        title: 'Money to Collect',
        message: `₹${totalUnreturned.toLocaleString()} is pending from ${unreturnedCredits.length} person(s).`,
      });
    }

    const topCategory = Object.entries(stats.categoryBreakdown)
      .sort(([, a], [, b]) => b - a)[0];
    
    if (topCategory && topCategory[1] > 0) {
      results.push({
        type: 'tip',
        title: 'Top Spending Category',
        message: `${topCategory[0].charAt(0).toUpperCase() + topCategory[0].slice(1)} is your highest expense at ₹${topCategory[1].toLocaleString()}.`,
      });
    }

    if (stats.totalExpenses < 10000 && expenses.length > 0) {
      results.push({
        type: 'success',
        title: 'Great Job!',
        message: 'You\'re maintaining low expenses this month. Keep it up!',
      });
    }

    return results;
  }, [monthlyStats, debts, credits, expenses]);

  return useMemo(() => ({
    expenses,
    debts,
    credits,
    isLoading,
    addExpense,
    deleteExpense,
    addDebt,
    markDebtAsPaid,
    deleteDebt,
    addCredit,
    markCreditAsReturned,
    deleteCredit,
    monthlyStats,
    insights,
  }), [expenses, debts, credits, isLoading, addExpense, deleteExpense, addDebt, markDebtAsPaid, deleteDebt, addCredit, markCreditAsReturned, deleteCredit, monthlyStats, insights]);
});

