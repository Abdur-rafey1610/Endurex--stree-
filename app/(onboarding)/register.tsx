import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors, spacing } from '@/constants/theme';
import { router } from 'expo-router';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Typography from '@/components/Typography';
import Logo from '@/assets/images/logo';
import { Lock, Mail, User, Phone } from 'lucide-react-native';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [nameError, setNameError] = useState<string | undefined>();
  const [emailError, setEmailError] = useState<string | undefined>();
  const [phoneError, setPhoneError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();

  const validateName = (name: string) => {
    if (!name) {
      setNameError('Name is required');
      return false;
    }
    setNameError(undefined);
    return true;
  };

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

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\d{10}$/;
    if (!phone) {
      return true; // Phone is optional
    } else if (!phoneRegex.test(phone)) {
      setPhoneError('Please enter a valid 10-digit phone number');
      return false;
    }
    setPhoneError(undefined);
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

  const handleRegister = () => {
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPhoneValid = validatePhone(phone);
    const isPasswordValid = validatePassword(password);

    if (isNameValid && isEmailValid && isPhoneValid && isPasswordValid) {
      router.replace('/(tabs)');
    }
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
            Create Account
          </Typography>
          <Typography variant="body1" color={colors.gray[600]} style={styles.subtitle}>
            Join Stree and make a difference
          </Typography>
        </View>

        <View style={styles.formContainer}>
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (nameError) validateName(text);
            }}
            error={nameError}
            leftIcon={<User size={20} color={colors.gray[500]} />}
          />

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
            label="Phone (Optional)"
            placeholder="Enter your phone number"
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              if (phoneError) validatePhone(text);
            }}
            keyboardType="phone-pad"
            error={phoneError}
            leftIcon={<Phone size={20} color={colors.gray[500]} />}
          />

          <Input
            label="Password"
            placeholder="Create a password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (passwordError) validatePassword(text);
            }}
            secureTextEntry
            error={passwordError}
            leftIcon={<Lock size={20} color={colors.gray[500]} />}
          />

          <Typography variant="caption" color={colors.gray[600]} style={styles.privacyText}>
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </Typography>

          <Button
            title="Sign Up"
            onPress={handleRegister}
            size="lg"
            fullWidth
            style={styles.registerButton}
          />
        </View>

        <View style={styles.footer}>
          <Typography variant="body2" color={colors.gray[600]}>
            Already have an account?{' '}
          </Typography>
          <TouchableOpacity onPress={() => router.push('/(onboarding)/login')}>
            <Typography variant="body2" color={colors.primary[600]} style={styles.loginLink}>
              Log In
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
    marginBottom: spacing.md,
  },
  privacyText: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  registerButton: {
    marginTop: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  loginLink: {
    fontWeight: 'bold',
  },
});