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

const amenityIcons: Record<string, React.ReactNode> = {
  'Gym': <Dumbbell size={14} color="#2260FF" />,
  'Swimming Pool': <Waves size={14} color="#2260FF" />,
  'Security': <Shield size={14} color="#2260FF" />,
  'Lift': <Building2 size={14} color="#2260FF" />,
  'Parking': <Car size={14} color="#2260FF" />,
  'WiFi': <Wifi size={14} color="#2260FF" />,
};

const getAmenityIcon = (name: string) => amenityIcons[name] ?? <CheckCircle2 size={14} color="#2260FF" />;

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
            <ChevronLeft size={20} color="#111827" strokeWidth={2.5} />
          </TouchableOpacity>
          <View style={styles.headerRightGroup}>
            <TouchableOpacity onPress={() => toggleSaved(property.id)} style={styles.headerIconButton} activeOpacity={0.8}>
              <Heart size={17} fill={saved ? '#EF4444' : 'transparent'} color={saved ? '#EF4444' : '#374151'} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIconButton} activeOpacity={0.8}>
              <Share2 size={17} color="#374151" />
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
                <MapPin size={13} color="#6B7280" />
                <Text style={styles.locationText}>{property.location}</Text>
              </View>
            </View>
            {property.verified && (
              <View style={styles.verifiedBadge}>
                <ShieldCheck size={13} color="#2260FF" />
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
                <BedDouble size={18} color="#2260FF" />
                <Text style={styles.statBoxText}>{property.bedrooms} Beds</Text>
              </View>
            )}
            <View style={styles.statBox}>
              <Bath size={18} color="#2260FF" />
              <Text style={styles.statBoxText}>{property.bathrooms} Baths</Text>
            </View>
            <View style={styles.statBox}>
              <Square size={18} color="#2260FF" />
              <Text style={styles.statBoxText}>{property.area} sq.ft</Text>
            </View>
            <View style={styles.statBox}>
              <Building2 size={18} color="#2260FF" />
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
                  <Star size={11} fill="#F59E0B" color="#F59E0B" />
                  <Star size={11} fill="#F59E0B" color="#F59E0B" />
                  <Star size={11} fill="#F59E0B" color="#F59E0B" />
                  <Star size={11} fill="#F59E0B" color="#F59E0B" />
                  <Star size={11} fill="#F59E0B" color="#F59E0B" />
                  <Text style={styles.verifiedOwnerText}>Verified {property.ownerType}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.phoneButton} activeOpacity={0.8}>
                <Phone size={18} color="white" />
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
            <BarChart3 size={14} color="#9CA3AF" />
            <Text style={styles.compareButtonText}>Compare</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => push({ name: 'chat', params: { property } })}
            style={styles.chatButton}
            activeOpacity={0.8}
          >
            <MessageCircle size={14} color="#2260FF" />
            <Text style={styles.chatButtonText}>Chat</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => push({ name: 'bookVisit', params: { property } })}
          style={styles.bookVisitButton}
          activeOpacity={0.9}
        >
          <Calendar size={18} color="white" />
          <Text style={styles.bookVisitText}>Book a Visit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
    shadowColor: '#000',
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
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  counterBadgeText: {
    color: '#FFFFFF',
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
    borderColor: '#FFFFFF',
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
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -20,
    padding: 22,
    shadowColor: '#0F172A',
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
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    fontSize: 13,
    color: '#64748B',
    marginLeft: 4,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    marginLeft: 8,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2260FF',
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
    color: '#2260FF',
    letterSpacing: -0.4,
  },
  emiText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginLeft: 10,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statBox: {
    alignItems: 'center',
  },
  statBoxText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 5,
  },
  sectionMargin: {
    marginTop: 22,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
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
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  detailGridKey: {
    fontSize: 11,
    color: '#64748B',
  },
  detailGridValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
  descriptionText: {
    fontSize: 14,
    color: '#475569',
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
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
  },
  amenityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E40AF',
    marginLeft: 6,
  },
  ownerBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 16,
    marginTop: 22,
    borderWidth: 1,
    borderColor: '#F1F5F9',
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
    color: '#0F172A',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  verifiedOwnerText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginLeft: 6,
  },
  phoneButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#2260FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2260FF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  bottomBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 18,
    shadowColor: '#0F172A',
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
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  compareButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginLeft: 6,
  },
  chatButton: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#2260FF',
    backgroundColor: '#EFF6FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2260FF',
    marginLeft: 6,
  },
  bookVisitButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: '#2260FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2260FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  bookVisitText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});
