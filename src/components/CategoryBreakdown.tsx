import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CATEGORIES, COLORS, RADIUS } from '../constants/theme';
import { useExpenses } from '../hooks/useExpenses';
import { formatCurrency } from '../lib/reports';

interface CategoryBreakdownProps {
  categoryTotals: Record<string, number>;
  totalSpent: number;
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({
  categoryTotals,
  totalSpent,
}) => {
  const { isDark } = useExpenses();
  const theme = isDark ? COLORS.dark : COLORS.light;

  const entries = Object.entries(categoryTotals)
    .filter(([_, amount]) => amount > 0)
    .sort((a, b) => b[1] - a[1]);

  if (entries.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={[styles.emptyText, { color: theme.muted }]}>No spending in this period</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Progress segmented bar */}
      <View style={[styles.segmentedTrack, { backgroundColor: theme.barTrack }]}>
        {entries.map(([catId, amount]) => {
          const cat = CATEGORIES.find(c => c.id === catId);
          const percent = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
          return (
            <View
              key={catId}
              style={{
                width: `${percent}%`,
                height: '100%',
                backgroundColor: cat?.color || theme.primary,
              }}
            />
          );
        })}
      </View>

      {/* Legend list */}
      <View style={styles.legend}>
        {entries.map(([catId, amount]) => {
          const cat = CATEGORIES.find(c => c.id === catId) || {
            name: catId,
            color: theme.primary,
          };
          const percent = totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0;

          return (
            <View key={catId} style={styles.legendRow}>
              <View style={[styles.swatch, { backgroundColor: cat.color }]} />
              <Text style={[styles.catName, { color: theme.text }]} numberOfLines={1}>
                {cat.name}
              </Text>
              <Text style={[styles.percentage, { color: theme.muted }]}>{percent}%</Text>
              <Text style={[styles.amount, { color: theme.text }]}>{formatCurrency(amount)}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  segmentedTrack: {
    flexDirection: 'row',
    height: 10,
    borderRadius: RADIUS.pill,
    overflow: 'hidden',
    width: '100%',
  },
  legend: {
    gap: 10,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  swatch: {
    width: 10,
    height: 10,
    borderRadius: 3,
  },
  catName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
  },
  percentage: {
    fontSize: 12,
    fontWeight: '500',
  },
  amount: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'serif',
  },
  empty: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
  },
});
