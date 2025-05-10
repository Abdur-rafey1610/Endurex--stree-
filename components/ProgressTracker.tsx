import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '@/constants/theme';
import Typography from './Typography';

interface ProgressTrackerProps {
  steps: string[];
  currentStep: number;
  completed?: boolean;
}

export default function ProgressTracker({ 
  steps, 
  currentStep, 
  completed = false 
}: ProgressTrackerProps) {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep || completed;
        
        return (
          <View key={index} style={styles.stepContainer}>
            <View style={styles.stepRow}>
              <View 
                style={[
                  styles.stepIndicator,
                  isActive && styles.activeIndicator,
                  isCompleted && styles.completedIndicator
                ]}
              >
                <Typography 
                  variant="caption" 
                  color={isActive || isCompleted ? colors.white : colors.gray[600]}
                >
                  {index + 1}
                </Typography>
              </View>
              
              {index < steps.length - 1 && (
                <View 
                  style={[
                    styles.line,
                    (isCompleted || (isActive && index > 0)) && styles.completedLine
                  ]} 
                />
              )}
            </View>
            
            <Typography 
              variant="body2" 
              color={isActive ? colors.primary[500] : isCompleted ? colors.secondary[500] : colors.gray[500]}
              style={styles.stepText}
            >
              {step}
            </Typography>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: spacing.md,
    width: '100%',
  },
  stepContainer: {
    flex: 1,
    alignItems: 'center',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  stepIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  activeIndicator: {
    backgroundColor: colors.primary[500],
  },
  completedIndicator: {
    backgroundColor: colors.secondary[500],
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: colors.gray[200],
    marginHorizontal: 0,
  },
  completedLine: {
    backgroundColor: colors.secondary[500],
  },
  stepText: {
    marginTop: spacing.xs,
    textAlign: 'center',
    fontSize: 11,
  },
});