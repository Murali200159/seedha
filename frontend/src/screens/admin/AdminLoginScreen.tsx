import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  ChevronLeft,
  ShieldCheck,
  Lock,
  ArrowRight,
  KeyRound,
  AlertCircle,
} from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import colors from '../../theme/colors';

export default function AdminLoginScreen() {
  const { pop, push, loginAdmin } = useApp();
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = (codeToUse?: string) => {
    const code = codeToUse ?? passcode;
    const success = loginAdmin(code);
    if (success) {
      setError(false);
      push({ name: 'adminDashboard' });
    } else {
      setError(true);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={pop} style={styles.backCircle} activeOpacity={0.8}>
          <ChevronLeft size={20} color={colors.primary} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Portal</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <ShieldCheck size={44} color={colors.primary} />
        </View>

        <Text style={styles.title}>Administrator Access</Text>
        <Text style={styles.subtitle}>
          Authorized Seedha Operations Team & Verification Officers only. Enter your administrator security key.
        </Text>

        <View style={styles.inputCard}>
          <View style={styles.inputRow}>
            <Lock size={18} color={colors.textSecondary} />
            <TextInput
              style={styles.textInput}
              placeholder="Enter Admin Passcode"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              value={passcode}
              onChangeText={t => {
                setPasscode(t);
                if (error) setError(false);
              }}
              onSubmitEditing={() => handleLogin()}
            />
          </View>
        </View>

        {error && (
          <View style={styles.errorRow}>
            <AlertCircle size={14} color={colors.danger} />
            <Text style={styles.errorText}>Invalid passcode. Please try again.</Text>
          </View>
        )}

        <TouchableOpacity
          onPress={() => handleLogin()}
          style={styles.loginBtn}
          activeOpacity={0.9}
        >
          <Text style={styles.loginBtnText}>Authenticate & Enter Hub</Text>
          <ArrowRight size={18} color={colors.textWhite} />
        </TouchableOpacity>

        {/* Quick Demo Access for Testing */}
        <View style={styles.demoBox}>
          <Text style={styles.demoTitle}>Seedha Operations Demo Key</Text>
          <Text style={styles.demoHint}>Default passcode is: <Text style={{ fontWeight: '700' }}>admin123</Text></Text>
          <TouchableOpacity
            onPress={() => {
              setPasscode('admin123');
              handleLogin('admin123');
            }}
            style={styles.quickAccessBtn}
            activeOpacity={0.8}
          >
            <KeyRound size={14} color={colors.secondary} />
            <Text style={styles.quickAccessText}>One-Tap Demo Admin Access</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.tertiaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 28,
  },
  inputCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 15,
    color: colors.primary,
    fontWeight: '600',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  errorText: {
    fontSize: 12,
    color: colors.danger,
    fontWeight: '600',
  },
  loginBtn: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    marginBottom: 24,
  },
  loginBtnText: {
    color: colors.textWhite,
    fontSize: 15,
    fontWeight: '700',
  },
  demoBox: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  demoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 2,
  },
  demoHint: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  quickAccessBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.secondaryBg,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  quickAccessText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.secondary,
  },
});
