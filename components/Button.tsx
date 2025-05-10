import React from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
  StyleProp
} from 'react-native';
import { colors, fonts, spacing, borderRadius } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  icon
}: ButtonProps) {
  const { theme } = useTheme();

  const buttonStyle: ViewStyle = {
    ...styles.button,
    ...styles[`button${size.charAt(0).toUpperCase() + size.slice(1)}` as keyof typeof styles],
    ...(fullWidth ? styles.fullWidth : {}),
    ...(disabled ? styles.buttonDisabled : {}),
    ...(variant === 'primary' ? { backgroundColor: theme.primary } : {}),
    ...(variant === 'secondary' ? { backgroundColor: theme.secondary } : {}),
    ...(variant === 'accent' ? { backgroundColor: theme.accent } : {}),
    ...(variant === 'outline' ? {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.primary,
    } : {}),
    ...(variant === 'ghost' ? { backgroundColor: 'transparent' } : {}),
    ...style,
  };

  const textStyleObj: TextStyle = {
    ...styles.text,
    ...styles[`text${size.charAt(0).toUpperCase() + size.slice(1)}` as keyof typeof styles],
    ...(disabled ? styles.textDisabled : {}),
    ...(variant === 'primary' || variant === 'secondary' || variant === 'accent' 
      ? { color: colors.white }
      : { color: theme.primary }
    ),
    ...textStyle,
  };

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
    >
      <View style={styles.contentContainer}>
        {loading ? (
          <ActivityIndicator 
            color={variant === 'outline' || variant === 'ghost' ? theme.primary : colors.white} 
            size="small" 
          />
        ) : (
          <>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text style={textStyleObj}>{title}</Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSm: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  buttonMd: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  buttonLg: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  fullWidth: {
    width: '100%',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: spacing.xs,
  },
  text: {
    fontFamily: fonts.button,
    textAlign: 'center',
  },
  textSm: {
    fontSize: 14,
  },
  textMd: {
    fontSize: 16,
  },
  textLg: {
    fontSize: 18,
  },
  textDisabled: {
    opacity: 0.6,
  },
});