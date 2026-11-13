import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import {
  ChevronLeft,
  House,
  KeyRound,
  Building2,
  Users,
  Building,
  ChevronRight,
  Store,
  CircleCheck,
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import type { AdminCategory } from '../types';
import { colors } from '../theme/colors';

type PostMode = 'sheet' | 'sell' | 'rent' | 'commercial' | 'flatmate' | 'pg';
type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

const steps = ['Basics', 'Location', 'Pricing', 'Amenities', 'Photos', 'Documents', 'Preview', 'Submit'];

const postTypes = [
  {
    id: 'sell',
    label: 'Sell Property',
    sub: 'Post a residential property for sale',
    Icon: House,
    iconColor: '#111827',
    iconBg: '#DBEAFE',
  },
  {
    id: 'rent',
    label: 'Rent Property',
    sub: 'Find a tenant for your residential property',
    Icon: KeyRound,
    iconColor: '#7008E7',
    iconBg: '#EDE9FE',
  },
  {
    id: 'commercial',
    label: 'Commercial Property',
    sub: 'Sell or rent offices, shops and more',
    Icon: Building2,
    iconColor: '#BB4D00',
    iconBg: '#FEF3C6',
  },
  {
    id: 'flatmate',
    label: 'Flatmates',
    sub: 'Share a flat and find the right flatmate',
    Icon: Users,
    iconColor: '#C6005C',
    iconBg: '#FCE7F3',
  },
  {
    id: 'pg',
    label: 'PG / Hostel',
    sub: 'List beds, rooms, food and facilities',
    Icon: Building,
    iconColor: '#047857',
    iconBg: '#D1FAE5',
  },
];

const amenityOptions = [
  'Lift',
  'Security',
  'Parking',
  'Gym',
  'Swimming Pool',
  'Club House',
  'Power Backup',
  'CCTV',
  'Garden',
  'Intercom',
  'WiFi',
  'Food Included',
];

export default function PostPropertyScreen() {
  const { pop, addAdminRequest, user } = useApp();
  const [mode, setMode] = useState<PostMode>('sheet');
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState({
    type: '',
    bhk: '',
    area: '',
    title: '',
    city: 'Hyderabad',
    locality: '',
    society: '',
    price: '',
    deposit: '',
    maintenance: '',
    amenities: [] as string[],
    photos: 0,
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);

    const category: AdminCategory =
      mode === 'sell' ? 'flat_building' : mode === 'commercial' ? 'commercial' : 'rent';

    const computedTitle =
      form.title ||
      `${form.bhk ? form.bhk + ' BHK ' : ''}${form.type || (mode === 'pg' ? 'PG Room' : mode === 'flatmate' ? 'Flatmate Room' : 'Property')} in ${
        form.locality || 'Hyderabad'
      }`;
    const computedLocation = `${form.locality ? form.locality + ', ' : ''}${form.city || 'Hyderabad'}`;
    const computedAmount = form.price
      ? `₹${form.price}`
      : mode === 'pg'
      ? '₹8,500/mo'
      : mode === 'flatmate'
      ? '₹12,000/mo'
      : mode === 'rent'
      ? '₹35,000/mo'
      : '₹95 Lakhs';

    if (addAdminRequest) {
      addAdminRequest({
        category,
        title: computedTitle,
        userName: user?.name || 'Verified Owner',
        userPhone: user?.phone || '+91 98765 43210',
        userEmail: user?.email || 'owner@seedhaproperties.com',
        location: computedLocation,
        amount: computedAmount,
        details: {
          listingMode: mode,
          propertyType: form.type || (mode === 'pg' ? 'PG / Hostel' : 'Apartment'),
          bhk: form.bhk || '2 BHK',
          carpetArea: form.area ? `${form.area} sq.ft` : '1,350 sq.ft',
          society: form.society || 'Green Heights',
          deposit: form.deposit,
          maintenance: form.maintenance,
          amenities: form.amenities,
        },
      });
    }

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successBadgeCircle}>
          <CircleCheck size={44} color="#047857" />
        </View>
        <Text style={styles.successTitle}>Property Submitted!</Text>
        <Text style={styles.successSubtitle}>
          Your property is under review. Our team will contact you within 24-48 hours to verify and activate the
          listing.
        </Text>
        <TouchableOpacity onPress={pop} style={styles.backHomeButton} activeOpacity={0.8}>
          <Text style={styles.backHomeButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Exact UI design matching SVG and Screenshot
  if (mode === 'sheet') {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <StatusBar style="dark" />
        <ScrollView
          style={styles.sheetScroll}
          contentContainerStyle={styles.sheetScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Bar with circular white back button, Title and Subtitle */}
          <View style={styles.sheetHeader}>
            <TouchableOpacity onPress={pop} style={styles.sheetBackCircle} activeOpacity={0.7}>
              <ChevronLeft size={22} color="#111827" strokeWidth={2.4} />
            </TouchableOpacity>
            <View style={styles.sheetHeaderTextWrap}>
              <Text style={styles.sheetHeaderTitle}>Post Property</Text>
              <Text style={styles.sheetHeaderSub}>Choose what you want to post</Text>
            </View>
          </View>

          {/* Dark Hero Card */}
          <View style={styles.heroCard}>
            <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
              <Defs>
                <LinearGradient id="heroCardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <Stop offset="0%" stopColor="#0B0C0E" />
                  <Stop offset="45%" stopColor="#1B1D20" />
                  <Stop offset="100%" stopColor="#373B41" />
                </LinearGradient>
              </Defs>
              <Rect width="100%" height="100%" rx={22} fill="url(#heroCardGrad)" />
            </Svg>
            <View style={styles.heroContent}>
              <Store size={26} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.heroTitle}>Reach genuine buyers, tenants and flatmates</Text>
              <Text style={styles.heroSubtitle}>
                Create a detailed listing, preview it and submit it for review.
              </Text>
            </View>
          </View>

          {/* 5 Selection Cards */}
          <View style={styles.cardsContainer}>
            {postTypes.map(({ id, label, sub, Icon, iconColor, iconBg }) => (
              <TouchableOpacity
                key={id}
                onPress={() => {
                  setMode(id as PostMode);
                  setStep(1);
                }}
                style={styles.optionCard}
                activeOpacity={0.75}
              >
                <View style={[styles.optionIconBox, { backgroundColor: iconBg }]}>
                  <Icon size={24} color={iconColor} strokeWidth={2} />
                </View>
                <View style={styles.optionTextWrap}>
                  <Text style={styles.optionTitle}>{label}</Text>
                  <Text style={styles.optionSubtitle}>{sub}</Text>
                </View>
                <ChevronRight size={20} color="#9CA3AF" strokeWidth={2} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const modeLabel =
    mode === 'sell'
      ? 'Sell'
      : mode === 'rent'
      ? 'Rent'
      : mode === 'commercial'
      ? 'Commercial'
      : mode === 'flatmate'
      ? 'Flatmates'
      : 'PG / Hostel';

  const typeList =
    mode === 'pg'
      ? ['Single Room', 'Double Sharing', 'Triple Sharing', 'Hostel Bed', 'Entire Floor', 'Coliving']
      : mode === 'flatmate'
      ? ['Room in 2 BHK', 'Room in 3 BHK', 'Shared Room', 'Master Bedroom', 'Studio Room']
      : mode === 'commercial'
      ? ['Office', 'Shop', 'Showroom', 'Warehouse', 'Co-working', 'Commercial Land']
      : ['Apartment', 'Villa', 'Independent House', 'Plot', 'Penthouse', 'Builder Floor'];

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* Step-by-step Header */}
        <View style={styles.formHeader}>
          <TouchableOpacity
            onPress={() => (step === 1 ? setMode('sheet') : setStep(s => (s - 1) as Step))}
            style={styles.sheetBackCircle}
            activeOpacity={0.8}
          >
            <ChevronLeft size={22} color="#111827" strokeWidth={2.4} />
          </TouchableOpacity>
          <View style={styles.formHeaderTitleCol}>
            <Text style={styles.formHeaderTitle}>Post to {modeLabel}</Text>
            <Text style={styles.formHeaderSub}>
              Step {step} of {steps.length} • {steps[step - 1]}
            </Text>
          </View>
          <Text style={styles.percentageText}>{Math.round((step / 8) * 100)}%</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarWrapper}>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${(step / 8) * 100}%` }]} />
          </View>
        </View>

        <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
          {step === 1 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepHeading}>Property Basics</Text>
              <Text style={styles.inputLabel}>
                {mode === 'pg' ? 'Sharing / Room Type' : mode === 'flatmate' ? 'Flatmate Room Type' : 'Property Type'}
              </Text>
              <View style={styles.typeGrid}>
                {typeList.map(t => (
                  <TouchableOpacity
                    key={t}
                    onPress={() => setForm(f => ({ ...f, type: t }))}
                    style={[styles.typeOption, form.type === t ? styles.selectedOption : styles.unselectedOption]}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        form.type === t ? styles.selectedOptionText : styles.unselectedOptionText,
                      ]}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {mode !== 'commercial' && mode !== 'pg' && (
                <View style={styles.fieldGroup}>
                  <Text style={styles.inputLabel}>BHK Configuration</Text>
                  <View style={styles.bhkRow}>
                    {['1', '2', '3', '4', '5+'].map(b => (
                      <TouchableOpacity
                        key={b}
                        onPress={() => setForm(f => ({ ...f, bhk: b }))}
                        style={[styles.bhkOption, form.bhk === b ? styles.selectedOption : styles.unselectedOption]}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            form.bhk === b ? styles.selectedOptionText : styles.unselectedOptionText,
                          ]}
                        >
                          {b} BHK
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              <View style={styles.fieldGroup}>
                <Text style={styles.inputLabel}>Approx Carpet Area (sq.ft)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. 1200"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                  value={form.area}
                  onChangeText={text => setForm(f => ({ ...f, area: text }))}
                />
              </View>
            </View>
          )}

          {step === 2 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepHeading}>Location Details</Text>
              <View style={styles.fieldGroup}>
                <Text style={styles.inputLabel}>Locality / Area</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Madhapur, Kondapur, Gachibowli"
                  placeholderTextColor={colors.textMuted}
                  value={form.locality}
                  onChangeText={text => setForm(f => ({ ...f, locality: text }))}
                />
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.inputLabel}>Society / Apartment / Building Name</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Vasavi Towers or Green PG"
                  placeholderTextColor={colors.textMuted}
                  value={form.society}
                  onChangeText={text => setForm(f => ({ ...f, society: text }))}
                />
              </View>
            </View>
          )}

          {step === 3 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepHeading}>Pricing & Deposit</Text>
              <View style={styles.fieldGroup}>
                <Text style={styles.inputLabel}>
                  {mode === 'rent' || mode === 'flatmate' || mode === 'pg'
                    ? 'Monthly Rent / Charge (₹)'
                    : 'Expected Price (₹)'}
                </Text>
                <TextInput
                  style={styles.textInput}
                  placeholder={
                    mode === 'pg'
                      ? '8,500'
                      : mode === 'flatmate'
                      ? '12,000'
                      : mode === 'rent'
                      ? '25,000'
                      : '75,00,000'
                  }
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                  value={form.price}
                  onChangeText={text => setForm(f => ({ ...f, price: text }))}
                />
              </View>

              {(mode === 'rent' || mode === 'flatmate' || mode === 'pg') && (
                <View style={styles.fieldGroup}>
                  <Text style={styles.inputLabel}>Security Deposit (₹)</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. 20,000"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="numeric"
                    value={form.deposit}
                    onChangeText={text => setForm(f => ({ ...f, deposit: text }))}
                  />
                </View>
              )}
            </View>
          )}

          {step === 4 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepHeading}>Amenities & Facilities</Text>
              <View style={styles.amenityWrap}>
                {amenityOptions.map(a => {
                  const selected = form.amenities.includes(a);
                  return (
                    <TouchableOpacity
                      key={a}
                      onPress={() =>
                        setForm(f => ({
                          ...f,
                          amenities: selected ? f.amenities.filter(x => x !== a) : [...f.amenities, a],
                        }))
                      }
                      style={[styles.amenityChip, selected ? styles.selectedOption : styles.unselectedOption]}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[styles.optionText, selected ? styles.selectedOptionText : styles.unselectedOptionText]}
                      >
                        {a}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {step >= 5 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepHeading}>Review & Complete</Text>
              <Text style={styles.stepSub}>Ready to submit your {modeLabel} listing in Hyderabad</Text>
              <View style={styles.reviewCard}>
                <Text style={styles.reviewTitle}>
                  {form.title || `${form.type || modeLabel} in ${form.locality || 'Hyderabad'}`}
                </Text>
                <Text style={styles.reviewMeta}>
                  {form.price ? `₹${form.price}` : 'Pricing on request'} •{' '}
                  {form.locality ? form.locality : 'Hyderabad'}
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Footer CTA */}
        <View style={styles.footerContainer}>
          <TouchableOpacity
            onPress={() => (step < 8 ? setStep(s => (s + 1) as Step) : handleSubmit())}
            disabled={loading}
            style={styles.continueButton}
            activeOpacity={0.9}
          >
            {loading ? (
              <ActivityIndicator color={colors.textWhite} />
            ) : (
              <Text style={styles.continueButtonText}>{step < 8 ? 'Continue' : 'Submit Property'}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#ECEEF5',
  },
  sheetScroll: {
    flex: 1,
  },
  sheetScrollContent: {
    paddingBottom: 30,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 24 : 12,
    paddingBottom: 16,
  },
  sheetBackCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  sheetHeaderTextWrap: {
    marginLeft: 14,
  },
  sheetHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 24,
  },
  sheetHeaderSub: {
    fontSize: 13,
    fontWeight: '400',
    color: '#6B7280',
    marginTop: 2,
  },
  heroCard: {
    marginHorizontal: 16,
    borderRadius: 22,
    padding: 22,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
    minHeight: 160,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  heroContent: {
    zIndex: 2,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 14,
    lineHeight: 26,
    letterSpacing: -0.2,
  },
  heroSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.78)',
    marginTop: 8,
    lineHeight: 18,
  },
  cardsContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#1E2822',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  optionIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTextWrap: {
    flex: 1,
    marginLeft: 14,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  optionSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: '#6B7280',
    marginTop: 2,
  },
  container: {
    flex: 1,
    backgroundColor: '#ECEEF5',
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 20 : 10,
    paddingBottom: 14,
    backgroundColor: '#ECEEF5',
  },
  formHeaderTitleCol: {
    flex: 1,
    marginLeft: 14,
  },
  formHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  formHeaderSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  percentageText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  progressBarWrapper: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  formScroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
  stepContainer: {
    paddingVertical: 10,
  },
  stepHeading: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  stepSub: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeOption: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '30%',
  },
  fieldGroup: {
    marginTop: 16,
  },
  bhkRow: {
    flexDirection: 'row',
    gap: 8,
  },
  bhkOption: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: colors.primary,
  },
  unselectedOption: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 1,
  },
  optionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
  unselectedOptionText: {
    color: '#1F2937',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 48,
    fontSize: 15,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 1,
  },
  amenityWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 10,
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  reviewMeta: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  footerContainer: {
    padding: 16,
    backgroundColor: '#ECEEF5',
    borderTopWidth: 1,
    borderTopColor: '#E2E5EE',
  },
  continueButton: {
    height: 50,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#ECEEF5',
  },
  successBadgeCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 20,
  },
  backHomeButton: {
    marginTop: 24,
    width: '100%',
    height: 50,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backHomeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
