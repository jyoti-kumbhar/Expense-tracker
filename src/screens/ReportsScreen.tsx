import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { CategoryBreakdown } from '../components/CategoryBreakdown';
import { COLORS, RADIUS } from '../constants/theme';
import { useExpenses } from '../hooks/useExpenses';
import {
  calculateCategoryTotals,
  calculateMonthTotal,
  calculateYearlyTotals,
  formatCurrency,
} from '../lib/reports';

export const ReportsScreen: React.FC = () => {
  const { expenses, isDark } = useExpenses();
  const theme = isDark ? COLORS.dark : COLORS.light;

  const monthTotal = calculateMonthTotal(expenses);
  const categoryTotals = calculateCategoryTotals(expenses);
  const yearlyData = calculateYearlyTotals(expenses);
  const maxYearTotal = Math.max(...yearlyData.map(y => y.total), 1);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: theme.text }]}>Spending Reports</Text>

      {/* Category Breakdown for Current Month */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.muted }]}>By Category · This Month</Text>
      </View>
      <Card>
        <CategoryBreakdown categoryTotals={categoryTotals} totalSpent={monthTotal} />
      </Card>

      {/* Expenses By Year */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.muted }]}>Spending By Year</Text>
      </View>
      <Card>
        {yearlyData.length === 0 ? (
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: theme.muted }]}>No expense data available</Text>
          </View>
        ) : (
          yearlyData.map((item, index) => {
            const percent = (item.total / maxYearTotal) * 100;
            const isLast = index === yearlyData.length - 1;

            return (
              <View
                key={item.year}
                style={[
                  styles.yearRow,
                  !isLast && { borderBottomWidth: 1, borderBottomColor: theme.border },
                ]}
              >
                <View style={styles.yearHead}>
                  <View style={styles.yearBadge}>
                    <Feather name="calendar" size={14} color={theme.primary} />
                    <Text style={[styles.yearText, { color: theme.text }]}>{item.year}</Text>
                  </View>
                  <Text style={[styles.yearAmount, { color: theme.text }]}>
                    {formatCurrency(item.total)}
                  </Text>
                </View>

                {/* Proportional visual bar */}
                <View style={[styles.barTrack, { backgroundColor: theme.barTrack }]}>
                  <View
                    style={[
                      styles.barFill,
                      { width: `${percent}%`, backgroundColor: theme.primary },
                    ]}
                  />
                </View>

                <Text style={[styles.yearMeta, { color: theme.muted }]}>
                  {item.count} {item.count === 1 ? 'entry' : 'entries'}
                </Text>
              </View>
            );
          })
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
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionHeader: {
    marginBottom: 8,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  yearRow: {
    paddingVertical: 12,
    gap: 6,
  },
  yearHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  yearBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  yearText: {
    fontSize: 16,
    fontWeight: '700',
  },
  yearAmount: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'serif',
  },
  barTrack: {
    height: 6,
    borderRadius: RADIUS.pill,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: RADIUS.pill,
  },
  yearMeta: {
    fontSize: 12,
  },
  empty: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
  },
});
