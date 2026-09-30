import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import {
  ArrowRight,
  Building2,
  FileSignature,
  HandCoins,
  House,
  KeyRound,
  ShieldCheck,
  Sparkles,
  Wrench,
} from 'lucide-react-native';
import SeedhaLogo from '../components/SeedhaLogo';
import { useApp } from '../context/AppContext';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1723110994499-df46435aa4b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800';

const services = [
  {
    label: 'Commercial',
    subtitle: 'Office & retail spaces',
    icon: Building2,
    bg: '#EA580C',
    stat: '320+ spaces',
    detail: 'HITEC City & Madhapur',
  },
  {
    label: 'Property Care',
    subtitle: 'We manage it for you',
    icon: Wrench,
    bg: '#059669',
    stat: '24/7 support',
    detail: 'Rent, repairs & tenants',
  },
  {
    label: 'Home Loans',
    subtitle: 'Best rates, quick approval',
    icon: HandCoins,
    bg: '#E11D48',
    stat: 'From 8.35%',
    detail: 'Compare leading banks',
  },
  {
    label: 'Agreements',
    subtitle: 'Legally sound & instant',
    icon: FileSignature,
    bg: '#7C3AED',
    stat: 'Ready in 10 min',
    detail: 'Secure digital signing',
  },
];

export default function LandingScreen() {
  const { setTab } = useApp();
  const enterApp = () => setTab('home');

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        <View style={styles.padding}>
          {/* Header */}
          <View style={styles.header}>
            <SeedhaLogo size="md" />
          </View>

          {/* Intro Text */}
          <View style={styles.introWrap}>
            <View style={styles.sparkleRow}>
              <Sparkles size={13} color="#2260FF" />
              <Text style={styles.sparkleText}>YOUR PROPERTY JOURNEY STARTS HERE</Text>
            </View>
            <Text style={styles.mainTitle}>Buy, Rent, Invest & Manage</Text>
            <Text style={styles.mainSubTitle}>All in One Place</Text>

            <View style={styles.trustBadgesRow}>
              <View style={styles.badgeItem}>
                <ShieldCheck size={13} color="#2260FF" />
                <Text style={styles.badgeText}>Trusted</Text>
              </View>
              <Text style={styles.dot}>·</Text>
              <Text style={styles.badgeText}>Transparent</Text>
              <Text style={styles.dot}>·</Text>
              <Text style={styles.badgeText}>Hassle-free</Text>
            </View>
          </View>

          {/* Hero Banner */}
          <View style={styles.heroBanner}>
            <Image source={{ uri: HERO_IMAGE }} style={styles.heroImage} />
            <View style={styles.heroOverlay} />
            <View style={styles.heroContent}>
              <View style={styles.heroTopRow}>
                <View style={styles.houseIconBox}>
                  <House size={22} color="white" />
                </View>
                <View style={styles.locationChip}>
                  <Text style={styles.locationChipText}>Live in Hyderabad</Text>
                </View>
              </View>

              <View>
                <Text style={styles.heroHeading}>Six property services.{'\n'}One trusted app.</Text>
                <Text style={styles.heroSubText}>Verified homes, loans and legal support in one place.</Text>

                <View style={styles.ctaRow}>
                  <TouchableOpacity onPress={enterApp} style={styles.ctaButton} activeOpacity={0.9}>
                    <House size={15} color="#2260FF" />
                    <Text style={styles.ctaButtonText}>Buy</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={enterApp} style={[styles.ctaButton, styles.rentCtaButton]} activeOpacity={0.9}>
                    <KeyRound size={15} color="#2260FF" />
                    <Text style={styles.rentCtaText}>Rent</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Services Grid */}
          <View style={styles.servicesGrid}>
            {services.map(({ label, subtitle, icon: Icon, bg, stat, detail }) => (
              <TouchableOpacity
                key={label}
                onPress={enterApp}
                style={[styles.serviceCard, { backgroundColor: bg }]}
                activeOpacity={0.9}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.cardIconBox}>
                    <Icon size={19} color="white" />
                  </View>
                  <ArrowRight size={16} color="rgba(255,255,255,0.8)" />
                </View>
                <Text style={styles.cardLabel}>{label}</Text>
                <Text style={styles.cardSub}>{subtitle}</Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.statText}>{stat}</Text>
                  <Text style={styles.detailText}>{detail}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollArea: {
    flex: 1,
  },
  padding: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  introWrap: {
    marginBottom: 16,
  },
  sparkleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sparkleText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2260FF',
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginTop: 4,
  },
  mainSubTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2260FF',
  },
  trustBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  badgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 3,
  },
  dot: {
    fontSize: 12,
    color: '#9CA3AF',
    marginHorizontal: 6,
  },
  heroBanner: {
    height: 260,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 16,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(5, 16, 66, 0.75)',
  },
  heroContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 18,
    justifyContent: 'space-between',
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  houseIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationChip: {
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  locationChipText: {
    fontSize: 11,
    color: '#A7F3D0',
    fontWeight: '600',
  },
  heroHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 26,
  },
  heroSubText: {
    fontSize: 12,
    color: '#BFDBFE',
    marginTop: 4,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  ctaButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2260FF',
    marginLeft: 6,
  },
  rentCtaButton: {
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  rentCtaText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 6,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  serviceCard: {
    width: '48%',
    borderRadius: 20,
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cardSub: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  cardFooter: {
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  statText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  detailText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
});
