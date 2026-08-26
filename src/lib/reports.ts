import { Expense } from '../types';

export const formatCurrency = (amount: number): string =>
  `₹${Math.round(amount || 0).toLocaleString('en-IN')}`;

const getTodayString = (): string => new Date().toISOString().slice(0, 10);
const getCurrentMonthString = (): string => new Date().toISOString().slice(0, 7);

export const calculateMonthTotal = (expenses: Expense[], yearMonth = getCurrentMonthString()): number =>
  expenses
    .filter(e => e.date?.startsWith(yearMonth))
    .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

export const calculateTodayTotal = (expenses: Expense[], today = getTodayString()): number =>
  expenses
    .filter(e => e.date === today)
    .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

export const calculateDailyAverage = (expenses: Expense[], yearMonth = getCurrentMonthString()): number => {
  const currentMonthExpenses = expenses.filter(e => e.date?.startsWith(yearMonth));
  if (currentMonthExpenses.length === 0) return 0;
  const currentDay = yearMonth === getCurrentMonthString() ? new Date().getDate() : 30;
  const total = currentMonthExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  return Math.round(total / Math.max(1, currentDay));
};

export const calculateCategoryTotals = (
  expenses: Expense[],
  yearMonth = getCurrentMonthString()
): Record<string, number> => {
  const filtered = expenses.filter(e => e.date?.startsWith(yearMonth));
  return filtered.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + (Number(e.amount) || 0);
    return acc;
  }, {} as Record<string, number>);
};

export const calculateYearlyTotals = (
  expenses: Expense[]
): { year: string; total: number; count: number }[] => {
  const map: Record<string, { total: number; count: number }> = {};
  expenses.forEach(e => {
    const year = e.date ? e.date.slice(0, 4) : new Date().getFullYear().toString();
    if (!map[year]) map[year] = { total: 0, count: 0 };
    map[year].total += Number(e.amount) || 0;
    map[year].count += 1;
  });

  return Object.entries(map)
    .map(([year, data]) => ({ year, total: data.total, count: data.count }))
    .sort((a, b) => b.year.localeCompare(a.year));
};
