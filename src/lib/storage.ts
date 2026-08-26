import AsyncStorage from '@react-native-async-storage/async-storage';
import { Budget, Expense } from '../types';

const STORAGE_KEYS = {
  EXPENSES: '@ledger_expenses',
  BUDGETS: '@ledger_budgets',
  THEME: '@ledger_theme',
};

const getDemoExpenses = (): Expense[] => {
  const d = (daysAgo: number) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().slice(0, 10);
  };

  return [
    { id: '1', amount: 320, category: 'food', date: d(0), paymentMethod: 'UPI', note: 'Lunch with team' },
    { id: '2', amount: 150, category: 'transport', date: d(0), paymentMethod: 'Cash', note: 'Auto rickshaw' },
    { id: '3', amount: 2400, category: 'shopping', date: d(1), paymentMethod: 'Card', note: 'Weekend groceries & shirt' },
    { id: '4', amount: 899, category: 'bills', date: d(2), paymentMethod: 'UPI', note: 'WiFi broadband' },
    { id: '5', amount: 450, category: 'entertainment', date: d(3), paymentMethod: 'Wallet', note: 'Cinema tickets' },
    { id: '6', amount: 550, category: 'health', date: d(5), paymentMethod: 'UPI', note: 'Pharmacy vitamins' },
    { id: '7', amount: 1200, category: 'groceries', date: d(6), paymentMethod: 'Card', note: 'Weekly veggies' },
  ];
};

export const storage = {
  async loadExpenses(): Promise<Expense[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.EXPENSES);
      if (data) return JSON.parse(data);
      const initial = getDemoExpenses();
      await AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(initial));
      return initial;
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
      return data ? JSON.parse(data) : { overall: 15000, categories: { food: 5000, transport: 2000, shopping: 4000 } };
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
