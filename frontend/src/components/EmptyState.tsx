import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Search, Heart, Building2 } from 'lucide-react-native';

interface Props {
  type?: 'search' | 'saved' | 'property' | 'visits' | 'generic';
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  onCta?: () => void;
}

const configs = {
  search: { icon: Search, title: 'No properties found', subtitle: 'Try changing your location or adjusting filters' },
  saved: { icon: Heart, title: 'No saved properties', subtitle: 'Save properties you like and find them here' },
  property: { icon: Building2, title: "You haven't added any properties yet", subtitle: 'Post your first property to get started' },
  visits: { icon: Building2, title: 'No visits scheduled', subtitle: 'Book a visit when you find your ideal property' },
  generic: { icon: Search, title: 'Nothing here yet', subtitle: 'Check back later' },
};

export default function EmptyState({ type = 'generic', title, subtitle, ctaLabel, onCta }: Props) {
  const config = configs[type];
  const IconComponent = config.icon;

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <IconComponent size={28} color="#2260FF" />
      </View>
      <Text style={styles.title}>{title ?? config.title}</Text>
      <Text style={styles.subtitle}>{subtitle ?? config.subtitle}</Text>
      {ctaLabel && onCta ? (
        <TouchableOpacity style={styles.ctaButton} onPress={onCta} activeOpacity={0.8}>
          <Text style={styles.ctaText}>{ctaLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#EBF0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },
  ctaButton: {
    marginTop: 20,
    backgroundColor: '#2260FF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  ctaText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
