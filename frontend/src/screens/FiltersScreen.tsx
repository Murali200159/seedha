import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { ChevronLeft, X } from 'lucide-react-native';
import { useApp } from '../context/AppContext';

export default function FiltersScreen() {
  const { pop } = useApp();
  const [bhk, setBhk] = useState<string[]>([]);
  const [propertyType, setPropertyType] = useState<string[]>([]);
  const [furnishing, setFurnishing] = useState<string[]>([]);
  const [parking, setParking] = useState<string | null>(null);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const activeCount = bhk.length + propertyType.length + furnishing.length + (parking ? 1 : 0) + (verifiedOnly ? 1 : 0);

  const toggle = (arr: string[], set: (a: string[]) => void, val: string) => {
    set(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  };

  const FilterChip = ({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, active ? styles.activeChip : styles.inactiveChip]}
      activeOpacity={0.8}
    >
      <Text style={[styles.chipText, active ? styles.activeChipText : styles.inactiveChipText]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <TouchableOpacity onPress={pop} style={styles.backCircle} activeOpacity={0.8}>
            <ChevronLeft size={20} color="#111827" strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            Filters {activeCount > 0 ? `(${activeCount})` : ''}
          </Text>
        </View>
        {activeCount > 0 ? (
          <TouchableOpacity
            onPress={() => { setBhk([]); setPropertyType([]); setFurnishing([]); setParking(null); setVerifiedOnly(false); }}
            style={styles.clearRow}
          >
            <X size={13} color="#6B7280" />
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        {/* BHK */}
        <View style={styles.sectionPadding}>
          <Text style={styles.sectionHeading}>BHK Configuration</Text>
          <View style={styles.chipWrap}>
            {['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK'].map(b => (
              <FilterChip key={b} label={b} active={bhk.includes(b)} onPress={() => toggle(bhk, setBhk, b)} />
            ))}
          </View>
        </View>

        {/* Property Type */}
        <View style={styles.sectionPadding}>
          <Text style={styles.sectionHeading}>Property Type</Text>
          <View style={styles.chipWrap}>
            {['Apartment', 'Villa', 'House', 'Plot', 'Office', 'Shop'].map(t => (
              <FilterChip key={t} label={t} active={propertyType.includes(t)} onPress={() => toggle(propertyType, setPropertyType, t)} />
            ))}
          </View>
        </View>

        {/* Furnishing */}
        <View style={styles.sectionPadding}>
          <Text style={styles.sectionHeading}>Furnishing</Text>
          <View style={styles.chipWrap}>
            {['Unfurnished', 'Semi-Furnished', 'Fully Furnished'].map(f => (
              <FilterChip key={f} label={f} active={furnishing.includes(f)} onPress={() => toggle(furnishing, setFurnishing, f)} />
            ))}
          </View>
        </View>

        {/* Parking */}
        <View style={styles.sectionPadding}>
          <Text style={styles.sectionHeading}>Parking</Text>
          <View style={styles.chipWrap}>
            {['Available', 'Not Required'].map(p => (
              <FilterChip key={p} label={p} active={parking === p} onPress={() => setParking(parking === p ? null : p)} />
            ))}
          </View>
        </View>

        {/* Verified Switch */}
        <View style={styles.sectionPadding}>
          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchTitle}>Verified Properties Only</Text>
              <Text style={styles.switchSub}>Show only owner-verified listings</Text>
            </View>
            <Switch
              value={verifiedOnly}
              onValueChange={setVerifiedOnly}
              trackColor={{ false: '#E5E7EB', true: '#2260FF' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={pop} style={styles.cancelButton} activeOpacity={0.8}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={pop} style={styles.applyButton} activeOpacity={0.9}>
          <Text style={styles.applyButtonText}>Apply Filters {activeCount > 0 ? `(${activeCount})` : ''}</Text>
        </TouchableOpacity>
      </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 10,
  },
  clearRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 2,
  },
  scrollArea: {
    flex: 1,
  },
  sectionPadding: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  activeChip: {
    backgroundColor: '#2260FF',
  },
  inactiveChip: {
    backgroundColor: '#FFFFFF',
    elevation: 1,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeChipText: {
    color: '#FFFFFF',
  },
  inactiveChipText: {
    color: '#374151',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    elevation: 1,
  },
  switchTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  switchSub: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  applyButton: {
    flex: 2,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#2260FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
