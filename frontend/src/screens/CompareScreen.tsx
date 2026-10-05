import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { ShieldCheck, CheckCircle2, XCircle, ChevronRight, BarChart3, Check } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';
import { properties } from '../data/properties';
import TopBar from '../components/TopBar';
import type { Property } from '../types';

type Row = { label: string; keyA: (p: Property) => string; highlight?: boolean };

const rows: Row[] = [
  { label: 'Price', keyA: p => p.priceLabel, highlight: true },
  { label: 'Area', keyA: p => `${p.area} sq.ft` },
  { label: 'BHK', keyA: p => p.bedrooms > 0 ? `${p.bedrooms} BHK` : 'N/A' },
  { label: 'Bathrooms', keyA: p => `${p.bathrooms}` },
  { label: 'Furnishing', keyA: p => p.furnishing.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ') },
  { label: 'Parking', keyA: p => p.parking ? 'Available' : 'Not Available' },
  { label: 'Floor', keyA: p => p.floor ?? '—' },
  { label: 'Price/sqft', keyA: p => p.listingType !== 'rent' ? `₹${Math.round(p.price / p.area).toLocaleString('en-IN')}` : '—' },
  { label: 'Possession', keyA: p => p.possessionDate ?? '—' },
];

const amenityList = ['Gym', 'Swimming Pool', 'Parking', 'Security', 'Lift', 'Power Backup', 'Clubhouse', 'WiFi'];

export default function CompareScreen() {
  const { currentScreen, push } = useApp();
  const propA = currentScreen.params?.property as Property | undefined;
  const [propertyA] = useState<Property | null>(propA ?? properties[0]);
  const [propertyB, setPropertyB] = useState<Property | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const pickableProperties = properties.filter(p => p.id !== propertyA?.id);

  return (
    <View style={styles.container}>
      <TopBar
        title="Compare Properties"
        subtitle={propertyA && propertyB ? 'Side-by-side comparison' : 'Select a property to compare'}
      />

      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          {/* Property A Header */}
          <View style={styles.propCol}>
            {propertyA && (
              <TouchableOpacity
                onPress={() => push({ name: 'propertyDetail', params: { property: propertyA } })}
                style={styles.cardHeader}
                activeOpacity={0.8}
              >
                <Image source={{ uri: propertyA.image }} style={styles.cardImage} />
                <View style={styles.overlay} />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{propertyA.title}</Text>
                  <Text style={styles.cardLocation} numberOfLines={1}>{propertyA.location}</Text>
                </View>
                <View style={styles.badgeA}>
                  <Text style={styles.badgeAText}>A</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>

          {/* Property B Header */}
          <View style={styles.propCol}>
            {propertyB ? (
              <TouchableOpacity
                onPress={() => push({ name: 'propertyDetail', params: { property: propertyB } })}
                style={styles.cardHeader}
                activeOpacity={0.8}
              >
                <Image source={{ uri: propertyB.image }} style={styles.cardImage} />
                <View style={styles.overlay} />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{propertyB.title}</Text>
                  <Text style={styles.cardLocation} numberOfLines={1}>{propertyB.location}</Text>
                </View>
                <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.changeBadge}>
                  <Text style={styles.changeText}>Change</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.emptyAddCard} activeOpacity={0.8}>
                <BarChart3 size={24} color={colors.primary} />
                <Text style={styles.addText}>Tap to add property</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {propertyA && propertyB ? (
          <View style={styles.tableSection}>
            <View style={styles.tableCard}>
              {rows.map((row, idx) => {
                const valA = row.keyA(propertyA);
                const valB = row.keyA(propertyB);
                const isDiff = valA !== valB;

                return (
                  <View key={row.label} style={[styles.tableRow, isDiff ? styles.diffRow : null]}>
                    <Text style={styles.rowLabel}>{row.label}</Text>
                    <Text style={[styles.rowVal, row.highlight ? styles.highlightVal : null]}>{valA}</Text>
                    <Text style={[styles.rowVal, row.highlight ? styles.highlightVal : null]}>{valB}</Text>
                  </View>
                );
              })}
            </View>

            {/* Amenities Section */}
            <Text style={styles.sectionHeading}>Amenities</Text>
            <View style={styles.tableCard}>
              {amenityList.map(amenity => {
                const hasA = propertyA.amenities.some(a => a.toLowerCase().includes(amenity.toLowerCase()));
                const hasB = propertyB.amenities.some(a => a.toLowerCase().includes(amenity.toLowerCase()));
                return (
                  <View key={amenity} style={styles.tableRow}>
                    <Text style={styles.rowLabel}>{amenity}</Text>
                    <View style={styles.iconCell}>
                      {hasA ? <CheckCircle2 size={16} color={colors.secondary} /> : <XCircle size={16} color={colors.tertiary} />}
                    </View>
                    <View style={styles.iconCell}>
                      {hasB ? <CheckCircle2 size={16} color={colors.secondary} /> : <XCircle size={16} color={colors.tertiary} />}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        ) : (
          <View style={styles.pickSection}>
            <Text style={styles.pickHeading}>Select a property to compare with</Text>
            {pickableProperties.map(p => (
              <TouchableOpacity
                key={p.id}
                onPress={() => setPropertyB(p)}
                style={styles.pickRow}
                activeOpacity={0.8}
              >
                <Image source={{ uri: p.image }} style={styles.pickImage} />
                <View style={styles.pickInfo}>
                  <Text style={styles.pickTitle} numberOfLines={1}>{p.title}</Text>
                  <Text style={styles.pickSub}>{p.location} · {p.priceLabel}</Text>
                </View>
                <ChevronRight size={16} color={colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Property Picker Modal */}
      <Modal visible={showPicker} transparent animationType="slide" onRequestClose={() => setShowPicker(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowPicker(false)}>
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Select Property to Compare</Text>
            <ScrollView style={styles.modalScroll}>
              {pickableProperties.map(p => (
                <TouchableOpacity
                  key={p.id}
                  onPress={() => { setPropertyB(p); setShowPicker(false); }}
                  style={[styles.modalPickRow, propertyB?.id === p.id ? styles.modalSelectedRow : null]}
                >
                  <Image source={{ uri: p.image }} style={styles.modalPickImage} />
                  <View style={styles.modalPickText}>
                    <Text style={styles.pickTitle} numberOfLines={1}>{p.title}</Text>
                    <Text style={styles.pickSub}>{p.location} · {p.priceLabel}</Text>
                  </View>
                  {propertyB?.id === p.id && <Check size={16} color={colors.primary} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
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
  scrollArea: {
    flex: 1,
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 12,
  },
  propCol: {
    flex: 1,
  },
  cardHeader: {
    height: 110,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.overlayLight,
  },
  cardInfo: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textWhite,
  },
  cardLocation: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  badgeA: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeAText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textWhite,
  },
  changeBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  changeText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.primary,
  },
  emptyAddCard: {
    height: 110,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.tertiary,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 6,
  },
  tableSection: {
    marginBottom: 24,
  },
  tableCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    marginBottom: 16,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
  },
  diffRow: {
    backgroundColor: colors.tertiaryBg,
  },
  rowLabel: {
    flex: 1.2,
    fontSize: 11,
    color: colors.textSecondary,
  },
  rowVal: {
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  highlightVal: {
    color: colors.primary,
  },
  iconCell: {
    flex: 1,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  pickSection: {
    paddingVertical: 8,
    gap: 8,
  },
  pickHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  pickRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 1,
  },
  pickImage: {
    width: 48,
    height: 48,
    borderRadius: 10,
  },
  pickInfo: {
    flex: 1,
    marginLeft: 10,
  },
  pickTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  pickSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
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
    maxHeight: '75%',
    padding: 20,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  modalScroll: {
    maxHeight: 350,
  },
  modalPickRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    marginBottom: 6,
    backgroundColor: colors.background,
  },
  modalSelectedRow: {
    backgroundColor: colors.tertiaryBg,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  modalPickImage: {
    width: 44,
    height: 44,
    borderRadius: 8,
  },
  modalPickText: {
    flex: 1,
    marginLeft: 10,
  },
});
