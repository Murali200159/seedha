import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import {
  ArrowRight,
  Briefcase,
  Building2,
  FileSignature,
  HandCoins,
  House,
  HousePlus,
  KeyRound,
  ShieldCheck,
  Sparkles,
  Wrench,
} from 'lucide-react-native';
import SeedhaLogo from '../components/SeedhaLogo';
import { useApp } from '../context/AppContext';
import colors from '../theme/colors';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1723110994499-df46435aa4b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800';

const heroSlides = [
  {
    tag: 'SEARCH PROPERTY',
    heading: 'Find a place that feels like yours.',
    subText: 'Buy, Rent & Commercial properties in one place.',
    cta1: 'Explore Properties',
    actionType: 'search',
    img: 'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=800&h=420&fit=crop&auto=format',
  },
  {
    tag: 'POST YOUR PROPERTY',
    heading: 'Reach the right people faster.',
    subText: 'List your property and connect with buyers and tenants.',
    cta1: 'Post Property',
    actionType: 'post',
    img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=420&fit=crop&auto=format',
  },
  {
    tag: 'PROPERTY MANAGEMENT',
    heading: 'Manage your property with ease.',
    subText: 'Manage tenants, rent and maintenance in one place.',
    cta1: 'Manage Property',
    actionType: 'care',
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=420&fit=crop&auto=format',
  },
  {
    tag: 'HOME LOANS',
    heading: 'Finance your dream property.',
    subText: 'Explore home loan and property financing options.',
    cta1: 'Explore Home Loans',
    actionType: 'loan',
    img: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=800&h=420&fit=crop&auto=format',
  },
  {
    tag: 'PROPERTY VENTURES',
    heading: 'Invest in the right opportunity.',
    subText: 'Explore property ventures and investment opportunities.',
    cta1: 'Explore Ventures',
    actionType: 'ventures',
    img: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=800&h=420&fit=crop&auto=format',
  },
  {
    tag: 'AGREEMENTS',
    heading: 'Keep your agreements organized.',
    subText: 'Access and manage your property agreements easily.',
    cta1: 'View Agreements',
    actionType: 'agreements',
    img: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&h=420&fit=crop&auto=format',
  },
];

type ServiceItem = {
  label: string;
  subtitle: string;
  icon: any;
  bg: string;
  stat: string;
  detail: string;
  screen?: string;
  params?: any;
  isTab?: string;
};

const services: ServiceItem[] = [
  {
    label: 'Post Property',
    subtitle: 'List & reach buyers',
    icon: HousePlus,
    bg: colors.accent,
    stat: 'Free listing',
    detail: 'Direct buyer inquiries',
    isTab: 'post',
  },
  {
    label: 'Property Care',
    subtitle: 'We manage it for you',
    icon: Wrench,
    bg: colors.secondary,
    stat: '24/7 support',
    detail: 'Rent, repairs & tenants',
    screen: 'rentalAgreement',
  },
  {
    label: 'Home Loans',
    subtitle: 'Best rates, quick approval',
    icon: HandCoins,
    bg: colors.accentDark,
    stat: 'From 8.35%',
    detail: 'Compare leading banks',
    screen: 'homeLoan',
  },
  {
    label: 'Property Ventures',
    subtitle: 'High yield investments',
    icon: Briefcase,
    bg: colors.secondaryDark,
    stat: '12-18% ROI',
    detail: 'Plotting & new launches',
    isTab: 'explore',
  },
];

