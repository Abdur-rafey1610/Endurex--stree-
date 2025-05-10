import React, { useRef, useState } from 'react';
import { View, StyleSheet, FlatList, useWindowDimensions, Animated } from 'react-native';
import { router } from 'expo-router';
import { colors, fonts, spacing } from '@/constants/theme';
import Button from '@/components/Button';
import Typography from '@/components/Typography';
import Logo from '@/assets/images/logo';

interface OnboardingItem {
  id: string;
  title: string;
  description: string;
}

const onboardingData: OnboardingItem[] = [
  {
    id: '1',
    title: 'Report Safely & Anonymously',
    description: 'Share your experiences without revealing your identity. Your privacy is our top priority.',
  },
  {
    id: '2',
    title: 'Find Legal & Emotional Support',
    description: 'Access a network of legal resources, counselors, and support groups.',
  },
  {
    id: '3',
    title: 'Know Your Rights & Take Action',
    description: 'Learn about your rights and how to protect yourself in various situations.',
  },
];

export default function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const viewConfigRef = { viewAreaCoveragePercentThreshold: 50 };
  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });

  const goToNextSlide = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.replace('/(onboarding)/login');
    }
  };

  const handleSkip = () => {
    router.replace('/(onboarding)/login');
  };

  const handleGetStarted = () => {
    router.replace('/(onboarding)/login');
  };

  const renderItem = ({ item }: { item: OnboardingItem }) => {
    return (
      <View style={[styles.slide, { width }]}>
        <Typography variant="h2" style={styles.title}>{item.title}</Typography>
        <Typography variant="body1" style={styles.description}>{item.description}</Typography>
      </View>
    );
  };

  const renderDots = () => {
    return (
      <View style={styles.dotContainer}>
        {onboardingData.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 20, 8],
            extrapolate: 'clamp',
          });

          const dotOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                { 
                  width: dotWidth, 
                  opacity: dotOpacity,
                  backgroundColor: colors.primary[500],
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Logo size={120} />
        <Typography variant="h1" color={colors.primary[500]} style={styles.logoText}>
          Stree
        </Typography>
        <Typography variant="subtitle1" color={colors.secondary[500]} style={styles.tagline}>
          Your Voice, Your Power.
        </Typography>
      </View>

      <View style={styles.slidesContainer}>
        <FlatList
          ref={flatListRef}
          data={onboardingData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          onViewableItemsChanged={onViewableItemsChanged.current}
          viewabilityConfig={viewConfigRef}
          scrollEventThrottle={32}
        />
        {renderDots()}
      </View>

      <View style={styles.footer}>
        {currentIndex < onboardingData.length - 1 ? (
          <View style={styles.buttonContainer}>
            <Button title="Skip" variant="ghost" onPress={handleSkip} style={styles.skipButton} />
            <Button title="Next" onPress={goToNextSlide} style={styles.nextButton} />
          </View>
        ) : (
          <Button 
            title="Get Started" 
            variant="accent" 
            onPress={handleGetStarted} 
            fullWidth 
            size="lg"
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
  },
  logoText: {
    marginTop: spacing.md,
    fontFamily: fonts.heading,
  },
  tagline: {
    marginTop: spacing.xs,
    fontFamily: fonts.body,
    opacity: 0.9,
  },
  slidesContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  slide: {
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.md,
    color: colors.primary[700],
  },
  description: {
    textAlign: 'center',
    color: colors.gray[600],
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    paddingTop: spacing.xl,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skipButton: {
    flex: 1,
    marginRight: spacing.md,
  },
  nextButton: {
    flex: 1,
  },
});