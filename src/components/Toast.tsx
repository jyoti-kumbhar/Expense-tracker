import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RADIUS } from '../constants/theme';
import { useExpenses } from '../hooks/useExpenses';

export const Toast: React.FC = () => {
  const { toastMessage } = useExpenses();

  if (!toastMessage) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      <View style={styles.toast}>
        <Text style={styles.text}>{toastMessage}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 84,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  toast: {
    backgroundColor: '#4B1C71',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: RADIUS.pill,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
