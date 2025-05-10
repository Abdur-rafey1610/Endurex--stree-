import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { colors, spacing, borderRadius } from '@/constants/theme';
import Typography from '@/components/Typography';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { MapPin, Navigation, Search, Clock, Shield, AlertTriangle } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import * as Location from 'expo-location';
import { router } from 'expo-router';

interface Route {
  id: string;
  name: string;
  distance: string;
  duration: string;
  safetyScore: number;
  warnings: string[];
}

export default function SafeRoutesScreen() {
  const { theme } = useTheme();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [suggestedRoutes, setSuggestedRoutes] = useState<Route[]>([
    {
      id: '1',
      name: 'Main Street Route',
      distance: '2.5 km',
      duration: '15 mins',
      safetyScore: 85,
      warnings: ['Well-lit streets', 'High pedestrian traffic']
    },
    {
      id: '2',
      name: 'Park Avenue Route',
      distance: '3.1 km',
      duration: '18 mins',
      safetyScore: 90,
      warnings: ['Security cameras', '24/7 surveillance']
    },
    {
      id: '3',
      name: 'Riverside Route',
      distance: '2.8 km',
      duration: '17 mins',
      safetyScore: 75,
      warnings: ['Some areas poorly lit', 'Low pedestrian traffic']
    }
  ]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const handlePlanRoute = () => {
    if (!startLocation || !endLocation) {
      Alert.alert('Missing Information', 'Please enter both start and end locations');
      return;
    }
    // Here you would typically call a routing API to get safe routes
    // For now, we'll just show the suggested routes
  };

  const handleSelectRoute = (route: Route) => {
    // Here you would typically start navigation
    Alert.alert(
      'Start Navigation',
      `Would you like to start navigating via ${route.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Start Navigation', 
          onPress: () => {
            // Here you would typically start the navigation
            console.log('Starting navigation via:', route.name);
          } 
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <Typography variant="h4" color={colors.white}>Safe Routes</Typography>
        <Typography variant="body2" color={colors.white}>Find the safest way to your destination</Typography>
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card style={[styles.searchCard, { backgroundColor: theme.card }]}>
          <View style={styles.inputContainer}>
            <MapPin size={20} color={theme.primary} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Start Location"
              placeholderTextColor={theme.text + '80'}
              value={startLocation}
              onChangeText={setStartLocation}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <MapPin size={20} color={theme.primary} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Destination"
              placeholderTextColor={theme.text + '80'}
              value={endLocation}
              onChangeText={setEndLocation}
            />
          </View>
          
          <Button
            title="Plan Route"
            onPress={handlePlanRoute}
            icon={<Search size={20} color={colors.white} />}
            style={styles.planButton}
          />
        </Card>

        <Typography variant="subtitle1" style={[styles.sectionTitle, { color: theme.text }]}>
          Suggested Safe Routes
        </Typography>

        {suggestedRoutes.map((route) => (
          <Card 
            key={route.id} 
            style={[styles.routeCard, { backgroundColor: theme.card }]}
          >
            <View style={styles.routeHeader}>
              <Typography variant="subtitle2" style={{ color: theme.text }}>
                {route.name}
              </Typography>
              <View style={[styles.safetyScore, { backgroundColor: theme.primary + '20' }]}>
                <Shield size={16} color={theme.primary} />
                <Typography variant="caption" color={theme.primary}>
                  {route.safetyScore}% Safe
                </Typography>
              </View>
            </View>

            <View style={styles.routeDetails}>
              <View style={styles.detailItem}>
                <Navigation size={16} color={theme.text} />
                <Typography variant="body2" style={{ color: theme.text }}>
                  {route.distance}
                </Typography>
              </View>
              <View style={styles.detailItem}>
                <Clock size={16} color={theme.text} />
                <Typography variant="body2" style={{ color: theme.text }}>
                  {route.duration}
                </Typography>
              </View>
            </View>

            <View style={styles.warnings}>
              {route.warnings.map((warning, index) => (
                <View key={index} style={styles.warningItem}>
                  <AlertTriangle size={14} color={theme.secondary} />
                  <Typography variant="caption" style={{ color: theme.text }}>
                    {warning}
                  </Typography>
                </View>
              ))}
            </View>

            <Button
              title="Use This Route"
              onPress={() => handleSelectRoute(route)}
              variant="outline"
              style={styles.routeButton}
            />
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  searchCard: {
    marginBottom: spacing.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: borderRadius.md,
    height: 48,
  },
  input: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: 16,
  },
  planButton: {
    marginTop: spacing.sm,
  },
  sectionTitle: {
    marginBottom: spacing.md,
    fontWeight: 'bold',
  },
  routeCard: {
    marginBottom: spacing.md,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  safetyScore: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  routeDetails: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  warnings: {
    marginBottom: spacing.md,
  },
  warningItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  routeButton: {
    marginTop: spacing.sm,
  },
}); 