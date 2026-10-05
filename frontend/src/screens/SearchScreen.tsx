import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronLeft, Search, Clock, MapPin, TrendingUp, X } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';
import { properties } from '../data/properties';
import PropertyCard from '../components/PropertyCard';

const popularLocations = [
  { name: 'Madhapur, Hyderabad', count: '234 properties' },
  { name: 'Gachibowli, Hyderabad', count: '187 properties' },
  { name: 'Kondapur, Hyderabad', count: '145 properties' },
  { name: 'Madhurawada, Vizag', count: '98 properties' },
  { name: 'Jubilee Hills, Hyderabad', count: '76 properties' },
  { name: 'Banjara Hills, Hyderabad', count: '65 properties' },
];

const recentSearches = [
  '3 BHK in Madhapur',
  'Flats in Gachibowli under 80L',
  'Commercial HITEC City',
  '2 BHK Rent in Kondapur',
];

export default function SearchScreen() {
  const { pop, push } = useApp();
  const [query, setQuery] = useState('');

  const results = query.length > 1
    ? properties.filter(p =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.location.toLowerCase().includes(query.toLowerCase()) ||
        p.city.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const suggestions = query.length > 1 ? [
    `${query}, Hyderabad`,
    `Properties in ${query}`,
    `Projects in ${query}`,
    `${query} nearby areas`,
    `${query}, Vizag`,
  ] : [];

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={pop} style={styles.backCircle} activeOpacity={0.8}>
          <ChevronLeft size={20} color={colors.textPrimary} strokeWidth={2.5} />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Search size={16} color={colors.textMuted} />
          <TextInput
            autoFocus
            style={styles.searchInput}
            placeholder="Search location, project, property..."
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={setQuery}
          />
          {query ? (
            <TouchableOpacity onPress={() => setQuery('')}>
              <X size={16} color={colors.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        {/* Suggestions while typing */}
        {query.length > 1 && suggestions.length > 0 && (
          <View style={styles.sectionPadding}>
            <View style={styles.cardContainer}>
              {suggestions.map((s, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => push({ name: 'propertyListing', params: { type: 'buy', title: s } })}
                  style={styles.suggestionRow}
                >
                  <MapPin size={15} color={colors.textMuted} />
                  <Text style={styles.suggestionText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Results */}
        {results.length > 0 && (
          <View style={styles.sectionPadding}>
            <Text style={styles.sectionHeader}>{results.length} Properties Found</Text>
            <View style={styles.resultsList}>
              {results.map(p => <PropertyCard key={p.id} property={p} horizontal />)}
            </View>
          </View>
        )}

        {/* Recent Searches */}
        {!query && (
          <View style={styles.sectionPadding}>
            <View style={styles.rowBetween}>
              <Text style={styles.sectionHeader}>Recent Searches</Text>
              <TouchableOpacity>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.recentList}>
              {recentSearches.map(s => (
                <TouchableOpacity
                  key={s}
                  onPress={() => setQuery(s)}
                  style={styles.recentRow}
                  activeOpacity={0.8}
                >
                  <Clock size={15} color={colors.textMuted} />
                  <Text style={styles.recentText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Popular Locations */}
            <View style={[styles.rowCenter, { marginTop: 20, marginBottom: 10 }]}>
              <TrendingUp size={14} color={colors.primary} />
              <Text style={[styles.sectionHeader, { marginBottom: 0, marginLeft: 6 }]}>Popular Locations</Text>
            </View>
            <View style={styles.popularList}>
              {popularLocations.map(loc => (
                <TouchableOpacity
                  key={loc.name}
                  onPress={() => push({ name: 'propertyListing', params: { type: 'buy', title: `Properties in ${loc.name}` } })}
                  style={styles.locationRow}
                  activeOpacity={0.8}
                >
                  <View style={styles.locationIconBox}>
                    <MapPin size={14} color={colors.primary} />
                  </View>
                  <View style={styles.locationTextCol}>
                    <Text style={styles.locationTitle}>{loc.name}</Text>
                    <Text style={styles.locationSub}>{loc.count}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
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
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.tertiaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.tertiaryBg,
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 42,
    marginLeft: 8,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
    marginLeft: 8,
  },
  scrollArea: {
    flex: 1,
  },
  sectionPadding: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  cardContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  suggestionText: {
    fontSize: 13,
    color: colors.textPrimary,
    marginLeft: 10,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  resultsList: {
    gap: 10,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clearText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  recentList: {
    gap: 8,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 1,
  },
  recentText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textPrimary,
    marginLeft: 10,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  popularList: {
    gap: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 1,
  },
  locationIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.tertiaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationTextCol: {
    marginLeft: 10,
  },
  locationTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  locationSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
});
