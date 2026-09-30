import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
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
  HousePlus,
  BadgeIndianRupee,
  Search,
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { properties } from '../data/properties';

const quickActions = [
  {
    id: 'buy',
    label: 'Buy',
    subtitle: 'Find your dream home',
    bgColor: '#DCFCE7',
    iconColor: '#15803D',
    Icon: House,
  },
  {
    id: 'rent',
    label: 'Rent',
    subtitle: 'Flexible living options',
    bgColor: '#FCE7F3',
    iconColor: '#A21CAF',
    Icon: KeyRound,
  },
  {
    id: 'post',
    label: 'Post Property',
    subtitle: 'Sell or rent out property',
    bgColor: '#FFEDD5',
    iconColor: '#EA580C',
    Icon: HousePlus,
  },
  {
    id: 'loan',
    label: 'Home Loan',
    subtitle: 'Get best loan offers',
    bgColor: '#DBEAFE',
    iconColor: '#1D4ED8',
    Icon: BadgeIndianRupee,
  },
];

const banners = [
  {
    img: 'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=800&h=420&fit=crop&auto=format',
    headline: 'Your Dream Home\nis Just a Tap Away',
    sub: 'Buy  ·  Rent  ·  Sell  ·  Manage',
    cta: 'Explore Properties',
  },
  {
    img: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=800&h=420&fit=crop&auto=format',
    headline: 'Premium Villas\nin Hyderabad',
    sub: '₹1.2 Cr onwards · Gated Community',
    cta: 'View Villas',
  },
  {
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=420&fit=crop&auto=format',
    headline: 'Commercial Spaces\nin HITEC City',
    sub: 'Office · Retail · Co-working',
    cta: 'Explore Spaces',
  },
];

