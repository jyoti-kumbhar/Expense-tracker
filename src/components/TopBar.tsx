import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, RADIUS } from '../constants/theme';
import { useExpenses } from '../hooks/useExpenses';
import { ScreenType } from '../types';

interface TopBarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ currentScreen, onNavigate }) => {
  const { isDark, toggleTheme } = useExpenses();
  const theme = isDark ? COLORS.dark : COLORS.light;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.brand}
        activeOpacity={0.7}
        onPress={() => onNavigate('home')}
      >
        <View style={[styles.mark, { backgroundColor: theme.primary }]}>
          <Text style={styles.markText}>L</Text>
        </View>
        <Text style={[styles.title, { color: theme.text }]}>Ledger</Text>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: theme.barTrack }]}
          onPress={toggleTheme}
          activeOpacity={0.7}
        >
          <Feather name={isDark ? 'sun' : 'moon'} size={18} color={theme.text} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.iconButton,
            { backgroundColor: currentScreen === 'settings' ? theme.primary : theme.barTrack },
          ]}
          onPress={() => onNavigate(currentScreen === 'settings' ? 'home' : 'settings')}
          activeOpacity={0.7}
        >
          <Feather
            name="settings"
            size={18}
            color={currentScreen === 'settings' ? '#FFFFFF' : theme.text}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  mark: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4B1C71',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  markText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'serif',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
