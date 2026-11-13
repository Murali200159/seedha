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
  Modal,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  House,
  KeyRound,
  Building2,
  Users,
  Building,
  Store,
  CircleCheck,
  Check,
  X,
  Camera,
  FileText,
  ShieldCheck,
  LocateFixed,
  MapPin,
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import type { AdminCategory } from '../types';
import { colors } from '../theme/colors';

type PostMode = 'sheet' | 'sell' | 'rent' | 'commercial' | 'flatmate' | 'pg';
type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;

const steps = ['Basics', 'Location', 'Pricing', 'Amenities', 'Photos', 'Documents', 'Review'];

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

const propertyTypeOptions = [
  'Apartment',
  'Independent House / Villa',
  'Builder Floor',
  'Penthouse',
  'Plot / Land',
  'Studio Apartment',
  'Farmhouse',
  'Commercial Office',
];

const parkingOptions = [
  'Covered',
  'Open',
  '1 Covered, 1 Open',
  '2 Covered',
  'None',
];

const propertyAgeOptions = [
  'Under Construction',
  '0 - 1 years',
  '1 - 5 years',
  '5 - 10 years',
  '10+ years',
];

const facingOptions = [
  'East',
  'North',
  'North-East',
  'West',
  'South',
  'North-West',
  'South-East',
  'South-West',
];

const conditionOptions = [
  'Ready to move',
  'Under construction',
  'Newly constructed',
  'Renovated',
  'Needs renovation',
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
  'Gas Pipeline',
];

