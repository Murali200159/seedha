import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { SlidersHorizontal, LayoutGrid, List, Map, ArrowUpDown, Search, Check } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { properties } from '../data/properties';
import PropertyCard from '../components/PropertyCard';
import TopBar from '../components/TopBar';
import EmptyState from '../components/EmptyState';
import type { ListingType } from '../types';
import colors from '../theme/colors';

type ViewMode = 'grid' | 'list';
type SortBy = 'relevance' | 'price_asc' | 'price_desc' | 'newest';

const sortOptions: { value: SortBy; label: string }[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
];

export default function PropertyListingScreen() {
  const { currentScreen, push } = useApp();
  const { type, title } = (currentScreen.params ?? {}) as { type: ListingType; title: string };
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('relevance');
  const [showSort, setShowSort] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = properties
    .filter(p => !type || p.listingType === type)
    .filter(p => !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.location.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      return 0;
    });

  return (
    <View style={styles.container}>
      <TopBar
        title={title || 'Property Listings'}
        subtitle={`${filtered.length} properties found`}
        actions={
          <TouchableOpacity
            onPress={() => push({ name: 'filters' })}
            style={styles.headerButton}
            activeOpacity={0.8}
          >
            <SlidersHorizontal size={16} color={colors.primary} />
          </TouchableOpacity>
        }
      />

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={15} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder={`Search ${type === 'buy' ? 'properties' : type === 'rent' ? 'homes' : 'spaces'}...`}
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Type Filter Chips */}
      <View style={styles.chipsSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
          {['All', type === 'buy' ? 'Apartment' : 'Flat', 'Villa', 'House', 'Plot'].map((chip, i) => (
            <TouchableOpacity
              key={chip}
              style={[styles.chip, i === 0 ? styles.activeChip : styles.inactiveChip]}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, i === 0 ? styles.activeChipText : styles.inactiveChipText]}>
                {chip}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Toolbar */}
      <View style={styles.toolbar}>
        <TouchableOpacity
          onPress={() => setShowSort(true)}
          style={styles.sortButton}
          activeOpacity={0.8}
        >
          <ArrowUpDown size={13} color={colors.textSecondary} />
          <Text style={styles.sortButtonText}>
            {sortOptions.find(s => s.value === sortBy)?.label}
          </Text>
        </TouchableOpacity>

        <View style={styles.viewModeGroup}>
          <TouchableOpacity
            onPress={() => push({ name: 'propertyListing', params: { type, title, mapView: true } })}
            style={styles.viewIconButton}
            activeOpacity={0.8}
          >
            <Map size={15} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setViewMode(v => v === 'grid' ? 'list' : 'grid')}
            style={[styles.viewIconButton, styles.activeViewIcon]}
            activeOpacity={0.8}
          >
            {viewMode === 'grid' ? <List size={15} color={colors.textWhite} /> : <LayoutGrid size={15} color={colors.textWhite} />}
          </TouchableOpacity>
        </View>
      </View>

      {/* Listings List */}
      <ScrollView style={styles.listArea} showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
        {filtered.length === 0 ? (
          <EmptyState
            type="search"
            ctaLabel="Clear Filters"
            onCta={() => setSearchQuery('')}
          />
        ) : viewMode === 'grid' ? (
          <View style={styles.gridWrap}>
            {filtered.map(p => (
              <View key={p.id} style={styles.gridCol}>
                <PropertyCard property={p} compact />
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.listWrap}>
            {filtered.map(p => (
              <PropertyCard key={p.id} property={p} horizontal />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Sort Modal */}
      <Modal visible={showSort} transparent animationType="slide" onRequestClose={() => setShowSort(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowSort(false)}>
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Sort By</Text>
            {sortOptions.map(opt => (
              <TouchableOpacity
                key={opt.value}
                onPress={() => { setSortBy(opt.value); setShowSort(false); }}
                style={styles.sortOptionRow}
              >
                <Text style={styles.sortOptionText}>{opt.label}</Text>
                {sortBy === opt.value && (
                  <View style={styles.checkCircle}>
                    <Check size={10} color={colors.textWhite} strokeWidth={3} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.tertiary,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 42,
    elevation: 1,
    borderWidth: 1,
    borderColor: colors.tertiary,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.primary,
    marginLeft: 8,
  },
  chipsSection: {
    height: 44,
    marginBottom: 6,
  },
  chipsScroll: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeChip: {
    backgroundColor: colors.primary,
  },
  inactiveChip: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.tertiary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeChipText: {
    color: colors.textWhite,
  },
  inactiveChipText: {
    color: colors.textSecondary,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    elevation: 1,
    borderWidth: 1,
    borderColor: colors.tertiary,
  },
  sortButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginLeft: 6,
  },
  viewModeGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  viewIconButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
    borderWidth: 1,
    borderColor: colors.tertiary,
  },
  activeViewIcon: {
    backgroundColor: colors.primary,
  },
  listArea: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  gridWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridCol: {
    width: '48%',
  },
  listWrap: {
    gap: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.modalOverlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.tertiary,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 14,
  },
  sortOptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.tertiaryLight,
  },
  sortOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
