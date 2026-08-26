import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { ConfirmModal } from '../components/ConfirmModal';
import { COLORS } from '../constants/theme';
import { useExpenses } from '../hooks/useExpenses';
import { exportExpensesToCSV } from '../lib/export';

export const SettingsScreen: React.FC = () => {
  const { expenses, isDark, toggleTheme, clearAllData, showToast } = useExpenses();
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

  const handleClearAll = async () => {
    await clearAllData();
    setShowClearModal(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: theme.text }]}>Settings</Text>

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
});