export default function LandingScreen() {
  const { setTab, push } = useApp();
  const enterApp = () => setTab('home');

  const [activeSlide, setActiveSlide] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const imageScaleAnim = useRef(new Animated.Value(1)).current;
  const slideTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAutoSlide = () => {
    stopAutoSlide();
    slideTimer.current = setInterval(() => {
      handleNextSlide();
    }, 4000);
  };

  const stopAutoSlide = () => {
    if (slideTimer.current) {
      clearInterval(slideTimer.current);
      slideTimer.current = null;
    }
  };

  const animateToNext = (nextIndex: number) => {
    // Phase 1: Smoothly slide out left & fade opacity & scale down image
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -30,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(imageScaleAnim, {
        toValue: 1.08,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Set new slide and reset position to entry right
      setActiveSlide(nextIndex);
      slideAnim.setValue(30);
      imageScaleAnim.setValue(1.05);

      // Phase 2: Smoothly slide in from right to center & fade back in & settle image scale
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(imageScaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleNextSlide = () => {
    const nextIndex = (activeSlide + 1) % heroSlides.length;
    animateToNext(nextIndex);
  };

  const handleSelectSlide = (index: number) => {
    if (index === activeSlide) return;
    stopAutoSlide();
    animateToNext(index);
    startAutoSlide();
  };

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, []);

  const currentHero = heroSlides[activeSlide];

  const handleCtaAction = (actionType: string, isAlt = false) => {
    if (actionType === 'search') {
      if (isAlt) push({ name: 'propertyListing', params: { type: 'rent', title: 'Rent Homes' } });
      else push({ name: 'propertyListing', params: { type: 'buy', title: 'Buy Properties' } });
    } else if (actionType === 'post') {
      setTab('post');
    } else if (actionType === 'care' || actionType === 'agreements') {
      push({ name: 'rentalAgreement' });
    } else if (actionType === 'loan') {
      push({ name: 'homeLoan' });
    } else if (actionType === 'ventures') {
      setTab('explore');
    } else {
      enterApp();
    }
  };

  const handleServiceClick = (item: ServiceItem) => {
    if (item.isTab) {
      setTab(item.isTab);
    } else if (item.screen) {
      push({ name: item.screen as any, params: item.params });
    } else {
      setTab('home');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        <View style={styles.padding}>
          {/* Header */}
          <View style={styles.header}>
            <SeedhaLogo size="md" />
            <TouchableOpacity onPress={enterApp} style={styles.openAppButton} activeOpacity={0.9}>
              <Text style={styles.openAppButtonText}>Open App</Text>
              <ArrowRight size={14} color={colors.textWhite} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          {/* Intro Text */}
          <View style={styles.introWrap}>
            <View style={styles.sparkleRow}>
              <Sparkles size={13} color={colors.accent} />
              <Text style={styles.sparkleText}>YOUR PROPERTY JOURNEY STARTS HERE</Text>
            </View>
            <Text style={styles.mainTitle}>Buy, Rent, Invest & Manage</Text>
            <Text style={styles.mainSubTitle}>All in One Place</Text>

            <View style={styles.trustBadgesRow}>
              <View style={styles.badgeItem}>
                <ShieldCheck size={13} color={colors.secondary} />
                <Text style={styles.badgeText}>Trusted</Text>
              </View>
              <Text style={styles.dot}>·</Text>
              <Text style={styles.badgeText}>Transparent</Text>
              <Text style={styles.dot}>·</Text>
              <Text style={styles.badgeText}>Hassle-free</Text>
            </View>
          </View>

          {/* Hero Banner with Animated Background Image Carousel & Content */}
          <View style={styles.heroBanner}>
            {heroSlides.map((slide, index) => {
              const isCurrent = index === activeSlide;
              return (
                <Animated.Image
                  key={`hero-bg-${index}`}
                  source={{ uri: slide.img }}
                  style={[
                    styles.heroImage,
                    StyleSheet.absoluteFillObject,
                    {
                      opacity: isCurrent ? fadeAnim : 0,
                      transform: [{ scale: isCurrent ? imageScaleAnim : 1 }],
                    },
                  ]}
                />
              );
            })}
            <View style={styles.heroOverlay} />
            <Animated.View
              style={[
                styles.heroContent,
                {
                  opacity: fadeAnim,
                  transform: [{ translateX: slideAnim }],
                },
              ]}
            >
              <View style={styles.heroTopRow}>
                <View style={styles.houseIconBox}>
                  <House size={22} color={colors.textWhite} />
                </View>
                <View style={styles.locationChip}>
                  <Text style={styles.locationChipText}>{currentHero.tag}</Text>
                </View>
              </View>

              <View>
                <Text style={styles.heroHeading}>{currentHero.heading}</Text>
                <Text style={styles.heroSubText}>{currentHero.subText}</Text>

                <View style={styles.ctaRow}>
                  <TouchableOpacity
                    onPress={() => handleCtaAction(currentHero.actionType, false)}
                    style={styles.ctaButton}
                    activeOpacity={0.9}
                  >
                    <House size={15} color={colors.primary} />
                    <Text style={styles.ctaButtonText}>{currentHero.cta1}</Text>
                  </TouchableOpacity>

                  {currentHero.cta2 && (
                    <TouchableOpacity
                      onPress={() => handleCtaAction(currentHero.actionType, true)}
                      style={[styles.ctaButton, styles.rentCtaButton]}
                      activeOpacity={0.9}
                    >
                      <KeyRound size={15} color={colors.primary} />
                      <Text style={styles.rentCtaText}>{currentHero.cta2}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </Animated.View>

            {/* Hero Pagination Dots */}
            <View style={styles.heroPaginationDots}>
              {heroSlides.map((_, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => handleSelectSlide(i)}
                  style={[
                    styles.heroDot,
                    {
                      width: i === activeSlide ? 18 : 6,
                      backgroundColor: i === activeSlide ? colors.textWhite : 'rgba(255,255,255,0.45)',
                    },
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Services Section Header */}
          <View style={styles.servicesSectionHeader}>
            <Text style={styles.servicesTag}>EVERYTHING PROPERTY</Text>
            <Text style={styles.servicesTitle}>What would you like to do?</Text>
          </View>

          {/* Services Grid */}
          <View style={styles.servicesGrid}>
            {/* 1. Combined Parent Card: Search Property */}
            <View style={[styles.serviceCard, styles.searchPropertyParentCard]}>
              <View style={styles.cardHeader}>
                <View style={styles.cardIconBox}>
                  <House size={19} color={colors.textWhite} />
                </View>
                <TouchableOpacity onPress={() => push({ name: 'propertyListing', params: { type: 'buy', title: 'Buy Properties' } })}>
                  <ArrowRight size={16} color="rgba(255,255,255,0.8)" />
                </TouchableOpacity>
              </View>
              <Text style={styles.cardLabel}>Search Property</Text>
              <Text style={styles.cardSub}>Find the right property for your needs</Text>

              {/* Sub-Options Pills: Buy | Rent | Commercial in horizontal row */}
              <View style={styles.subOptionsContainerHorizontal}>
                <TouchableOpacity
                  onPress={() => push({ name: 'propertyListing', params: { type: 'buy', title: 'Buy Properties' } })}
                  style={styles.subOptionPillFlex}
                  activeOpacity={0.85}
                >
                  <House size={13} color={colors.primary} />
                  <Text style={styles.subOptionText}>Buy</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => push({ name: 'propertyListing', params: { type: 'rent', title: 'Rent Homes' } })}
                  style={styles.subOptionPillFlex}
                  activeOpacity={0.85}
                >
                  <KeyRound size={13} color={colors.primary} />
                  <Text style={styles.subOptionText}>Rent</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => push({ name: 'propertyListing', params: { type: 'commercial', title: 'Commercial Spaces' } })}
                  style={styles.subOptionPillFlex}
                  activeOpacity={0.85}
                >
                  <Building2 size={13} color={colors.primary} />
                  <Text style={styles.subOptionText}>Commercial</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 2. Other Service Cards */}
            {services.map((serviceItem) => {
              const { label, subtitle, icon: Icon, bg, stat, detail } = serviceItem;
              return (
                <TouchableOpacity
                  key={label}
                  onPress={() => handleServiceClick(serviceItem)}
                  style={[styles.serviceCard, { backgroundColor: bg }]}
                  activeOpacity={0.9}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.cardIconBox}>
                      <Icon size={19} color={colors.textWhite} />
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
              );
            })}
          </View>
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
  openAppButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  openAppButtonText: {
    fontFamily: colors.fontFamily,
    fontSize: 13,
    fontWeight: '700',
    color: colors.textWhite,
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
    color: colors.accent,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  mainTitle: {
    fontFamily: colors.fontFamily,
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 4,
  },
  mainSubTitle: {
    fontFamily: colors.fontFamily,
    fontSize: 22,
    fontWeight: '800',
    color: colors.secondary,
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
    fontFamily: colors.fontFamily,
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    marginLeft: 3,
  },
  dot: {
    fontSize: 12,
    color: colors.textMuted,
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
    backgroundColor: colors.overlayMedium,
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
    backgroundColor: 'rgba(217, 201, 178, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  locationChipText: {
    fontFamily: colors.fontFamily,
    fontSize: 11,
    color: colors.tertiaryLight,
    fontWeight: '600',
  },
  heroHeading: {
    fontFamily: colors.fontFamily,
    fontSize: 20,
    fontWeight: '800',
    color: colors.textWhite,
    lineHeight: 26,
  },
  heroSubText: {
    fontFamily: colors.fontFamily,
    fontSize: 12,
    color: colors.tertiary,
    marginTop: 4,
  },
  heroPaginationDots: {
    position: 'absolute',
    bottom: 12,
    right: 16,
    flexDirection: 'row',
    gap: 4,
  },
  heroDot: {
    height: 6,
    borderRadius: 3,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  ctaButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 6,
  },
  rentCtaButton: {
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  rentCtaText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 6,
  },
  servicesSectionHeader: {
    marginTop: 20,
    marginBottom: 12,
  },
  servicesTag: {
    fontFamily: colors.fontFamily,
    fontSize: 11,
    fontWeight: '700',
    color: colors.accent,
    letterSpacing: 0.6,
  },
  servicesTitle: {
    fontFamily: colors.fontFamily,
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 2,
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
  searchPropertyParentCard: {
    width: '100%',
    backgroundColor: colors.primary,
    padding: 16,
  },
  subOptionsContainerHorizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  subOptionPillFlex: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 7,
    borderRadius: 12,
    gap: 5,
  },
  subOptionText: {
    fontFamily: colors.fontFamily,
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
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
    color: colors.textWhite,
  },
  cardSub: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
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
    color: colors.textWhite,
  },
  detailText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
});
