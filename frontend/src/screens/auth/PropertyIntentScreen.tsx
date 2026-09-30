import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronLeft, Home, Key, Building2, Landmark, Check } from 'lucide-react-native';
import { useApp } from '../../context/AppContext';

const intents = [
  { id: 'buy', label: 'Buy a Property', sub: 'Apartments, villas, plots', icon: Home, color: '#2260FF', bg: '#EFF6FF' },
  { id: 'rent', label: 'Rent a Home', sub: 'Flexible rentals across India', icon: Key, color: '#7C3AED', bg: '#F5F3FF' },
  { id: 'commercial', label: 'Commercial Space', sub: 'Office, retail & industrial', icon: Building2, color: '#0891B2', bg: '#ECFEFF' },
  { id: 'loan', label: 'Home Loan', sub: 'Best rates, instant approval', icon: Landmark, color: '#E11D48', bg: '#FFF1F2' },
];

export default function PropertyIntentScreen() {
  const { currentScreen, push } = useApp();
  const params = (currentScreen.params ?? {}) as { name?: string; phone?: string; email?: string; city?: string };
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setSelected(s => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleContinue = () => {
    push({ name: 'locationPermission', params });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <TouchableOpacity onPress={() => push({ name: 'profileSetup', params })} style={styles.backCircle} activeOpacity={0.8}>
          <ChevronLeft size={20} color="#111827" strokeWidth={2.5} />
        </TouchableOpacity>

        <Text style={styles.stepTag}>STEP 2 OF 3</Text>
        <Text style={styles.mainTitle}>What are you looking for?</Text>
        <Text style={styles.subTitle}>Choose what you want to do on Seedha Properties.</Text>
      </View>

      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        <View style={styles.gridPadding}>
          <View style={styles.gridWrap}>
            {intents.map(item => {
              const active = selected.has(item.id);
              const Icon = item.icon;
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => toggle(item.id)}
                  style={[styles.intentCard, active ? { backgroundColor: item.bg, borderColor: item.color } : null]}
                  activeOpacity={0.8}
                >
                  <View style={styles.cardHeader}>
                    <View style={[styles.iconBox, { backgroundColor: active ? item.color : '#E5E7EB' }]}>
                      <Icon size={20} color={active ? 'white' : '#6B7280'} />
                    </View>
                    <View style={[styles.checkCircle, active ? { backgroundColor: item.color } : null]}>
                      {active && <Check size={10} color="white" strokeWidth={3} />}
                    </View>
                  </View>
                  <Text style={styles.intentTitle}>{item.label}</Text>
                  <Text style={styles.intentSub}>{item.sub}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity onPress={handleContinue} style={styles.continueButton} activeOpacity={0.9}>
            <Text style={styles.continueButtonText}>
              Continue {selected.size > 0 ? `(${selected.size})` : ''}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleContinue} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topSection: {
    backgroundColor: '#F8F9FF',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  backCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
    marginBottom: 16,
  },
  stepTag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2260FF',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
  },
  subTitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  scrollArea: {
    flex: 1,
  },
  gridPadding: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  gridWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  intentCard: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 14,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  intentTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  intentSub: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  continueButton: {
    height: 50,
    borderRadius: 16,
    backgroundColor: '#2260FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  continueButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  skipButton: {
    marginTop: 14,
    alignItems: 'center',
  },
  skipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
});
