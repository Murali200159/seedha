import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Search, MapPin, Clock, TrendingUp, Heart, SlidersHorizontal, Map, ChevronRight, Sparkles } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { properties } from '../data/properties';
import PropertyCard from '../components/PropertyCard';

const tabs = ['All', 'Buy', 'Rent', 'Commercial', 'New Projects'];
const popularLocations = [
  { name: 'Madhapur', count: '240+ properties' },
  { name: 'Gachibowli', count: '185+ properties' },
  { name: 'Kondapur', count: '162+ properties' },
  { name: 'Jubilee Hills', count: '98+ properties' },
  { name: 'Banjara Hills', count: '143+ properties' },
  { name: 'Madhurawada', count: '95+ properties' },
];
const recentSearches = ['3 BHK in Madhapur', 'Flats in Gachibowli', 'Commercial HITEC City'];

export default function ExploreScreen() {
  const { push, savedIds } = useApp();
  const [activeTab, setActiveTab] = useState('All');
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = query.length > 1 ? [
    `${query}, Hyderabad`,
    `Properties in ${query}`,
    `Projects in ${query}`,
    `${query} nearby areas`,
  ] : [];

  const filtered = properties.filter(p => {
    const matchesTab =
      activeTab === 'Buy' ? p.listingType === 'buy' :
      activeTab === 'Rent' ? p.listingType === 'rent' :
      activeTab === 'Commercial' ? p.listingType === 'commercial' :
      true;
    const matchesQuery = !query || p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.location.toLowerCase().includes(query.toLowerCase());
    return matchesTab && matchesQuery;
  });

  const savedProperties = properties.filter(p => savedIds.has(p.id));

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Text style={styles.pageTitle}>Explore</Text>
          <TouchableOpacity
            onPress={() => push({ name: 'filters' })}
            style={styles.filterCircle}
            activeOpacity={0.8}
          >
            <SlidersHorizontal size={16} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchWrapper}>
          <View style={styles.searchBar}>
            <Search size={16} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search location, project, property..."
              placeholderTextColor="#9CA3AF"
              value={query}
              onChangeText={text => { setQuery(text); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
            />
            {query ? (
              <TouchableOpacity onPress={() => setQuery('')} style={styles.clearButton}>
                <Text style={styles.clearText}>✕</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Suggestions Dropdown */}
          {showSuggestions && (query.length > 1 ? suggestions : recentSearches).length > 0 && (
            <View style={styles.suggestionsBox}>
              <View style={styles.suggestionHeader}>
                <Text style={styles.suggestionHeaderText}>
                  {query.length > 1 ? 'Suggestions' : 'Recent Searches'}
                </Text>
              </View>
              {(query.length > 1 ? suggestions : recentSearches).map((s, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => { setQuery(s); setShowSuggestions(false); }}
                  style={styles.suggestionItem}
                >
                  {query.length > 1 ? <MapPin size={14} color="#9CA3AF" /> : <Clock size={14} color="#9CA3AF" />}
                  <Text style={styles.suggestionItemText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        {/* Map View CTA */}
        <View style={styles.sectionPadding}>
          <TouchableOpacity
            onPress={() => push({ name: 'propertyListing', params: { type: 'buy', title: 'Explore on Map' } })}
            style={styles.mapBanner}
            activeOpacity={0.9}
          >
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=800&h=200&fit=crop&auto=format' }}
              style={styles.mapImage}
            />
            <View style={styles.mapOverlay} />
            <View style={styles.mapButtonContent}>
              <Map size={15} color="#2260FF" />
              <Text style={styles.mapButtonText}>View Properties on Map</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Saved Properties */}
        {savedProperties.length > 0 && (
          <View style={styles.savedSection}>
            <View style={styles.savedHeader}>
              <View style={styles.rowCenter}>
                <Heart size={14} color="#EF4444" fill="#EF4444" />
                <Text style={styles.sectionTitle}>Saved Properties</Text>
              </View>
              <TouchableOpacity style={styles.rowCenter}>
                <Text style={styles.seeAllText}>See All</Text>
                <ChevronRight size={13} color="#2260FF" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.savedScroll}>
              {savedProperties.map(p => (
                <TouchableOpacity
                  key={p.id}
                  onPress={() => push({ name: 'propertyDetail', params: { property: p } })}
                  style={styles.savedCard}
                  activeOpacity={0.8}
                >
                  <Image source={{ uri: p.image }} style={styles.savedImage} />
                  <View style={styles.savedCardBody}>
                    <Text style={styles.savedTitle} numberOfLines={1}>{p.title}</Text>
                    <Text style={styles.savedLocation} numberOfLines={1}>{p.location}</Text>
                    <Text style={styles.savedPrice}>{p.priceLabel}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Popular Locations */}
        <View style={styles.sectionPadding}>
          <View style={styles.rowCenterMargin}>
            <TrendingUp size={14} color="#2260FF" />
            <Text style={styles.sectionTitle}>Popular Locations</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.popularScroll}>
            {popularLocations.map(loc => (
              <TouchableOpacity
                key={loc.name}
                onPress={() => push({ name: 'propertyListing', params: { type: 'buy', title: `Properties in ${loc.name}` } })}
                style={styles.locationChip}
                activeOpacity={0.8}
              >
                <View style={styles.rowCenter}>
                  <MapPin size={11} color="#2260FF" />
                  <Text style={styles.locationName}>{loc.name}</Text>
                </View>
                <Text style={styles.locationCount}>{loc.count}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* New Projects Banner */}
        <View style={styles.sectionPadding}>
          <TouchableOpacity
            onPress={() => push({ name: 'propertyListing', params: { type: 'buy', title: 'New Projects' } })}
            style={styles.projectsBanner}
            activeOpacity={0.9}
          >
            <View style={styles.projectsContent}>
              <View>
                <Text style={styles.projectsTitle}>New Projects</Text>
                <Text style={styles.projectsSub}>10+ new launches this month</Text>
              </View>
              <View style={styles.projectsBadge}>
                <Sparkles size={12} color="white" />
                <Text style={styles.projectsBadgeText}>Explore</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Category Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tabPill,
                activeTab === tab ? styles.activeTabPill : styles.inactiveTabPill,
              ]}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabPillText, activeTab === tab ? styles.activeTabPillText : styles.inactiveTabPillText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Properties Grid */}
        {filtered.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyCircle}>
              <Search size={28} color="#9CA3AF" />
            </View>
            <Text style={styles.emptyTitle}>No properties found</Text>
            <Text style={styles.emptySub}>Try changing your search or filters</Text>
            <TouchableOpacity
              onPress={() => { setQuery(''); setActiveTab('All'); }}
              style={styles.clearFiltersButton}
              activeOpacity={0.8}
            >
              <Text style={styles.clearFiltersText}>Clear Filters</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.gridContainer}>
            {filtered.map(p => (
              <View key={p.id} style={styles.gridColumn}>
                <PropertyCard property={p} compact />
              </View>
            ))}
          </View>
        )}
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
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: '#ECEEF5',
    zIndex: 10,
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  filterCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  searchWrapper: {
    position: 'relative',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 44,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#111827',
    marginLeft: 8,
  },
  clearButton: {
    paddingHorizontal: 6,
  },
  clearText: {
    fontSize: 12,
    color: '#6B7280',
  },
  suggestionsBox: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 6,
    elevation: 6,
    zIndex: 20,
  },
  suggestionHeader: {
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  suggestionHeaderText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  suggestionItemText: {
    fontSize: 13,
    color: '#111827',
    marginLeft: 10,
  },
  scrollArea: {
    flex: 1,
  },
  sectionPadding: {
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  mapBanner: {
    height: 75,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(5, 16, 66, 0.5)',
  },
  mapButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  mapButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 6,
  },
  savedSection: {
    marginBottom: 14,
  },
  savedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowCenterMargin: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 6,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2260FF',
    marginRight: 2,
  },
  savedScroll: {
    paddingHorizontal: 16,
    gap: 10,
  },
  savedCard: {
    width: 150,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 2,
  },
  savedImage: {
    width: '100%',
    height: 90,
  },
  savedCardBody: {
    padding: 8,
  },
  savedTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#111827',
  },
  savedLocation: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  savedPrice: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2260FF',
    marginTop: 4,
  },
  popularScroll: {
    gap: 8,
  },
  locationChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    elevation: 1,
  },
  locationName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 4,
  },
  locationCount: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  projectsBanner: {
    backgroundColor: '#2260FF',
    borderRadius: 16,
    padding: 14,
  },
  projectsContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  projectsSub: {
    fontSize: 11,
    color: '#BFDBFE',
    marginTop: 2,
  },
  projectsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  projectsBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  tabsScroll: {
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 14,
  },
  tabPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activeTabPill: {
    backgroundColor: '#2260FF',
  },
  inactiveTabPill: {
    backgroundColor: '#FFFFFF',
    elevation: 1,
  },
  tabPillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeTabPillText: {
    color: '#FFFFFF',
  },
  inactiveTabPillText: {
    color: '#6B7280',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  emptySub: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  clearFiltersButton: {
    marginTop: 16,
    backgroundColor: '#2260FF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  clearFiltersText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 10,
  },
  gridColumn: {
    width: '48%',
  },
});
