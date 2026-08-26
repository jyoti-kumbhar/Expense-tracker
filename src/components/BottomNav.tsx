import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, RADIUS } from '../constants/theme';
import { useExpenses } from '../hooks/useExpenses';
import { ScreenType } from '../types';

interface BottomNavProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const { isDark } = useExpenses();
  const theme = isDark ? COLORS.dark : COLORS.light;

  const tabs: { key: ScreenType; label: string; icon: keyof typeof Feather.glyphMap }[] = [
    { key: 'home', label: 'Home', icon: 'home' },
    { key: 'history', label: 'History', icon: 'list' },
    { key: 'reports', label: 'Reports', icon: 'bar-chart-2' },
    { key: 'budgets', label: 'Budgets', icon: 'target' },
  ];

  return (
    <View style={[styles.wrapper, { backgroundColor: 'transparent' }]}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        {/* Home */}
        <TouchableOpacity
          style={styles.tab}
          onPress={() => onNavigate('home')}
          activeOpacity={0.7}
        >
          <Feather
            name="home"
            size={20}
            color={currentScreen === 'home' ? theme.primary : theme.muted}
          />
          <Text
            style={[
              styles.label,
              { color: currentScreen === 'home' ? theme.primary : theme.muted },
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        {/* History */}
        <TouchableOpacity
          style={styles.tab}
          onPress={() => onNavigate('history')}
          activeOpacity={0.7}
        >
          <Feather
            name="list"
            size={20}
            color={currentScreen === 'history' ? theme.primary : theme.muted}
          />
          <Text
            style={[
              styles.label,
              { color: currentScreen === 'history' ? theme.primary : theme.muted },
            ]}
          >
            History
          </Text>
        </TouchableOpacity>

        {/* Central Add FAB */}
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: theme.primary }]}
          onPress={() => onNavigate('add')}
          activeOpacity={0.85}
        >
          <Feather name="plus" size={26} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Reports */}
        <TouchableOpacity
          style={styles.tab}
          onPress={() => onNavigate('reports')}
          activeOpacity={0.7}
        >
          <Feather
            name="bar-chart-2"
            size={20}
            color={currentScreen === 'reports' ? theme.primary : theme.muted}
          />
          <Text
            style={[
              styles.label,
              { color: currentScreen === 'reports' ? theme.primary : theme.muted },
            ]}
          >
            Reports
          </Text>
        </TouchableOpacity>

        {/* Budgets */}
        <TouchableOpacity
          style={styles.tab}
          onPress={() => onNavigate('budgets')}
          activeOpacity={0.7}
        >
          <Feather
            name="target"
            size={20}
            color={currentScreen === 'budgets' ? theme.primary : theme.muted}
          />
          <Text
            style={[
              styles.label,
              { color: currentScreen === 'budgets' ? theme.primary : theme.muted },
            ]}
          >
            Budgets
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 4,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: RADIUS.card + 4,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 6,
    shadowColor: '#4B1C71',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
  },
  fab: {
    width: 50,
    height: 50,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -22,
    shadowColor: '#4B1C71',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});
