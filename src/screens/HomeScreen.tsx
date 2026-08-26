import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from '../components/Card';
import { CategoryBreakdown } from '../components/CategoryBreakdown';
import { ExpenseItem } from '../components/ExpenseItem';
import { QuickEntryWidget } from '../components/QuickEntryWidget';
import { COLORS, RADIUS } from '../constants/theme';
import { useExpenses } from '../hooks/useExpenses';
import {
  calculateCategoryTotals,
  calculateDailyAverage,
  calculateMonthTotal,
  calculateTodayTotal,
  formatCurrency,
} from '../lib/reports';
import { Expense, ScreenType } from '../types';

interface HomeScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onEditExpense: (expense: Expense) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate, onEditExpense }) => {
  const { expenses, isDark } = useExpenses();
  const theme = isDark ? COLORS.dark : COLORS.light;

  const monthTotal = calculateMonthTotal(expenses);
  const todayTotal = calculateTodayTotal(expenses);
  const dailyAvg = calculateDailyAverage(expenses);
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthEntries = expenses.filter(e => e.date?.startsWith(currentMonth)).length;
  const categoryTotals = calculateCategoryTotals(expenses);
  const recentExpenses = expenses.slice(0, 5);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Primary Spending Card */}
      <View style={[styles.mainCard, { backgroundColor: theme.primary }]}>
        <Text style={styles.eyebrow}>Spent this month</Text>
        <Text style={styles.totalAmount}>{formatCurrency(monthTotal)}</Text>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statVal}>{formatCurrency(todayTotal)}</Text>
            <Text style={styles.statLbl}>Today</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statVal}>{formatCurrency(dailyAvg)}</Text>
            <Text style={styles.statLbl}>Daily avg</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statVal}>{monthEntries}</Text>
            <Text style={styles.statLbl}>Entries</Text>
          </View>
        </View>
      </View>

      {/* Quick Entry Widget */}
      <QuickEntryWidget />

      {/* Category Breakdown */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.muted }]}>By Category · This Month</Text>
      </View>
      <Card>
        <CategoryBreakdown categoryTotals={categoryTotals} totalSpent={monthTotal} />
      </Card>

      {/* Recent Entries */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.muted }]}>Recent Entries</Text>
        {expenses.length > 5 && (
          <TouchableOpacity onPress={() => onNavigate('history')} activeOpacity={0.7}>
            <Text style={[styles.seeAll, { color: theme.primary }]}>See all</Text>
          </TouchableOpacity>
        )}
      </View>

      <Card>
        {recentExpenses.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: theme.muted }]}>
              No expenses recorded yet.{'\n'}Tap the + button to add your first expense.
            </Text>
          </View>
        ) : (
          recentExpenses.map((expense, index) => (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              onPress={() => onEditExpense(expense)}
              isLast={index === recentExpenses.length - 1}
            />
          ))
        )}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  mainCard: {
    borderRadius: RADIUS.card,
    padding: 22,
    marginBottom: 16,
    shadowColor: '#4B1C71',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 5,
  },
  eyebrow: {
    color: '#DBB6EE',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  totalAmount: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: '700',
    fontFamily: 'serif',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 12,
  },
  stat: {
    alignItems: 'flex-start',
  },
  statVal: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  statLbl: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  seeAll: {
    fontSize: 13,
    fontWeight: '600',
  },
  emptyState: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 13,
  },
});
