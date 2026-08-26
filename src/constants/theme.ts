import { CategoryMeta, PaymentMethod } from '../types';

export const COLORS = {
  light: {
    background: '#F3E9FA',
    card: '#FFFFFF',
    cardElevated: '#FFFFFF',
    text: '#4B1C71',
    textSecondary: '#7F4CA5',
    muted: '#9F7FB8',
    border: 'rgba(75, 28, 113, 0.12)',
    primary: '#4B1C71',
    secondary: '#7F4CA5',
    accent: '#B57EDC',
    lightLavender: '#DBB6EE',
    danger: '#D9534F',
    dangerBg: 'rgba(217, 83, 79, 0.12)',
    cardGradient: ['#4B1C71', '#7F4CA5'],
    buttonBg: '#4B1C71',
    buttonText: '#FFFFFF',
    barTrack: 'rgba(75, 28, 113, 0.08)',
  },
  dark: {
    background: '#180A28',
    card: '#241038',
    cardElevated: '#2E1547',
    text: '#FFF0FF',
    textSecondary: '#DBB6EE',
    muted: '#9077AE',
    border: 'rgba(255, 255, 255, 0.12)',
    primary: '#7F4CA5',
    secondary: '#B57EDC',
    accent: '#DBB6EE',
    lightLavender: '#DBB6EE',
    danger: '#FF6B6B',
    dangerBg: 'rgba(255, 107, 107, 0.18)',
    cardGradient: ['#3A1259', '#632C8C'],
    buttonBg: '#7F4CA5',
    buttonText: '#FFFFFF',
    barTrack: 'rgba(255, 255, 255, 0.1)',
  },
};

export const CATEGORIES: CategoryMeta[] = [
  { id: 'food', name: 'Food', icon: 'coffee', color: '#4B1C71' },
  { id: 'transport', name: 'Transport', icon: 'navigation', color: '#7F4CA5' },
  { id: 'shopping', name: 'Shopping', icon: 'shopping-bag', color: '#9159A8' },
  { id: 'bills', name: 'Bills', icon: 'file-text', color: '#6B3A94' },
  { id: 'entertainment', name: 'Fun', icon: 'smile', color: '#B57EDC' },
  { id: 'health', name: 'Health', icon: 'heart', color: '#5C2C87' },
  { id: 'groceries', name: 'Groceries', icon: 'shopping-cart', color: '#8465B0' },
  { id: 'other', name: 'Other', icon: 'grid', color: '#9F7FB8' },
];

export const PAYMENT_METHODS: PaymentMethod[] = ['UPI', 'Cash', 'Card', 'Wallet'];

export const RADIUS = {
  sm: 10,
  md: 14,
  lg: 18,
  card: 22,
  pill: 999,
};
