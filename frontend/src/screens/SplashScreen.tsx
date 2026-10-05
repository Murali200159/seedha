import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useApp } from '../context/AppContext';
import colors from '../theme/colors';

export default function SplashScreen() {
  const { push } = useApp();

  const logoScale = useRef(new Animated.Value(0.7)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const ringScale = useRef(new Animated.Value(0.9)).current;
  const ringOpacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // 1. Entrance animation (scale + fade in logo)
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 1000,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Pulse ring loop
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(ringScale, {
            toValue: 1.15,
            duration: 1800,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(ringOpacity, {
            toValue: 0.7,
            duration: 1800,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(ringScale, {
            toValue: 0.95,
            duration: 1800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(ringOpacity, {
            toValue: 0.3,
            duration: 1800,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();

    // 3. Auto-transition to onboarding after 2.8 seconds
    const timer = setTimeout(() => {
      push({ name: 'onboarding' });
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Outer Pulse Rings */}
      <Animated.View
        style={[
          styles.ringOuter,
          {
            transform: [{ scale: ringScale }],
            opacity: ringOpacity,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.ringMiddle,
          {
            transform: [{ scale: ringScale }],
            opacity: ringOpacity,
          },
        ]}
      />
      <View style={styles.glowRadial} />

      {/* Main Logo Card & Typography */}
      <Animated.View
        style={[
          styles.centerBox,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <View style={styles.logoBadge}>
          <Text style={styles.logoLetter}>S</Text>
        </View>

        <Animated.View style={{ opacity: textOpacity, alignItems: 'center' }}>
          <Text style={styles.brandTitle}>SEEDHA</Text>
          <Text style={styles.brandSubtitle}>PROPERTIES</Text>
        </Animated.View>
      </Animated.View>

      {/* Bottom Tagline */}
      <Animated.Text style={[styles.bottomTagline, { opacity: textOpacity }]}>
        PROPERTY, SIMPLIFIED.
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringOuter: {
    position: 'absolute',
    width: 290,
    height: 290,
    borderRadius: 145,
    borderWidth: 1,
    borderColor: 'rgba(217, 201, 178, 0.25)',
  },
  ringMiddle: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
    borderWidth: 1,
    borderColor: 'rgba(217, 201, 178, 0.4)',
  },
  glowRadial: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(201, 111, 79, 0.15)',
  },
  centerBox: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  logoBadge: {
    width: 78,
    height: 78,
    borderRadius: 24,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  logoLetter: {
    fontSize: 42,
    fontWeight: '900',
    color: colors.textWhite,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.textWhite,
    letterSpacing: 6,
    textAlign: 'center',
  },
  brandSubtitle: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.65)',
    letterSpacing: 5,
    marginTop: 6,
    textAlign: 'center',
  },
  bottomTagline: {
    position: 'absolute',
    bottom: 50,
    fontSize: 9,
    fontWeight: '600',
    color: colors.tertiary,
    letterSpacing: 3.5,
    textAlign: 'center',
  },
});
