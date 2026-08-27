import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { ConfirmModal } from '../components/ConfirmModal';
import { COLORS, RADIUS } from '../constants/theme';
import { useExpenses } from '../hooks/useExpenses';
import { exportExpensesToCSV } from '../lib/export';
import { calculateMonthTotal, calculateTodayTotal, formatCurrency, formatMonthLabel } from '../lib/reports';

export const SettingsScreen: React.FC = () => {
  const { expenses, budgets, isDark, toggleTheme, clearAllData, showToast } = useExpenses();
  const theme = isDark ? COLORS.dark : COLORS.light;

  const [showClearModal, setShowClearModal] = useState(false);

  const handleExportCSV = async () => {
    if (expenses.length === 0) {
      showToast('No expenses to export');
      return;
    }
    const success = await exportExpensesToCSV(expenses);
    if (success) {
      showToast('CSV export ready');
    }
  };

  const handlePinWidget = async (widgetName: string) => {
    if (Platform.OS !== 'android') {
      showToast('Widgets are supported on Android home screen');
      return;
    }
    try {
      const { requestPinWidget } = await import('react-native-android-widget');
      const supported = await requestPinWidget({ widgetName });
      if (supported) {
        showToast('Widget pin prompt opened');
      } else {
        showToast('Long-press your home screen to add Ledger widget');
      }
    } catch {
      showToast('Long-press your home screen to add Ledger widget');
    }
  };

  const handleClearAll = async () => {
    await clearAllData();
    setShowClearModal(false);
  };

  const currentMonthTotal = calculateMonthTotal(expenses);
  const currentTodayTotal = calculateTodayTotal(expenses);
  const currentMonthStr = formatMonthLabel(new Date().toISOString().slice(0, 7));

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: theme.text }]}>Settings</Text>

      {/* Home Screen Widget Section */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.muted }]}>Home Screen Widget</Text>
      </View>

      {/* Interactive In-App Widget Preview */}
      <View style={styles.widgetPreviewWrapper}>
        <View style={styles.widgetCard}>
          <View style={styles.widgetHeader}>
            <Text style={styles.widgetBrand}>LEDGER</Text>
            <Text style={styles.widgetMonth}>{currentMonthStr}</Text>
          </View>

          <View style={styles.widgetBody}>
            <View>
              <Text style={styles.widgetEyebrow}>Spent this month</Text>
              <Text style={styles.widgetMainAmount}>{formatCurrency(currentMonthTotal)}</Text>
            </View>
            <View style={styles.widgetAddBadge}>
              <Text style={styles.widgetAddText}>+ Add</Text>
            </View>
          </View>

          <View style={styles.widgetFooter}>
            <Text style={styles.widgetTodayText}>
              Today: <Text style={{ fontWeight: '700', color: '#FFF' }}>{formatCurrency(currentTodayTotal)}</Text>
            </Text>
            <Text style={styles.widgetBudgetText}>
              {budgets.overall > 0
                ? budgets.overall >= currentMonthTotal
                  ? `Left: ${formatCurrency(budgets.overall - currentMonthTotal)}`
                  : `Over: ${formatCurrency(currentMonthTotal - budgets.overall)}`
                : 'No budget limit'}
            </Text>
          </View>
        </View>
      </View>

      <Card style={styles.groupCard}>
        <TouchableOpacity
          style={[styles.row, { borderBottomWidth: 1, borderBottomColor: theme.border }]}
          onPress={() => handlePinWidget('LedgerSummaryWidget')}
          activeOpacity={0.7}
        >
          <View style={styles.rowInfo}>
            <Text style={[styles.rowTitle, { color: theme.text }]}>Pin Monthly Summary Widget</Text>
            <Text style={[styles.rowDesc, { color: theme.muted }]}>
              4x2 widget with monthly spending & 1-tap add
            </Text>
          </View>
          <Feather name="plus-circle" size={18} color={theme.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.row}
          onPress={() => handlePinWidget('LedgerQuickAddWidget')}
          activeOpacity={0.7}
        >
          <View style={styles.rowInfo}>
            <Text style={[styles.rowTitle, { color: theme.text }]}>Pin Quick Entry Widget</Text>
            <Text style={[styles.rowDesc, { color: theme.muted }]}>
              2x2 compact widget for instant expense logging
            </Text>
          </View>
          <Feather name="zap" size={18} color={theme.primary} />
        </TouchableOpacity>
      </Card>

      {/* Appearance Group */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.muted }]}>Appearance</Text>
      </View>
      <Card style={styles.groupCard}>
        <View style={styles.row}>
          <View style={styles.rowInfo}>
            <Text style={[styles.rowTitle, { color: theme.text }]}>Dark Mode</Text>
            <Text style={[styles.rowDesc, { color: theme.muted }]}>Easier on the eyes at night</Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: theme.barTrack, true: theme.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
      </Card>

      {/* Data Group */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.muted }]}>Data Management</Text>
      </View>
      <Card style={styles.groupCard}>
        {/* Export CSV */}
        <TouchableOpacity
          style={[styles.row, { borderBottomWidth: 1, borderBottomColor: theme.border }]}
          onPress={handleExportCSV}
          activeOpacity={0.7}
        >
          <View style={styles.rowInfo}>
            <Text style={[styles.rowTitle, { color: theme.text }]}>Export as CSV</Text>
            <Text style={[styles.rowDesc, { color: theme.muted }]}>
              Export all expenses to open in Excel / Sheets
            </Text>
          </View>
          <Feather name="download" size={18} color={theme.primary} />
        </TouchableOpacity>

        {/* Clear All Data */}
        <TouchableOpacity
          style={styles.row}
          onPress={() => setShowClearModal(true)}
          activeOpacity={0.7}
        >
          <View style={styles.rowInfo}>
            <Text style={[styles.rowTitle, { color: theme.danger }]}>Clear All Data</Text>
            <Text style={[styles.rowDesc, { color: theme.muted }]}>
              Permanently removes every expense on this device
            </Text>
          </View>
          <Feather name="trash-2" size={18} color={theme.danger} />
        </TouchableOpacity>
      </Card>

      {/* About Group */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.muted }]}>About</Text>
      </View>
      <Card style={styles.groupCard}>
        <View style={styles.row}>
          <View style={styles.rowInfo}>
            <Text style={[styles.rowTitle, { color: theme.text }]}>Ledger</Text>
            <Text style={[styles.rowDesc, { color: theme.muted }]}>
              v1.0.0 • Your data stays privately on this device
            </Text>
          </View>
          <Feather name="shield" size={18} color={theme.muted} />
        </View>
      </Card>

      {/* Clear Confirmation Modal */}
      <ConfirmModal
        visible={showClearModal}
        title="Clear All Data"
        message="Are you sure you want to delete all expense and budget records? This action cannot be undone."
        confirmText="Clear Everything"
        onConfirm={handleClearAll}
        onCancel={() => setShowClearModal(false)}
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
    paddingBottom: 24,
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
  groupCard: {
    paddingVertical: 4,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  rowInfo: {
    flex: 1,
    paddingRight: 12,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  rowDesc: {
    fontSize: 12,
  },
  widgetPreviewWrapper: {
    marginBottom: 12,
  },
  widgetCard: {
    backgroundColor: '#1E0D33',
    borderRadius: RADIUS.card,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(219, 182, 238, 0.2)',
    shadowColor: '#4B1C71',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  widgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  widgetBrand: {
    color: '#DBB6EE',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  widgetMonth: {
    color: '#B57EDC',
    fontSize: 11,
    fontWeight: '600',
  },
  widgetBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  widgetEyebrow: {
    color: '#9077AE',
    fontSize: 11,
    marginBottom: 2,
  },
  widgetMainAmount: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'serif',
  },
  widgetAddBadge: {
    backgroundColor: '#7F4CA5',
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  widgetAddText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  widgetFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2A1245',
    borderRadius: RADIUS.sm,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  widgetTodayText: {
    color: '#9077AE',
    fontSize: 11,
  },
  widgetBudgetText: {
    color: '#DBB6EE',
    fontSize: 11,
    fontWeight: '600',
  },
});
