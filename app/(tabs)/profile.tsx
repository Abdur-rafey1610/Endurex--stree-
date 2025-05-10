import React from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  Image,
  TouchableOpacity,
} from 'react-native';
import { colors, spacing, fonts } from '@/constants/theme';
import Typography from '@/components/Typography';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { ChevronLeft, Settings, ShieldCheck, BellRing, FileText, Users, Moon, Sun } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function ProfileScreen() {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={colors.white} />
        </TouchableOpacity>
        <Typography variant="h3" color={colors.white}>Profile</Typography>
        <TouchableOpacity style={styles.settingsButton}>
          <Settings size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }} 
            style={styles.profileImage}
          />
          <Typography variant="h4" style={{ ...styles.profileName, color: theme.text }}>Sarah Johnson</Typography>
          <Typography variant="body2" color={colors.gray[500]}>sarah.j@email.com</Typography>
        </View>

        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Typography variant="h4" color={theme.primary}>78</Typography>
            <Typography variant="body2" color={colors.gray[500]}>Safety Score</Typography>
          </Card>
          <Card style={styles.statCard}>
            <Typography variant="h4" color={theme.secondary}>450</Typography>
            <Typography variant="body2" color={colors.gray[500]}>Impact Points</Typography>
          </Card>
        </View>

        <View style={styles.menuSection}>
          <Typography variant="subtitle1" style={{ ...styles.sectionTitle, color: theme.text }}>
            Account Settings
          </Typography>
          
          <Card style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: colors.primary[50] }]}>
                  <ShieldCheck size={20} color={colors.primary[500]} />
                </View>
                <Typography variant="body1" style={{ color: theme.text }}>Safety Settings</Typography>
              </View>
              <ChevronLeft size={20} color={colors.gray[400]} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: colors.secondary[50] }]}>
                  <BellRing size={20} color={colors.secondary[500]} />
                </View>
                <Typography variant="body1" style={{ color: theme.text }}>Notifications</Typography>
              </View>
              <ChevronLeft size={20} color={colors.gray[400]} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: colors.accent[50] }]}>
                  <FileText size={20} color={colors.accent[500]} />
                </View>
                <Typography variant="body1" style={{ color: theme.text }}>My Reports</Typography>
              </View>
              <ChevronLeft size={20} color={colors.gray[400]} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: colors.warning + '20' }]}>
                  <Users size={20} color={colors.warning} />
                </View>
                <Typography variant="body1" style={{ color: theme.text }}>Community Activity</Typography>
              </View>
              <ChevronLeft size={20} color={colors.gray[400]} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={toggleTheme}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: isDark ? colors.gray[800] : colors.gray[100] }]}>
                  {isDark ? (
                    <Sun size={20} color={colors.warning} />
                  ) : (
                    <Moon size={20} color={colors.gray[700]} />
                  )}
                </View>
                <Typography variant="body1" style={{ color: theme.text }}>
                  {isDark ? 'Light Mode' : 'Dark Mode'}
                </Typography>
              </View>
              <ChevronLeft size={20} color={colors.gray[400]} />
            </TouchableOpacity>
          </Card>
        </View>

        <Button 
          title="Sign Out" 
          variant="outline" 
          onPress={() => {}} 
          style={{ ...styles.signOutButton, borderColor: colors.error }}
          textStyle={{ color: colors.error }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  backButton: {
    padding: spacing.xs,
  },
  settingsButton: {
    padding: spacing.xs,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: spacing.md,
  },
  profileName: {
    marginBottom: spacing.xs,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  statCard: {
    width: '48%',
    alignItems: 'center',
    padding: spacing.md,
  },
  menuSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
  },
  menuCard: {
    padding: spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  signOutButton: {
    marginTop: spacing.md,
  },
}); 