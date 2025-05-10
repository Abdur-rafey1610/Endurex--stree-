import React from 'react';
import { 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  ViewStyle, 
  Animated, 
  View 
} from 'react-native';
import { colors, fonts, shadows, spacing } from '@/constants/theme';
import { TriangleAlert as AlertTriangle } from 'lucide-react-native';

interface EmergencyButtonProps {
  onPress: () => void;
  style?: ViewStyle;
  title?: string;
}

export default function EmergencyButton({ 
  onPress, 
  style, 
  title = 'SOS Emergency'
}: EmergencyButtonProps) {
  // Animation for pulsing effect
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    const pulse = Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.08,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]);

    Animated.loop(pulse).start();

    return () => {
      pulseAnim.stopAnimation();
    };
  }, [pulseAnim]);

  return (
    <View style={[styles.container, style]}>
      <Animated.View 
        style={[
          styles.pulseContainer,
          { transform: [{ scale: pulseAnim }] }
        ]}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={onPress}
          activeOpacity={0.7}
        >
          <AlertTriangle size={28} color={colors.white} />
          <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseContainer: {
    borderRadius: 28,
    overflow: 'hidden',
  },
  button: {
    backgroundColor: colors.error,
    borderRadius: 28,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
    elevation: 8,
  },
  text: {
    fontFamily: fonts.heading,
    fontSize: 18,
    color: colors.white,
    marginLeft: spacing.sm,
    fontWeight: 'bold',
  },
});