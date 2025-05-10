import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius } from '@/constants/theme';
import Typography from './Typography';

interface BadgeIconProps {
  icon: React.ReactNode;
  count?: number;
  color?: string;
  style?: ViewStyle;
}

export default function BadgeIcon({ 
  icon, 
  count, 
  color = colors.primary[500],
  style 
}: BadgeIconProps) {
  return (
    <View style={[styles.container, style]}>
      {icon}
      
      {count !== undefined && count > 0 && (
        <View 
          style={[
            styles.badge,
            { backgroundColor: color }
          ]}
        >
          <Typography 
            variant="caption" 
            color={colors.white} 
            style={styles.badgeText}
          >
            {count > 99 ? '99+' : count}
          </Typography>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    minWidth: 20,
    height: 20,
    borderRadius: borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});