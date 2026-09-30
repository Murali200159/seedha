import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Heart, MapPin, BedDouble, Bath, Square, ShieldCheck } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import type { Property } from '../types';

interface Props {
  property: Property;
  compact?: boolean;
  horizontal?: boolean;
}

const getBadge = (type: Property['listingType']) => {
  if (type === 'buy') return { label: 'For Sale', bg: '#16A34A' };
  if (type === 'rent') return { label: 'For Rent', bg: '#6D28D9' };
  return { label: 'Commercial', bg: '#D97706' };
};

export default function PropertyCard({ property, compact = false, horizontal = false }: Props) {
  const { push, toggleSaved, savedIds } = useApp();
  const saved = savedIds.has(property.id);
  const badge = getBadge(property.listingType);

  if (horizontal) {
    return (
      <TouchableOpacity
        onPress={() => push({ name: 'propertyDetail', params: { property } })}
        style={styles.horizontalCard}
        activeOpacity={0.8}
      >
        <View style={styles.horizontalImageContainer}>
          <Image source={{ uri: property.image }} style={styles.horizontalImage} />
          <View style={[styles.badge, { backgroundColor: badge.bg, top: 8, left: 8 }]}>
            <Text style={styles.badgeText}>{badge.label}</Text>
          </View>
        </View>
        <View style={styles.horizontalContent}>
          <View>
            <View style={styles.titleRow}>
              <Text style={styles.horizontalTitle} numberOfLines={1}>
                {property.title}
              </Text>
              {property.verified && <ShieldCheck size={14} color="#2260FF" style={styles.verifiedIcon} />}
            </View>
            <View style={styles.locationRow}>
              <MapPin size={11} color="#9CA3AF" strokeWidth={2} />
              <Text style={styles.locationText} numberOfLines={1}>
                {property.location}
              </Text>
            </View>
            <Text style={styles.priceText}>{property.priceLabel}</Text>
          </View>
          <View style={styles.metaRow}>
            {property.bedrooms > 0 && (
              <View style={styles.metaItem}>
                <BedDouble size={11} strokeWidth={1.5} color="#9CA3AF" />
                <Text style={styles.metaText}>{property.bedrooms} Bed</Text>
              </View>
            )}
            <View style={styles.metaItem}>
              <Bath size={11} strokeWidth={1.5} color="#9CA3AF" />
              <Text style={styles.metaText}>{property.bathrooms} Bath</Text>
            </View>
            <View style={styles.metaItem}>
              <Square size={11} strokeWidth={1.5} color="#9CA3AF" />
              <Text style={styles.metaText}>{property.area} sq.ft</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  const imgHeight = compact ? 130 : 175;

  return (
    <TouchableOpacity
      onPress={() => push({ name: 'propertyDetail', params: { property } })}
      style={styles.verticalCard}
      activeOpacity={0.8}
    >
      <View style={[styles.imageContainer, { height: imgHeight }]}>
        <Image source={{ uri: property.image }} style={styles.verticalImage} />
        <View style={[styles.badge, { backgroundColor: badge.bg, top: 10, left: 10 }]}>
          <Text style={styles.badgeText}>{badge.label}</Text>
        </View>
        <TouchableOpacity
          onPress={() => toggleSaved(property.id)}
          style={styles.heartButton}
          activeOpacity={0.7}
        >
          <Heart
            size={15}
            fill={saved ? '#EF4444' : 'transparent'}
            color={saved ? '#EF4444' : '#6B7280'}
            strokeWidth={2}
          />
        </TouchableOpacity>
        {property.verified && (
          <View style={styles.verifiedBadge}>
            <ShieldCheck size={11} color="#2260FF" />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        )}
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.verticalTitle} numberOfLines={1}>
          {property.title}
        </Text>
        <View style={styles.locationRow}>
          <MapPin size={11} color="#9CA3AF" strokeWidth={2} />
          <Text style={styles.locationText} numberOfLines={1}>
            {property.location}
          </Text>
        </View>
        <Text style={styles.verticalPrice}>{property.priceLabel}</Text>
        <View style={styles.cardFooter}>
          {property.bedrooms > 0 && (
            <View style={styles.metaItem}>
              <BedDouble size={11} strokeWidth={1.5} color="#9CA3AF" />
              <Text style={styles.metaText}>{property.bedrooms} Bed</Text>
            </View>
          )}
          <View style={styles.metaItem}>
            <Bath size={11} strokeWidth={1.5} color="#9CA3AF" />
            <Text style={styles.metaText}>{property.bathrooms} Bath</Text>
          </View>
          <View style={styles.metaItem}>
            <Square size={11} strokeWidth={1.5} color="#9CA3AF" />
            <Text style={styles.metaText}>{property.area} sq.ft</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  horizontalCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  horizontalImageContainer: {
    width: 115,
    height: 115,
    position: 'relative',
  },
  horizontalImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  horizontalContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  horizontalTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  locationText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 3,
    flex: 1,
  },
  priceText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2260FF',
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 6,
  },
  metaText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
    marginLeft: 3,
  },
  badge: {
    position: 'absolute',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  verticalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
  },
  verticalImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heartButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.96)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2260FF',
    marginLeft: 3,
  },
  cardContent: {
    padding: 14,
  },
  verticalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  verticalPrice: {
    fontSize: 17,
    fontWeight: '800',
    color: '#2260FF',
    marginTop: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
});
