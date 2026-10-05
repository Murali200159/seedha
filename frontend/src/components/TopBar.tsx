import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import colors from '../theme/colors';

interface Props {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  transparent?: boolean;
  actions?: React.ReactNode;
  onBack?: () => void;
}

export default function TopBar({ title, subtitle, showBack = true, transparent = false, actions, onBack }: Props) {
  const { pop } = useApp();

  return (
    <View style={[styles.container, transparent ? styles.transparentBg : styles.appBg]}>
      {showBack && (
        <TouchableOpacity
          onPress={onBack ?? pop}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ChevronLeft size={20} color={colors.primary} strokeWidth={2.5} />
        </TouchableOpacity>
      )}
      <View style={styles.titleContainer}>
        {title ? <Text style={styles.title} numberOfLines={1}>{title}</Text> : null}
        {subtitle ? <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text> : null}
      </View>
      {actions ? <View style={styles.actionsContainer}>{actions}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    paddingHorizontal: 16,
  },
  appBg: {
    backgroundColor: colors.background,
  },
  transparentBg: {
    backgroundColor: 'transparent',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    marginRight: 10,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.primary,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
