import React from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { colors, spacing, fonts, borderRadius, shadows } from '@/constants/theme';
import Typography from '@/components/Typography';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { ChevronLeft, Settings, ShieldCheck, BellRing, FileText, Users, User, Shield, Bell, MapPin, ChevronRight, AlertTriangle, MessageCircle, Heart, TrendingUp, Clock, Star, BookMarked } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import EmergencyButton from '@/components/EmergencyButton';
import ScoreCard from '@/components/ScoreCard';
import BadgeIcon from '@/components/BadgeIcon';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { theme } = useTheme();

  const handleEmergencySOS = () => {
    router.push('/sos');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingTop: spacing.xl, paddingBottom: spacing.xxl }]}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.background }]}>
          <Typography 
            style={{
              fontSize: 32,
              fontWeight: 'bold',
              color: theme.primary,
              textAlign: 'center',
              paddingVertical: spacing.md
            }}
          >
            Stree
          </Typography>
        </View>

        {/* Hero Section */}
        <View style={[styles.heroSection, { backgroundColor: theme.primary }]}>
          <View style={styles.heroContent}>
            <Typography variant="h3" color={colors.white} style={styles.heroTitle}>
              Your Safety Matters
            </Typography>
            <Typography variant="body1" color={colors.white} style={styles.heroSubtitle}>
              Stay protected with our comprehensive safety tools and community support
            </Typography>
          </View>
          <View style={styles.heroStats}>
            <View style={styles.statItem}>
              <Typography variant="h4" color={colors.white}>24/7</Typography>
              <Typography variant="caption" color={colors.white}>Support</Typography>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Typography variant="h4" color={colors.white}>10k+</Typography>
              <Typography variant="caption" color={colors.white}>Users</Typography>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Typography variant="h4" color={colors.white}>98%</Typography>
              <Typography variant="caption" color={colors.white}>Success</Typography>
            </View>
          </View>
        </View>

        {/* Emergency SOS Section */}
        <View style={styles.emergencySection}>
          <EmergencyButton onPress={handleEmergencySOS} />
          <Typography 
            style={{
              marginTop: spacing.sm,
              color: theme.text,
              fontSize: 14,
              lineHeight: 20
            }}
          >
            Press in case of emergency
          </Typography>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Typography 
            style={{
              marginBottom: spacing.md,
              color: theme.text,
              fontSize: 20,
              fontWeight: 'bold'
            }}
          >
            Quick Actions
          </Typography>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={[styles.quickActionCard, { backgroundColor: theme.card }]}
              onPress={() => router.push('/report')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: theme.primary + '20' }]}>
                <Shield size={24} color={theme.primary} />
              </View>
              <Typography variant="subtitle2" style={{ color: theme.text }}>Report Incident</Typography>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.quickActionCard, { backgroundColor: theme.card }]}
              onPress={() => router.push('/screens/routes')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: theme.secondary + '20' }]}>
                <MapPin size={24} color={theme.secondary} />
              </View>
              <Typography variant="subtitle2" style={{ color: theme.text }}>Safe Routes</Typography>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.quickActionCard, { backgroundColor: theme.card }]}
              onPress={() => router.push('/screens/community')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: theme.accent + '20' }]}>
                <Users size={24} color={theme.accent} />
              </View>
              <Typography variant="subtitle2" style={{ color: theme.text }}>Community</Typography>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.quickActionCard, { backgroundColor: theme.card }]}
              onPress={() => router.push('/screens/legal')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: theme.error + '20' }]}>
                <BookMarked size={24} color={theme.error} />
              </View>
              <Typography variant="subtitle2" style={{ color: theme.text }}>Legal Help</Typography>
            </TouchableOpacity>
          </View>
        </View>

        {/* Safety Score */}
        <View style={styles.safetyScoreSection}>
          <Typography 
            style={{
              marginBottom: spacing.md,
              color: theme.text,
              fontSize: 20,
              fontWeight: 'bold'
            }}
          >
            Your Safety Score
          </Typography>
          <ScoreCard
            title="Safety Score"
            score={85}
            maxScore={100}
            color={theme.primary}
          />
        </View>

        {/* Community Insights */}
        <View style={styles.insightsSection}>
          <Typography 
            style={{
              marginBottom: spacing.md,
              color: theme.text,
              fontSize: 20,
              fontWeight: 'bold'
            }}
          >
            Community Insights
          </Typography>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.insightsScroll}
          >
            <Card style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
              borderRadius: 12,
              backgroundColor: theme.card,
              marginRight: spacing.md,
              width: 200
            }}>
              <View style={styles.insightHeader}>
                <View style={[styles.insightIcon, { backgroundColor: theme.primary + '20' }]}>
                  <TrendingUp size={20} color={theme.primary} />
                </View>
                <Typography variant="subtitle2" style={{ color: theme.text }}>
                  Safety Trend
                </Typography>
              </View>
              <Typography variant="body2" style={{ color: theme.text }}>
                Your area's safety has improved by 15% this month
              </Typography>
            </Card>

            <Card style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
              borderRadius: 12,
              backgroundColor: theme.card,
              marginRight: spacing.md,
              width: 200
            }}>
              <View style={styles.insightHeader}>
                <View style={[styles.insightIcon, { backgroundColor: theme.secondary + '20' }]}>
                  <Clock size={20} color={theme.secondary} />
                </View>
                <Typography variant="subtitle2" style={{ color: theme.text }}>
                  Active Hours
                </Typography>
              </View>
              <Typography variant="body2" style={{ color: theme.text }}>
                Most incidents reported between 6 PM - 9 PM
              </Typography>
            </Card>

            <Card style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
              borderRadius: 12,
              backgroundColor: theme.card,
              width: 200
            }}>
              <View style={styles.insightHeader}>
                <View style={[styles.insightIcon, { backgroundColor: theme.accent + '20' }]}>
                  <Star size={20} color={theme.accent} />
                </View>
                <Typography variant="subtitle2" style={{ color: theme.text }}>
                  Community Rating
                </Typography>
              </View>
              <Typography variant="body2" style={{ color: theme.text }}>
                Your neighborhood safety rating: 4.5/5
              </Typography>
            </Card>
          </ScrollView>
        </View>

        {/* Safety Tips */}
        <View style={styles.tipsSection}>
          <Typography 
            style={{
              marginBottom: spacing.md,
              color: theme.text,
              fontSize: 20,
              fontWeight: 'bold'
            }}
          >
            Safety Tips
          </Typography>
          <Card style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
            borderRadius: 12,
            backgroundColor: theme.card
          }}>
            <View style={styles.tipContent}>
              <View style={[styles.tipIcon, { backgroundColor: theme.primary + '20' }]}>
                <AlertTriangle size={24} color={theme.primary} />
              </View>
              <View style={styles.tipText}>
                <Typography variant="subtitle2" style={{ color: theme.text }}>
                  Stay Alert
                </Typography>
                <Typography variant="body2" style={{ color: theme.text }}>
                  Always be aware of your surroundings and trust your instincts
                </Typography>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    // Removed paddingHorizontal
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    marginBottom: spacing.lg,
  },
  heroSection: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  heroContent: {
    marginBottom: spacing.lg,
  },
  heroTitle: {
    marginBottom: spacing.xs,
  },
  heroSubtitle: {
    opacity: 0.9,
  },
  heroStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.white + '40',
  },
  emergencySection: {
    alignItems: 'center',
    marginTop: -30,
    marginBottom: spacing.lg,
  },
  emergencyText: {
    marginTop: spacing.sm,
  },
  quickActionsSection: {
    padding: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  quickActionCard: {
    width: (width - spacing.lg * 2 - spacing.xs * 2) / 2,
    margin: spacing.xs,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.sm,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  safetyScoreSection: {
    padding: spacing.lg,
  },
  safetyScoreCard: {
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  communitySection: {
    padding: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightsContainer: {
    paddingRight: spacing.lg,
  },
  insightCard: {
    width: width * 0.7,
    marginRight: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  insightIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  tipsSection: {
    padding: spacing.lg,
  },
  tipCard: {
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  tipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  tipIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  tipText: {
    flex: 1,
  },
  insightsSection: {
    padding: spacing.lg,
  },
  insightsScroll: {
    paddingRight: spacing.lg,
  },
});