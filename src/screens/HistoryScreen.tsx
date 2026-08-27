import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { ExpenseItem } from '../components/ExpenseItem';
import { CATEGORIES, COLORS, RADIUS } from '../constants/theme';
import { useExpenses } from '../hooks/useExpenses';
import { formatMonthLabel } from '../lib/reports';
import { Expense } from '../types';

interface HistoryScreenProps {
  onEditExpense: (expense: Expense) => void;
  selectedMonth?: string | null;
  onClearMonthFilter?: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  onEditExpense,
  selectedMonth,
  onClearMonthFilter,
}) => {
  const { expenses, isDark } = useExpenses();
  const theme = isDark ? COLORS.dark : COLORS.light;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter(expense => {
        const matchesMonth = !selectedMonth || expense.date?.startsWith(selectedMonth);
        const matchesCategory =
          selectedCategory === 'all' || expense.category === selectedCategory;
        const matchesSearch =
          !searchQuery.trim() ||
          (expense.note && expense.note.toLowerCase().includes(searchQuery.toLowerCase())) ||
          expense.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          expense.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase()) ||
          String(expense.amount).includes(searchQuery);

        return matchesMonth && matchesCategory && matchesSearch;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, selectedCategory, searchQuery, selectedMonth]);

  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <Text style={[styles.title, { color: theme.text }]}>All Expenses</Text>

        {/* Active Month Filter Banner */}
        {selectedMonth && (
          <View
            style={[
              styles.monthBanner,
              {
                backgroundColor: isDark
                  ? 'rgba(127, 76, 165, 0.25)'
                  : 'rgba(75, 28, 113, 0.08)',
                borderColor: theme.border,
              },
            ]}
          >
            <View style={styles.monthBannerLeft}>
              <Feather name="calendar" size={14} color={theme.primary} />
              <Text style={[styles.monthBannerText, { color: theme.text }]}>
                Month:{' '}
                <Text style={{ fontWeight: '700', color: theme.primary }}>
                  {formatMonthLabel(selectedMonth)}
                </Text>
              </Text>
            </View>
            {onClearMonthFilter && (
              <TouchableOpacity
                onPress={onClearMonthFilter}
                style={styles.clearMonthBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                activeOpacity={0.7}
              >
                <Feather name="x" size={16} color={theme.primary} />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Search Bar */}
        <View
          style={[styles.searchBar, { backgroundColor: theme.card, borderColor: theme.border }]}
        >
          <Feather name="search" size={16} color={theme.muted} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search notes or category…"
            placeholderTextColor={theme.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x" size={16} color={theme.muted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          <TouchableOpacity
            style={[
              styles.filterChip,
              {
                backgroundColor: selectedCategory === 'all' ? theme.primary : theme.card,
                borderColor: selectedCategory === 'all' ? 'transparent' : theme.border,
              },
            ]}
            onPress={() => setSelectedCategory('all')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterText,
                { color: selectedCategory === 'all' ? '#FFFFFF' : theme.textSecondary },
              ]}
            >
              All
            </Text>
          </TouchableOpacity>

          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isSelected ? theme.primary : theme.card,
                    borderColor: isSelected ? 'transparent' : theme.border,
                  },
                ]}
                onPress={() => setSelectedCategory(cat.id)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterText,
                    { color: isSelected ? '#FFFFFF' : theme.textSecondary },
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Expenses List */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        <Card>
          {filteredExpenses.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="inbox" size={32} color={theme.muted} style={styles.emptyIcon} />
              <Text style={[styles.emptyTitle, { color: theme.text }]}>No expenses found</Text>
              <Text style={[styles.emptySubtitle, { color: theme.muted }]}>
                {searchQuery || selectedCategory !== 'all' || selectedMonth
                  ? 'Try changing your search or category/month filter'
                  : 'Add your first expense to get started'}
              </Text>
            </View>
          ) : (
            filteredExpenses.map((expense, index) => (
              <ExpenseItem
                key={expense.id}
                expense={expense}
                onPress={() => onEditExpense(expense)}
                isLast={index === filteredExpenses.length - 1}
              />
            ))
          )}
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerArea: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  monthBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
  },
  monthBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  monthBannerText: {
    fontSize: 13,
  },
  clearMonthBtn: {
    padding: 2,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 2,
  },
  filterRow: {
    gap: 8,
    paddingBottom: 4,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  emptyState: {
    paddingVertical: 36,
    alignItems: 'center',
  },
  emptyIcon: {
    marginBottom: 10,
    opacity: 0.6,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    textAlign: 'center',
  },
});
