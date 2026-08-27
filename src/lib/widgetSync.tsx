import React from 'react';
import { Platform } from 'react-native';
import { calculateMonthTotal, calculateTodayTotal, formatCurrency, formatMonthLabel } from './reports';
import { storage } from './storage';

export const syncHomeWidget = async (): Promise<void> => {
  if (Platform.OS !== 'android') return;

  try {
    const { requestWidgetUpdate } = await import('react-native-android-widget');
    const { LedgerSummaryWidget } = await import('../widgets/LedgerSummaryWidget');
    const { LedgerQuickAddWidget } = await import('../widgets/LedgerQuickAddWidget');

    const expenses = await storage.loadExpenses();
    const budgets = await storage.loadBudgets();

    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthTotal = calculateMonthTotal(expenses);
    const todayTotal = calculateTodayTotal(expenses);
    const monthName = formatMonthLabel(currentMonth);

    let budgetStatus = 'No budget limit';
    if (budgets.overall > 0) {
      const remaining = budgets.overall - monthTotal;
      if (remaining >= 0) {
        budgetStatus = `Left: ${formatCurrency(remaining)}`;
      } else {
        budgetStatus = `Over: ${formatCurrency(Math.abs(remaining))}`;
      }
    }

    await Promise.allSettled([
      requestWidgetUpdate({
        widgetName: 'LedgerSummaryWidget',
        renderWidget: () => (
          <LedgerSummaryWidget
            monthName={monthName}
            monthTotal={formatCurrency(monthTotal)}
            todayTotal={formatCurrency(todayTotal)}
            budgetStatus={budgetStatus}
          />
        ),
      }),
      requestWidgetUpdate({
        widgetName: 'LedgerQuickAddWidget',
        renderWidget: () => <LedgerQuickAddWidget todayTotal={formatCurrency(todayTotal)} />,
      }),
    ]);
  } catch {
    // Graceful fallback for non-native / development environments
  }
};
