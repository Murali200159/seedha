import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Heart, MapPin, BedDouble, Bath, Square, ShieldCheck } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import type { Property } from '../types';
import colors from '../theme/colors';

interface Props {
  property: Property;
  compact?: boolean;
  horizontal?: boolean;
}

const getBadge = (type: Property['listingType']) => {
  if (type === 'buy') return { label: 'For Sale', bg: colors.primary };
  if (type === 'rent') return { label: 'For Rent', bg: colors.secondary };
  return { label: 'Commercial', bg: colors.accent };
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
              {property.verified && <ShieldCheck size={14} color={colors.secondary} style={styles.verifiedIcon} />}
            </View>
            <View style={styles.locationRow}>
              <MapPin size={11} color={colors.textMuted} strokeWidth={2} />
              <Text style={styles.locationText} numberOfLines={1}>
                {property.location}
              </Text>
            </View>
            <Text style={styles.priceText}>{property.priceLabel}</Text>
          </View>
          <View style={styles.metaRow}>
            {property.bedrooms > 0 && (
              <View style={styles.metaItem}>
                <BedDouble size={11} strokeWidth={1.5} color={colors.textMuted} />
                <Text style={styles.metaText}>{property.bedrooms} Bed</Text>
              </View>
            )}
            <View style={styles.metaItem}>
              <Bath size={11} strokeWidth={1.5} color={colors.textMuted} />
              <Text style={styles.metaText}>{property.bathrooms} Bath</Text>
            </View>
            <View style={styles.metaItem}>
              <Square size={11} strokeWidth={1.5} color={colors.textMuted} />
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
            fill={saved ? colors.accent : 'transparent'}
            color={saved ? colors.accent : colors.textMuted}
            strokeWidth={2}
          />
        </TouchableOpacity>
        {property.verified && (
          <View style={styles.verifiedBadge}>
            <ShieldCheck size={11} color={colors.secondary} />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        )}
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.verticalTitle} numberOfLines={1}>
          {property.title}
        </Text>
        <View style={styles.locationRow}>
          <MapPin size={11} color={colors.textMuted} strokeWidth={2} />
          <Text style={styles.locationText} numberOfLines={1}>
            {property.location}
          </Text>
        </View>
        <Text style={styles.verticalPrice}>{property.priceLabel}</Text>
        <View style={styles.cardFooter}>
          {property.bedrooms > 0 && (
            <View style={styles.metaItem}>
              <BedDouble size={11} strokeWidth={1.5} color={colors.textMuted} />
              <Text style={styles.metaText}>{property.bedrooms} Bed</Text>
            </View>
          )}
          <View style={styles.metaItem}>
            <Bath size={11} strokeWidth={1.5} color={colors.textMuted} />
            <Text style={styles.metaText}>{property.bathrooms} Bath</Text>
          </View>
          <View style={styles.metaItem}>
            <Square size={11} strokeWidth={1.5} color={colors.textMuted} />
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
    backgroundColor: colors.surface,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.tertiary,
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
    fontFamily: colors.fontFamily,
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
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
    fontFamily: colors.fontFamily,
    fontSize: 12,
    fontWeight: '400',
    color: colors.textSecondary,
    marginLeft: 3,
    flex: 1,
  },
  priceText: {
    fontFamily: colors.fontFamily,
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
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
    backgroundColor: colors.surfaceSoft,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 6,
    borderWidth: 1,
    borderColor: colors.tertiaryLight,
  },
  metaText: {
    fontFamily: colors.fontFamily,
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
    marginLeft: 3,
  },
  badge: {
    position: 'absolute',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    fontFamily: colors.fontFamily,
    fontSize: 10,
    fontWeight: '600',
    color: colors.textWhite,
  },
  verticalCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.tertiary,
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
    shadowColor: colors.primary,
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
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  verifiedText: {
    fontFamily: colors.fontFamily,
    fontSize: 10,
    fontWeight: '600',
    color: colors.secondary,
    marginLeft: 3,
  },
  cardContent: {
    padding: 14,
  },
  verticalTitle: {
    fontFamily: colors.fontFamily,
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  verticalPrice: {
    fontFamily: colors.fontFamily,
    fontSize: 17,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.tertiaryLight,
  },
});
