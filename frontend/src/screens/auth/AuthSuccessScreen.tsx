import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import colors from '../../theme/colors';

export default function AuthSuccessScreen() {
  const { currentScreen, signIn } = useApp();
  const params = (currentScreen.params ?? {}) as { name?: string; phone?: string; email?: string; city?: string };

  const handleExplore = () => {
    signIn({
      name: params.name || 'User',
      phone: params.phone || '',
      email: params.email,
      city: params.city,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.circleOuter}>
        <View style={styles.circleInner}>
          <Check size={36} color={colors.textWhite} strokeWidth={3} />
        </View>
      </View>

      <Text style={styles.title}>You're all set!</Text>
      <Text style={styles.welcomeText}>
        Welcome to Seedha Properties{params.name ? `, ${params.name.split(' ')[0]}` : ''}! 🎉
      </Text>
      <Text style={styles.subtitle}>Let's find the right property for you.</Text>

      <View style={styles.bulletList}>
        <View style={styles.bulletRow}>
          <Text style={styles.bulletEmoji}>🏠</Text>
          <Text style={styles.bulletText}>Browse thousands of verified properties</Text>
        </View>
        <View style={styles.bulletRow}>
          <Text style={styles.bulletEmoji}>🔔</Text>
          <Text style={styles.bulletText}>Get instant alerts for new listings</Text>
        </View>
        <View style={styles.bulletRow}>
          <Text style={styles.bulletEmoji}>📋</Text>
          <Text style={styles.bulletText}>Manage agreements & loans in one place</Text>
        </View>
      </View>

      <TouchableOpacity onPress={handleExplore} style={styles.exploreButton} activeOpacity={0.9}>
        <Text style={styles.exploreButtonText}>Explore Properties</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  circleOuter: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.secondaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  circleInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 6,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  bulletList: {
    width: '100%',
    marginTop: 28,
    gap: 10,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSoft,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.tertiaryLight,
  },
  bulletEmoji: {
    fontSize: 18,
    marginRight: 10,
  },
  bulletText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.primary,
  },
  exploreButton: {
    width: '100%',
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
  },
  exploreButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textWhite,
  },
});
