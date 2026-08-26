import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { CATEGORIES, COLORS, RADIUS } from '../constants/theme';
import { useExpenses } from '../hooks/useExpenses';
import { CategoryId } from '../types';

const QUICK_PRESETS = [
  { label: '☕ Chai', amount: 20, category: 'food', note: 'Chai / Coffee' },
  { label: '🛺 Auto', amount: 50, category: 'transport', note: 'Auto rickshaw' },
  { label: '🍱 Lunch', amount: 150, category: 'food', note: 'Lunch' },
  { label: '🛒 Snacks', amount: 100, category: 'groceries', note: 'Snacks / Grocery' },
];

export const QuickEntryWidget: React.FC = () => {
  const { isDark, addExpense } = useExpenses();
  const theme = isDark ? COLORS.dark : COLORS.light;

  const [expanded, setExpanded] = useState(false);
  const [amount, setAmount] = useState('');
  const [selectedCat, setSelectedCat] = useState<CategoryId>('food');
  const [note, setNote] = useState('');

  const handleQuickPreset = async (preset: (typeof QUICK_PRESETS)[0]) => {
    await addExpense({
      amount: preset.amount,
      category: preset.category,
      paymentMethod: 'UPI',
      date: new Date().toISOString().slice(0, 10),
      note: preset.note,
    });
  };

  const handleCustomQuickAdd = async () => {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return;

    await addExpense({
      amount: num,
      category: selectedCat,
      paymentMethod: 'UPI',
      date: new Date().toISOString().slice(0, 10),
      note: note.trim() || undefined,
    });

    setAmount('');
    setNote('');
    setExpanded(false);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.cardElevated, borderColor: theme.border },
      ]}
    >
      {/* Widget Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={[styles.badge, { backgroundColor: `${theme.primary}20` }]}>
            <Feather name="zap" size={14} color={theme.primary} />
          </View>
          <Text style={[styles.title, { color: theme.text }]}>Quick Entry Widget</Text>
        </View>
        <TouchableOpacity
          onPress={() => setExpanded(!expanded)}
          style={[styles.toggleBtn, { backgroundColor: theme.barTrack }]}
          activeOpacity={0.7}
        >
          <Feather
            name={expanded ? 'chevron-up' : 'edit-3'}
            size={14}
            color={theme.primary}
          />
        </TouchableOpacity>
      </View>

      {/* 1-Tap Presets */}
      <View style={styles.presetsRow}>
        {QUICK_PRESETS.map((p, idx) => (
          <TouchableOpacity
            key={idx}
            style={[
              styles.presetChip,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
            onPress={() => handleQuickPreset(p)}
            activeOpacity={0.7}
          >
            <Text style={[styles.presetLabel, { color: theme.text }]}>{p.label}</Text>
            <Text style={[styles.presetAmount, { color: theme.primary }]}>₹{p.amount}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Expandable Quick Input Pad */}
      {expanded && (
        <View style={[styles.expandedContent, { borderTopColor: theme.border }]}>
          <View style={styles.inputRow}>
            <View
              style={[
                styles.amountWrap,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              <Text style={[styles.currSymbol, { color: theme.muted }]}>₹</Text>
              <TextInput
                style={[styles.amountInput, { color: theme.text }]}
                placeholder="0"
                placeholderTextColor={theme.muted}
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={setAmount}
              />
            </View>

            <TextInput
              style={[
                styles.noteInput,
                { backgroundColor: theme.card, borderColor: theme.border, color: theme.text },
              ]}
              placeholder="Note (optional)"
              placeholderTextColor={theme.muted}
              value={note}
              onChangeText={setNote}
            />
          </View>

          {/* Mini Category Chips */}
          <View style={styles.catChipsRow}>
            {CATEGORIES.slice(0, 4).map(cat => {
              const isSel = selectedCat === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.catChip,
                    {
                      backgroundColor: isSel ? theme.primary : theme.card,
                      borderColor: isSel ? 'transparent' : theme.border,
                    },
                  ]}
                  onPress={() => setSelectedCat(cat.id)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.catChipText,
                      { color: isSel ? '#FFFFFF' : theme.textSecondary },
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Quick Submit Button */}
          <TouchableOpacity
            style={[styles.quickSubmit, { backgroundColor: theme.primary }]}
            onPress={handleCustomQuickAdd}
            activeOpacity={0.8}
          >
            <Feather name="check" size={16} color="#FFFFFF" />
            <Text style={styles.quickSubmitText}>Add Entry</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: RADIUS.card,
    borderWidth: 1,
    padding: 14,
    marginBottom: 16,
    shadowColor: '#4B1C71',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    width: 26,
    height: 26,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  toggleBtn: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  presetChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    gap: 2,
  },
  presetLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  presetAmount: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'serif',
  },
  expandedContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    gap: 10,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  amountWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    paddingHorizontal: 10,
    width: 90,
  },
  currSymbol: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'serif',
    marginRight: 4,
  },
  amountInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'serif',
    paddingVertical: 6,
  },
  noteInput: {
    flex: 1,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 13,
  },
  catChipsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  catChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
  },
  catChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  quickSubmit: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: RADIUS.md,
    gap: 6,
  },
  quickSubmitText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
