import React from 'react';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { calculateMonthTotal, calculateTodayTotal, formatCurrency, formatMonthLabel } from '../lib/reports';
import { storage } from '../lib/storage';
import { LedgerQuickAddWidget } from './LedgerQuickAddWidget';
import { LedgerSummaryWidget } from './LedgerSummaryWidget';

const getWidgetData = async () => {
  try {
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

    return {
      monthName,
      monthTotal: formatCurrency(monthTotal),
      todayTotal: formatCurrency(todayTotal),
      budgetStatus,
    };
  } catch {
    return {
      monthName: 'This Month',
      monthTotal: '₹0',
      todayTotal: '₹0',
      budgetStatus: 'No budget set',
    };
  }
};

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const { widgetInfo, renderWidget } = props;

  const data = await getWidgetData();

  switch (widgetInfo?.widgetName) {
    case 'LedgerQuickAddWidget':
      renderWidget(<LedgerQuickAddWidget todayTotal={data.todayTotal} />);
      break;

    case 'LedgerSummaryWidget':
    default:
      renderWidget(
        <LedgerSummaryWidget
          monthName={data.monthName}
          monthTotal={data.monthTotal}
          todayTotal={data.todayTotal}
          budgetStatus={data.budgetStatus}
        />
      );
      break;
  }
}
