import React from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { COLORS, RADIUS } from '../constants/theme';
import { useExpenses } from '../hooks/useExpenses';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  style,
  textStyle,
  icon,
  disabled,
}) => {
  const { isDark } = useExpenses();
  const theme = isDark ? COLORS.dark : COLORS.light;

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          container: { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 },
          text: { color: theme.text },
        };
      case 'danger':
        return {
          container: { backgroundColor: theme.dangerBg, borderColor: 'transparent', borderWidth: 0 },
          text: { color: theme.danger },
        };
      default:
        return {
          container: { backgroundColor: theme.buttonBg, borderColor: 'transparent', borderWidth: 0 },
          text: { color: theme.buttonText },
        };
    }
  };

  const vStyle = getVariantStyles();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, vStyle.container, disabled && styles.disabled, style]}
    >
      {icon}
      <Text style={[styles.text, vStyle.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: RADIUS.lg,
    gap: 8,
    shadowColor: '#4B1C71',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});
