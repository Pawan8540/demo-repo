import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Expense, Debt, Credit } from '../types/finance';

interface FinanceContextType {
  expenses: Expense[];
  debts: Debt[];
  credits: Credit[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  addDebt: (debt: Omit<Debt, 'id'>) => void;
  addCredit: (credit: Omit<Credit, 'id'>) => void;
  deleteExpense: (id: string) => void;
  deleteDebt: (id: string) => void;
  deleteCredit: (id: string) => void;
  getTotalExpenses: () => number;
  getTotalDebts: () => number;
  getTotalCredits: () => number;
  getMonthlyExpenses: () => number;
  getMonthlyStats: () => { expenses: number; debts: number; credits: number };
  getFinancialInsights: () => string[];
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const STORAGE_KEYS = {
  EXPENSES: '@finance_expenses',
  DEBTS: '@finance_debts',
  CREDITS: '@finance_credits',
};

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [credits, setCredits] = useState<Credit[]>([]);

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
      console.error('Error loading data:', error);
    }
  };

  const saveExpenses = async (newExpenses: Expense[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(newExpenses));
      setExpenses(newExpenses);
    } catch (error) {
      console.error('Error saving expenses:', error);
    }
  };

  const saveDebts = async (newDebts: Debt[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.DEBTS, JSON.stringify(newDebts));
      setDebts(newDebts);
    } catch (error) {
      console.error('Error saving debts:', error);
    }
  };

  const saveCredits = async (newCredits: Credit[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CREDITS, JSON.stringify(newCredits));
      setCredits(newCredits);
    } catch (error) {
      console.error('Error saving credits:', error);
    }
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
    };
    saveExpenses([...expenses, newExpense]);
  };

  const addDebt = (debt: Omit<Debt, 'id'>) => {
    const newDebt: Debt = {
      ...debt,
      id: Date.now().toString(),
    };
    saveDebts([...debts, newDebt]);
  };

  const addCredit = (credit: Omit<Credit, 'id'>) => {
    const newCredit: Credit = {
      ...credit,
      id: Date.now().toString(),
    };
    saveCredits([...credits, newCredit]);
  };

  const deleteExpense = (id: string) => {
    saveExpenses(expenses.filter((e) => e.id !== id));
  };

  const deleteDebt = (id: string) => {
    saveDebts(debts.filter((d) => d.id !== id));
  };

  const deleteCredit = (id: string) => {
    saveCredits(credits.filter((c) => c.id !== id));
  };

  const getTotalExpenses = () => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getTotalDebts = () => {
    return debts.reduce((sum, debt) => sum + debt.amount, 0);
  };

  const getTotalCredits = () => {
    return credits.reduce((sum, credit) => sum + credit.amount, 0);
  };

  const getMonthlyExpenses = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getMonthlyStats = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyExpenses = expenses
      .filter((e) => {
        const date = new Date(e.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .reduce((sum, e) => sum + e.amount, 0);

    const monthlyDebts = debts
      .filter((d) => {
        const date = new Date(d.dueDate);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .reduce((sum, d) => sum + d.amount, 0);

    const monthlyCredits = credits
      .filter((c) => {
        const date = new Date(c.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .reduce((sum, c) => sum + c.amount, 0);

    return {
      expenses: monthlyExpenses,
      debts: monthlyDebts,
      credits: monthlyCredits,
    };
  };

  const getFinancialInsights = (): string[] => {
    const insights: string[] = [];
    const monthlyExpenses = getMonthlyExpenses();
    const totalDebts = getTotalDebts();
    const totalCredits = getTotalCredits();

    if (monthlyExpenses > 5000) {
      insights.push('Your monthly expenses are high. Consider budgeting.');
    }

    if (totalDebts > totalCredits) {
      insights.push('You have more debts than credits. Focus on paying off debts.');
    }

    if (expenses.length > 0) {
      const avgExpense = getTotalExpenses() / expenses.length;
      insights.push(`Your average expense is $${avgExpense.toFixed(2)}`);
    }

    return insights;
  };

  return (
    <FinanceContext.Provider
      value={{
        expenses,
        debts,
        credits,
        addExpense,
        addDebt,
        addCredit,
        deleteExpense,
        deleteDebt,
        deleteCredit,
        getTotalExpenses,
        getTotalDebts,
        getTotalCredits,
        getMonthlyExpenses,
        getMonthlyStats,
        getFinancialInsights,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
