import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronLeft, Navigation, Check } from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import colors from '../../theme/colors';

const cities = ['Hyderabad', 'Vizag', 'Vijayawada', 'Bengaluru', 'Chennai', 'Mumbai'];

export default function LocationPermissionScreen() {
  const { currentScreen, push } = useApp();
  const params = (currentScreen.params ?? {}) as { name?: string; phone?: string; email?: string; city?: string };

  const [showManual, setShowManual] = useState(false);
  const [city, setCity] = useState(params.city ?? '');

  const handleAllow = () => {
    push({ name: 'authSuccess', params });
  };

  const handleManualContinue = () => {
    push({ name: 'authSuccess', params: { ...params, city } });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <TouchableOpacity onPress={() => push({ name: 'propertyIntent', params })} style={styles.backCircle} activeOpacity={0.8}>
          <ChevronLeft size={20} color={colors.primary} strokeWidth={2.5} />
        </TouchableOpacity>

        <Text style={styles.stepTag}>STEP 3 OF 3</Text>
        <Text style={styles.mainTitle}>Find properties near you</Text>
        <Text style={styles.subTitle}>Allow location access to discover properties and services around you.</Text>
      </View>

      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        <View style={styles.bodyPadding}>
          {!showManual ? (
            <>
              <View style={styles.navBanner}>
                <View style={styles.navIconBox}>
                  <Navigation size={32} color={colors.textWhite} />
                </View>
                <Text style={styles.navTitle}>Location Access</Text>
                <Text style={styles.navSub}>We use your location to show nearby properties and estimate commute times.</Text>
              </View>

              <View style={styles.bulletsWrap}>
                {[
                  'Discover properties near you',
                  'Get accurate commute estimates',
                  'Find schools, hospitals & metro nearby',
                  'Your location is never shared without consent',
                ].map((item, i) => (
                  <View key={i} style={styles.bulletRow}>
                    <View style={styles.bulletCheck}>
                      <Check size={10} color={colors.secondary} strokeWidth={3} />
                    </View>
                    <Text style={styles.bulletText}>{item}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity onPress={handleAllow} style={styles.mainButton} activeOpacity={0.9}>
                <Text style={styles.mainButtonText}>Allow Location</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setShowManual(true)} style={styles.skipButton}>
                <Text style={styles.skipText}>Enter Location Manually</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.manualHeading}>Select Your City</Text>
              <View style={styles.citiesWrap}>
                {cities.map(c => (
                  <TouchableOpacity
                    key={c}
                    onPress={() => setCity(c)}
                    style={[styles.cityChip, city === c ? styles.selectedChip : styles.unselectedChip]}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.cityChipText, city === c ? styles.selectedChipText : styles.unselectedChipText]}>
                      {c}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                onPress={handleManualContinue}
                disabled={!city}
                style={[styles.mainButton, !city ? styles.disabledButton : null]}
                activeOpacity={0.9}
              >
                <Text style={styles.mainButtonText}>Continue</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setShowManual(false)} style={styles.skipButton}>
                <Text style={styles.skipText}>Use My Location Instead</Text>
              </TouchableOpacity>
            </>
          )}
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
  stepTag: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.secondary,
    letterSpacing: 0.5,
    marginBottom: 4,
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
  scrollArea: {
    flex: 1,
  },
  bodyPadding: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  navBanner: {
    backgroundColor: colors.secondaryBg,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  navIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  navSub: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  bulletsWrap: {
    gap: 12,
    marginBottom: 24,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bulletCheck: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.secondaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  bulletText: {
    fontSize: 13,
    color: colors.primary,
  },
  mainButton: {
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
  mainButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textWhite,
  },
  skipButton: {
    marginTop: 14,
    alignItems: 'center',
  },
  skipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  manualHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
  },
  citiesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  cityChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  selectedChip: {
    backgroundColor: colors.primary,
  },
  unselectedChip: {
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.tertiary,
  },
  cityChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  selectedChipText: {
    color: colors.textWhite,
  },
  unselectedChipText: {
    color: colors.textSecondary,
  },
});
