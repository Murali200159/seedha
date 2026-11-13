import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import {
  Menu,
  Bell,
  Search,
  SlidersHorizontal,
  Heart,
  MapPin,
  BedDouble,
  Bath,
  Square,
  House,
  KeyRound,
  Building2,
  HousePlus,
  Landmark,
  FileText,
  UserCheck,
  CheckCircle2,
  ArrowRight,
  User,
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { properties } from '../data/properties';

// Popular localities in Hyderabad matching the Figma design & screenshot
const POPULAR_LOCATIONS = [
  {
    id: 'loc-1',
    name: 'Jubilee Hills',
    city: 'Hyderabad',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=800&fit=crop&auto=format',
  },
  {
    id: 'loc-2',
    name: 'Banjara Hills',
    city: 'Hyderabad',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=800&fit=crop&auto=format',
  },
  {
    id: 'loc-3',
    name: 'Hitec City',
    city: 'Hyderabad',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=800&fit=crop&auto=format',
  },
  {
    id: 'loc-4',
    name: 'Gachibowli',
    city: 'Hyderabad',
    image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600&h=800&fit=crop&auto=format',
  },
];

export default function HomeScreen() {
  const { push, savedIds, toggleSaved, notifications, setTab } = useApp();
  const [activeCategory, setActiveCategory] = useState('buy');

  // Find properties for spotlight, featured horizontal carousel, and recommended list
  const spotlightProperty =
    properties.find((p) => p.id === 'spotlight-1') || properties[0];

  const featuredProperties = properties
    .filter((p) => p.id === 'feat-1' || p.id === 'feat-2' || p.featured)
    .slice(0, 4);

  const recommendedProperties = properties
    .filter((p) => p.id === 'rec-1' || p.id === 'rec-2' || (!p.featured && p.id !== 'spotlight-1'))
    .slice(0, 4);

  const handleCategoryPress = (key: string) => {
    setActiveCategory(key);
    switch (key) {
      case 'buy':
        push({ name: 'propertyListing', params: { type: 'buy', title: 'Buy Properties' } });
        break;
      case 'rent':
        push({ name: 'propertyListing', params: { type: 'rent', title: 'Rent Homes' } });
        break;
      case 'commercial':
        push({ name: 'propertyListing', params: { type: 'commercial', title: 'Commercial Spaces' } });
        break;
      case 'manage':
        push({ name: 'propertyManagement' });
        break;
      case 'loans':
        push({ name: 'homeLoan' });
        break;
      case 'agreements':
        push({ name: 'rentalAgreement' });
        break;
      case 'verify':
        push({ name: 'ownerVerification' });
        break;
      default:
        break;
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* ── 1. Header Bar ── */}
      <View style={styles.header}>
        {/* Left: Menu & Seedha Properties Brand */}
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => push({ name: 'profile' })}
            activeOpacity={0.7}
          >
            <Menu size={20} color="#000000" strokeWidth={2.2} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.brandContainer}
            onPress={() => setTab('home')}
            activeOpacity={0.8}
          >
            <View style={styles.logoBadge}>
              <House size={13} color="#FFFFFF" strokeWidth={2.4} />
            </View>
            <View style={styles.brandTextStack}>
              <Text style={styles.brandTitle}>Seedha</Text>
              <Text style={styles.brandSubtitle}>PROPERTIES</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Right: Notifications & Profile Avatar */}
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.notifButton}
            onPress={() => push({ name: 'notifications' })}
            activeOpacity={0.8}
          >
            <Bell size={18} color="#1A1C1A" strokeWidth={2.2} />
            {notifications > 0 && <View style={styles.notifDot} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.profileAvatar}
            onPress={() => push({ name: 'profile' })}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format' }}
              style={styles.avatarImg}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── 2. Search & Filter Bar ── */}
      <View style={styles.searchSection}>
        <View style={styles.searchPill}>
          <TouchableOpacity
            style={styles.searchInputArea}
            onPress={() => push({ name: 'search' })}
            activeOpacity={0.85}
          >
            <Search size={17} color="#747874" strokeWidth={2.2} />
            <Text style={styles.searchPlaceholder} numberOfLines={1}>
              Search localities in Hyderabad, proper...
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => push({ name: 'filters' })}
            activeOpacity={0.8}
          >
            <SlidersHorizontal size={16} color="#1A1C1A" strokeWidth={2.4} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── 3. Service Categories Horizontal Carousel ── */}
      <View style={styles.categoriesSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
        >
          {/* 1. Buy (Active default) */}
          <TouchableOpacity
            style={[
              styles.categoryCard,
              activeCategory === 'buy' && styles.categoryCardActive,
            ]}
            onPress={() => handleCategoryPress('buy')}
            activeOpacity={0.8}
          >
            <View style={styles.categoryIconBox}>
              <House size={18} color="#434844" strokeWidth={2.2} />
            </View>
            <Text style={styles.categoryText}>Buy</Text>
          </TouchableOpacity>

          {/* 2. Rent */}
          <TouchableOpacity
            style={styles.categoryCard}
            onPress={() => handleCategoryPress('rent')}
            activeOpacity={0.8}
          >
            <View style={styles.categoryIconBox}>
              <KeyRound size={18} color="#434844" strokeWidth={2.2} />
            </View>
            <Text style={styles.categoryText}>Rent</Text>
          </TouchableOpacity>

          {/* 3. Commercial */}
          <TouchableOpacity
            style={[styles.categoryCard, { minWidth: 78 }]}
            onPress={() => handleCategoryPress('commercial')}
            activeOpacity={0.8}
          >
            <View style={styles.categoryIconBox}>
              <Building2 size={18} color="#434844" strokeWidth={2.2} />
            </View>
            <Text style={styles.categoryText}>Commercial</Text>
          </TouchableOpacity>

          {/* 4. Manage (Property Management) */}
          <TouchableOpacity
            style={styles.categoryCard}
            onPress={() => handleCategoryPress('manage')}
            activeOpacity={0.8}
          >
            <View style={styles.categoryIconBox}>
              <HousePlus size={18} color="#434844" strokeWidth={2.2} />
            </View>
            <Text style={styles.categoryText}>Manage</Text>
          </TouchableOpacity>

          {/* 5. Home Loans */}
          <TouchableOpacity
            style={[styles.categoryCard, { minWidth: 84 }]}
            onPress={() => handleCategoryPress('loans')}
            activeOpacity={0.8}
          >
            <View style={styles.categoryIconBox}>
              <Landmark size={18} color="#434844" strokeWidth={2.2} />
            </View>
            <Text style={styles.categoryText}>Home Loans</Text>
          </TouchableOpacity>

          {/* 6. Rental Agreements */}
          <TouchableOpacity
            style={[styles.categoryCard, { minWidth: 84 }]}
            onPress={() => handleCategoryPress('agreements')}
            activeOpacity={0.8}
          >
            <View style={styles.categoryIconBox}>
              <FileText size={18} color="#434844" strokeWidth={2.2} />
            </View>
            <Text style={styles.categoryText}>Agreements</Text>
          </TouchableOpacity>

          {/* 7. Verify Owner (Obsidian Dark Card) */}
          <TouchableOpacity
            style={styles.verifyOwnerCard}
            onPress={() => handleCategoryPress('verify')}
            activeOpacity={0.85}
          >
            <View style={styles.verifyOwnerIconBox}>
              <UserCheck size={18} color="#FFFFFF" strokeWidth={2.2} />
            </View>
            <Text style={styles.verifyOwnerText}>Verify Owner</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* ── 4. Section - Featured Property Spotlight Card ── */}
      <View style={styles.spotlightSection}>
        <TouchableOpacity
          style={styles.spotlightCard}
          onPress={() =>
            push({ name: 'propertyDetail', params: { property: spotlightProperty } })
          }
          activeOpacity={0.92}
        >
          <Image
            source={{ uri: spotlightProperty.image }}
            style={styles.spotlightImage}
          />
          {/* Dark Gradient Scrim */}
          <View style={styles.spotlightScrim} />

          {/* Top Floating Badges */}
          <View style={styles.spotlightTopRow}>
            <View style={styles.featuredPill}>
              <View style={styles.featuredDot} />
              <Text style={styles.featuredPillText}>Featured</Text>
            </View>

            {/* Image Carousel Dots */}
            <View style={styles.carouselDotsRow}>
              <View style={styles.activeDot} />
              <View style={styles.inactiveDot} />
              <View style={styles.inactiveDot} />
              <View style={styles.inactiveDot} />
            </View>

            {/* Save to favorites button */}
            <TouchableOpacity
              style={styles.spotlightFavButton}
              onPress={() => toggleSaved(spotlightProperty.id)}
              activeOpacity={0.8}
            >
              <Heart
                size={17}
                color={savedIds.has(spotlightProperty.id) ? '#FF385C' : '#1A1C1A'}
                fill={savedIds.has(spotlightProperty.id) ? '#FF385C' : 'transparent'}
                strokeWidth={2.2}
              />
            </TouchableOpacity>
          </View>

          {/* Bottom Property Info */}
          <View style={styles.spotlightBottomInfo}>
            <View style={styles.spotlightMainRow}>
              <View style={styles.spotlightTitleCol}>
                <Text style={styles.spotlightTitle} numberOfLines={2}>
                  {spotlightProperty.title}
                </Text>
                <View style={styles.spotlightLocationRow}>
                  <MapPin size={12} color="rgba(255, 255, 255, 0.85)" strokeWidth={2.2} />
                  <Text style={styles.spotlightLocationText} numberOfLines={1}>
                    {spotlightProperty.location}
                  </Text>
                </View>
              </View>

              <Text style={styles.spotlightPrice}>
                {spotlightProperty.priceLabel}
              </Text>
            </View>

            {/* Frosted Glass Specs Pill Tray */}
            <View style={styles.specsPillTray}>
              <View style={styles.specItem}>
                <BedDouble size={14} color="#FFDBCC" strokeWidth={2.2} />
                <Text style={styles.specText}>{spotlightProperty.bedrooms} Beds</Text>
              </View>
              <View style={styles.specDot} />
              <View style={styles.specItem}>
                <Bath size={14} color="#FFDBCC" strokeWidth={2.2} />
                <Text style={styles.specText}>{spotlightProperty.bathrooms} Baths</Text>
              </View>
              <View style={styles.specDot} />
              <View style={styles.specItem}>
                <Square size={13} color="#FFDBCC" strokeWidth={2.2} />
                <Text style={styles.specText}>
                  {spotlightProperty.area.toLocaleString()} sqft
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* ── 5. Popular Locations Section ── */}
      <View style={styles.locationsSection}>
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.sectionTitle}>Popular Locations</Text>
            <Text style={styles.sectionSubtitle}>
              Top curated Hyderabad localities
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => push({ name: 'search' })}
            activeOpacity={0.7}
          >
            <Text style={styles.viewAllText}>View all &gt;</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.locationsScroll}
        >
          {POPULAR_LOCATIONS.map((loc) => (
            <TouchableOpacity
              key={loc.id}
              style={styles.locationCard}
              onPress={() =>
                push({
                  name: 'propertyListing',
                  params: { location: loc.name, title: loc.name },
                })
              }
              activeOpacity={0.88}
            >
              <Image source={{ uri: loc.image }} style={styles.locationImage} />
              <View style={styles.locationScrim} />
              <View style={styles.locationTextStack}>
                <Text style={styles.locationName}>{loc.name}</Text>
                <Text style={styles.locationCity}>{loc.city}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── 6. Featured Properties (Horizontal Carousel) ── */}
      <View style={styles.featuredSection}>
        <View style={styles.sectionHeaderPadding}>
          <Text style={styles.sectionTitleBlack}>Featured Properties</Text>
          <Text style={styles.sectionSubtitleMuted}>
            Handpicked properties selected for you
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredScroll}
        >
          {featuredProperties.map((prop) => (
            <TouchableOpacity
              key={prop.id}
              style={styles.featuredCard}
              onPress={() => push({ name: 'propertyDetail', params: { property: prop } })}
              activeOpacity={0.9}
            >
              <View style={styles.featuredCardImageWrapper}>
                <Image source={{ uri: prop.image }} style={styles.featuredCardImage} />

                {/* For Sale / Rent Pill */}
                <View style={styles.listingTypePill}>
                  <Text style={styles.listingTypeText}>
                    {prop.listingType === 'rent' ? 'FOR RENT' : 'FOR SALE'}
                  </Text>
                </View>

                {/* Favorite Heart Button */}
                <TouchableOpacity
                  style={styles.smallFavButton}
                  onPress={() => toggleSaved(prop.id)}
                  activeOpacity={0.8}
                >
                  <Heart
                    size={14}
                    color={savedIds.has(prop.id) ? '#FF385C' : '#1A1C1A'}
                    fill={savedIds.has(prop.id) ? '#FF385C' : 'transparent'}
                    strokeWidth={2.2}
                  />
                </TouchableOpacity>

                {/* Bottom Chips on Image */}
                <View style={styles.imageBottomChipsRow}>
                  <View style={styles.chipDark}>
                    <Text style={styles.chipDarkText}>
                      {prop.city || 'Hyderabad'}
                    </Text>
                  </View>
                  <View style={styles.chipBordered}>
                    <Text style={styles.chipBorderedText}>Ready to Move</Text>
                  </View>
                </View>
              </View>

              {/* Card Body Details */}
              <View style={styles.featuredCardBody}>
                <View style={styles.featuredTitleRow}>
                  <Text style={styles.featuredTitle} numberOfLines={1}>
                    {prop.title}
                  </Text>
                  {prop.verified && (
                    <CheckCircle2 size={16} color="#055808" strokeWidth={2.4} />
                  )}
                </View>

                <View style={styles.cardLocationRow}>
                  <MapPin size={11} color="#737373" strokeWidth={2} />
                  <Text style={styles.cardLocationText} numberOfLines={1}>
                    {prop.location}
                  </Text>
                </View>

                <View style={styles.cardDivider} />

                <View style={styles.priceRow}>
                  <Text style={styles.cardPriceText}>{prop.priceLabel}</Text>
                  <Text style={styles.cardExploreText}>Explore &rarr;</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── 7. Section - Promotional Banner ── */}
      <TouchableOpacity
        style={styles.promoBanner}
        onPress={() => push({ name: 'ownerVerification' })}
        activeOpacity={0.9}
      >
        <View style={styles.promoLeftCol}>
          <Text style={styles.promoEyebrow}>TRUST YOU CAN COUNT ON</Text>
          <Text style={styles.promoHeading}>Verified Owners. Safer Decisions.</Text>
          <Text style={styles.promoDesc}>
            All property documents are verified with sub-registrar records & digital title audit.
          </Text>
        </View>

        <View style={styles.promoArrowButton}>
          <ArrowRight size={16} color="#000000" strokeWidth={2.6} />
        </View>
      </TouchableOpacity>

      {/* ── 8. Recommended Properties (Vertical List) ── */}
      <View style={styles.recommendedSection}>
        <View style={styles.sectionHeaderPadding}>
          <Text style={styles.sectionTitleBlack}>Recommended Properties</Text>
          <Text style={styles.sectionSubtitleMuted}>
            Properties that match your preferences
          </Text>
        </View>

        <View style={styles.recommendedList}>
          {recommendedProperties.map((prop) => (
            <TouchableOpacity
              key={prop.id}
              style={styles.recommendedCard}
              onPress={() => push({ name: 'propertyDetail', params: { property: prop } })}
              activeOpacity={0.92}
            >
              <View style={styles.recommendedImageWrapper}>
                <Image source={{ uri: prop.image }} style={styles.recommendedImage} />

                <View style={styles.listingTypePill}>
                  <Text style={styles.listingTypeText}>
                    {prop.listingType === 'rent' ? 'FOR RENT' : 'FOR SALE'}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.smallFavButton}
                  onPress={() => toggleSaved(prop.id)}
                  activeOpacity={0.8}
                >
                  <Heart
                    size={14}
                    color={savedIds.has(prop.id) ? '#FF385C' : '#1A1C1A'}
                    fill={savedIds.has(prop.id) ? '#FF385C' : 'transparent'}
                    strokeWidth={2.2}
                  />
                </TouchableOpacity>

                <View style={styles.imageBottomChipsRow}>
                  <View style={styles.chipDark}>
                    <Text style={styles.chipDarkText}>
                      {prop.area ? `${prop.area.toLocaleString()} sq.ft` : '2,450 sq.ft'}
                    </Text>
                  </View>
                  <View style={styles.chipBordered}>
                    <Text style={styles.chipBorderedText}>Ready to Move</Text>
                  </View>
                </View>
              </View>

              <View style={styles.recommendedBody}>
                <View style={styles.featuredTitleRow}>
                  <Text style={styles.recommendedTitle} numberOfLines={1}>
                    {prop.title}
                  </Text>
                  {prop.verified && (
                    <CheckCircle2 size={18} color="#055808" strokeWidth={2.4} />
                  )}
                </View>

                <View style={styles.cardLocationRow}>
                  <MapPin size={12} color="#737373" strokeWidth={2} />
                  <Text style={styles.cardLocationText} numberOfLines={1}>
                    {prop.location}
                  </Text>
                </View>

                <View style={styles.cardDivider} />

                <View style={styles.priceRow}>
                  <Text style={styles.recPriceText}>{prop.priceLabel}</Text>
                  <Text style={styles.cardExploreText}>Explore &rarr;</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // ── Header Bar ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 64,
    backgroundColor: '#FFFFFF',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBadge: {
    width: 24,
    height: 24,
    borderRadius: 7,
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: '#262626',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandTextStack: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 5,
  },
  brandTitle: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.4,
  },
  brandSubtitle: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 9,
    fontWeight: '500',
    color: '#737373',
    letterSpacing: 1.8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notifButton: {
    width: 44,
    height: 44,
    borderRadius: 9999,
    backgroundColor: '#F4F3F0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 11,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: 9999,
    backgroundColor: '#863838',
    borderWidth: 2,
    borderColor: '#FAF9F6',
  },
  profileAvatar: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    backgroundColor: '#09130E',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },

  // ── Search & Filter ──
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  searchPill: {
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 18,
    paddingRight: 6,
    shadowColor: '#1E2822',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 3,
    borderWidth: Platform.OS === 'android' ? 0.8 : 0.5,
    borderColor: '#EFEEEB',
  },
  searchInputArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: '100%',
  },
  searchPlaceholder: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13.5,
    color: '#747874',
    flex: 1,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 9999,
    backgroundColor: '#EFEEEB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── Categories ──
  categoriesSection: {
    paddingVertical: 8,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  categoryCard: {
    width: 74,
    minWidth: 74,
    height: 86,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1E2822',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 18,
    elevation: 2,
    borderWidth: 0.6,
    borderColor: '#F0EFEA',
  },
  categoryCardActive: {
    borderColor: '#E2E0D8',
  },
  categoryIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F4F3F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11,
    fontWeight: '500',
    color: '#1A1C1A',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  verifyOwnerCard: {
    minWidth: 89,
    height: 86,
    borderRadius: 16,
    backgroundColor: '#09130E',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  verifyOwnerIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#1E2822',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  verifyOwnerText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.2,
  },

  // ── Spotlight Card ──
  spotlightSection: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  spotlightCard: {
    height: 320,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#EFEEEB',
    shadowColor: '#1E2822',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.14,
    shadowRadius: 32,
    elevation: 8,
    position: 'relative',
    justifyContent: 'space-between',
    padding: 16,
  },
  spotlightImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  spotlightScrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(9, 19, 14, 0.42)',
  },
  spotlightTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  featuredPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(9, 19, 14, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 9999,
  },
  featuredDot: {
    width: 6,
    height: 6,
    borderRadius: 9999,
    backgroundColor: '#FFDBCC',
  },
  featuredPillText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11,
    fontWeight: '500',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
  carouselDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  activeDot: {
    width: 20,
    height: 5,
    borderRadius: 9999,
    backgroundColor: '#FFFFFF',
  },
  inactiveDot: {
    width: 5,
    height: 5,
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  spotlightFavButton: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    backgroundColor: 'rgba(250, 249, 246, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spotlightBottomInfo: {
    zIndex: 2,
  },
  spotlightMainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  spotlightTitleCol: {
    flex: 1,
    marginRight: 10,
  },
  spotlightTitle: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 19,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.3,
    lineHeight: 25,
  },
  spotlightLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  spotlightLocationText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  spotlightPrice: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  specsPillTray: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  specText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: 0.3,
  },
  specDot: {
    width: 4,
    height: 4,
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },

  // ── Locations ──
  locationsSection: {
    paddingVertical: 14,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1C1A',
    letterSpacing: -0.2,
  },
  sectionSubtitle: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12,
    color: '#434844',
    marginTop: 2,
  },
  viewAllText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1C1A',
  },
  locationsScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  locationCard: {
    width: 130,
    height: 176,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#EFEEEB',
    position: 'relative',
    justifyContent: 'flex-end',
    padding: 12,
  },
  locationImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  locationScrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(9, 19, 14, 0.4)',
  },
  locationTextStack: {
    zIndex: 2,
  },
  locationName: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  locationCity: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 1,
  },

  // ── Featured Properties ──
  featuredSection: {
    paddingVertical: 10,
  },
  sectionHeaderPadding: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitleBlack: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.4,
  },
  sectionSubtitleMuted: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11,
    fontWeight: '500',
    color: '#737373',
    marginTop: 2,
  },
  featuredScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  featuredCard: {
    width: 245,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  featuredCardImageWrapper: {
    width: '100%',
    height: 140,
    position: 'relative',
    backgroundColor: '#F5F5F5',
  },
  featuredCardImage: {
    width: '100%',
    height: '100%',
  },
  listingTypePill: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#000000',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  listingTypeText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
  smallFavButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBottomChipsRow: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chipDark: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 4,
  },
  chipDarkText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 10,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  chipBordered: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderWidth: 1,
    borderColor: '#404040',
    paddingHorizontal: 6,
    paddingVertical: 2.5,
    borderRadius: 4,
  },
  chipBorderedText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 9,
    fontWeight: '600',
    color: '#E5E5E5',
  },
  featuredCardBody: {
    padding: 12,
  },
  featuredTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredTitle: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    flex: 1,
    marginRight: 6,
  },
  cardLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 3,
  },
  cardLocationText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11,
    color: '#737373',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardPriceText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
  },
  cardExploreText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11,
    fontWeight: '600',
    color: '#000000',
  },

  // ── Promotional Banner ──
  promoBanner: {
    marginHorizontal: 20,
    marginVertical: 14,
    borderRadius: 16,
    backgroundColor: '#09130E',
    borderWidth: 1,
    borderColor: '#262626',
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 4,
  },
  promoLeftCol: {
    flex: 1,
    marginRight: 12,
  },
  promoEyebrow: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#A3A3A3',
    textTransform: 'uppercase',
  },
  promoHeading: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 4,
  },
  promoDesc: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 10,
    color: '#A3A3A3',
    lineHeight: 14,
    marginTop: 4,
  },
  promoArrowButton: {
    width: 36,
    height: 36,
    borderRadius: 9999,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── Recommended Properties ──
  recommendedSection: {
    paddingVertical: 10,
  },
  recommendedList: {
    paddingHorizontal: 20,
  },
  recommendedCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    marginBottom: 16,
  },
  recommendedImageWrapper: {
    width: '100%',
    height: 170,
    position: 'relative',
    backgroundColor: '#F5F5F5',
  },
  recommendedImage: {
    width: '100%',
    height: '100%',
  },
  recommendedBody: {
    padding: 14,
  },
  recommendedTitle: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    flex: 1,
    marginRight: 6,
  },
  recPriceText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 16,
    fontWeight: '800',
    color: '#000000',
  },
});
