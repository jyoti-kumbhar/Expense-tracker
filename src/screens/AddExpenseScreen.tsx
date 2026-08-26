import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Button } from '../components/Button';
import { ConfirmModal } from '../components/ConfirmModal';
import { CATEGORIES, COLORS, PAYMENT_METHODS, RADIUS } from '../constants/theme';
import { useExpenses } from '../hooks/useExpenses';
import { CategoryId, Expense, PaymentMethod, ScreenType } from '../types';

interface AddExpenseScreenProps {
  onDone: () => void;
  editingExpense: Expense | null;
}

export const AddExpenseScreen: React.FC<AddExpenseScreenProps> = ({ onDone, editingExpense }) => {
  const { isDark, addExpense, updateExpense, deleteExpense } = useExpenses();
  const theme = isDark ? COLORS.dark : COLORS.light;

  const [amount, setAmount] = useState<string>(editingExpense ? String(editingExpense.amount) : '');
  const [category, setCategory] = useState<CategoryId>((editingExpense?.category as CategoryId) || 'food');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    (editingExpense?.paymentMethod as PaymentMethod) || 'UPI'
  );
  const [date, setDate] = useState<string>(
    editingExpense?.date || new Date().toISOString().slice(0, 10)
  );
  const [note, setNote] = useState<string>(editingExpense?.note || '');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSave = async () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return;
    }

    if (editingExpense) {
      const success = await updateExpense(editingExpense.id, {
        amount: numAmount,
        category,
        paymentMethod,
        date,
        note: note.trim() || undefined,
      });
      if (success) onDone();
    } else {
      const success = await addExpense({
        amount: numAmount,
        category,
        paymentMethod,
        date,
        note: note.trim() || undefined,
      });
      if (success) onDone();
    }
  };

  const handleDelete = async () => {
    if (editingExpense) {
      const success = await deleteExpense(editingExpense.id);
      setShowDeleteModal(false);
      if (success) onDone();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.heading, { color: theme.text }]}>
          {editingExpense ? 'Edit Expense' : 'New Expense'}
        </Text>

        {/* Amount Input */}
        <Text style={[styles.label, { color: theme.muted }]}>Amount</Text>
        <View style={[styles.amountWrapper, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.currencyPrefix, { color: theme.muted }]}>₹</Text>
          <TextInput
            style={[styles.amountInput, { color: theme.text }]}
            placeholder="0.00"
            placeholderTextColor={theme.muted}
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
            autoFocus={!editingExpense}
          />
        </View>

        {/* Category Grid */}
        <Text style={[styles.label, { color: theme.muted }]}>Category</Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map(cat => {
            const isSelected = category === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: isSelected ? theme.primary : theme.card,
                    borderColor: isSelected ? 'transparent' : theme.border,
                  },
                ]}
                onPress={() => setCategory(cat.id)}
                activeOpacity={0.7}
              >
                <Feather
                  name={cat.icon as any}
                  size={18}
                  color={isSelected ? '#FFFFFF' : cat.color}
                />
                <Text
                  style={[
                    styles.categoryText,
                    { color: isSelected ? '#FFFFFF' : theme.textSecondary },
                  ]}
                  numberOfLines={1}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Payment Method Selector */}
        <Text style={[styles.label, { color: theme.muted }]}>Payment Method</Text>
        <View style={styles.payRow}>
          {PAYMENT_METHODS.map(method => {
            const isSelected = paymentMethod === method;
            return (
              <TouchableOpacity
                key={method}
                style={[
                  styles.payChip,
                  {
                    backgroundColor: isSelected ? theme.primary : theme.card,
                    borderColor: isSelected ? 'transparent' : theme.border,
                  },
                ]}
                onPress={() => setPaymentMethod(method)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.payText,
                    { color: isSelected ? '#FFFFFF' : theme.textSecondary },
                  ]}
                >
                  {method}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Date Input */}
        <Text style={[styles.label, { color: theme.muted }]}>Date (YYYY-MM-DD)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={theme.muted}
          value={date}
          onChangeText={setDate}
        />

        {/* Note Input */}
        <Text style={[styles.label, { color: theme.muted }]}>
          Note <Text style={styles.optionalText}>(optional)</Text>
        </Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
          placeholder="e.g. Dinner with friends"
          placeholderTextColor={theme.muted}
          value={note}
          onChangeText={setNote}
        />

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          {editingExpense && (
            <Button
              title="Delete"
              variant="danger"
              onPress={() => setShowDeleteModal(true)}
              style={styles.flexBtn}
            />
          )}
          <Button
            title={editingExpense ? 'Save Changes' : 'Save Expense'}
            variant="primary"
            onPress={handleSave}
            style={styles.flexBtn}
          />
        </View>
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        visible={showDeleteModal}
        title="Delete Expense"
        message="Are you sure you want to delete this expense? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </KeyboardAvoidingView>
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
  heading: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 14,
    marginBottom: 6,
  },
  optionalText: {
    textTransform: 'none',
    fontWeight: '400',
  },
  amountWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  currencyPrefix: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'serif',
    marginRight: 6,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'serif',
    paddingVertical: 8,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    width: '23%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    gap: 5,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
  },
  payRow: {
    flexDirection: 'row',
    gap: 8,
  },
  payChip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
  },
  payText: {
    fontSize: 12,
    fontWeight: '600',
  },
  input: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 22,
  },
  flexBtn: {
    flex: 1,
  },
});
