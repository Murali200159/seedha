import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { ChevronLeft, Home, Key, Building2, ChevronRight, Camera, Plus, CheckCircle2, Upload } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';

type PostMode = 'sheet' | 'sell' | 'rent' | 'commercial';
type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

const steps = ['Basics', 'Location', 'Pricing', 'Amenities', 'Photos', 'Documents', 'Preview', 'Submit'];

const postTypes = [
  { id: 'sell', label: 'Sell Property', sub: 'List your property for sale', Icon: Home, color: colors.primary, bg: colors.tertiaryBg },
  { id: 'rent', label: 'Rent Property', sub: 'Find tenants for your property', Icon: Key, color: colors.secondary, bg: colors.tertiaryBg },
  { id: 'commercial', label: 'Commercial Property', sub: 'List offices, shops & more', Icon: Building2, color: colors.accent, bg: colors.tertiaryBg },
];

const amenityOptions = ['Lift', 'Security', 'Parking', 'Gym', 'Swimming Pool', 'Club House', 'Power Backup', 'CCTV', 'Garden', 'Intercom'];

export default function PostPropertyScreen() {
  const { pop } = useApp();
  const [mode, setMode] = useState<PostMode>('sheet');
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState({
    type: '', bhk: '', area: '', title: '', city: 'Hyderabad', locality: '', society: '',
    price: '', deposit: '', maintenance: '', amenities: [] as string[], photos: 0,
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1500);
  };

  if (submitted) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successBadgeCircle}>
          <CheckCircle2 size={40} color={colors.secondary} />
        </View>
        <Text style={styles.successTitle}>Property Submitted!</Text>
        <Text style={styles.successSubtitle}>
          Your property is under review. Our team will contact you within 24-48 hours to verify and activate the listing.
        </Text>
        <TouchableOpacity onPress={pop} style={styles.backHomeButton} activeOpacity={0.8}>
          <Text style={styles.backHomeButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (mode === 'sheet') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={pop} style={styles.headerBackCircle} activeOpacity={0.8}>
            <ChevronLeft size={20} color={colors.textPrimary} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post Property</Text>
        </View>
        <View style={styles.sheetBody}>
          <Text style={styles.sheetSub}>What would you like to do with your property?</Text>
          <View style={styles.postTypeWrap}>
            {postTypes.map(({ id, label, sub, Icon, color, bg }) => (
              <TouchableOpacity
                key={id}
                onPress={() => setMode(id as PostMode)}
                style={styles.postTypeCard}
                activeOpacity={0.8}
              >
                <View style={[styles.postTypeIconBox, { backgroundColor: bg }]}>
                  <Icon size={22} color={color} />
                </View>
                <View style={styles.postTypeTextColumn}>
                  <Text style={styles.postTypeTitle}>{label}</Text>
                  <Text style={styles.postTypeSub}>{sub}</Text>
                </View>
                <ChevronRight size={18} color={colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  }

  const modeLabel = mode === 'sell' ? 'Sell' : mode === 'rent' ? 'Rent' : 'Commercial';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => step === 1 ? setMode('sheet') : setStep(s => (s - 1) as Step)}
          style={styles.headerBackCircle}
          activeOpacity={0.8}
        >
          <ChevronLeft size={20} color={colors.textPrimary} strokeWidth={2.5} />
        </TouchableOpacity>
        <View style={styles.headerTitleColumn}>
          <Text style={styles.headerTitle}>Post to {modeLabel}</Text>
          <Text style={styles.headerSubtitle}>Step {step} of {steps.length}</Text>
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
            <Text style={styles.inputLabel}>Property Type</Text>
            <View style={styles.typeGrid}>
              {['Apartment', 'Villa', 'House', 'Plot', 'Office', 'Shop'].map(t => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setForm(f => ({ ...f, type: t }))}
                  style={[styles.typeOption, form.type === t ? styles.selectedOption : styles.unselectedOption]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.optionText, form.type === t ? styles.selectedOptionText : styles.unselectedOptionText]}>
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {mode !== 'commercial' && (
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
                      <Text style={[styles.optionText, form.bhk === b ? styles.selectedOptionText : styles.unselectedOptionText]}>
                        {b} BHK
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.fieldGroup}>
              <Text style={styles.inputLabel}>Carpet Area (sq.ft)</Text>
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
                placeholder="e.g. Madhapur, Kondapur"
                placeholderTextColor={colors.textMuted}
                value={form.locality}
                onChangeText={text => setForm(f => ({ ...f, locality: text }))}
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.inputLabel}>Society / Project Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Vasavi Towers"
                placeholderTextColor={colors.textMuted}
                value={form.society}
                onChangeText={text => setForm(f => ({ ...f, society: text }))}
              />
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepHeading}>Pricing</Text>
            <View style={styles.fieldGroup}>
              <Text style={styles.inputLabel}>{mode === 'rent' ? 'Monthly Rent (₹)' : 'Expected Price (₹)'}</Text>
              <TextInput
                style={styles.textInput}
                placeholder={mode === 'rent' ? '20,000' : '75,00,000'}
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                value={form.price}
                onChangeText={text => setForm(f => ({ ...f, price: text }))}
              />
            </View>
          </View>
        )}

        {step === 4 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepHeading}>Amenities</Text>
            <View style={styles.amenityWrap}>
              {amenityOptions.map(a => {
                const selected = form.amenities.includes(a);
                return (
                  <TouchableOpacity
                    key={a}
                    onPress={() => setForm(f => ({
                      ...f,
                      amenities: selected ? f.amenities.filter(x => x !== a) : [...f.amenities, a],
                    }))}
                    style={[styles.amenityChip, selected ? styles.selectedOption : styles.unselectedOption]}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.optionText, selected ? styles.selectedOptionText : styles.unselectedOptionText]}>
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
            <Text style={styles.stepSub}>Ready to register property in Hyderabad</Text>
          </View>
        )}
      </ScrollView>

      {/* Footer CTA */}
      <View style={styles.footerContainer}>
        <TouchableOpacity
          onPress={() => step < 8 ? setStep(s => (s + 1) as Step) : handleSubmit()}
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
  headerBackCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.tertiaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginLeft: 10,
  },
  headerTitleColumn: {
    flex: 1,
    marginLeft: 10,
  },
  headerSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  percentageText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  progressBarWrapper: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: colors.tertiaryBg,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  sheetBody: {
    padding: 16,
  },
  sheetSub: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  postTypeWrap: {
    gap: 10,
  },
  postTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
  },
  postTypeIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postTypeTextColumn: {
    flex: 1,
    marginLeft: 12,
  },
  postTypeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  postTypeSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  formScroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
  stepContainer: {
    paddingVertical: 10,
  },
  stepHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  stepSub: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeOption: {
    width: '31%',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  fieldGroup: {
    marginTop: 14,
  },
  bhkRow: {
    flexDirection: 'row',
    gap: 8,
  },
  bhkOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: colors.primary,
  },
  unselectedOption: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.tertiary,
    elevation: 1,
  },
  optionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  selectedOptionText: {
    color: colors.textWhite,
  },
  unselectedOptionText: {
    color: colors.textPrimary,
  },
  textInput: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
    fontSize: 14,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 1,
  },
  amenityWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  footerContainer: {
    padding: 16,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  continueButton: {
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textWhite,
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: colors.background,
  },
  successBadgeCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.tertiaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  backHomeButton: {
    marginTop: 24,
    width: '100%',
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backHomeButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textWhite,
  },
});