export default function PostPropertyScreen() {
  const { pop, addAdminRequest, user } = useApp();
  const [mode, setMode] = useState<PostMode>('sheet');
  const [step, setStep] = useState<Step>(1);

  // Form State
  const [form, setForm] = useState({
    // Step 1 - Basics
    propertyType: '',
    title: '',
    description: '',
    bhk: '',
    bathrooms: '',
    balconies: '',
    furnishing: '',
    parking: '',
    propertyAge: '',
    floorNo: '',
    totalFloors: '',
    facing: '',
    condition: '',
    superBuiltUpArea: '',
    carpetArea: '',

    // Step 2 - Location
    locality: '',
    streetArea: '',
    society: '',
    city: 'Hyderabad',
    landmark: '',
    mapPinSet: false,
    propertyPosition: 'Main road property',
    availableDays: 'Any day',
    availableFrom: '',
    availableUntil: '',

    // Step 3 - Pricing
    price: '',
    deposit: '',
    maintenance: '',

    // Step 4 - Amenities
    amenities: [] as string[],

    // Step 5 - Photos
    photosCount: 2,

    // Step 6 - Documents
    ownership: 'Freehold',
    reraId: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Picker modal state
  const [pickerModal, setPickerModal] = useState<{
    visible: boolean;
    title: string;
    options: string[];
    selectedValue: string;
    onSelect: (val: string) => void;
  }>({
    visible: false,
    title: '',
    options: [],
    selectedValue: '',
    onSelect: () => {},
  });

  const openPicker = (
    title: string,
    options: string[],
    selectedValue: string,
    onSelect: (val: string) => void
  ) => {
    setPickerModal({
      visible: true,
      title,
      options,
      selectedValue,
      onSelect,
    });
  };

  const closePicker = () => {
    setPickerModal(p => ({ ...p, visible: false }));
  };

  const handleSubmit = () => {
    setLoading(true);

    const category: AdminCategory =
      mode === 'sell' ? 'flat_building' : mode === 'commercial' ? 'commercial' : 'rent';

    const computedTitle =
      form.title ||
      `${form.bhk ? form.bhk + ' BHK ' : ''}${form.propertyType || (mode === 'pg' ? 'PG Room' : mode === 'flatmate' ? 'Flatmate Room' : 'Property')} in ${
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
          propertyType: form.propertyType || (mode === 'pg' ? 'PG / Hostel' : 'Apartment'),
          bhk: form.bhk ? `${form.bhk} BHK` : '2 BHK',
          carpetArea: form.carpetArea ? `${form.carpetArea} sq.ft` : '1,350 sq.ft',
          superBuiltUpArea: form.superBuiltUpArea ? `${form.superBuiltUpArea} sq.ft` : '',
          society: form.society || 'Green Heights',
          deposit: form.deposit,
          maintenance: form.maintenance,
          amenities: form.amenities,
          furnishing: form.furnishing,
          facing: form.facing,
          condition: form.condition,
          propertyAge: form.propertyAge,
          parking: form.parking,
          streetArea: form.streetArea,
          propertyPosition: form.propertyPosition,
          availableDays: form.availableDays,
          availableFrom: form.availableFrom,
          availableUntil: form.availableUntil,
        },
      });
    }

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  if (submitted) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successBadgeCircle}>
          <CircleCheck size={44} color="#047857" />
        </View>
        <Text style={styles.successTitle}>Property Submitted!</Text>
        <Text style={styles.successSubtitle}>
          Your listing has been submitted for verification. Our review team will verify and activate your
          property within 24 hours.
        </Text>
        <TouchableOpacity onPress={pop} style={styles.backHomeButton} activeOpacity={0.8}>
          <Text style={styles.backHomeButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 1. Initial "Choose what you want to post" Sheet
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

  // Step percentage: Step 1 is 14% (1/7), Step 2 is 29%, Step 7 is 100%
  const stepPercentage = Math.round((step / 7) * 100);

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
              Step {step} of 7 · {steps[step - 1]}
            </Text>
          </View>
          <Text style={styles.percentageText}>{stepPercentage}%</Text>
        </View>

        {/* 7-Segment Progress Bar */}
        <View style={styles.segmentBarRow}>
          {[1, 2, 3, 4, 5, 6, 7].map(seg => (
            <View
              key={seg}
              style={[
                styles.segmentBar,
                seg <= step ? styles.segmentBarActive : styles.segmentBarInactive,
              ]}
            />
          ))}
        </View>

        {/* Scrollable Form Body */}
        <ScrollView
          style={styles.formScroll}
          contentContainerStyle={styles.formScrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* STEP 1: BASICS */}
          {step === 1 && (
            <View style={styles.stepFormContent}>
              {/* 1. Property Type */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Property Type</Text>
                <TouchableOpacity
                  style={styles.selectInput}
                  activeOpacity={0.7}
                  onPress={() =>
                    openPicker('Property Type', propertyTypeOptions, form.propertyType, val =>
                      setForm(f => ({ ...f, propertyType: val }))
                    )
                  }
                >
                  <Text style={[styles.selectText, !form.propertyType && styles.placeholderText]}>
                    {form.propertyType || 'Select'}
                  </Text>
                  <ChevronDown size={18} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {/* 2. Property title */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Property title</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Write a clear listing title"
                  placeholderTextColor="#9CA3AF"
                  value={form.title}
                  onChangeText={text => setForm(f => ({ ...f, title: text }))}
                />
              </View>

              {/* 3. Property description */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Property description</Text>
                <TextInput
                  style={styles.textAreaInput}
                  placeholder="Describe the property, highlights and neighbourhood"
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  value={form.description}
                  onChangeText={text => setForm(f => ({ ...f, description: text }))}
                />
              </View>

              {/* 4. BHK */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>BHK</Text>
                <View style={styles.bhkRow}>
                  {['1', '2', '3', '4', '5+'].map(b => {
                    const isSelected = form.bhk === b;
                    return (
                      <TouchableOpacity
                        key={b}
                        onPress={() => setForm(f => ({ ...f, bhk: isSelected ? '' : b }))}
                        style={[styles.bhkCircle, isSelected && styles.bhkCircleSelected]}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.bhkText, isSelected && styles.bhkTextSelected]}>
                          {b}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* 5. Bathrooms & Balconies (2 columns) */}
              <View style={styles.twoColRow}>
                <View style={styles.colHalf}>
                  <Text style={styles.fieldLabel}>Bathrooms</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder=""
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    value={form.bathrooms}
                    onChangeText={text => setForm(f => ({ ...f, bathrooms: text }))}
                  />
                </View>
                <View style={styles.colHalf}>
                  <Text style={styles.fieldLabel}>Balconies</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder=""
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    value={form.balconies}
                    onChangeText={text => setForm(f => ({ ...f, balconies: text }))}
                  />
                </View>
              </View>

              {/* 6. Furnishing status */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Furnishing status</Text>
                <View style={styles.pillsRow}>
                  {['Fully Furnished', 'Semi-Furnished', 'Unfurnished'].map(item => {
                    const isSelected = form.furnishing === item;
                    return (
                      <TouchableOpacity
                        key={item}
                        onPress={() => setForm(f => ({ ...f, furnishing: isSelected ? '' : item }))}
                        style={[styles.furnishPill, isSelected && styles.furnishPillSelected]}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.furnishText,
                            isSelected && styles.furnishTextSelected,
                          ]}
                        >
                          {item}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* 7. Parking availability */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Parking availability</Text>
                <TouchableOpacity
                  style={styles.selectInput}
                  activeOpacity={0.7}
                  onPress={() =>
                    openPicker('Parking availability', parkingOptions, form.parking, val =>
                      setForm(f => ({ ...f, parking: val }))
                    )
                  }
                >
                  <Text style={[styles.selectText, !form.parking && styles.placeholderText]}>
                    {form.parking || 'Select'}
                  </Text>
                  <ChevronDown size={18} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {/* 8. Property age & Floor number (2 columns) */}
              <View style={styles.twoColRow}>
                <View style={styles.colHalf}>
                  <Text style={styles.fieldLabel}>Property age</Text>
                  <TouchableOpacity
                    style={styles.selectInput}
                    activeOpacity={0.7}
                    onPress={() =>
                      openPicker('Property age', propertyAgeOptions, form.propertyAge, val =>
                        setForm(f => ({ ...f, propertyAge: val }))
                      )
                    }
                  >
                    <Text
                      style={[styles.selectText, !form.propertyAge && styles.placeholderText]}
                      numberOfLines={1}
                    >
                      {form.propertyAge || 'Select'}
                    </Text>
                    <ChevronDown size={18} color="#6B7280" />
                  </TouchableOpacity>
                </View>
                <View style={styles.colHalf}>
                  <Text style={styles.fieldLabel}>Floor number</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder=""
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    value={form.floorNo}
                    onChangeText={text => setForm(f => ({ ...f, floorNo: text }))}
                  />
                </View>
              </View>

              {/* 9. Total floors & Facing direction (2 columns) */}
              <View style={styles.twoColRow}>
                <View style={styles.colHalf}>
                  <Text style={styles.fieldLabel}>Total floors</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder=""
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    value={form.totalFloors}
                    onChangeText={text => setForm(f => ({ ...f, totalFloors: text }))}
                  />
                </View>
                <View style={styles.colHalf}>
                  <Text style={styles.fieldLabel}>Facing direction</Text>
                  <TouchableOpacity
                    style={styles.selectInput}
                    activeOpacity={0.7}
                    onPress={() =>
                      openPicker('Facing direction', facingOptions, form.facing, val =>
                        setForm(f => ({ ...f, facing: val }))
                      )
                    }
                  >
                    <Text
                      style={[styles.selectText, !form.facing && styles.placeholderText]}
                      numberOfLines={1}
                    >
                      {form.facing || 'Select'}
                    </Text>
                    <ChevronDown size={18} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* 10. Current property condition */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Current property condition</Text>
                <TouchableOpacity
                  style={styles.selectInput}
                  activeOpacity={0.7}
                  onPress={() =>
                    openPicker('Current property condition', conditionOptions, form.condition, val =>
                      setForm(f => ({ ...f, condition: val }))
                    )
                  }
                >
                  <Text style={[styles.selectText, !form.condition && styles.placeholderText]}>
                    {form.condition || 'Select'}
                  </Text>
                  <ChevronDown size={18} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {/* 11. Super built-up area (sq.ft.) & Carpet area (sq.ft.) (2 columns) */}
              <View style={styles.twoColRow}>
                <View style={styles.colHalf}>
                  <Text style={styles.fieldLabel}>Super built-up area (sq.ft.)</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder=""
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    value={form.superBuiltUpArea}
                    onChangeText={text => setForm(f => ({ ...f, superBuiltUpArea: text }))}
                  />
                </View>
                <View style={styles.colHalf}>
                  <Text style={styles.fieldLabel}>Carpet area (sq.ft.)</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder=""
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    value={form.carpetArea}
                    onChangeText={text => setForm(f => ({ ...f, carpetArea: text }))}
                  />
                </View>
              </View>
            </View>
          )}

          {/* STEP 2: LOCATION */}
          {step === 2 && (
            <View style={styles.stepFormContent}>
              {/* Use current location button */}
              <TouchableOpacity
                style={styles.useLocationBtn}
                activeOpacity={0.75}
                onPress={() => {
                  setForm(f => ({
                    ...f,
                    city: 'Hyderabad',
                    locality: f.locality || 'Hitec City',
                  }));
                }}
              >
                <LocateFixed size={18} color="#111827" strokeWidth={2.2} />
                <Text style={styles.useLocationText}>Use current location</Text>
              </TouchableOpacity>

              {/* City & Locality (2 columns) */}
              <View style={styles.twoColRow}>
                <View style={styles.colHalf}>
                  <Text style={styles.fieldLabel}>City</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Hyderabad"
                    placeholderTextColor="#9CA3AF"
                    value={form.city}
                    onChangeText={text => setForm(f => ({ ...f, city: text }))}
                  />
                </View>
                <View style={styles.colHalf}>
                  <Text style={styles.fieldLabel}>Locality</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Area / neighbourhood"
                    placeholderTextColor="#9CA3AF"
                    value={form.locality}
                    onChangeText={text => setForm(f => ({ ...f, locality: text }))}
                  />
                </View>
              </View>

              {/* Street / Area */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Street / Area</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder=""
                  placeholderTextColor="#9CA3AF"
                  value={form.streetArea}
                  onChangeText={text => setForm(f => ({ ...f, streetArea: text }))}
                />
              </View>

              {/* Landmark (optional) */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Landmark (optional)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder=""
                  placeholderTextColor="#9CA3AF"
                  value={form.landmark}
                  onChangeText={text => setForm(f => ({ ...f, landmark: text }))}
                />
              </View>

              {/* Google Maps location card */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Google Maps location</Text>
                <View style={styles.mapLocationCard}>
                  <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
                    <Defs>
                      <LinearGradient id="mapCardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <Stop offset="0%" stopColor="#E0F2FE" />
                        <Stop offset="100%" stopColor="#DCFCE7" />
                      </LinearGradient>
                    </Defs>
                    <Rect width="100%" height="100%" rx={20} fill="url(#mapCardGrad)" />
                  </Svg>
                  <View style={styles.mapCardContent}>
                    <MapPin size={26} color="#000000" strokeWidth={2} />
                    <Text style={styles.mapCardText}>Drop a pin for the exact location</Text>
                    <TouchableOpacity
                      style={styles.setPinBtn}
                      activeOpacity={0.85}
                      onPress={() => setForm(f => ({ ...f, mapPinSet: !f.mapPinSet }))}
                    >
                      <Text style={styles.setPinBtnText}>
                        {form.mapPinSet ? 'Map pin set ✓' : 'Set map pin'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Property position card */}
              <View style={styles.whiteSectionCard}>
                <Text style={styles.sectionCardTitle}>Property position</Text>
                <Text style={styles.sectionCardSub}>Tell users how the property is positioned</Text>
                <Text style={styles.sectionCardLabel}>Position</Text>
                <View style={styles.positionPillsWrap}>
                  <View style={styles.positionPillsRow}>
                    {['Main road property', 'Corner property'].map(pos => {
                      const isSelected = form.propertyPosition === pos;
                      return (
                        <TouchableOpacity
                          key={pos}
                          onPress={() => setForm(f => ({ ...f, propertyPosition: pos }))}
                          style={[styles.optionPill, isSelected && styles.optionPillSelected]}
                          activeOpacity={0.8}
                        >
                          <Text
                            style={[
                              styles.optionPillText,
                              isSelected && styles.optionPillTextSelected,
                            ]}
                          >
                            {pos}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                  <View style={styles.positionPillsRow}>
                    {['Main road & corner property'].map(pos => {
                      const isSelected = form.propertyPosition === pos;
                      return (
                        <TouchableOpacity
                          key={pos}
                          onPress={() => setForm(f => ({ ...f, propertyPosition: pos }))}
                          style={[styles.optionPill, isSelected && styles.optionPillSelected]}
                          activeOpacity={0.8}
                        >
                          <Text
                            style={[
                              styles.optionPillText,
                              isSelected && styles.optionPillTextSelected,
                            ]}
                          >
                            {pos}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </View>

              {/* Visit availability card */}
              <View style={styles.whiteSectionCard}>
                <Text style={styles.sectionCardTitle}>Visit availability</Text>
                <Text style={styles.sectionCardSub}>When can interested users visit the property?</Text>
                <Text style={styles.sectionCardLabel}>Available days</Text>
                <View style={styles.positionPillsRow}>
                  {['Everyday', 'Weekends', 'Any day'].map(day => {
                    const isSelected = form.availableDays === day;
                    return (
                      <TouchableOpacity
                        key={day}
                        onPress={() => setForm(f => ({ ...f, availableDays: day }))}
                        style={[styles.optionPill, isSelected && styles.optionPillSelected]}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.optionPillText,
                            isSelected && styles.optionPillTextSelected,
                          ]}
                        >
                          {day}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Available from & Available until (2 columns) */}
                <View style={[styles.twoColRow, { marginTop: 16 }]}>
                  <View style={styles.colHalf}>
                    <Text style={[styles.fieldLabel, { fontSize: 12, marginBottom: 6 }]}>Available from</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder=""
                      placeholderTextColor="#9CA3AF"
                      value={form.availableFrom}
                      onChangeText={text => setForm(f => ({ ...f, availableFrom: text }))}
                    />
                  </View>
                  <View style={styles.colHalf}>
                    <Text style={[styles.fieldLabel, { fontSize: 12, marginBottom: 6 }]}>Available until</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder=""
                      placeholderTextColor="#9CA3AF"
                      value={form.availableUntil}
                      onChangeText={text => setForm(f => ({ ...f, availableUntil: text }))}
                    />
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* STEP 3: PRICING */}
          {step === 3 && (
            <View style={styles.stepFormContent}>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>
                  {mode === 'rent' || mode === 'flatmate' || mode === 'pg'
                    ? 'Expected Monthly Rent (₹)'
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
                      ? '35,000'
                      : '85,00,000'
                  }
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={form.price}
                  onChangeText={text => setForm(f => ({ ...f, price: text }))}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Monthly Maintenance (₹)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. 3,500"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={form.maintenance}
                  onChangeText={text => setForm(f => ({ ...f, maintenance: text }))}
                />
              </View>

              {(mode === 'rent' || mode === 'flatmate' || mode === 'pg') && (
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Security Deposit (₹)</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. 50,000"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    value={form.deposit}
                    onChangeText={text => setForm(f => ({ ...f, deposit: text }))}
                  />
                </View>
              )}
            </View>
          )}

          {/* STEP 4: AMENITIES */}
          {step === 4 && (
            <View style={styles.stepFormContent}>
              <Text style={styles.fieldLabel}>Select Available Amenities</Text>
              <View style={styles.amenityWrap}>
                {amenityOptions.map(a => {
                  const selected = form.amenities.includes(a);
                  return (
                    <TouchableOpacity
                      key={a}
                      onPress={() =>
                        setForm(f => ({
                          ...f,
                          amenities: selected
                            ? f.amenities.filter(x => x !== a)
                            : [...f.amenities, a],
                        }))
                      }
                      style={[styles.amenityChip, selected && styles.amenityChipSelected]}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[styles.amenityText, selected && styles.amenityTextSelected]}
                      >
                        {a}
                      </Text>
                      {selected && <Check size={14} color="#FFFFFF" style={{ marginLeft: 6 }} />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 5: PHOTOS */}
          {step === 5 && (
            <View style={styles.stepFormContent}>
              <Text style={styles.fieldLabel}>Upload Photos</Text>
              <Text style={styles.fieldSubLabel}>
                High quality photos increase buyer inquiries by up to 3x.
              </Text>
              <View style={styles.photoUploadBox}>
                <Camera size={36} color="#4B5563" />
                <Text style={styles.uploadMainText}>Add Property Photos</Text>
                <Text style={styles.uploadSubText}>Living Room, Bedrooms, Kitchen, Balcony</Text>
                <TouchableOpacity
                  style={styles.uploadActionBtn}
                  activeOpacity={0.8}
                  onPress={() => setForm(f => ({ ...f, photosCount: f.photosCount + 1 }))}
                >
                  <Text style={styles.uploadActionBtnText}>Select Photos ({form.photosCount} added)</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* STEP 6: DOCUMENTS */}
          {step === 6 && (
            <View style={styles.stepFormContent}>
              <Text style={styles.fieldLabel}>Ownership & Verification</Text>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Ownership Type</Text>
                <View style={styles.pillsRow}>
                  {['Freehold', 'Leasehold', 'Power of Attorney'].map(item => {
                    const isSelected = form.ownership === item;
                    return (
                      <TouchableOpacity
                        key={item}
                        onPress={() => setForm(f => ({ ...f, ownership: item }))}
                        style={[styles.furnishPill, isSelected && styles.furnishPillSelected]}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.furnishText,
                            isSelected && styles.furnishTextSelected,
                          ]}
                        >
                          {item}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>RERA ID (Optional)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. P02400001234"
                  placeholderTextColor="#9CA3AF"
                  value={form.reraId}
                  onChangeText={text => setForm(f => ({ ...f, reraId: text }))}
                />
              </View>

              <View style={styles.docVerifyNotice}>
                <ShieldCheck size={24} color="#047857" />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.docNoticeTitle}>Verified Owner Protection</Text>
                  <Text style={styles.docNoticeSub}>
                    Seedha Properties verifies all listings directly with municipal records to prevent spam.
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* STEP 7: REVIEW */}
          {step === 7 && (
            <View style={styles.stepFormContent}>
              <Text style={styles.reviewHeaderTitle}>Review Listing Summary</Text>
              <Text style={styles.reviewHeaderSub}>
                Please check all your listing details before submitting.
              </Text>

              <View style={styles.reviewSummaryCard}>
                <Text style={styles.reviewPropertyTitle}>
                  {form.title || `${form.bhk ? form.bhk + ' BHK ' : ''}${form.propertyType || 'Apartment'} in ${form.locality || 'Hyderabad'}`}
                </Text>

                <View style={styles.reviewGrid}>
                  <View style={styles.reviewGridItem}>
                    <Text style={styles.reviewGridLabel}>Property Type</Text>
                    <Text style={styles.reviewGridVal}>{form.propertyType || 'Apartment'}</Text>
                  </View>
                  <View style={styles.reviewGridItem}>
                    <Text style={styles.reviewGridLabel}>BHK</Text>
                    <Text style={styles.reviewGridVal}>{form.bhk ? `${form.bhk} BHK` : '2 BHK'}</Text>
                  </View>
                  <View style={styles.reviewGridItem}>
                    <Text style={styles.reviewGridLabel}>Expected Price</Text>
                    <Text style={styles.reviewGridVal}>{form.price ? `₹${form.price}` : '₹85 Lakhs'}</Text>
                  </View>
                  <View style={styles.reviewGridItem}>
                    <Text style={styles.reviewGridLabel}>Carpet Area</Text>
                    <Text style={styles.reviewGridVal}>{form.carpetArea ? `${form.carpetArea} sq.ft` : '1,200 sq.ft'}</Text>
                  </View>
                  <View style={styles.reviewGridItem}>
                    <Text style={styles.reviewGridLabel}>Furnishing</Text>
                    <Text style={styles.reviewGridVal}>{form.furnishing || 'Semi-Furnished'}</Text>
                  </View>
                  <View style={styles.reviewGridItem}>
                    <Text style={styles.reviewGridLabel}>Condition</Text>
                    <Text style={styles.reviewGridVal}>{form.condition || 'Ready to move'}</Text>
                  </View>
                  <View style={styles.reviewGridItem}>
                    <Text style={styles.reviewGridLabel}>Facing</Text>
                    <Text style={styles.reviewGridVal}>{form.facing || 'East'}</Text>
                  </View>
                  <View style={styles.reviewGridItem}>
                    <Text style={styles.reviewGridLabel}>Location</Text>
                    <Text style={styles.reviewGridVal}>{form.locality || 'Hyderabad'}</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Bottom Action Footer matching design */}
        <View style={styles.footerRow}>
          <TouchableOpacity
            style={styles.draftButton}
            activeOpacity={0.8}
            onPress={() => {
              pop();
            }}
          >
            <Text style={styles.draftButtonText}>Save draft</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.continueButton}
            activeOpacity={0.9}
            disabled={loading}
            onPress={() => {
              if (step < 7) {
                setStep(s => (s + 1) as Step);
              } else {
                handleSubmit();
              }
            }}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.continueButtonText}>
                {step < 7 ? 'Continue' : 'Submit Property'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Dropdown Modal Bottom Sheet */}
        <Modal
          visible={pickerModal.visible}
          transparent
          animationType="fade"
          onRequestClose={closePicker}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={closePicker}
          >
            <View style={styles.modalSheet} onStartShouldSetResponder={() => true}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{pickerModal.title}</Text>
                <TouchableOpacity
                  onPress={closePicker}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <X size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                {pickerModal.options.map(opt => {
                  const isSelected = pickerModal.selectedValue === opt;
                  return (
                    <TouchableOpacity
                      key={opt}
                      style={[styles.modalOptionRow, isSelected && styles.modalOptionSelected]}
                      onPress={() => {
                        pickerModal.onSelect(opt);
                        closePicker();
                      }}
                    >
                      <Text
                        style={[
                          styles.modalOptionText,
                          isSelected && styles.modalOptionTextSelected,
                        ]}
                      >
                        {opt}
                      </Text>
                      {isSelected && <Check size={18} color="#000000" />}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
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
    fontWeight: '600',
    color: '#111827',
  },
  segmentBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 6,
    marginBottom: 14,
  },
  segmentBar: {
    flex: 1,
    height: 5,
    borderRadius: 3,
  },
  segmentBarActive: {
    backgroundColor: '#000000',
  },
  segmentBarInactive: {
    backgroundColor: '#E5E7EB',
  },
  formScroll: {
    flex: 1,
  },
  formScrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  stepFormContent: {
    paddingBottom: 10,
  },
  fieldGroup: {
    marginTop: 14,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 8,
  },
  fieldSubLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
    marginTop: -4,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 48,
    fontSize: 14,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  textAreaInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 100,
    fontSize: 14,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  selectInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  selectText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
    flex: 1,
  },
  placeholderText: {
    color: '#9CA3AF',
    fontWeight: '400',
  },
  bhkRow: {
    flexDirection: 'row',
    gap: 12,
  },
  bhkCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    elevation: 1,
  },
  bhkCircleSelected: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  bhkText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  bhkTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  twoColRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },
  colHalf: {
    flex: 1,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  furnishPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    elevation: 1,
  },
  furnishPillSelected: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  furnishText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  furnishTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  useLocationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  useLocationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  mapLocationCard: {
    height: 146,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  mapCardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  mapCardText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginTop: 8,
    marginBottom: 12,
  },
  setPinBtn: {
    backgroundColor: '#000000',
    paddingHorizontal: 22,
    paddingVertical: 9,
    borderRadius: 999,
  },
  setPinBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  whiteSectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  sectionCardSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    marginBottom: 14,
  },
  sectionCardLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 10,
  },
  positionPillsWrap: {
    gap: 8,
  },
  positionPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    elevation: 1,
  },
  optionPillSelected: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  optionPillText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  optionPillTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  amenityWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  amenityChipSelected: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  amenityText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  amenityTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  photoUploadBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  uploadMainText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginTop: 10,
  },
  uploadSubText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  uploadActionBtn: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  uploadActionBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  docVerifyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderRadius: 14,
    padding: 14,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  docNoticeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#065F46',
  },
  docNoticeSub: {
    fontSize: 12,
    color: '#047857',
    marginTop: 2,
    lineHeight: 16,
  },
  reviewHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  reviewHeaderSub: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 16,
  },
  reviewSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  reviewPropertyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    marginBottom: 12,
  },
  reviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  reviewGridItem: {
    width: '47%',
    marginBottom: 6,
  },
  reviewGridLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  reviewGridVal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginTop: 2,
  },
  footerRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    gap: 12,
    backgroundColor: '#ECEEF5',
    borderTopWidth: 1,
    borderTopColor: '#E2E5EE',
  },
  draftButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    elevation: 1,
  },
  draftButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  continueButton: {
    flex: 2,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 2,
  },
  continueButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    maxHeight: '65%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  modalScroll: {
    marginTop: 8,
  },
  modalOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  modalOptionSelected: {
    backgroundColor: '#F9FAFB',
  },
  modalOptionText: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
  },
  modalOptionTextSelected: {
    color: '#000000',
    fontWeight: '700',
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
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backHomeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
