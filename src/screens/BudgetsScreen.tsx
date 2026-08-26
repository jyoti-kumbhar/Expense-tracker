import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { CATEGORIES, COLORS, RADIUS } from '../constants/theme';
import { useExpenses } from '../hooks/useExpenses';
import { calculateCategoryTotals, calculateMonthTotal, formatCurrency } from '../lib/reports';

export const BudgetsScreen: React.FC = () => {
  const { expenses, budgets, updateBudgets, isDark } = useExpenses();
  const theme = isDark ? COLORS.dark : COLORS.light;

  const [overallInput, setOverallInput] = useState(budgets.overall ? String(budgets.overall) : '');
  const [categoryInputs, setCategoryInputs] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    Object.entries(budgets.categories || {}).forEach(([catId, val]) => {
      if (val) init[catId] = String(val);
    });
    return init;
  });

  const monthTotal = calculateMonthTotal(expenses);
  const categoryTotals = calculateCategoryTotals(expenses);

  const handleSaveBudgets = () => {
    const newOverall = parseFloat(overallInput) || 0;
    const newCatBudgets: Record<string, number> = {};
    Object.entries(categoryInputs).forEach(([k, v]) => {
      const parsed = parseFloat(v);
      if (parsed > 0) newCatBudgets[k] = parsed;
    });

    updateBudgets({
      overall: newOverall,
      categories: newCatBudgets,
    });
  };

  const overallBudget = budgets.overall || 0;
  const overallPercent = overallBudget > 0 ? Math.min(100, (monthTotal / overallBudget) * 100) : 0;
  const isOverallOver = overallBudget > 0 && monthTotal > overallBudget;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.title, { color: theme.text }]}>Budget Control</Text>

      {/* Overall Monthly Budget */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.muted }]}>Overall Monthly Budget</Text>
      </View>

      <Card>
        <View style={styles.budgetHead}>
          <View style={styles.cnameRow}>
            <Feather name="target" size={16} color={theme.primary} />
            <Text style={[styles.cname, { color: theme.text }]}>Total Monthly</Text>
          </View>
          <Text style={[styles.figures, { color: theme.muted }]}>
            {formatCurrency(monthTotal)} / {overallBudget > 0 ? formatCurrency(overallBudget) : 'No limit'}
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={[styles.barTrack, { backgroundColor: theme.barTrack }]}>
          <View
            style={[
              styles.barFill,
              {
                width: `${overallPercent}%`,
                backgroundColor: isOverallOver ? theme.danger : theme.primary,
              },
            ]}
          />
        </View>

        {isOverallOver && (
          <View style={styles.overBadge}>
            <Feather name="alert-circle" size={13} color={theme.danger} />
            <Text style={[styles.overText, { color: theme.danger }]}>
              Over budget by {formatCurrency(monthTotal - overallBudget)}
            </Text>
          </View>
        )}

        <TextInput
          style={[
            styles.input,
            { backgroundColor: theme.cardElevated, borderColor: theme.border, color: theme.text },
          ]}
          placeholder="Set overall budget (₹)"
          placeholderTextColor={theme.muted}
          keyboardType="decimal-pad"
          value={overallInput}
          onChangeText={setOverallInput}
        />
      </Card>

      {/* Category Budgets */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.muted }]}>Category Budgets</Text>
      </View>

      {CATEGORIES.map(cat => {
        const spent = categoryTotals[cat.id] || 0;
        const catBudget = budgets.categories[cat.id] || 0;
        const percent = catBudget > 0 ? Math.min(100, (spent / catBudget) * 100) : 0;
        const isOver = catBudget > 0 && spent > catBudget;

        return (
          <Card key={cat.id} style={styles.catCard}>
            <View style={styles.budgetHead}>
              <View style={styles.cnameRow}>
                <Feather name={cat.icon as any} size={15} color={cat.color} />
                <Text style={[styles.cname, { color: theme.text }]}>{cat.name}</Text>
              </View>
              <Text style={[styles.figures, { color: theme.muted }]}>
                {formatCurrency(spent)} / {catBudget > 0 ? formatCurrency(catBudget) : '—'}
              </Text>
            </View>

            {catBudget > 0 && (
              <View style={[styles.barTrack, { backgroundColor: theme.barTrack }]}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${percent}%`,
                      backgroundColor: isOver ? theme.danger : cat.color,
                    },
                  ]}
                />
              </View>
            )}

            {isOver && (
              <View style={styles.overBadge}>
                <Feather name="alert-circle" size={12} color={theme.danger} />
                <Text style={[styles.overText, { color: theme.danger }]}>
                  Over budget by {formatCurrency(spent - catBudget)}
                </Text>
              </View>
            )}

            <TextInput
              style={[
                styles.input,
                { backgroundColor: theme.cardElevated, borderColor: theme.border, color: theme.text },
              ]}
              placeholder={`Set ${cat.name} budget (₹)`}
              placeholderTextColor={theme.muted}
              keyboardType="decimal-pad"
              value={categoryInputs[cat.id] || ''}
              onChangeText={val => setCategoryInputs({ ...categoryInputs, [cat.id]: val })}
            />
          </Card>
        );
      })}

      <Button
        title="Save Budgets"
        variant="primary"
        onPress={handleSaveBudgets}
        style={styles.saveBtn}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionHeader: {
    marginBottom: 8,
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  budgetHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cnameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cname: {
    fontSize: 14,
    fontWeight: '600',
  },
  figures: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'serif',
  },
  barTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  overBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 10,
  },
  overText: {
    fontSize: 11,
    fontWeight: '600',
  },
  input: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
  },
  catCard: {
    padding: 14,
    marginBottom: 10,
  },
  saveBtn: {
    marginTop: 10,
    marginBottom: 20,
  },
});
