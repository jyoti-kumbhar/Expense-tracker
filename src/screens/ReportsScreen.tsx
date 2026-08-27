import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { CategoryBreakdown } from '../components/CategoryBreakdown';
import { COLORS, RADIUS } from '../constants/theme';
import { useExpenses } from '../hooks/useExpenses';
import {
  calculateCategoryTotals,
  calculateMonthlyTotals,
  calculateMonthTotal,
  calculateYearlyTotals,
  formatCurrency,
} from '../lib/reports';

interface ReportsScreenProps {
  onViewMonthHistory?: (month: string) => void;
}

export const ReportsScreen: React.FC<ReportsScreenProps> = ({ onViewMonthHistory }) => {
  const { expenses, isDark } = useExpenses();
  const theme = isDark ? COLORS.dark : COLORS.light;

  const monthTotal = calculateMonthTotal(expenses);
  const categoryTotals = calculateCategoryTotals(expenses);
  const monthlyData = calculateMonthlyTotals(expenses);
  const yearlyData = calculateYearlyTotals(expenses);
  const maxMonthTotal = Math.max(...monthlyData.map(m => m.total), 1);
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

      {/* Expenses By Month */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.muted }]}>Spending By Month</Text>
      </View>
      <Card>
        {monthlyData.length === 0 ? (
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: theme.muted }]}>No expense data available</Text>
          </View>
        ) : (
          monthlyData.map((item, index) => {
            const percent = (item.total / maxMonthTotal) * 100;
            const isLast = index === monthlyData.length - 1;

            return (
              <View
                key={item.month}
                style={[
                  styles.itemRow,
                  !isLast && { borderBottomWidth: 1, borderBottomColor: theme.border },
                ]}
              >
                <View style={styles.itemHead}>
                  <View style={styles.itemBadge}>
                    <Feather name="calendar" size={14} color={theme.primary} />
                    <Text style={[styles.itemText, { color: theme.text }]}>{item.monthLabel}</Text>
                  </View>
                  <Text style={[styles.itemAmount, { color: theme.text }]}>
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

                <View style={styles.itemFooter}>
                  <Text style={[styles.itemMeta, { color: theme.muted }]}>
                    {item.count} {item.count === 1 ? 'entry' : 'entries'}
                  </Text>
                  {onViewMonthHistory && (
                    <TouchableOpacity
                      style={[
                        styles.viewBtn,
                        {
                          backgroundColor: isDark
                            ? 'rgba(127, 76, 165, 0.25)'
                            : 'rgba(75, 28, 113, 0.08)',
                        },
                      ]}
                      onPress={() => onViewMonthHistory(item.month)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.viewBtnText, { color: theme.primary }]}>View History</Text>
                      <Feather name="arrow-right" size={12} color={theme.primary} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })
        )}
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
                  styles.itemRow,
                  !isLast && { borderBottomWidth: 1, borderBottomColor: theme.border },
                ]}
              >
                <View style={styles.itemHead}>
                  <View style={styles.itemBadge}>
                    <Feather name="calendar" size={14} color={theme.primary} />
                    <Text style={[styles.itemText, { color: theme.text }]}>{item.year}</Text>
                  </View>
                  <Text style={[styles.itemAmount, { color: theme.text }]}>
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

                <Text style={[styles.itemMeta, { color: theme.muted }]}>
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
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  itemRow: {
    paddingVertical: 12,
    gap: 6,
  },
  itemHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  itemText: {
    fontSize: 15,
    fontWeight: '700',
  },
  itemAmount: {
    fontSize: 15,
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
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  itemMeta: {
    fontSize: 12,
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
  },
  viewBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  empty: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
  },
});
