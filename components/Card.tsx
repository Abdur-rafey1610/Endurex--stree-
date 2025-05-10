import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors, borderRadius, shadows } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  variant?: 'elevated' | 'outlined' | 'filled';
  elevation?: 'none' | 'sm' | 'md' | 'lg';
}

export default function Card({ 
  children, 
  style, 
  variant = 'elevated',
  elevation = 'md'
}: CardProps) {
  const { theme } = useTheme();

  const getCardStyle = () => {
    switch (variant) {
      case 'outlined':
        return {
          backgroundColor: theme.background,
          borderWidth: 1,
          borderColor: theme.border,
        };
      case 'filled':
        return {
          backgroundColor: theme.card,
        };
      case 'elevated':
      default:
        return {
          backgroundColor: theme.background,
          ...(elevation !== 'none' ? shadows[elevation] : {}),
        };
    }
  };

  return (
    <View style={[styles.card, getCardStyle(), style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    padding: 16,
  },
});