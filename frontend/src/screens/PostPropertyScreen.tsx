import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { ChevronLeft, Home, Key, Building2, ChevronRight, Camera, Plus, CheckCircle2, Upload } from 'lucide-react-native';
import { useApp } from '../context/AppContext';

type PostMode = 'sheet' | 'sell' | 'rent' | 'commercial';
type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

const steps = ['Basics', 'Location', 'Pricing', 'Amenities', 'Photos', 'Documents', 'Preview', 'Submit'];

const postTypes = [
  { id: 'sell', label: 'Sell Property', sub: 'List your property for sale', Icon: Home, color: '#2260FF', bg: '#EBF0FF' },
  { id: 'rent', label: 'Rent Property', sub: 'Find tenants for your property', Icon: Key, color: '#7C3AED', bg: '#EDE9FE' },
  { id: 'commercial', label: 'Commercial Property', sub: 'List offices, shops & more', Icon: Building2, color: '#D97706', bg: '#FEF3C7' },
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
          <CheckCircle2 size={40} color="#16A34A" />
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
            <ChevronLeft size={20} color="#111827" strokeWidth={2.5} />
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
                <ChevronRight size={18} color="#9CA3AF" />
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
          <ChevronLeft size={20} color="#111827" strokeWidth={2.5} />
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
                placeholderTextColor="#9CA3AF"
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
                placeholderTextColor="#9CA3AF"
                value={form.locality}
                onChangeText={text => setForm(f => ({ ...f, locality: text }))}
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.inputLabel}>Society / Project Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Vasavi Towers"
                placeholderTextColor="#9CA3AF"
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
                placeholderTextColor="#9CA3AF"
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
            <ActivityIndicator color="white" />
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
    backgroundColor: '#ECEEF5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
  },
  headerBackCircle: {
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
  headerTitleColumn: {
    flex: 1,
    marginLeft: 10,
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#6B7280',
  },
  percentageText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2260FF',
  },
  progressBarWrapper: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2260FF',
    borderRadius: 3,
  },
  sheetBody: {
    padding: 16,
  },
  sheetSub: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  postTypeWrap: {
    gap: 10,
  },
  postTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
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
    color: '#111827',
  },
  postTypeSub: {
    fontSize: 11,
    color: '#6B7280',
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
    color: '#111827',
    marginBottom: 12,
  },
  stepSub: {
    fontSize: 13,
    color: '#6B7280',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
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
    backgroundColor: '#2260FF',
  },
  unselectedOption: {
    backgroundColor: '#FFFFFF',
    elevation: 1,
  },
  optionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
  unselectedOptionText: {
    color: '#374151',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
    fontSize: 14,
    color: '#111827',
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
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  continueButton: {
    height: 48,
    borderRadius: 14,
    backgroundColor: '#2260FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    fontSize: 15,
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
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#DCFCE7',
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
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },
  backHomeButton: {
    marginTop: 24,
    width: '100%',
    height: 48,
    borderRadius: 14,
    backgroundColor: '#2260FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backHomeButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
