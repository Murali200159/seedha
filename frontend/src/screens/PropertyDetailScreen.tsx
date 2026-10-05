import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import {
  ChevronLeft,
  Heart,
  Share2,
  ShieldCheck,
  MapPin,
  BedDouble,
  Bath,
  Square,
  MessageCircle,
  Calendar,
  Phone,
  Star,
  CheckCircle2,
  Building2,
  Wifi,
  Car,
  Dumbbell,
  Waves,
  Shield,
  BarChart3,
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import type { Property } from '../types';
import colors from '../theme/colors';

const amenityIcons: Record<string, React.ReactNode> = {
  'Gym': <Dumbbell size={14} color={colors.primary} />,
  'Swimming Pool': <Waves size={14} color={colors.primary} />,
  'Security': <Shield size={14} color={colors.primary} />,
  'Lift': <Building2 size={14} color={colors.primary} />,
  'Parking': <Car size={14} color={colors.primary} />,
  'WiFi': <Wifi size={14} color={colors.primary} />,
};

const getAmenityIcon = (name: string) => amenityIcons[name] ?? <CheckCircle2 size={14} color={colors.primary} />;

export default function PropertyDetailScreen() {
  const { currentScreen, push, pop, toggleSaved, savedIds } = useApp();
  const property = currentScreen.params?.property as Property;
  const [activeImg, setActiveImg] = useState(0);
  const saved = savedIds ? savedIds.has(property.id) : false;

  const emiMonthly = Math.round(property.price * 0.00624);
  const pricePerSqft = Math.round(property.price / property.area);

  return (
    <View style={styles.container}>
      {/* Gallery */}
      <View style={styles.galleryContainer}>
        <Image source={{ uri: property.images[activeImg] || property.image }} style={styles.mainGalleryImage} />

        {/* Top Floating Header */}
        <View style={styles.topHeader}>
          <TouchableOpacity onPress={pop} style={styles.headerIconButton} activeOpacity={0.8}>
            <ChevronLeft size={20} color={colors.primary} strokeWidth={2.5} />
          </TouchableOpacity>
          <View style={styles.headerRightGroup}>
            <TouchableOpacity onPress={() => toggleSaved(property.id)} style={styles.headerIconButton} activeOpacity={0.8}>
              <Heart size={17} fill={saved ? colors.accent : 'transparent'} color={saved ? colors.accent : colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIconButton} activeOpacity={0.8}>
              <Share2 size={17} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Counter Badge */}
        <View style={styles.counterBadge}>
          <Text style={styles.counterBadgeText}>
            {activeImg + 1} / {property.images.length}
          </Text>
        </View>

        {/* Thumbnails Row */}
        {property.images.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbnailRow}>
            {property.images.map((img, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => setActiveImg(i)}
                style={[
                  styles.thumbnailButton,
                  i === activeImg ? styles.activeThumbnail : styles.inactiveThumbnail,
                ]}
                activeOpacity={0.8}
              >
                <Image source={{ uri: img }} style={styles.thumbnailImage} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Content Area */}
      <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.contentCard}>
          {/* Title & Verified */}
          <View style={styles.titleRow}>
            <View style={styles.titleColumn}>
              <Text style={styles.propertyTitle}>{property.title}</Text>
              <View style={styles.locationRow}>
                <MapPin size={13} color={colors.textSecondary} />
                <Text style={styles.locationText}>{property.location}</Text>
              </View>
            </View>
            {property.verified && (
              <View style={styles.verifiedBadge}>
                <ShieldCheck size={13} color={colors.secondary} />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            )}
          </View>

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>{property.priceLabel}</Text>
            {property.listingType === 'buy' && (
              <Text style={styles.emiText}>EMI ~₹{emiMonthly.toLocaleString('en-IN')}/mo</Text>
            )}
          </View>

          {/* Stats Bar */}
          <View style={styles.statsBar}>
            {property.bedrooms > 0 && (
              <View style={styles.statBox}>
                <BedDouble size={18} color={colors.primary} />
                <Text style={styles.statBoxText}>{property.bedrooms} Beds</Text>
              </View>
            )}
            <View style={styles.statBox}>
              <Bath size={18} color={colors.primary} />
              <Text style={styles.statBoxText}>{property.bathrooms} Baths</Text>
            </View>
            <View style={styles.statBox}>
              <Square size={18} color={colors.primary} />
              <Text style={styles.statBoxText}>{property.area} sq.ft</Text>
            </View>
            <View style={styles.statBox}>
              <Building2 size={18} color={colors.primary} />
              <Text style={styles.statBoxText}>{property.floor ?? 'G+2'} Floor</Text>
            </View>
          </View>

          {/* Property Details Grid */}
          <View style={styles.sectionMargin}>
            <Text style={styles.sectionHeading}>Property Details</Text>
            <View style={styles.detailsGrid}>
              <View style={styles.detailGridCell}>
                <Text style={styles.detailGridKey}>Type</Text>
                <Text style={styles.detailGridValue}>
                  {property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}
                </Text>
              </View>
              <View style={styles.detailGridCell}>
                <Text style={styles.detailGridKey}>Furnishing</Text>
                <Text style={styles.detailGridValue}>
                  {property.furnishing.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </Text>
              </View>
              <View style={styles.detailGridCell}>
                <Text style={styles.detailGridKey}>Parking</Text>
                <Text style={styles.detailGridValue}>{property.parking ? 'Available' : 'Not Available'}</Text>
              </View>
              <View style={styles.detailGridCell}>
                <Text style={styles.detailGridKey}>Price/sq.ft</Text>
                <Text style={styles.detailGridValue}>₹{pricePerSqft.toLocaleString('en-IN')}</Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <View style={styles.sectionMargin}>
            <Text style={styles.sectionHeading}>About Property</Text>
            <Text style={styles.descriptionText}>{property.description}</Text>
          </View>

          {/* Amenities */}
          {property.amenities.length > 0 && (
            <View style={styles.sectionMargin}>
              <Text style={styles.sectionHeading}>Amenities</Text>
              <View style={styles.amenitiesWrap}>
                {property.amenities.map(a => (
                  <View key={a} style={styles.amenityChip}>
                    {getAmenityIcon(a)}
                    <Text style={styles.amenityText}>{a}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Owner Box */}
          <View style={styles.ownerBox}>
            <Text style={styles.sectionHeading}>
              {property.ownerType === 'builder' ? 'Builder Details' : property.ownerType === 'agent' ? 'Listed By Agent' : 'Owner Details'}
            </Text>
            <View style={styles.ownerRow}>
              <Image source={{ uri: property.ownerAvatar }} style={styles.ownerAvatar} />
              <View style={styles.ownerColumn}>
                <Text style={styles.ownerName}>{property.ownerName}</Text>
                <View style={styles.starsRow}>
                  <Star size={11} fill={colors.warning} color={colors.warning} />
                  <Star size={11} fill={colors.warning} color={colors.warning} />
                  <Star size={11} fill={colors.warning} color={colors.warning} />
                  <Star size={11} fill={colors.warning} color={colors.warning} />
                  <Star size={11} fill={colors.warning} color={colors.warning} />
                  <Text style={styles.verifiedOwnerText}>Verified {property.ownerType}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.phoneButton} activeOpacity={0.8}>
                <Phone size={18} color={colors.textWhite} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Floating Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomSubRow}>
          <TouchableOpacity
            onPress={() => push({ name: 'compare', params: { property } })}
            style={styles.compareButton}
            activeOpacity={0.8}
          >
            <BarChart3 size={14} color={colors.textSecondary} />
            <Text style={styles.compareButtonText}>Compare</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => push({ name: 'chat', params: { property } })}
            style={styles.chatButton}
            activeOpacity={0.8}
          >
            <MessageCircle size={14} color={colors.secondary} />
            <Text style={styles.chatButtonText}>Chat</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => push({ name: 'bookVisit', params: { property } })}
          style={styles.bookVisitButton}
          activeOpacity={0.9}
        >
          <Calendar size={18} color={colors.textWhite} />
          <Text style={styles.bookVisitText}>Book a Visit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  galleryContainer: {
    height: 270,
    position: 'relative',
  },
  mainGalleryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  topHeader: {
    position: 'absolute',
    top: 14,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerIconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRightGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  counterBadge: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    backgroundColor: colors.overlayDark,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  counterBadgeText: {
    color: colors.textWhite,
    fontSize: 11,
    fontWeight: '700',
  },
  thumbnailRow: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    flexDirection: 'row',
  },
  thumbnailButton: {
    width: 44,
    height: 30,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 6,
    borderWidth: 2,
  },
  activeThumbnail: {
    borderColor: colors.surface,
  },
  inactiveThumbnail: {
    borderColor: 'transparent',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  contentScroll: {
    flex: 1,
  },
  contentCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -20,
    padding: 22,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleColumn: {
    flex: 1,
  },
  propertyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondaryBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    marginLeft: 8,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.secondary,
    marginLeft: 3,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 14,
  },
  priceLabel: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.4,
  },
  emiText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginLeft: 10,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: colors.surfaceSoft,
    marginTop: 18,
    borderWidth: 1,
    borderColor: colors.tertiaryLight,
  },
  statBox: {
    alignItems: 'center',
  },
  statBoxText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 5,
  },
  sectionMargin: {
    marginTop: 22,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 10,
    letterSpacing: -0.2,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  detailGridCell: {
    width: '46%',
    backgroundColor: colors.surfaceSoft,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.tertiaryLight,
  },
  detailGridKey: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  detailGridValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 2,
  },
  descriptionText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  amenitiesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSoft,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.tertiaryLight,
  },
  amenityText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 6,
  },
  ownerBox: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: 20,
    padding: 16,
    marginTop: 22,
    borderWidth: 1,
    borderColor: colors.tertiaryLight,
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  ownerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  ownerColumn: {
    flex: 1,
    marginLeft: 12,
  },
  ownerName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  verifiedOwnerText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    marginLeft: 6,
  },
  phoneButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  bottomBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.tertiary,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 18,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 6,
  },
  bottomSubRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  compareButton: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.tertiary,
    backgroundColor: colors.surfaceSoft,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  compareButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginLeft: 6,
  },
  chatButton: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.secondary,
    backgroundColor: colors.secondaryBg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.secondary,
    marginLeft: 6,
  },
  bookVisitButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  bookVisitText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textWhite,
    marginLeft: 8,
  },
});
