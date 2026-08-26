export type PaymentMethod = 'UPI' | 'Cash' | 'Card' | 'Wallet';

export type CategoryId =
  | 'food'
  | 'transport'
  | 'shopping'
  | 'bills'
  | 'entertainment'
  | 'health'
  | 'groceries'
  | 'other';

export type Expense = {
  id: string;
  amount: number;
  category: CategoryId | string;
  date: string; // YYYY-MM-DD
  paymentMethod: PaymentMethod | string;
  note?: string;
};

export type Budget = {
  overall: number;
  categories: Record<string, number>;
};

export type CategoryMeta = {
  id: CategoryId;
  name: string;
  icon: string;
  color: string;
};

export type ScreenType = 'home' | 'history' | 'add' | 'reports' | 'budgets' | 'settings';
