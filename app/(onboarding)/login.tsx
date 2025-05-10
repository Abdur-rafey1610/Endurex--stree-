import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors, spacing } from '@/constants/theme';
import { router } from 'expo-router';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Typography from '@/components/Typography';
import Logo from '@/assets/images/logo';
import { Lock, Mail } from 'lucide-react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email');
      return false;
    }
    setEmailError(undefined);
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError(undefined);
    return true;
  };

  const handleLogin = () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (isEmailValid && isPasswordValid) {
      router.replace('/(tabs)');
    }
  };

  const handleGuestMode = () => {
    router.replace('/(tabs)');
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Logo size={80} />
          <Typography variant="h2" color={colors.primary[500]} style={styles.title}>
            Welcome Back
          </Typography>
          <Typography variant="body1" color={colors.gray[600]} style={styles.subtitle}>
            Log in to your Stree account
          </Typography>
        </View>

        <View style={styles.formContainer}>
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (emailError) validateEmail(text);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            error={emailError}
            leftIcon={<Mail size={20} color={colors.gray[500]} />}
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (passwordError) validatePassword(text);
            }}
            secureTextEntry
            error={passwordError}
            leftIcon={<Lock size={20} color={colors.gray[500]} />}
          />

          <TouchableOpacity style={styles.forgotPassword}>
            <Typography variant="body2" color={colors.primary[600]}>
              Forgot Password?
            </Typography>
          </TouchableOpacity>

          <Button
            title="Log In"
            onPress={handleLogin}
            size="lg"
            fullWidth
            style={styles.loginButton}
          />

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Typography variant="body2" color={colors.gray[500]} style={styles.dividerText}>
              OR
            </Typography>
            <View style={styles.divider} />
          </View>

          <Button
            title="Continue as Guest"
            onPress={handleGuestMode}
            variant="outline"
            size="lg"
            fullWidth
            style={styles.guestButton}
          />
        </View>

        <View style={styles.footer}>
          <Typography variant="body2" color={colors.gray[600]}>
            Don't have an account?{' '}
          </Typography>
          <TouchableOpacity onPress={() => router.push('/(onboarding)/register')}>
            <Typography variant="body2" color={colors.primary[600]} style={styles.registerLink}>
              Sign Up
            </Typography>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.xl,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    marginTop: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  loginButton: {
    marginTop: spacing.md,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray[300],
  },
  dividerText: {
    marginHorizontal: spacing.md,
  },
  guestButton: {
    marginTop: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  registerLink: {
    fontWeight: 'bold',
  },
});