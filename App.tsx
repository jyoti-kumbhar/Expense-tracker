import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';
import { StatusBar } from 'expo-status-bar';
import { BottomNav } from './src/components/BottomNav';
import { Toast } from './src/components/Toast';
import { TopBar } from './src/components/TopBar';
import { COLORS } from './src/constants/theme';
import { ExpenseProvider, useExpenses } from './src/hooks/useExpenses';
import { AddExpenseScreen } from './src/screens/AddExpenseScreen';
import { BudgetsScreen } from './src/screens/BudgetsScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ReportsScreen } from './src/screens/ReportsScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { Expense, ScreenType } from './src/types';

const MainApp: React.FC = () => {
  const { isDark, editingExpense, setEditingExpense } = useExpenses();
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');

  const theme = isDark ? COLORS.dark : COLORS.light;

  useEffect(() => {
    const handleUrl = (event: { url: string }) => {
      const data = Linking.parse(event.url);
      if (data.hostname === 'add' || data.path?.includes('add') || event.url.includes('add')) {
        setEditingExpense(null);
        setCurrentScreen('add');
      }
    };

    Linking.getInitialURL().then(url => {
      if (url) handleUrl({ url });
    });

    const subscription = Linking.addEventListener('url', handleUrl);
    return () => subscription.remove();
  }, []);

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setCurrentScreen('add');
  };

  const handleDoneAdd = () => {
    setEditingExpense(null);
    setCurrentScreen('home');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onNavigate={setCurrentScreen} onEditExpense={handleEditExpense} />;
      case 'history':
        return <HistoryScreen onEditExpense={handleEditExpense} />;
      case 'add':
        return (
          <AddExpenseScreen
            onDone={handleDoneAdd}
            editingExpense={editingExpense}
          />
        );
      case 'reports':
        return <ReportsScreen />;
      case 'budgets':
        return <BudgetsScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <HomeScreen onNavigate={setCurrentScreen} onEditExpense={handleEditExpense} />;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <TopBar currentScreen={currentScreen} onNavigate={setCurrentScreen} />
      <View style={styles.content}>{renderScreen()}</View>
      <BottomNav
        currentScreen={currentScreen}
        onNavigate={screen => {
          if (screen === 'add') {
            setEditingExpense(null);
          }
          setCurrentScreen(screen);
        }}
      />
      <Toast />
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ExpenseProvider>
        <MainApp />
      </ExpenseProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
