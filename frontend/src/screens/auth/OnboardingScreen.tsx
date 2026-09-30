import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import SeedhaLogo from '../../components/SeedhaLogo';

const slides = [
  {
    img: 'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=800&h=900&fit=crop&auto=format',
    title: 'Find Your\nDream Home',
    sub: "Browse thousands of verified properties across India's top cities.",
    accent: '#2260FF',
  },
  {
    img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=900&fit=crop&auto=format',
    title: 'Rent with\nConfidence',
    sub: 'Transparent listings, verified owners, zero brokerage options.',
    accent: '#7C3AED',
  },
  {
    img: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=900&fit=crop&auto=format',
    title: 'Sell or Rent\nYour Property',
    sub: 'List your property in minutes. Reach lakhs of genuine buyers.',
    accent: '#0891B2',
  },
];

export default function OnboardingScreen() {
  const { push } = useApp();
  const [active, setActive] = useState(0);

  const goNext = () => {
    if (active < slides.length - 1) setActive((a: number) => a + 1);
    else push({ name: 'login' });
  };

  const slide = slides[active];

  return (
    <View style={styles.container}>
      {/* Background image */}
      <Image source={{ uri: slide.img }} style={styles.bgImage} />
      <View style={styles.darkOverlay} />

      {/* Header */}
      <View style={styles.header}>
        <SeedhaLogo light />
        <TouchableOpacity
          onPress={() => push({ name: 'login' })}
          style={styles.skipButton}
          activeOpacity={0.8}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Content Card */}
      <View style={styles.bottomContent}>
        <Text style={styles.titleText}>{slide.title}</Text>
        <Text style={styles.subText}>{slide.sub}</Text>

        {/* Pagination Dots */}
        <View style={styles.dotsRow}>
          {slides.map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setActive(i)}
              style={[
                styles.dot,
                { width: i === active ? 24 : 6, backgroundColor: i === active ? '#FFFFFF' : 'rgba(255,255,255,0.35)' },
              ]}
            />
          ))}
        </View>

        {/* CTA Button */}
        <TouchableOpacity onPress={goNext} style={styles.nextButton} activeOpacity={0.9}>
          <Text style={styles.nextButtonText}>
            {active < slides.length - 1 ? 'Next' : 'Get Started'}
          </Text>
          {active < slides.length - 1 && <ChevronRight size={18} color="white" strokeWidth={2.5} />}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => push({ name: 'login' })} style={styles.loginLink}>
          <Text style={styles.loginLinkText}>
            Already have an account? <Text style={styles.loginBold}>Log In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#051042',
    justifyContent: 'space-between',
  },
  bgImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    resizeMode: 'cover',
  },
  darkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(5, 16, 66, 0.75)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    zIndex: 10,
  },
  skipButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  skipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bottomContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    zIndex: 10,
  },
  titleText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 38,
    marginBottom: 10,
  },
  subText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 20,
    marginBottom: 20,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 24,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  nextButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: '#2260FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 6,
  },
  loginLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
  },
  loginBold: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
