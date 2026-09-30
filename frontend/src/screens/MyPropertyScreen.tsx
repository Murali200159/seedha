import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Plus, Eye, MessageCircle, Calendar, Building2, MapPin } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { properties } from '../data/properties';

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  published: { label: 'Published', color: '#16A34A', bg: '#DCFCE7' },
  review: { label: 'Under Review', color: '#D97706', bg: '#FEF3C7' },
  draft: { label: 'Draft', color: '#6B7280', bg: '#F3F4F6' },
};

const myListings = [
  { ...properties[0], status: 'published', views: 234, leads: 12, visits: 5 },
  { ...properties[2], status: 'review', views: 0, leads: 0, visits: 0 },
  { ...properties[4], status: 'draft', views: 0, leads: 0, visits: 0 },
];

export default function MyPropertyScreen() {
  const { push } = useApp();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.pageTitle}>My Properties</Text>
          <Text style={styles.pageSub}>Manage your listings</Text>
        </View>
        <TouchableOpacity
          onPress={() => push({ name: 'postProperty' })}
          style={styles.addButton}
          activeOpacity={0.8}
        >
          <Plus size={16} color="white" />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        {/* Quick Stats Grid */}
        <View style={styles.sectionPadding}>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={[styles.iconBox, { backgroundColor: '#EBF0FF' }]}>
                <Building2 size={16} color="#2260FF" />
              </View>
              <Text style={styles.statVal}>1</Text>
              <Text style={styles.statSub}>Active Listings</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.iconBox, { backgroundColor: '#DCFCE7' }]}>
                <MessageCircle size={16} color="#16A34A" />
              </View>
              <Text style={styles.statVal}>12</Text>
              <Text style={styles.statSub}>Total Leads</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}>
                <Calendar size={16} color="#D97706" />
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
                        <MapPin size={10} color="#9CA3AF" />
                        <Text style={styles.locationText}>{listing.location}</Text>
                      </View>
                      <Text style={styles.listingPrice}>{listing.priceLabel}</Text>
                      <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                          <Eye size={10} color="#9CA3AF" />
                          <Text style={styles.metaText}>{listing.views}</Text>
                        </View>
                        <View style={styles.metaItem}>
                          <MessageCircle size={10} color="#9CA3AF" />
                          <Text style={styles.metaText}>{listing.leads}</Text>
                        </View>
                        <View style={styles.metaItem}>
                          <Calendar size={10} color="#9CA3AF" />
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
    backgroundColor: '#ECEEF5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  pageSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2260FF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
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
    color: '#111827',
  },
  statSub: {
    fontSize: 9,
    color: '#6B7280',
    marginTop: 2,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  listingsWrap: {
    gap: 10,
  },
  listingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
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
    color: '#111827',
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
    color: '#6B7280',
    marginLeft: 2,
  },
  listingPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2260FF',
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
    color: '#6B7280',
    marginLeft: 3,
  },
});
