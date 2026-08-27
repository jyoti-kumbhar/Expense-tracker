import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { storage } from '../lib/storage';
import { syncHomeWidget } from '../lib/widgetSync';
import { Budget, Expense } from '../types';

interface ExpenseContextType {
  expenses: Expense[];
  budgets: Budget;
  isDark: boolean;
  loading: boolean;
  editingExpense: Expense | null;
  setEditingExpense: (expense: Expense | null) => void;
  addExpense: (data: Omit<Expense, 'id'>) => Promise<boolean>;
  updateExpense: (id: string, data: Partial<Expense>) => Promise<boolean>;
  deleteExpense: (id: string) => Promise<boolean>;
  updateBudgets: (newBudgets: Budget) => Promise<void>;
  toggleTheme: () => void;
  clearAllData: () => Promise<void>;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget>({ overall: 0, categories: {} });
  const [isDark, setIsDark] = useState<boolean>(systemScheme === 'dark');
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const [storedExpenses, storedBudgets, storedTheme] = await Promise.all([
        storage.loadExpenses(),
        storage.loadBudgets(),
        storage.loadTheme(),
      ]);
      setExpenses(storedExpenses);
      setBudgets(storedBudgets);
      if (storedTheme) {
        setIsDark(storedTheme === 'dark');
      }
      setLoading(false);
      syncHomeWidget();
    })();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const addExpense = async (data: Omit<Expense, 'id'>): Promise<boolean> => {
    if (!data.amount || data.amount <= 0) {
      showToast('Please enter a valid amount');
      return false;
    }
    const newExpense: Expense = {
      ...data,
      id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
    };
    const updated = [newExpense, ...expenses];
    setExpenses(updated);
    await storage.saveExpenses(updated);
    syncHomeWidget();
    showToast('Expense added');
    return true;
  };

  const updateExpense = async (id: string, data: Partial<Expense>): Promise<boolean> => {
    if (data.amount !== undefined && data.amount <= 0) {
      showToast('Please enter a valid amount');
      return false;
    }
    const updated = expenses.map(e => (e.id === id ? { ...e, ...data } : e));
    setExpenses(updated);
    await storage.saveExpenses(updated);
    syncHomeWidget();
    showToast('Expense updated');
    return true;
  };

  const deleteExpense = async (id: string): Promise<boolean> => {
    const updated = expenses.filter(e => e.id !== id);
    setExpenses(updated);
    await storage.saveExpenses(updated);
    syncHomeWidget();
    showToast('Expense deleted');
    return true;
  };

  const updateBudgets = async (newBudgets: Budget): Promise<void> => {
    setBudgets(newBudgets);
    await storage.saveBudgets(newBudgets);
    syncHomeWidget();
    showToast('Budgets saved');
  };

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    storage.saveTheme(next ? 'dark' : 'light');
  };

  const clearAllData = async () => {
    setExpenses([]);
    setBudgets({ overall: 0, categories: {} });
    await storage.clearAll();
    syncHomeWidget();
    showToast('All data cleared');
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        budgets,
        isDark,
        loading,
        editingExpense,
        setEditingExpense,
        addExpense,
        updateExpense,
        deleteExpense,
        updateBudgets,
        toggleTheme,
        clearAllData,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) throw new Error('useExpenses must be used within ExpenseProvider');
  return context;
};
