import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { ChevronLeft, RefreshCw, PhoneCall } from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import colors from '../../theme/colors';

export default function OTPScreen() {
  const { currentScreen, push, pop, signIn } = useApp();
  const { phone = '', mode = 'login' } = (currentScreen.params ?? {}) as { phone: string; mode: string };

  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<TextInput[]>([]);

  const maskedPhone = phone ? `+91 ****${phone.slice(-4)}` : '+91 ****5678';
  const otp = digits.join('');

  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return; }
    const t = setTimeout(() => setCountdown((c: number) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...digits];
    next[i] = val.slice(-1);
    setDigits(next);
    if (val && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const handleVerify = () => {
    if (otp.length !== 6) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (mode === 'login') {
        signIn({ name: 'Rahul Kumar', phone });
      } else {
        push({ name: 'profileSetup', params: { phone } });
      }
    }, 1200);
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topSection}>
        <TouchableOpacity onPress={pop} style={styles.backCircle} activeOpacity={0.8}>
          <ChevronLeft size={20} color={colors.primary} strokeWidth={2.5} />
        </TouchableOpacity>

        <View style={styles.iconBox}>
          <PhoneCall size={26} color={colors.primary} />
        </View>

        <Text style={styles.mainTitle}>Verify your number</Text>
        <Text style={styles.subTitle}>
          Enter the 6-digit code sent to <Text style={styles.phoneBold}>{maskedPhone}</Text>
        </Text>
      </View>

      {/* OTP Boxes */}
      <View style={styles.body}>
        <View style={styles.digitsRow}>
          {digits.map((d: string, i: number) => (
            <TextInput
              key={i}
              ref={(el: TextInput | null) => { if (el) inputRefs.current[i] = el; }}
              keyboardType="number-pad"
              maxLength={1}
              value={d}
              onChangeText={(text: string) => handleChange(i, text)}
              style={[styles.digitInput, d ? styles.activeDigitInput : null]}
              autoFocus={i === 0}
            />
          ))}
        </View>

        <TouchableOpacity
          onPress={handleVerify}
          disabled={otp.length !== 6 || loading}
          style={[styles.verifyButton, otp.length < 6 ? styles.disabledButton : null]}
          activeOpacity={0.9}
        >
          {loading ? (
            <ActivityIndicator color={colors.textWhite} />
          ) : (
            <Text style={styles.verifyButtonText}>Verify & Continue</Text>
          )}
        </TouchableOpacity>

        <View style={styles.resendWrap}>
          <Text style={styles.resendHelp}>Didn't receive the code?</Text>
          {canResend ? (
            <TouchableOpacity
              onPress={() => { setCountdown(30); setCanResend(false); }}
              style={styles.resendRow}
            >
              <RefreshCw size={13} color={colors.accent} />
              <Text style={styles.resendText}>Resend OTP</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.timerText}>Resend in 00:{String(countdown).padStart(2, '0')}</Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  topSection: {
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  backCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
    marginBottom: 16,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.secondaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.primary,
  },
  subTitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  phoneBold: {
    fontWeight: '700',
    color: colors.primary,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  digitsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  digitInput: {
    width: 44,
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.tertiary,
    backgroundColor: colors.surface,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },
  activeDigitInput: {
    borderColor: colors.primary,
    backgroundColor: colors.secondaryBg,
  },
  verifyButton: {
    height: 50,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: colors.tertiaryDark,
    opacity: 0.5,
  },
  verifyButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textWhite,
  },
  resendWrap: {
    alignItems: 'center',
    marginTop: 24,
  },
  resendHelp: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resendText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.accent,
    marginLeft: 4,
  },
  timerText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
});
