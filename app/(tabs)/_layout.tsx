import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, shadows, spacing } from '@/constants/theme';
import { Chrome as Home, FileText, TriangleAlert as AlertTriangle, User } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { router } from 'expo-router';

export default function TabLayout() {
  const { theme, isDark } = useTheme();

  return (
    <Tabs
      key="main-tabs"
      screenOptions={{
        headerShown: false,
        tabBarStyle: [styles.tabBar, { 
          backgroundColor: theme.background,
          borderTopColor: theme.border
        }],
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.text + '80',
        tabBarShowLabel: true,
        tabBarLabelStyle: [styles.tabBarLabel, { color: theme.text }],
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: 'Report',
          tabBarIcon: ({ color, size }) => (
            <FileText size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sos"
        options={{
          title: 'SOS',
          tabBarIcon: ({ color }) => (
            <View style={styles.sosContainer}>
              <AlertTriangle size={26} color={colors.error} />
            </View>
          ),
          tabBarActiveTintColor: colors.error,
          tabBarButton: (props) => (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/sos')}
              style={props.style}
            >
              {props.children}
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    elevation: 8,
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
    paddingHorizontal: spacing.lg,
  },
  tabBarLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  sosContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.error + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
});