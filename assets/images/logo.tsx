import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';
import Svg, { Path, Circle } from 'react-native-svg';

interface LogoProps {
  size?: number;
  color?: string;
}

export default function Logo({ 
  size = 100,
  color = colors.primary[500]
}: LogoProps) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Circle cx="50" cy="50" r="45" fill="transparent" stroke={color} strokeWidth="3" />
        <Path 
          d="M30 40 L50 25 L70 40 L70 70 C70 75 65 80 60 80 L40 80 C35 80 30 75 30 70 Z" 
          fill={color} 
          stroke={color} 
          strokeWidth="2" 
        />
        <Circle cx="50" cy="45" r="8" fill={colors.white} />
        <Path 
          d="M35 65 L65 65 C65 55 35 55 35 65" 
          fill={colors.white} 
          stroke={colors.white} 
          strokeWidth="1" 
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});