import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Plus, Eye, MessageCircle, Calendar, Building2, MapPin } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';
import { properties } from '../data/properties';

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  published: { label: 'Published', color: colors.secondary, bg: colors.tertiaryBg },
  review: { label: 'Under Review', color: colors.accent, bg: colors.tertiaryBg },
  draft: { label: 'Draft', color: colors.textSecondary, bg: colors.tertiaryBg },
};

const myListings = [
  { ...properties[0], status: 'published', views: 234, leads: 12, visits: 5 },
  { ...properties[2], status: 'review', views: 0, leads: 0, visits: 0 },
  { ...properties[4], status: 'draft', views: 0, leads: 0, visits: 0 },
];

export default function MyPropertyScreen() {
  const { push, isAuthenticated, requireAuth } = useApp();

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.pageTitle}>My Properties</Text>
            <Text style={styles.pageSub}>Manage your listings</Text>
          </View>
        </View>

        <View style={styles.guestEmptyWrapper}>
          <View style={styles.guestEmptyCircle}>
            <Building2 size={36} color="#2E3A2F" strokeWidth={2} />
          </View>
          <Text style={styles.guestEmptyTitle}>Sign in to view your properties</Text>
          <Text style={styles.guestEmptySubtitle}>
            Post free property listings, track buyer enquiries, and manage tenant agreements all in one place.
          </Text>
          <TouchableOpacity
            style={styles.guestSignInBtn}
            onPress={() => requireAuth(undefined, { name: 'myProperty' }, 'Manage Properties')}
            activeOpacity={0.88}
          >
            <Text style={styles.guestSignInBtnText}>Sign In with Mobile OTP</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.pageTitle}>My Properties</Text>
          <Text style={styles.pageSub}>Manage your listings</Text>
        </View>
        <TouchableOpacity
          onPress={() => requireAuth(undefined, { name: 'postProperty' }, 'Post Property')}
          style={styles.addButton}
          activeOpacity={0.8}
        >
          <Plus size={16} color={colors.textWhite} />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        {/* Quick Stats Grid */}
        <View style={styles.sectionPadding}>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={[styles.iconBox, { backgroundColor: colors.tertiaryBg }]}>
                <Building2 size={16} color={colors.primary} />
              </View>
              <Text style={styles.statVal}>1</Text>
              <Text style={styles.statSub}>Active Listings</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.iconBox, { backgroundColor: colors.tertiaryBg }]}>
                <MessageCircle size={16} color={colors.secondary} />
              </View>
              <Text style={styles.statVal}>12</Text>
              <Text style={styles.statSub}>Total Leads</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.iconBox, { backgroundColor: colors.tertiaryBg }]}>
                <Calendar size={16} color={colors.accent} />
              </View>
              <Text style={styles.statVal}>5</Text>
              <Text style={styles.statSub}>Visits Booked</Text>
            </View>
          </View>
        </View>

        {/* Listings */}
        <View style={styles.sectionPadding}>
          <Text style={styles.sectionTitle}>Your Property Listings</Text>
          <View style={styles.listingsWrap}>
            {myListings.map(listing => {
              const sc = statusConfig[listing.status];
              return (
                <View key={listing.id} style={styles.listingCard}>
                  <View style={styles.listingRow}>
                    <Image source={{ uri: listing.image }} style={styles.listingImage} />
                    <View style={styles.listingInfo}>
                      <View style={styles.titleRow}>
                        <Text style={styles.listingTitle} numberOfLines={1}>{listing.title}</Text>
                        <View style={[styles.statusChip, { backgroundColor: sc.bg }]}>
                          <Text style={[styles.statusText, { color: sc.color }]}>{sc.label}</Text>
                        </View>
                      </View>
                      <View style={styles.locationRow}>
                        <MapPin size={10} color={colors.textMuted} />
                        <Text style={styles.locationText}>{listing.location}</Text>
                      </View>
                      <Text style={styles.listingPrice}>{listing.priceLabel}</Text>
                      <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                          <Eye size={10} color={colors.textMuted} />
                          <Text style={styles.metaText}>{listing.views}</Text>
                        </View>
                        <View style={styles.metaItem}>
                          <MessageCircle size={10} color={colors.textMuted} />
                          <Text style={styles.metaText}>{listing.leads}</Text>
                        </View>
                        <View style={styles.metaItem}>
                          <Calendar size={10} color={colors.textMuted} />
                          <Text style={styles.metaText}>{listing.visits}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
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
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  pageSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textWhite,
    marginLeft: 4,
  },
  scrollArea: {
    flex: 1,
  },
  sectionPadding: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 1,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statVal: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  statSub: {
    fontSize: 9,
    color: colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  listingsWrap: {
    gap: 10,
  },
  listingCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
  },
  listingRow: {
    flexDirection: 'row',
    padding: 10,
  },
  listingImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
  },
  listingInfo: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  listingTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  statusChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 4,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '700',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationText: {
    fontSize: 10,
    color: colors.textSecondary,
    marginLeft: 2,
  },
  listingPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 10,
    color: colors.textMuted,
    marginLeft: 3,
  },
  guestEmptyWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  guestEmptyCircle: {
    width: 72,
    height: 72,
    borderRadius: 9999,
    backgroundColor: '#F8F6EE',
    borderWidth: 1,
    borderColor: '#D9C9B2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  guestEmptyTitle: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 18,
    fontWeight: '700',
    color: '#2E3A2F',
    textAlign: 'center',
    marginBottom: 8,
  },
  guestEmptySubtitle: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    color: '#687F5B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
  },
  guestSignInBtn: {
    backgroundColor: '#2E3A2F',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
    shadowColor: '#2E3A2F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  guestSignInBtnText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
