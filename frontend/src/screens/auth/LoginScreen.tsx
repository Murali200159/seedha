import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import SeedhaLogo from '../../components/SeedhaLogo';

export default function LoginScreen() {
  const { push, pop } = useApp();
  const [phone, setPhone] = useState('');
  const isValid = phone.replace(/\s/g, '').length === 10;

  const handleContinue = () => {
    if (!isValid) return;
    push({ name: 'otp', params: { phone, mode: 'login' } });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <TouchableOpacity onPress={pop} style={styles.backCircle} activeOpacity={0.8}>
          <ChevronLeft size={20} color="#111827" strokeWidth={2.5} />
        </TouchableOpacity>

        <SeedhaLogo />

        <View style={styles.titleWrap}>
          <Text style={styles.mainTitle}>Welcome Back</Text>
          <Text style={styles.subTitle}>Sign in to continue your property journey.</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        <View style={styles.formPadding}>
          {/* Mobile input */}
          <Text style={styles.inputLabel}>Mobile Number</Text>
          <View style={styles.phoneInputRow}>
            <View style={styles.flagBox}>
              <Text style={styles.flagText}>🇮🇳  +91</Text>
            </View>
            <TextInput
              keyboardType="number-pad"
              maxLength={10}
              style={styles.phoneInput}
              placeholder="Enter mobile number"
              placeholderTextColor="#9CA3AF"
              value={phone}
              onChangeText={(text: string) => setPhone(text.replace(/\D/g, '').slice(0, 10))}
            />
          </View>

          {/* Continue CTA */}
          <TouchableOpacity
            onPress={handleContinue}
            disabled={!isValid}
            style={[styles.continueButton, !isValid ? styles.disabledButton : null]}
            activeOpacity={0.9}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity
            onPress={() => push({ name: 'profileSetup', params: { mode: 'google' } })}
            style={styles.socialButton}
            activeOpacity={0.8}
          >
            <Text style={styles.socialButtonText}>Google Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => push({ name: 'signup' })}>
          <Text style={styles.signUpLinkText}>
            Don't have an account? <Text style={styles.signUpBold}>Create Account</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topSection: {
    backgroundColor: '#F8F9FF',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  backCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
    marginBottom: 16,
  },
  titleWrap: {
    marginTop: 16,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  subTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  scrollArea: {
    flex: 1,
  },
  formPadding: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 6,
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    height: 50,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  flagBox: {
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  flagText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  phoneInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    paddingLeft: 12,
  },
  continueButton: {
    height: 50,
    borderRadius: 16,
    backgroundColor: '#2260FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#C7D5FF',
  },
  continueButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginHorizontal: 10,
  },
  socialButton: {
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  signUpLinkText: {
    fontSize: 13,
    color: '#6B7280',
  },
  signUpBold: {
    fontWeight: '700',
    color: '#2260FF',
  },
});
