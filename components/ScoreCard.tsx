import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '@/constants/theme';
import Card from './Card';
import Typography from './Typography';

interface ScoreCardProps {
  title: string;
  score: number;
  maxScore: number;
  color?: string;
}

export default function ScoreCard({ 
  title, 
  score, 
  maxScore,
  color = colors.primary[500]
}: ScoreCardProps) {
  // Calculate percentage for the progress bar
  const percentage = (score / maxScore) * 100;
  
  return (
    <Card style={styles.card}>
      <Typography variant="subtitle2">{title}</Typography>
      
      <View style={styles.scoreContainer}>
        <Typography variant="h2" color={color} style={styles.scoreText}>
          {score}
        </Typography>
        <Typography variant="body2" color={colors.gray[500]}>
          /{maxScore}
        </Typography>
      </View>
      
      <View style={styles.progressContainer}>
        <View 
          style={[
            styles.progressBar, 
            { width: `${percentage}%`, backgroundColor: color }
          ]} 
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: spacing.sm,
  },
  scoreText: {
    fontWeight: 'bold',
  },
  progressContainer: {
    height: 8,
    backgroundColor: colors.gray[200],
    borderRadius: borderRadius.round,
    overflow: 'hidden',
    marginTop: spacing.sm,
  },
  progressBar: {
    height: '100%',
    borderRadius: borderRadius.round,
  },
});