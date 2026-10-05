import React from 'react';
import { View, StyleSheet } from 'react-native';
import colors from '../theme/colors';

export function SkeletonCard() {
  return (
    <View style={styles.card}>
      <View style={[styles.skeleton, styles.image]} />
      <View style={styles.content}>
        <View style={[styles.skeleton, styles.line1]} />
        <View style={[styles.skeleton, styles.line2]} />
        <View style={[styles.skeleton, styles.line3]} />
        <View style={styles.row}>
          <View style={[styles.skeleton, styles.badge]} />
          <View style={[styles.skeleton, styles.badge]} />
          <View style={[styles.skeleton, styles.badge]} />
        </View>
      </View>
    </View>
  );
}

export function SkeletonList() {
  return (
    <View style={styles.list}>
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  skeleton: {
    backgroundColor: colors.tertiaryLight,
    borderRadius: 4,
  },
  image: {
    height: 160,
    width: '100%',
  },
  content: {
    padding: 14,
  },
  line1: {
    height: 16,
    width: '75%',
    marginBottom: 8,
  },
  line2: {
    height: 12,
    width: '50%',
    marginBottom: 12,
  },
  line3: {
    height: 20,
    width: '35%',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    height: 14,
    width: 48,
  },
  list: {
    paddingVertical: 8,
  },
});