export default function HomeScreen() {
  const { push, toggleSaved, savedIds, notifications } = useApp();
  const [activeBanner, setActiveBanner] = useState(0);
  const recommended = properties.slice(0, 4);

  const handleQuickAction = (id: string) => {
    if (id === 'buy') push({ name: 'propertyListing', params: { type: 'buy', title: 'Buy Properties' } });
    else if (id === 'rent') push({ name: 'propertyListing', params: { type: 'rent', title: 'Rent Homes' } });
    else if (id === 'post') push({ name: 'postProperty' });
    else if (id === 'loan') push({ name: 'homeLoan' });
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
            <Text style={styles.subGreeting}>Find your dream property today</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => push({ name: 'notifications' })}
              style={styles.iconCircle}
              activeOpacity={0.8}
            >
              <Bell size={19} strokeWidth={1.8} color="#374151" />
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
            <Search size={16} color="#9CA3AF" strokeWidth={2.2} />
            <Text style={styles.searchPlaceholder}>Search location, project or property</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => push({ name: 'filters' })}
            style={styles.filterButton}
            activeOpacity={0.8}
          >
            <SlidersHorizontal size={16} strokeWidth={1.9} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Hero Banner ── */}
      <View style={styles.sectionPadding}>
        <View style={styles.bannerCard}>
          <Image source={{ uri: banners[activeBanner].img }} style={styles.bannerImage} />
          <View style={styles.bannerOverlay} />
          <View style={styles.bannerContent}>
            <View>
              <Text style={styles.bannerHeadline}>{banners[activeBanner].headline}</Text>
              <Text style={styles.bannerSub}>{banners[activeBanner].sub}</Text>
            </View>
            <TouchableOpacity
              onPress={() => push({ name: 'explore' })}
              style={styles.bannerCta}
              activeOpacity={0.9}
            >
              <Text style={styles.bannerCtaText}>{banners[activeBanner].cta}</Text>
              <View style={styles.bannerCtaIcon}>
                <ChevronRight size={11} color="white" strokeWidth={3} />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.paginationDots}>
            {banners.map((_, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => setActiveBanner(i)}
                style={[
                  styles.dot,
                  { width: i === activeBanner ? 18 : 6, backgroundColor: i === activeBanner ? '#FFFFFF' : 'rgba(255,255,255,0.45)' },
                ]}
              />
            ))}
          </View>
        </View>
      </View>

      {/* ── Quick Actions ── */}
      <View style={styles.sectionPadding}>
        <View style={styles.quickActionsGrid}>
          {quickActions.map(({ id, label, subtitle, bgColor, iconColor, Icon }) => (
            <TouchableOpacity
              key={id}
              onPress={() => handleQuickAction(id)}
              style={styles.actionCard}
              activeOpacity={0.8}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: bgColor }]}>
                <Icon size={22} color={iconColor} strokeWidth={2.1} />
              </View>
              <Text style={styles.actionLabel}>{label}</Text>
              <Text style={styles.actionSub}>{subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ── Recommended Properties ── */}
      <View style={styles.sectionPadding}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended Properties</Text>
          <TouchableOpacity onPress={() => push({ name: 'explore' })} style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>See All</Text>
            <ChevronRight size={14} color="#2260FF" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        <View style={styles.propertiesGrid}>
          {recommended.map(property => {
            const saved = savedIds.has(property.id);
            const badgeBg = property.listingType === 'buy' ? '#16A34A' : property.listingType === 'rent' ? '#6D28D9' : '#D97706';
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
                      fill={saved ? '#EF4444' : 'transparent'}
                      color={saved ? '#EF4444' : '#6B7280'}
                      strokeWidth={2}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.propertyInfo}>
                  <Text style={styles.propertyTitle} numberOfLines={1}>
                    {property.title}
                  </Text>
                  <View style={styles.locationRow}>
                    <MapPin size={10} color="#9CA3AF" strokeWidth={2} />
                    <Text style={styles.locationText} numberOfLines={1}>
                      {property.location}
                    </Text>
                  </View>
                  <Text style={styles.priceText}>{property.priceLabel}</Text>
                  <View style={styles.statsRow}>
                    {property.bedrooms > 0 && (
                      <View style={styles.statItem}>
                        <BedDouble size={10} color="#9CA3AF" strokeWidth={1.5} />
                        <Text style={styles.statText}>{property.bedrooms} Bed</Text>
                      </View>
                    )}
                    <View style={styles.statItem}>
                      <Bath size={10} color="#9CA3AF" strokeWidth={1.5} />
                      <Text style={styles.statText}>{property.bathrooms} Bath</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Square size={10} color="#9CA3AF" strokeWidth={1.5} />
                      <Text style={styles.statText}>{property.area}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ── Home Loan CTA ── */}
      <View style={[styles.sectionPadding, { marginBottom: 24 }]}>
        <TouchableOpacity
          onPress={() => push({ name: 'homeLoan' })}
          style={styles.loanCard}
          activeOpacity={0.8}
        >
          <View style={styles.loanIconBg}>
            <Landmark size={22} color="#2E7D32" strokeWidth={1.8} />
          </View>
          <View style={styles.loanTextColumn}>
            <Text style={styles.loanTitle}>Check Your Home Loan Eligibility</Text>
            <Text style={styles.loanSub}>Get instant loan offers from top banks</Text>
          </View>
          <ChevronRight size={18} color="#9CA3AF" strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#0F172A',
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
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  waveEmoji: {
    fontSize: 22,
  },
  subGreeting: {
    fontSize: 12,
    color: '#64748B',
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
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifBadge: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  avatarButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#2260FF',
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
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 48,
  },
  searchPlaceholder: {
    fontSize: 13,
    color: '#94A3B8',
    marginLeft: 10,
    flex: 1,
    fontWeight: '500',
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#2260FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2260FF',
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
    shadowColor: '#0F172A',
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
    backgroundColor: 'rgba(5, 16, 66, 0.65)',
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
  bannerHeadline: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 23,
    letterSpacing: -0.2,
  },
  bannerSub: {
    fontSize: 11,
    color: '#BFDBFE',
    marginTop: 4,
    fontWeight: '500',
  },
  bannerCta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingLeft: 12,
    paddingRight: 6,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  bannerCtaText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2260FF',
    marginRight: 6,
  },
  bannerCtaIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#2260FF',
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
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 6,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  actionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
  },
  actionSub: {
    fontSize: 9,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 2,
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
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2260FF',
    marginRight: 2,
  },
  propertiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  propertyCard: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
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
    color: '#FFFFFF',
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
    color: '#0F172A',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  locationText: {
    fontSize: 11,
    color: '#64748B',
    marginLeft: 3,
    flex: 1,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2260FF',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 6,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 10,
    color: '#64748B',
    marginLeft: 2,
    fontWeight: '500',
  },
  loanCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    elevation: 3,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  loanIconBg: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#DCFCE7',
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
    color: '#0F172A',
  },
  loanSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
});
