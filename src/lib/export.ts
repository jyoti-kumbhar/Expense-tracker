import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Expense } from '../types';

export const exportExpensesToCSV = async (expenses: Expense[]): Promise<boolean> => {
  if (!expenses.length) return false;

  const headers = 'ID,Amount,Category,Payment Method,Date,Note\n';
  const rows = expenses
    .map(e =>
      [
        `"${e.id}"`,
        e.amount,
        `"${e.category}"`,
        `"${e.paymentMethod}"`,
        `"${e.date}"`,
        `"${(e.note || '').replace(/"/g, '""')}"`,
      ].join(',')
    )
    .join('\n');

  const csvContent = headers + rows;

  if (Platform.OS === 'web') {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ledger_expenses_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  }

  try {
    const fileUri = `${FileSystem.cacheDirectory || FileSystem.documentDirectory}ledger_expenses_${Date.now()}.csv`;
    await FileSystem.writeAsStringAsync(fileUri, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        dialogTitle: 'Export Expenses CSV',
        UTI: 'public.comma-separated-values-text',
      });
      return true;
    }
  } catch (error) {
    console.error('CSV Export Error:', error);
  }
  return false;
};
