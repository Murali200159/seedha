import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
} from 'react-native';
import {
  Bell,
  SlidersHorizontal,
  ChevronRight,
  Heart,
  MapPin,
  BedDouble,
  Bath,
  Square,
  Landmark,
  House,
  KeyRound,
  Building2,
  HousePlus,
  ShieldCheck,
  Briefcase,
  FileSignature,
  Search,
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { properties } from '../data/properties';
import colors from '../theme/colors';

const heroSlides = [
  {
    img: 'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=800&h=420&fit=crop&auto=format',
    tag: 'YOUR PROPERTY JOURNEY STARTS HERE',
    headline: 'Buy, Rent, Invest & Manage All in One Place',
    sub: 'Seedha is your one trusted app for the complete property journey.',
    cta: 'Explore All Properties',
    targetScreen: 'explore',
  },
  {
    img: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=800&h=420&fit=crop&auto=format',
    tag: 'BUY OR RENT WITH CONFIDENCE',
    headline: 'Find verified properties for your next move.',
    sub: 'Verified homes, gated communities & prime locations.',
    cta: 'View Homes',
    targetScreen: 'propertyListing',
    params: { type: 'buy', title: 'Buy Properties' },
  },
  {
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=420&fit=crop&auto=format',
    tag: 'POST YOUR PROPERTY',
    headline: 'Reach buyers and tenants faster.',
    sub: 'Direct inquiries, zero hassle, maximum reach.',
    cta: 'Post Property Free',
    targetScreen: 'postProperty',
  },
  {
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=420&fit=crop&auto=format',
    tag: 'MANAGE YOUR PROPERTY',
    headline: 'Rent, repairs, tenants and more in one place.',
    sub: 'End-to-end property care for modern owners.',
    cta: 'Explore Property Care',
    targetScreen: 'rentalAgreement',
  },
  {
    img: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=800&h=420&fit=crop&auto=format',
    tag: 'FINANCE YOUR DREAM PROPERTY',
    headline: 'Explore home loans and property opportunities.',
    sub: 'Low interest rates starting from 8.35% p.a.',
    cta: 'Check Eligibility',
    targetScreen: 'homeLoan',
  },
];

export default function HomeScreen() {
  const { push, toggleSaved, savedIds, notifications, setTab } = useApp();
  const [activeSlide, setActiveSlide] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const recommended = properties.slice(0, 4);

  // Auto-slide logic (Every 3.5 seconds)
  const startAutoSlide = () => {
    stopAutoSlide();
    slideTimer.current = setInterval(() => {
      handleNextSlide();
    }, 3500);
  };

  const stopAutoSlide = () => {
    if (slideTimer.current) {
      clearInterval(slideTimer.current);
      slideTimer.current = null;
    }
  };

  const handleNextSlide = () => {
    Animated.timing(fadeAnim, {
      toValue: 0.3,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setActiveSlide(prev => (prev + 1) % heroSlides.length);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }).start();
    });
  };

  const handlePrevSlide = () => {
    Animated.timing(fadeAnim, {
      toValue: 0.3,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setActiveSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleManualSelectSlide = (index: number) => {
    stopAutoSlide();
    Animated.timing(fadeAnim, {
      toValue: 0.3,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setActiveSlide(index);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        startAutoSlide();
      });
    });
  };

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, []);

  // Gesture responder for left/right swipe on mobile
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 40) {
          stopAutoSlide();
          handlePrevSlide();
          startAutoSlide();
        } else if (gestureState.dx < -40) {
          stopAutoSlide();
          handleNextSlide();
          startAutoSlide();
        }
      },
    })
  ).current;

  const currentHero = heroSlides[activeSlide];

  const handleSearchOption = (type: 'buy' | 'rent' | 'commercial') => {
    if (type === 'buy') push({ name: 'propertyListing', params: { type: 'buy', title: 'Buy Properties' } });
    else if (type === 'rent') push({ name: 'propertyListing', params: { type: 'rent', title: 'Rent Homes' } });
    else if (type === 'commercial') push({ name: 'propertyListing', params: { type: 'commercial', title: 'Commercial Spaces' } });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greetingText}>Good Morning,</Text>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>Rahul</Text>
              <Text style={styles.waveEmoji}> 👋</Text>
            </View>
            <Text style={styles.subGreeting}>Seedha · One Trusted App for Your Complete Property Journey</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => push({ name: 'notifications' })}
              style={styles.iconCircle}
              activeOpacity={0.8}
            >
              <Bell size={19} strokeWidth={1.8} color={colors.primary} />
              {notifications > 0 && <View style={styles.notifBadge} />}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => push({ name: 'profile' })}
              style={styles.avatarButton}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format' }}
                style={styles.avatarImage}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchRow}>
          <TouchableOpacity
            onPress={() => push({ name: 'search' })}
            style={styles.searchBar}
            activeOpacity={0.9}
          >
            <Search size={16} color={colors.textMuted} strokeWidth={2.2} />
            <Text style={styles.searchPlaceholder}>Search location, project or property</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => push({ name: 'filters' })}
            style={styles.filterButton}
            activeOpacity={0.8}
          >
            <SlidersHorizontal size={16} strokeWidth={1.9} color={colors.textWhite} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── 1. Animated Hero Carousel ── */}
      <View style={styles.sectionPadding}>
        <View style={styles.bannerCard} {...panResponder.panHandlers}>
          <Animated.Image source={{ uri: currentHero.img }} style={[styles.bannerImage, { opacity: fadeAnim }]} />
          <View style={styles.bannerOverlay} />
          <Animated.View style={[styles.bannerContent, { opacity: fadeAnim }]}>
            <View>
              <Text style={styles.bannerTag}>{currentHero.tag}</Text>
              <Text style={styles.bannerHeadline}>{currentHero.headline}</Text>
              <Text style={styles.bannerSub}>{currentHero.sub}</Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                if (currentHero.targetScreen === 'explore') setTab('explore');
                else push({ name: currentHero.targetScreen as any, params: currentHero.params });
              }}
              style={styles.bannerCta}
              activeOpacity={0.9}
            >
              <Text style={styles.bannerCtaText}>{currentHero.cta}</Text>
              <View style={styles.bannerCtaIcon}>
                <ChevronRight size={11} color={colors.textWhite} strokeWidth={3} />
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Carousel Pagination Dots */}
          <View style={styles.paginationDots}>
            {heroSlides.map((_, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => handleManualSelectSlide(i)}
                style={[
                  styles.dot,
                  { width: i === activeSlide ? 18 : 6, backgroundColor: i === activeSlide ? colors.textWhite : 'rgba(255,255,255,0.45)' },
                ]}
              />
            ))}
          </View>
        </View>
      </View>

      {/* ── 2. Search Property Group (Buy | Rent | Commercial) ── */}
      <View style={styles.sectionPadding}>
        <Text style={styles.groupSectionTitle}>Search Property</Text>
        <View style={styles.searchPropertyGrid}>
          {/* Buy */}
          <TouchableOpacity
            onPress={() => handleSearchOption('buy')}
            style={styles.searchOptionCard}
            activeOpacity={0.85}
          >
            <View style={[styles.searchOptionIconBox, { backgroundColor: colors.primaryBg }]}>
              <House size={20} color={colors.primary} strokeWidth={2.2} />
            </View>
            <Text style={styles.searchOptionTitle}>Buy</Text>
            <Text style={styles.searchOptionSub}>Find your dream property</Text>
          </TouchableOpacity>

          {/* Rent */}
          <TouchableOpacity
            onPress={() => handleSearchOption('rent')}
            style={styles.searchOptionCard}
            activeOpacity={0.85}
          >
            <View style={[styles.searchOptionIconBox, { backgroundColor: colors.secondaryBg }]}>
              <KeyRound size={20} color={colors.secondary} strokeWidth={2.2} />
            </View>
            <Text style={styles.searchOptionTitle}>Rent</Text>
            <Text style={styles.searchOptionSub}>Find a place that fits you</Text>
          </TouchableOpacity>

          {/* Commercial */}
          <TouchableOpacity
            onPress={() => handleSearchOption('commercial')}
            style={styles.searchOptionCard}
            activeOpacity={0.85}
          >
            <View style={[styles.searchOptionIconBox, { backgroundColor: colors.accentBg }]}>
              <Building2 size={20} color={colors.accent} strokeWidth={2.2} />
            </View>
            <Text style={styles.searchOptionTitle}>Commercial</Text>
            <Text style={styles.searchOptionSub}>Find office & retail spaces</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── 3. More Services Group ── */}
      <View style={styles.sectionPadding}>
        <Text style={styles.groupSectionTitle}>More Services</Text>
        <View style={styles.moreServicesGrid}>
          {/* Post Property */}
          <TouchableOpacity
            onPress={() => setTab('post')}
            style={styles.moreServiceCard}
            activeOpacity={0.85}
          >
            <View style={[styles.moreServiceIconBox, { backgroundColor: colors.accentBg }]}>
              <HousePlus size={18} color={colors.accent} strokeWidth={2.1} />
            </View>
            <View style={styles.moreServiceTextCol}>
              <Text style={styles.moreServiceTitle}>Post Property</Text>
              <Text style={styles.moreServiceSub}>List & reach buyers or tenants</Text>
            </View>
          </TouchableOpacity>

          {/* Property Management */}
          <TouchableOpacity
            onPress={() => push({ name: 'rentalAgreement' })}
            style={styles.moreServiceCard}
            activeOpacity={0.85}
          >
            <View style={[styles.moreServiceIconBox, { backgroundColor: colors.secondaryBg }]}>
              <ShieldCheck size={18} color={colors.secondary} strokeWidth={2.1} />
            </View>
            <View style={styles.moreServiceTextCol}>
              <Text style={styles.moreServiceTitle}>Property Management</Text>
              <Text style={styles.moreServiceSub}>Manage tenants, rent & repairs</Text>
            </View>
          </TouchableOpacity>

          {/* Home Loans */}
          <TouchableOpacity
            onPress={() => push({ name: 'homeLoan' })}
            style={styles.moreServiceCard}
            activeOpacity={0.85}
          >
            <View style={[styles.moreServiceIconBox, { backgroundColor: colors.tertiaryBg }]}>
              <Landmark size={18} color={colors.primary} strokeWidth={2.1} />
            </View>
            <View style={styles.moreServiceTextCol}>
              <Text style={styles.moreServiceTitle}>Home Loans</Text>
              <Text style={styles.moreServiceSub}>Explore financing options</Text>
            </View>
          </TouchableOpacity>

          {/* Ventures */}
          <TouchableOpacity
            onPress={() => setTab('explore')}
            style={styles.moreServiceCard}
            activeOpacity={0.85}
          >
            <View style={[styles.moreServiceIconBox, { backgroundColor: colors.primaryBg }]}>
              <Briefcase size={18} color={colors.primary} strokeWidth={2.1} />
            </View>
            <View style={styles.moreServiceTextCol}>
              <Text style={styles.moreServiceTitle}>Ventures</Text>
              <Text style={styles.moreServiceSub}>Explore investment opportunities</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Recommended Properties ── */}
      <View style={styles.sectionPadding}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended Properties</Text>
          <TouchableOpacity onPress={() => setTab('explore')} style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>See All</Text>
            <ChevronRight size={14} color={colors.secondary} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        <View style={styles.propertiesGrid}>
          {recommended.map(property => {
            const saved = savedIds.has(property.id);
            const badgeBg = property.listingType === 'buy' ? colors.primary : property.listingType === 'rent' ? colors.secondary : colors.accent;
            const badgeLabel = property.listingType === 'buy' ? 'For Sale' : property.listingType === 'rent' ? 'For Rent' : 'Commercial';

            return (
              <TouchableOpacity
                key={property.id}
                onPress={() => push({ name: 'propertyDetail', params: { property } })}
                style={styles.propertyCard}
                activeOpacity={0.9}
              >
                <View style={styles.propertyImageContainer}>
                  <Image source={{ uri: property.image }} style={styles.propertyImage} />
                  <View style={[styles.badge, { backgroundColor: badgeBg }]}>
                    <Text style={styles.badgeText}>{badgeLabel}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => toggleSaved(property.id)}
                    style={styles.heartCircle}
                    activeOpacity={0.8}
                  >
                    <Heart
                      size={14}
                      fill={saved ? colors.accent : 'transparent'}
                      color={saved ? colors.accent : colors.textMuted}
                      strokeWidth={2}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.propertyInfo}>
                  <Text style={styles.propertyTitle} numberOfLines={1}>
                    {property.title}
                  </Text>
                  <View style={styles.locationRow}>
                    <MapPin size={10} color={colors.textMuted} strokeWidth={2} />
                    <Text style={styles.locationText} numberOfLines={1}>
                      {property.location}
                    </Text>
                  </View>
                  <Text style={styles.priceText}>{property.priceLabel}</Text>
                  <View style={styles.statsRow}>
                    {property.bedrooms > 0 && (
                      <View style={styles.statItem}>
                        <BedDouble size={10} color={colors.textMuted} strokeWidth={1.5} />
                        <Text style={styles.statText}>{property.bedrooms} Bed</Text>
                      </View>
                    )}
                    <View style={styles.statItem}>
                      <Bath size={10} color={colors.textMuted} strokeWidth={1.5} />
                      <Text style={styles.statText}>{property.bathrooms} Bath</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Square size={10} color={colors.textMuted} strokeWidth={1.5} />
                      <Text style={styles.statText}>{property.area}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingText: {
    fontFamily: colors.fontFamily,
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  userName: {
    fontFamily: colors.fontFamily,
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.4,
  },
  waveEmoji: {
    fontSize: 22,
  },
  subGreeting: {
    fontFamily: colors.fontFamily,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.tertiaryLight,
  },
  notifBadge: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  avatarButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  searchRow: {
    flexDirection: 'row',
    marginTop: 14,
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSoft,
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: colors.tertiary,
  },
  searchPlaceholder: {
    fontSize: 13,
    color: colors.textMuted,
    marginLeft: 10,
    flex: 1,
    fontWeight: '500',
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  sectionPadding: {
    paddingHorizontal: 18,
    marginBottom: 16,
  },
  bannerCard: {
    height: 165,
    borderRadius: 22,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.overlayMedium,
  },
  bannerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    justifyContent: 'space-between',
  },
  bannerTag: {
    fontFamily: colors.fontFamily,
    fontSize: 10,
    fontWeight: '700',
    color: colors.tertiary,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  bannerHeadline: {
    fontFamily: colors.fontFamily,
    fontSize: 18,
    fontWeight: '800',
    color: colors.textWhite,
    lineHeight: 23,
  },
  bannerSub: {
    fontFamily: colors.fontFamily,
    fontSize: 11,
    color: colors.tertiaryLight,
    marginTop: 4,
    fontWeight: '500',
  },
  bannerCta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingLeft: 12,
    paddingRight: 6,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  bannerCtaText: {
    fontFamily: colors.fontFamily,
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    marginRight: 6,
  },
  bannerCtaIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paginationDots: {
    position: 'absolute',
    bottom: 12,
    right: 14,
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  groupSectionTitle: {
    fontFamily: colors.fontFamily,
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 10,
  },
  searchPropertyGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  searchOptionCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.tertiary,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  searchOptionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  searchOptionTitle: {
    fontFamily: colors.fontFamily,
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
  },
  searchOptionSub: {
    fontFamily: colors.fontFamily,
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  moreServicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  moreServiceCard: {
    width: '48.5%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.tertiary,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  moreServiceIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  moreServiceTextCol: {
    flex: 1,
  },
  moreServiceTitle: {
    fontFamily: colors.fontFamily,
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  moreServiceSub: {
    fontFamily: colors.fontFamily,
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.2,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.secondary,
    marginRight: 2,
  },
  propertiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  propertyCard: {
    width: '48.5%',
    backgroundColor: colors.surface,
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: colors.tertiary,
  },
  propertyImageContainer: {
    height: 128,
    position: 'relative',
  },
  propertyImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textWhite,
  },
  heartCircle: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  propertyInfo: {
    padding: 10,
  },
  propertyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  locationText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginLeft: 3,
    flex: 1,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.tertiaryLight,
    gap: 6,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 10,
    color: colors.textSecondary,
    marginLeft: 2,
    fontWeight: '500',
  },
  loanCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 14,
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: colors.tertiary,
  },
  loanIconBg: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: colors.secondaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loanTextColumn: {
    flex: 1,
    marginLeft: 12,
  },
  loanTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  loanSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
