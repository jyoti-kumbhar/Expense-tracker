import AsyncStorage from '@react-native-async-storage/async-storage';
import { Budget, Expense } from '../types';

const STORAGE_KEYS = {
  EXPENSES: '@ledger_expenses',
  BUDGETS: '@ledger_budgets',
  THEME: '@ledger_theme',
};

export const storage = {
  async loadExpenses(): Promise<Expense[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.EXPENSES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async saveExpenses(expenses: Expense[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    } catch (e) {
      console.error('Failed to save expenses', e);
    }
  },

  async loadBudgets(): Promise<Budget> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.BUDGETS);
      return data ? JSON.parse(data) : { overall: 0, categories: {} };
    } catch {
      return { overall: 0, categories: {} };
    }
  },

  async saveBudgets(budgets: Budget): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
    } catch (e) {
      console.error('Failed to save budgets', e);
    }
  },

  async loadTheme(): Promise<'light' | 'dark' | null> {
    try {
      return (await AsyncStorage.getItem(STORAGE_KEYS.THEME)) as 'light' | 'dark' | null;
    } catch {
      return null;
    }
  },

  async saveTheme(theme: 'light' | 'dark'): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (e) {
      console.error('Failed to save theme', e);
    }
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.EXPENSES, STORAGE_KEYS.BUDGETS]);
    } catch (e) {
      console.error('Failed to clear storage', e);
    }
  },
};
