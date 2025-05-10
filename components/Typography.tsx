import React, { ReactNode } from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { colors, fonts } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

interface TypographyProps {
  children: ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'caption' | 'button';
  style?: TextStyle;
  color?: string;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  numberOfLines?: number;
}

export default function Typography({
  children,
  variant = 'body1',
  style,
  color,
  align = 'left',
  numberOfLines,
}: TypographyProps) {
  const { theme } = useTheme();

  return (
    <Text
      style={[
        styles.text,
        styles[variant],
        { color: color || theme.text },
        { textAlign: align },
        style,
      ]}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    color: colors.gray[900],
  },
  h1: {
    fontFamily: fonts.heading,
    fontSize: 32,
    lineHeight: 40,
    marginBottom: 16,
  },
  h2: {
    fontFamily: fonts.heading,
    fontSize: 28,
    lineHeight: 36,
    marginBottom: 16,
  },
  h3: {
    fontFamily: fonts.heading,
    fontSize: 24,
    lineHeight: 32,
    marginBottom: 8,
  },
  h4: {
    fontFamily: fonts.heading,
    fontSize: 20,
    lineHeight: 28,
    marginBottom: 8,
  },
  subtitle1: {
    fontFamily: fonts.heading,
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 8,
  },
  subtitle2: {
    fontFamily: fonts.heading,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },
  body1: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
  },
  body2: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
    color: colors.gray[500],
  },
  button: {
    fontFamily: fonts.button,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
});