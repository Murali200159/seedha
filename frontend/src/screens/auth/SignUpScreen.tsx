import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { User, Mail, Phone, KeyRound, ArrowRight, CheckSquare, Square } from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import SeedhaLogo from '../../components/SeedhaLogo';
import colors from '../../theme/colors';

export default function SignUpScreen() {
  const { push, pop, signIn } = useApp();
  const [activeSegment, setActiveSegment] = useState<'login' | 'signup'>('signup');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  const isValid = fullName.trim().length > 0 && phone.replace(/\D/g, '').length === 10 && password.length >= 4 && agreeTerms;

  const handleSignUp = () => {
    if (!isValid) return;
    signIn({
      name: fullName.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
    });
  };

  const handleTabChange = (mode: 'login' | 'signup') => {
    setActiveSegment(mode);
    if (mode === 'login') {
      pop();
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
        <Text style={styles.welcomeTag}>Get Started</Text>
        <Text style={styles.mainTitle}>Create your account</Text>
        <Text style={styles.subTitle}>Join Seedha Properties and make your property journey easier.</Text>

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

        {/* Full Name Input */}
        <Text style={styles.inputLabel}>Full Name</Text>
        <View style={styles.inputRow}>
          <User size={18} color={colors.textMuted} style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            placeholder="Rahul Sharma"
            placeholderTextColor={colors.textMuted}
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        {/* Email Address Input */}
        <Text style={styles.inputLabel}>Email Address</Text>
        <View style={styles.inputRow}>
          <Mail size={18} color={colors.textMuted} style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            placeholder="rahul@example.com"
            placeholderTextColor={colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Mobile Number Input */}
        <Text style={styles.inputLabel}>Mobile Number</Text>
        <View style={styles.inputRow}>
          <Phone size={18} color={colors.textMuted} style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter 10-digit mobile number"
            placeholderTextColor={colors.textMuted}
            keyboardType="number-pad"
            maxLength={10}
            value={phone}
            onChangeText={t => setPhone(t.replace(/\D/g, '').slice(0, 10))}
          />
        </View>

        {/* Password Input */}
        <Text style={styles.inputLabel}>Create Password</Text>
        <View style={styles.inputRow}>
          <KeyRound size={18} color={colors.textMuted} style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            placeholder="Create a strong password"
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Terms & Conditions */}
        <View style={styles.optionsRow}>
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setAgreeTerms(!agreeTerms)}
            activeOpacity={0.8}
          >
            {agreeTerms ? (
              <CheckSquare size={18} color={colors.primary} />
            ) : (
              <Square size={18} color={colors.border} />
            )}
            <Text style={styles.checkboxLabel}>I agree to Terms & Conditions and Privacy Policy</Text>
          </TouchableOpacity>
        </View>

        {/* Main CTA */}
        <TouchableOpacity
          onPress={handleSignUp}
          disabled={!isValid}
          style={[styles.signUpButton, !isValid && styles.disabledButton]}
          activeOpacity={0.9}
        >
          <Text style={styles.signUpButtonText}>Create Account</Text>
          <ArrowRight size={18} color={colors.textWhite} style={styles.ctaIcon} />
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>or sign up with</Text>
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
          <Text style={styles.bottomText}>Already have an account? </Text>
          <TouchableOpacity onPress={pop}>
            <Text style={styles.loginAccountText}>Log In</Text>
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
    fontFamily: colors.fontFamily,
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  mainTitle: {
    fontFamily: colors.fontFamily,
    fontSize: 30,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.5,
  },
  subTitle: {
    fontFamily: colors.fontFamily,
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
    fontFamily: colors.fontFamily,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
  },
  segmentTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  inputLabel: {
    fontFamily: colors.fontFamily,
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
    fontFamily: colors.fontFamily,
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
    flex: 1,
  },
  checkboxLabel: {
    fontFamily: colors.fontFamily,
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 8,
    flex: 1,
  },
  signUpButton: {
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
  signUpButtonText: {
    fontFamily: colors.fontFamily,
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
    fontFamily: colors.fontFamily,
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
    fontFamily: colors.fontFamily,
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
    fontFamily: colors.fontFamily,
    fontSize: 13,
    color: colors.textSecondary,
  },
  loginAccountText: {
    fontFamily: colors.fontFamily,
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
});
