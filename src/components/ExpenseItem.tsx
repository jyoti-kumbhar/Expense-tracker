import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { CATEGORIES, COLORS, RADIUS } from '../constants/theme';
import { useExpenses } from '../hooks/useExpenses';
import { formatCurrency } from '../lib/reports';
import { Expense } from '../types';

interface ExpenseItemProps {
  expense: Expense;
  onPress: () => void;
  isLast?: boolean;
}

export const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense, onPress, isLast }) => {
  const { isDark } = useExpenses();
  const theme = isDark ? COLORS.dark : COLORS.light;

  const category = CATEGORIES.find(c => c.id === expense.category) || {
    name: expense.category,
    icon: 'grid',
    color: theme.primary,
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.container,
        !isLast && { borderBottomWidth: 1, borderBottomColor: theme.border },
      ]}
    >
      <View style={[styles.iconBox, { backgroundColor: `${category.color}1E` }]}>
        <Feather name={category.icon as any} size={18} color={category.color} />
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
          {expense.note || category.name}
        </Text>
        <Text style={[styles.meta, { color: theme.muted }]}>
          {category.name} • {expense.paymentMethod} • {expense.date}
        </Text>
      </View>

      <Text style={[styles.amount, { color: theme.text }]}>
        {formatCurrency(expense.amount)}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  meta: {
    fontSize: 12,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'serif',
  },
});
