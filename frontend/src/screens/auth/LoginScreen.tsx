import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { User, KeyRound, ArrowRight, CheckSquare, Square, ShieldCheck, AlertCircle } from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import SeedhaLogo from '../../components/SeedhaLogo';
import colors from '../../theme/colors';

export default function LoginScreen() {
  const { push, signIn } = useApp();
  const [activeSegment, setActiveSegment] = useState<'login' | 'signup'>('login');
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isValid = identity.trim().length > 0 && password.length >= 4;

  const handleLogin = async () => {
    if (!isValid || isLoading) return;
    setIsLoading(true);
    setErrorMessage(null);

    const cleanIdentity = identity.trim();

    try {
      const response = await api.auth.login(cleanIdentity, password);
      if (response && response.user) {
        signIn(response.user, response.accessToken);
        return;
      } else {
        throw new Error('Invalid response received from server');
      }
    } catch (err: any) {
      console.warn('Backend login attempt failed:', err.message);

      // Offline / fallback handling for quick test demo accounts
      const lower = cleanIdentity.toLowerCase();
      if ((lower === 'admin@seedhaproperties.com' || lower === 'admin') && (password === 'admin123' || password === 'admin')) {
        signIn({
          id: 'admin_1',
          name: 'Administrator',
          email: 'admin@seedhaproperties.com',
          phone: '+91 98480 11223',
          role: 'ADMIN',
          city: 'Hyderabad',
        }, 'demo_admin_token');
        return;
      }

      if ((lower === 'rahul@example.com' || cleanIdentity === '9876543210') && (password === 'password123' || password === 'admin123')) {
        signIn({
          id: 'usr_rahul',
          name: 'Rahul Sharma',
          email: 'rahul@example.com',
          phone: '+91 98765 43210',
          role: 'USER',
          city: 'Hyderabad',
        }, 'demo_user_token');
        return;
      }

      setErrorMessage(
        err.message?.includes('fetch') || err.message?.includes('Network')
          ? 'Backend server not responding on port 4000. You can tap Admin or Customer above for instant demo login.'
          : (err.message || 'Invalid credentials. Please check your email and password.')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fillQuickDemo = (type: 'admin' | 'user') => {
    setErrorMessage(null);
    if (type === 'admin') {
      setIdentity('admin@seedhaproperties.com');
      setPassword('admin123');
    } else {
      setIdentity('rahul@example.com');
      setPassword('password123');
    }
  };

  const handleTabChange = (mode: 'login' | 'signup') => {
    setActiveSegment(mode);
    if (mode === 'signup') {
      push({ name: 'signup' });
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.headerRow}>
        <SeedhaLogo />
      </View>

      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Title Section */}
        <Text style={styles.welcomeTag}>Welcome back</Text>
        <Text style={styles.mainTitle}>Sign in to Seedha</Text>
        <Text style={styles.subTitle}>Continue your property journey with verified security & real-time authorization.</Text>

        {/* Quick Demo 1-Click Fillers */}
        <View style={styles.quickFillContainer}>
          <Text style={styles.quickFillLabel}>⚡ Quick Test Logins:</Text>
          <View style={styles.quickFillRow}>
            <TouchableOpacity
              style={[styles.quickBadge, styles.adminBadge]}
              onPress={() => fillQuickDemo('admin')}
              activeOpacity={0.8}
            >
              <ShieldCheck size={14} color="#B45309" />
              <Text style={styles.adminBadgeText}>Admin (Full Queues)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickBadge, styles.userBadge]}
              onPress={() => fillQuickDemo('user')}
              activeOpacity={0.8}
            >
              <User size={14} color={colors.primary} />
              <Text style={styles.userBadgeText}>Customer (Rahul)</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Log in / Sign up Segment Switcher */}
        <View style={styles.segmentContainer}>
          <TouchableOpacity
            style={[styles.segmentButton, activeSegment === 'login' && styles.segmentActive]}
            onPress={() => handleTabChange('login')}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentText, activeSegment === 'login' && styles.segmentTextActive]}>Log in</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segmentButton, activeSegment === 'signup' && styles.segmentActive]}
            onPress={() => handleTabChange('signup')}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentText, activeSegment === 'signup' && styles.segmentTextActive]}>Sign up</Text>
          </TouchableOpacity>
        </View>

        {/* Error Alert Banner */}
        {errorMessage ? (
          <View style={styles.errorAlert}>
            <AlertCircle size={16} color={colors.danger} />
            <Text style={styles.errorAlertText}>{errorMessage}</Text>
          </View>
        ) : null}

        {/* Email or Mobile Number Input */}
        <Text style={styles.inputLabel}>Email or mobile number</Text>
        <View style={styles.inputRow}>
          <User size={18} color={colors.textMuted} style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            placeholder="admin@seedhaproperties.com"
            placeholderTextColor={colors.textMuted}
            value={identity}
            onChangeText={setIdentity}
            autoCapitalize="none"
          />
        </View>

        {/* Password Input */}
        <Text style={styles.inputLabel}>Password</Text>
        <View style={styles.inputRow}>
          <KeyRound size={18} color={colors.textMuted} style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            placeholder="admin123"
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Keep me signed in & Forgot password */}
        <View style={styles.optionsRow}>
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setKeepSignedIn(!keepSignedIn)}
            activeOpacity={0.8}
          >
            {keepSignedIn ? (
              <CheckSquare size={18} color={colors.primary} />
            ) : (
              <Square size={18} color={colors.border} />
            )}
            <Text style={styles.checkboxLabel}>Keep me signed in</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => push({ name: 'otp', params: { mode: 'login' } })}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        {/* Main CTA */}
        <TouchableOpacity
          onPress={handleLogin}
          disabled={!isValid || isLoading}
          style={[styles.loginButton, (!isValid || isLoading) && styles.disabledButton]}
          activeOpacity={0.9}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.textWhite} />
          ) : (
            <>
              <Text style={styles.loginButtonText}>Log in securely</Text>
              <ArrowRight size={18} color={colors.textWhite} style={styles.ctaIcon} />
            </>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.line} />
        </View>

        {/* Social Buttons */}
        <View style={styles.socialGroup}>
          <TouchableOpacity
            onPress={() => push({ name: 'profileSetup', params: { mode: 'google' } })}
            style={styles.socialButton}
            activeOpacity={0.8}
          >
            <View style={styles.iconContainer}>
              <Svg width="20" height="20" viewBox="0 0 24 24">
                <Path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <Path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <Path
                  fill="#FBBC05"
                  d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"
                />
                <Path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </Svg>
            </View>
            <Text style={styles.socialButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => push({ name: 'profileSetup', params: { mode: 'apple' } })}
            style={styles.socialButton}
            activeOpacity={0.8}
          >
            <View style={styles.iconContainer}>
              <Svg width="20" height="20" viewBox="0 0 24 24">
                <Path
                  fill={colors.primary}
                  d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.35c.67-.82 1.12-1.96.99-3.1-.96.04-2.13.64-2.82 1.44-.61.71-1.15 1.88-.99 3 .01 0 .04.01.07.01 1.08 0 2.16-.58 2.75-1.35z"
                />
              </Svg>
            </View>
            <Text style={styles.socialButtonText}>Continue with Apple</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Link */}
        <View style={styles.bottomRow}>
          <Text style={styles.bottomText}>New to Seedha Properties? </Text>
          <TouchableOpacity onPress={() => push({ name: 'signup' })}>
            <Text style={styles.createAccountText}>Create an account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  headerRow: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  welcomeTag: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  mainTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.5,
  },
  subTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 20,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: colors.radiusPill,
    padding: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.tertiary,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: colors.radiusPill - 4,
  },
  segmentActive: {
    backgroundColor: colors.surface,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
  },
  segmentTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.tertiary,
    borderRadius: colors.radiusLg,
    height: 52,
    paddingHorizontal: 14,
    backgroundColor: colors.surface,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: colors.primary,
    borderWidth: 0,
    outlineWidth: 0,
    ...( { outlineStyle: 'none' } as any ),
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 2,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  loginButton: {
    height: 52,
    borderRadius: colors.radiusLg,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  disabledButton: {
    opacity: 0.5,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textWhite,
  },
  ctaIcon: {
    marginLeft: 8,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.tertiary,
  },
  dividerText: {
    fontSize: 12,
    color: colors.textMuted,
    marginHorizontal: 12,
  },
  socialGroup: {
    gap: 12,
  },
  socialButton: {
    height: 52,
    borderRadius: colors.radiusLg,
    borderWidth: 1.5,
    borderColor: colors.tertiary,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  iconContainer: {
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
  },
  bottomText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  createAccountText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  quickFillContainer: {
    backgroundColor: colors.surfaceSoft,
    padding: 12,
    borderRadius: colors.radiusMd,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickFillLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  quickFillRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickBadge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: colors.radiusSm,
    gap: 6,
  },
  adminBadge: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  adminBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
  },
  userBadge: {
    backgroundColor: colors.primaryBg,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  userBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  errorAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dangerBg,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: colors.radiusMd,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FECDD3',
    gap: 8,
  },
  errorAlertText: {
    flex: 1,
    fontSize: 13,
    color: colors.danger,
    fontWeight: '500',
  },
});
