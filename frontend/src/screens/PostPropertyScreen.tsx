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
  Image,
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
  ImagePlus,
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import type { AdminCategory } from '../types';
import { colors } from '../theme/colors';

type PostMode = 'sheet' | 'sell' | 'rent' | 'commercial' | 'flatmate' | 'pg';
type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

const sellSteps = ['Basics', 'Location', 'Pricing', 'Amenities', 'Photos', 'Owner', 'Preview'];
const rentSteps = ['Basics', 'Location', 'Pricing', 'Amenities', 'Photos', 'Tenant Prefs', 'Owner', 'Preview'];
const commercialSteps = ['Purpose', 'Basics', 'Location', 'Pricing', 'Amenities', 'Photos', 'Owner', 'Preview'];
const flatmateSteps = ['Basics', 'Location', 'Pricing', 'Amenities', 'Photos', 'Flatmate', 'Preferences', 'Preview'];
const pgSteps = [
  'Basics',
  'Rooms',
  'Food',
  'Facilities',
  'Photos',
  'Rules',
  'Location',
  'Pricing',
  'Owner',
  'Preview',
];

const getStepsForMode = (m: PostMode): string[] => {
  if (m === 'rent') {
    return rentSteps;
  }
  if (m === 'commercial') {
    return commercialSteps;
  }
  if (m === 'flatmate') {
    return flatmateSteps;
  }
  if (m === 'pg') {
    return pgSteps;
  }
  return sellSteps;
};

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

const commercialPropertyTypeOptions = [
  'Office Space',
  'Retail / Showroom',
  'Shop',
  'Warehouse / Godown',
  'Industrial Building',
  'Commercial Land / Plot',
  'Co-working Space',
  'Commercial Building',
];

const washroomOptions = ['1', '2', '3', '4+', 'Shared', 'None'];
const pantryOptions = ['Private', 'Shared', 'Cafeteria', 'None'];
const ageGroupOptions = [
  '18 - 25 years',
  '20 - 30 years',
  '25 - 35 years',
  '30 - 45 years',
  'Any age group',
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
  'CCTV',
  'Power Backup',
  'Parking',
  'Gym',
  'Swimming Pool',
  'Club House',
  'Garden',
  'Wi-Fi',
  'Intercom',
  'Fire Safety',
];

const pgAccommodationOptions = [
  'Boys PG',
  'Girls PG',
  'Co-living PG',
  'Boys Hostel',
  'Girls Hostel',
  'Co-ed Hostel',
];

const pgOccupancyOptions = [
  { id: 'Single Sharing', title: 'Single Sharing', sub: '1 bed', beds: 1 },
  { id: 'Double Sharing', title: 'Double Sharing', sub: '2 beds', beds: 2 },
  { id: 'Triple Sharing', title: 'Triple Sharing', sub: '3 beds', beds: 3 },
  { id: 'Four Sharing', title: 'Four Sharing', sub: '4 beds', beds: 4 },
];

const pgAcOptions = ['AC', 'Non-AC', 'Both'];

const pgFurnishingOptions = [
  'Fully Furnished',
  'Semi-Furnished',
  'Unfurnished',
];

const pgRoomAmenityOptions = [
  'Cupboard',
  'TV',
  'Bedding',
  'Geyser',
  'AC',
  'Attached Bathroom',
  'Study Table',
  'Fan',
];

const pgPlaceAvailableOptions = ['Male', 'Female', 'Anyone'];

const pgPreferredGuestsOptions = [
  'Students',
  'Working Professionals',
  'Both',
  'Anyone',
];

const pgFacilitiesAmenities = [
  'Common TV',
  'Mess',
  'Lift',
  'Refrigerator',
  'Wi-Fi',
  'Cooking Allowed',
  'Power Backup',
  'Security',
  'CCTV',
  'RO Water',
  'Geyser',
  'Study Area',
];

const pgRulesOptions = [
  'No boys entry',
  'No girls entry',
  'No smoking',
  'No guardian stay',
  'No non-veg',
  'No drinking',
  'No visitors after hours',
];

export default function PostPropertyScreen() {
  const { pop, addAdminRequest, user } = useApp();
  const [mode, setMode] = useState<PostMode>('sheet');
  const [step, setStep] = useState<Step>(1);

  // Form State
  const [form, setForm] = useState({
    // PG / Hostel Specific (Step 1, 2, 3, 4 & 6)
    pgAccommodationType: '',
    pgHostelName: '',
    pgOccupancyTypes: [] as string[],
    pgAcType: 'Non-AC',
    pgActiveRoomTab: 'Single',
    pgNumberOfBeds: '',
    pgBedsAvailable: '',
    pgRoomSize: '',
    pgAttachedBathroom: false,
    pgBalcony: false,
    pgFurnishing: '',
    pgRoomAmenities: [] as string[],
    pgPlaceAvailableFor: 'Anyone',
    pgPreferredGuests: '',
    pgAvailableFrom: '',
    pgFoodAvailable: false,
    pgDiningArea: false,
    pgKitchenAvailable: false,
    pgOutsideFoodAllowed: false,
    pgLaundryService: false,
    pgRoomCleaning: false,
    pgWardenFacility: false,
    pgDirections: '',
    pgAvailableAmenities: [] as string[],
    pgRules: ['No non-veg'] as string[],
    pgGateClosingTime: '',
    pgAdditionalRules: '',

    // Commercial Specific (Step 1 & 2)
    commercialPurpose: 'sell' as 'sell' | 'rent',
    propertySubtype: '',
    washrooms: '',
    pantry: '',

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
    priceNegotiable: true,
    availabilityDate: '',
    deposit: '',
    maintenance: '',
    maintenanceMode: 'Separate',

    // Step 4 - Amenities
    amenities: [] as string[],

    // Step 5 - Photos
    photos: [] as string[],
    photosCount: 0,

    // Step 6 (Rent) - Tenant Preferences
    preferredTenant: [] as string[],
    genderPreference: '',
    petsAllowed: false,
    smokingAllowed: false,
    foodPreference: '',

    // Step 6 (Flatmate) - Profile
    flatmateName: '',
    flatmateMobile: '',
    flatmateEmail: '',
    flatmateProfession: '',
    flatmateGender: '',

    // Step 7 (Flatmate) - Preferences
    flatmatePreferredGender: '',
    flatmateAgeGroup: '',
    flatmateOccupation: [] as string[],
    flatmateFoodPref: '',
    flatmateSmoking: false,
    flatmateDrinking: false,
    flatmatePets: false,

    // Owner & Declaration
    ownerName: '',
    ownerMobile: '',
    ownerEmail: '',
    postingAs: 'Owner',
    propertyAcquired: 'Purchased',
    loanOnProperty: 'No loan',
    propertyTaxPaid: 'Yes',
    pendingDues: 'None',
    courtCase: 'None',
    ownership: 'Freehold',
    reraId: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Amenities State (Step 4)
  const [amenitiesList, setAmenitiesList] = useState<string[]>(amenityOptions);
  const [customAmenity, setCustomAmenity] = useState('');

  const handleAddAmenity = () => {
    const trimmed = customAmenity.trim();
    if (!trimmed) return;
    if (!amenitiesList.includes(trimmed)) {
      setAmenitiesList(prev => [...prev, trimmed]);
    }
    if (!form.amenities.includes(trimmed)) {
      setForm(f => ({ ...f, amenities: [...f.amenities, trimmed] }));
    }
    setCustomAmenity('');
  };

  // PG Facilities Amenities State (Step 4)
  const [pgAmenitiesList, setPgAmenitiesList] = useState<string[]>(pgFacilitiesAmenities);
  const [pgCustomAmenity, setPgCustomAmenity] = useState('');

  const handleAddPgAmenity = () => {
    const trimmed = pgCustomAmenity.trim();
    if (!trimmed) return;
    if (!pgAmenitiesList.includes(trimmed)) {
      setPgAmenitiesList(prev => [...prev, trimmed]);
    }
    if (!form.pgAvailableAmenities.includes(trimmed)) {
      setForm(f => ({ ...f, pgAvailableAmenities: [...f.pgAvailableAmenities, trimmed] }));
    }
    setPgCustomAmenity('');
  };

  // Photos State & Handlers (Step 5)
  const samplePropertyImages = [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=80',
  ];

  const handleAddPhoto = () => {
    const nextImg = samplePropertyImages[form.photos.length % samplePropertyImages.length];
    setForm(f => ({
      ...f,
      photos: [...f.photos, nextImg],
      photosCount: f.photos.length + 1,
    }));
  };

  const handleRemovePhoto = (index: number) => {
    setForm(f => ({
      ...f,
      photos: f.photos.filter((_, i) => i !== index),
      photosCount: Math.max(0, f.photos.length - 1),
    }));
  };

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
        userName: form.ownerName || user?.name || 'Verified Owner',
        userPhone: form.ownerMobile || user?.phone || '+91 98765 43210',
        userEmail: form.ownerEmail || user?.email || 'owner@seedhaproperties.com',
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
          priceNegotiable: form.priceNegotiable,
          availabilityDate: form.availabilityDate,
          ownerName: form.ownerName,
          ownerMobile: form.ownerMobile,
          ownerEmail: form.ownerEmail,
          postingAs: form.postingAs,
          propertyAcquired: form.propertyAcquired,
          loanOnProperty: form.loanOnProperty,
          propertyTaxPaid: form.propertyTaxPaid,
          pendingDues: form.pendingDues,
          courtCase: form.courtCase,
          preferredTenant: form.preferredTenant,
          genderPreference: form.genderPreference,
          petsAllowed: form.petsAllowed,
          smokingAllowed: form.smokingAllowed,
          foodPreference: form.foodPreference,
          commercialPurpose: form.commercialPurpose,
          propertySubtype: form.propertySubtype,
          washrooms: form.washrooms,
          pantry: form.pantry,
          flatmateName: form.flatmateName,
          flatmateMobile: form.flatmateMobile,
          flatmateEmail: form.flatmateEmail,
          flatmateProfession: form.flatmateProfession,
          flatmateGender: form.flatmateGender,
          flatmatePreferredGender: form.flatmatePreferredGender,
          flatmateAgeGroup: form.flatmateAgeGroup,
          flatmateOccupation: form.flatmateOccupation,
          flatmateFoodPref: form.flatmateFoodPref,
          flatmateSmoking: form.flatmateSmoking,
          flatmateDrinking: form.flatmateDrinking,
          flatmatePets: form.flatmatePets,
          pgAccommodationType: form.pgAccommodationType,
          pgHostelName: form.pgHostelName,
          pgOccupancyTypes: form.pgOccupancyTypes,
          pgAcType: form.pgAcType,
          pgActiveRoomTab: form.pgActiveRoomTab,
          pgNumberOfBeds: form.pgNumberOfBeds,
          pgBedsAvailable: form.pgBedsAvailable,
          pgRoomSize: form.pgRoomSize,
          pgAttachedBathroom: form.pgAttachedBathroom,
          pgBalcony: form.pgBalcony,
          pgFurnishing: form.pgFurnishing,
          pgRoomAmenities: form.pgRoomAmenities,
          pgPlaceAvailableFor: form.pgPlaceAvailableFor,
          pgPreferredGuests: form.pgPreferredGuests,
          pgAvailableFrom: form.pgAvailableFrom,
          pgFoodAvailable: form.pgFoodAvailable,
          pgDiningArea: form.pgDiningArea,
          pgKitchenAvailable: form.pgKitchenAvailable,
          pgOutsideFoodAllowed: form.pgOutsideFoodAllowed,
          pgLaundryService: form.pgLaundryService,
          pgRoomCleaning: form.pgRoomCleaning,
          pgWardenFacility: form.pgWardenFacility,
          pgDirections: form.pgDirections,
          pgAvailableAmenities: form.pgAvailableAmenities,
          pgRules: form.pgRules,
          pgGateClosingTime: form.pgGateClosingTime,
          pgAdditionalRules: form.pgAdditionalRules,
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
      <SafeAreaView style={styles.safeContainer}>
        <StatusBar style="dark" />
        <View style={styles.submittedContainer}>
          <View style={styles.submittedContent}>
            {/* Top Success Badge */}
            <View style={styles.submittedSuccessCircle}>
              <CircleCheck size={40} color="#10B981" strokeWidth={2.4} />
            </View>

            {/* Title */}
            <Text style={styles.submittedTitle}>Property Submitted</Text>

            {/* Subtitle */}
            <Text style={styles.submittedSubtitle}>
              Your listing is under review. Seedha Properties will verify the details and activate it within 24–48 hours.
            </Text>

            {/* Status Steps Card */}
            <View style={styles.submittedStatusCard}>
              {/* Step 1: Listing received */}
              <View style={styles.statusStepRow}>
                <View style={styles.statusStepCircleActive}>
                  <Text style={styles.statusStepNumActive}>1</Text>
                </View>
                <View style={styles.statusStepTextCol}>
                  <Text style={styles.statusStepTitle}>Listing received</Text>
                  <Text style={styles.statusStepSub}>Completed</Text>
                </View>
              </View>

              {/* Step 2: Details and photos reviewed */}
              <View style={styles.statusStepRow}>
                <View style={styles.statusStepCirclePending}>
                  <Text style={styles.statusStepNumPending}>2</Text>
                </View>
                <View style={styles.statusStepTextCol}>
                  <Text style={styles.statusStepTitle}>Details and photos reviewed</Text>
                  <Text style={styles.statusStepSub}>Pending</Text>
                </View>
              </View>

              {/* Step 3: Listing published */}
              <View style={styles.statusStepRow}>
                <View style={styles.statusStepCirclePending}>
                  <Text style={styles.statusStepNumPending}>3</Text>
                </View>
                <View style={styles.statusStepTextCol}>
                  <Text style={styles.statusStepTitle}>Listing published</Text>
                  <Text style={styles.statusStepSub}>Pending</Text>
                </View>
              </View>
            </View>

            {/* Done Button */}
            <TouchableOpacity
              onPress={() => {
                setSubmitted(false);
                setMode('sheet');
                setStep(1);
                pop();
              }}
              style={styles.submittedDoneBtn}
              activeOpacity={0.85}
            >
              <Text style={styles.submittedDoneBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
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
                  if (id === 'rent') {
                    setForm(f => ({ ...f, priceNegotiable: false, maintenanceMode: 'Separate' }));
                  } else if (id === 'sell') {
                    setForm(f => ({ ...f, priceNegotiable: true }));
                  }
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

  const activeSteps = getStepsForMode(mode);
  const totalSteps = activeSteps.length;
  // Step percentage: e.g. Sell Step 1: 14% (1/7), Rent Step 1: 13% (1/8)
  const stepPercentage = Math.round((step / totalSteps) * 100);

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
            <Text style={styles.formHeaderTitle}>
              {mode === 'pg'
                ? 'Post PG / Hostel'
                : mode === 'flatmate'
                ? 'Post for Flatmates'
                : mode === 'commercial'
                ? 'Post Commercial'
                : `Post to ${modeLabel}`}
            </Text>
            <Text style={styles.formHeaderSub}>
              Step {step} of {totalSteps} · {activeSteps[step - 1]}
            </Text>
          </View>
          <Text style={styles.percentageText}>{stepPercentage}%</Text>
        </View>

        {/* Dynamic Segment Progress Bar */}
        <View style={styles.segmentBarRow}>
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map(seg => (
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
          {/* STEP 1 (COMMERCIAL): PURPOSE */}
          {mode === 'commercial' && step === 1 && (
            <View style={styles.stepFormContent}>
              <Text style={styles.purposeHeading}>What do you want to do?</Text>

              <View style={styles.purposeCardsWrap}>
                {/* 1. Sell Commercial Property */}
                <TouchableOpacity
                  style={[
                    styles.purposeCard,
                    form.commercialPurpose === 'sell' && styles.purposeCardSelected,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => setForm(f => ({ ...f, commercialPurpose: 'sell' }))}
                >
                  {form.commercialPurpose === 'sell' ? (
                    <View style={styles.purposeCheckCircle}>
                      <Check size={13} color="#FFFFFF" strokeWidth={3} />
                    </View>
                  ) : (
                    <View style={styles.purposeUncheckCircle} />
                  )}
                  <View style={styles.purposeTextCol}>
                    <Text style={styles.purposeTitle}>Sell Commercial Property</Text>
                    <Text style={styles.purposeSub}>Find buyers for your commercial asset</Text>
                  </View>
                </TouchableOpacity>

                {/* 2. Rent Commercial Property */}
                <TouchableOpacity
                  style={[
                    styles.purposeCard,
                    form.commercialPurpose === 'rent' && styles.purposeCardSelected,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => setForm(f => ({ ...f, commercialPurpose: 'rent' }))}
                >
                  {form.commercialPurpose === 'rent' ? (
                    <View style={styles.purposeCheckCircle}>
                      <Check size={13} color="#FFFFFF" strokeWidth={3} />
                    </View>
                  ) : (
                    <View style={styles.purposeUncheckCircle} />
                  )}
                  <View style={styles.purposeTextCol}>
                    <Text style={styles.purposeTitle}>Rent Commercial Property</Text>
                    <Text style={styles.purposeSub}>Find a business tenant</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* STEP 1 (PG / HOSTEL): BASICS */}
          {mode === 'pg' && step === 1 && (
            <View style={styles.stepFormContent}>
              {/* 1. Accommodation type */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Accommodation type</Text>
                <View style={styles.optionPillsRow}>
                  {pgAccommodationOptions.map(opt => {
                    const isSelected = form.pgAccommodationType === opt;
                    return (
                      <TouchableOpacity
                        key={opt}
                        onPress={() => setForm(f => ({ ...f, pgAccommodationType: opt }))}
                        style={[styles.optionPill, isSelected && styles.optionPillSelected]}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.optionPillText,
                            isSelected && styles.optionPillTextSelected,
                          ]}
                        >
                          {opt}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* 2. PG / Hostel name */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>PG / Hostel name</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder=""
                  placeholderTextColor="#9CA3AF"
                  value={form.pgHostelName}
                  onChangeText={text => setForm(f => ({ ...f, pgHostelName: text }))}
                />
              </View>

              {/* 3. Property title */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Property title</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Safe girls PG near Metro"
                  placeholderTextColor="#9CA3AF"
                  value={form.title}
                  onChangeText={text => setForm(f => ({ ...f, title: text }))}
                />
              </View>

              {/* 4. Description */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Description</Text>
                <TextInput
                  style={styles.textAreaInput}
                  placeholder=""
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  value={form.description}
                  onChangeText={text => setForm(f => ({ ...f, description: text }))}
                />
              </View>

              {/* 5. Total floors */}
              <View style={styles.fieldGroup}>
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

              {/* 6. Occupancy types available */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Occupancy types available</Text>
                <Text style={styles.fieldSubLabel}>
                  Select every room type available in your PG or hostel.
                </Text>
                <View style={styles.occupancyGrid}>
                  {pgOccupancyOptions.map(item => {
                    const isSelected = form.pgOccupancyTypes.includes(item.id);
                    return (
                      <TouchableOpacity
                        key={item.id}
                        style={[styles.occupancyCard, isSelected && styles.occupancyCardSelected]}
                        activeOpacity={0.8}
                        onPress={() => {
                          setForm(f => ({
                            ...f,
                            pgOccupancyTypes: f.pgOccupancyTypes.includes(item.id)
                              ? f.pgOccupancyTypes.filter(x => x !== item.id)
                              : [...f.pgOccupancyTypes, item.id],
                          }));
                        }}
                      >
                        <View style={styles.bedCapsulesRow}>
                          {Array.from({ length: item.beds }).map((_, bIdx) => (
                            <View
                              key={bIdx}
                              style={[styles.bedCapsule, isSelected && styles.bedCapsuleSelected]}
                            />
                          ))}
                        </View>
                        <Text
                          style={[
                            styles.occupancyTitle,
                            isSelected && styles.occupancyTitleSelected,
                          ]}
                        >
                          {item.title}
                        </Text>
                        <Text
                          style={[
                            styles.occupancySub,
                            isSelected && styles.occupancySubSelected,
                          ]}
                        >
                          {item.sub}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* 7. AC / Non-AC */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>AC / Non-AC</Text>
                <View style={styles.optionPillsRow}>
                  {pgAcOptions.map(opt => {
                    const isSelected = form.pgAcType === opt;
                    return (
                      <TouchableOpacity
                        key={opt}
                        onPress={() => setForm(f => ({ ...f, pgAcType: opt }))}
                        style={[styles.optionPill, isSelected && styles.optionPillSelected]}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.optionPillText,
                            isSelected && styles.optionPillTextSelected,
                          ]}
                        >
                          {opt}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* 8. Current property condition */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Current property condition</Text>
                <TouchableOpacity
                  style={styles.selectInput}
                  activeOpacity={0.7}
                  onPress={() =>
                    openPicker(
                      'Current property condition',
                      conditionOptions,
                      form.condition,
                      val => setForm(f => ({ ...f, condition: val }))
                    )
                  }
                >
                  <Text style={[styles.selectText, !form.condition && styles.placeholderText]}>
                    {form.condition || 'Select'}
                  </Text>
                  <ChevronDown size={18} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* STEP 1 (SELL/RENT) / STEP 2 (COMMERCIAL): BASICS */}
          {((mode !== 'commercial' && mode !== 'pg' && step === 1) || (mode === 'commercial' && step === 2)) && (
            <View style={styles.stepFormContent}>
              {/* 1. Property Type / Commercial Property Type */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>
                  {mode === 'commercial' ? 'Commercial Property Type' : 'Property Type'}
                </Text>
                <TouchableOpacity
                  style={styles.selectInput}
                  activeOpacity={0.7}
                  onPress={() =>
                    openPicker(
                      mode === 'commercial' ? 'Commercial Property Type' : 'Property Type',
                      mode === 'commercial' ? commercialPropertyTypeOptions : propertyTypeOptions,
                      form.propertyType,
                      val => setForm(f => ({ ...f, propertyType: val }))
                    )
                  }
                >
                  <Text style={[styles.selectText, !form.propertyType && styles.placeholderText]}>
                    {form.propertyType || 'Select'}
                  </Text>
                  <ChevronDown size={18} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {/* 1b. Property subtype (optional) - Commercial Only */}
              {mode === 'commercial' && (
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>
                    Property subtype <Text style={{ color: '#9CA3AF', fontWeight: '400' }}>(optional)</Text>
                  </Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. IT office, high-street retail"
                    placeholderTextColor="#9CA3AF"
                    value={form.propertySubtype}
                    onChangeText={text => setForm(f => ({ ...f, propertySubtype: text }))}
                  />
                </View>
              )}

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

              {/* Residential Only: BHK + Bathrooms/Balconies */}
              {mode !== 'commercial' && (
                <>
                  {/* BHK */}
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

                  {/* Bathrooms & Balconies */}
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
                </>
              )}

              {/* Commercial Only: Washrooms & Pantry/Cafeteria */}
              {mode === 'commercial' && (
                <View style={styles.twoColRow}>
                  <View style={styles.colHalf}>
                    <Text style={styles.fieldLabel}>Washrooms</Text>
                    <TouchableOpacity
                      style={styles.selectInput}
                      activeOpacity={0.7}
                      onPress={() =>
                        openPicker('Washrooms', washroomOptions, form.washrooms, val =>
                          setForm(f => ({ ...f, washrooms: val }))
                        )
                      }
                    >
                      <Text style={[styles.selectText, !form.washrooms && styles.placeholderText]}>
                        {form.washrooms || 'Select'}
                      </Text>
                      <ChevronDown size={18} color="#6B7280" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.colHalf}>
                    <Text style={styles.fieldLabel}>Pantry / Cafeteria</Text>
                    <TouchableOpacity
                      style={styles.selectInput}
                      activeOpacity={0.7}
                      onPress={() =>
                        openPicker('Pantry / Cafeteria', pantryOptions, form.pantry, val =>
                          setForm(f => ({ ...f, pantry: val }))
                        )
                      }
                    >
                      <Text style={[styles.selectText, !form.pantry && styles.placeholderText]}>
                        {form.pantry || 'Select'}
                      </Text>
                      <ChevronDown size={18} color="#6B7280" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

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

          {/* STEP 2 (PG / HOSTEL): ROOMS */}
          {mode === 'pg' && step === 2 && (
            <View style={styles.stepFormContent}>
              {/* Notice banner if no occupancy was selected */}
              {form.pgOccupancyTypes.length === 0 && (
                <View style={styles.noticeBanner}>
                  <Text style={styles.noticeBannerText}>
                    No occupancy type was selected in Basics, so Single Sharing is shown as a preview. Go back to select the room types you offer.
                  </Text>
                </View>
              )}

              {/* Room Type Tabs */}
              <View style={styles.roomTabsRow}>
                {(form.pgOccupancyTypes.length > 0
                  ? form.pgOccupancyTypes.map(t => t.replace(' Sharing', ''))
                  : ['Single']
                ).map(tab => {
                  const isSelected = form.pgActiveRoomTab === tab;
                  return (
                    <TouchableOpacity
                      key={tab}
                      onPress={() => setForm(f => ({ ...f, pgActiveRoomTab: tab }))}
                      style={[styles.roomTabPill, isSelected && styles.roomTabPillActive]}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.roomTabPillText,
                          isSelected && styles.roomTabPillTextActive,
                        ]}
                      >
                        {tab}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Room Details Card */}
              <View style={styles.roomCard}>
                <Text style={styles.roomCardTitle}>
                  {form.pgActiveRoomTab.includes('Sharing')
                    ? form.pgActiveRoomTab
                    : `${form.pgActiveRoomTab} Sharing`}{' '}
                  details
                </Text>
                <Text style={styles.roomCardSub}>
                  These details apply only to this occupancy type
                </Text>

                {/* Number of beds & Beds available */}
                <View style={styles.twoColRow}>
                  <View style={styles.colHalf}>
                    <Text style={styles.roomFieldLabel}>Number of beds</Text>
                    <TextInput
                      style={styles.roomTextInput}
                      placeholder=""
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numeric"
                      value={form.pgNumberOfBeds}
                      onChangeText={text => setForm(f => ({ ...f, pgNumberOfBeds: text }))}
                    />
                  </View>
                  <View style={styles.colHalf}>
                    <Text style={styles.roomFieldLabel}>Beds available</Text>
                    <TextInput
                      style={styles.roomTextInput}
                      placeholder=""
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numeric"
                      value={form.pgBedsAvailable}
                      onChangeText={text => setForm(f => ({ ...f, pgBedsAvailable: text }))}
                    />
                  </View>
                </View>

                {/* Room size (sq.ft.) */}
                <View style={styles.roomFieldGroup}>
                  <Text style={styles.roomFieldLabel}>Room size (sq.ft.)</Text>
                  <TextInput
                    style={styles.roomTextInput}
                    placeholder=""
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    value={form.pgRoomSize}
                    onChangeText={text => setForm(f => ({ ...f, pgRoomSize: text }))}
                  />
                </View>

                {/* Attached bathroom */}
                <View style={styles.roomToggleCard}>
                  <Text style={styles.roomToggleText}>Attached bathroom</Text>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                      setForm(f => ({ ...f, pgAttachedBathroom: !f.pgAttachedBathroom }))
                    }
                    style={[
                      styles.toggleSwitchTrack,
                      form.pgAttachedBathroom
                        ? styles.toggleSwitchTrackOn
                        : styles.toggleSwitchTrackOff,
                    ]}
                  >
                    <View
                      style={[
                        styles.toggleSwitchThumb,
                        form.pgAttachedBathroom
                          ? styles.toggleSwitchThumbOn
                          : styles.toggleSwitchThumbOff,
                      ]}
                    />
                  </TouchableOpacity>
                </View>

                {/* Balcony */}
                <View style={styles.roomToggleCard}>
                  <Text style={styles.roomToggleText}>Balcony</Text>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setForm(f => ({ ...f, pgBalcony: !f.pgBalcony }))}
                    style={[
                      styles.toggleSwitchTrack,
                      form.pgBalcony ? styles.toggleSwitchTrackOn : styles.toggleSwitchTrackOff,
                    ]}
                  >
                    <View
                      style={[
                        styles.toggleSwitchThumb,
                        form.pgBalcony ? styles.toggleSwitchThumbOn : styles.toggleSwitchThumbOff,
                      ]}
                    />
                  </TouchableOpacity>
                </View>

                {/* Furnishing status */}
                <View style={styles.roomFieldGroup}>
                  <Text style={styles.roomFieldLabel}>Furnishing status</Text>
                  <View style={styles.optionPillsRow}>
                    {pgFurnishingOptions.map(opt => {
                      const isSelected = form.pgFurnishing === opt;
                      return (
                        <TouchableOpacity
                          key={opt}
                          onPress={() => setForm(f => ({ ...f, pgFurnishing: opt }))}
                          style={[styles.optionPill, isSelected && styles.optionPillSelected]}
                          activeOpacity={0.8}
                        >
                          <Text
                            style={[
                              styles.optionPillText,
                              isSelected && styles.optionPillTextSelected,
                            ]}
                          >
                            {opt}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Room amenities */}
                <View style={styles.roomFieldGroup}>
                  <Text style={styles.roomFieldLabel}>Room amenities</Text>
                  <View style={styles.optionPillsRow}>
                    {pgRoomAmenityOptions.map(opt => {
                      const isSelected = form.pgRoomAmenities.includes(opt);
                      return (
                        <TouchableOpacity
                          key={opt}
                          onPress={() =>
                            setForm(f => ({
                              ...f,
                              pgRoomAmenities: f.pgRoomAmenities.includes(opt)
                                ? f.pgRoomAmenities.filter(x => x !== opt)
                                : [...f.pgRoomAmenities, opt],
                            }))
                          }
                          style={[styles.optionPill, isSelected && styles.optionPillSelected]}
                          activeOpacity={0.8}
                        >
                          <Text
                            style={[
                              styles.optionPillText,
                              isSelected && styles.optionPillTextSelected,
                            ]}
                          >
                            {opt}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* STEP 3 (PG / HOSTEL): FOOD */}
          {mode === 'pg' && step === 3 && (
            <View style={styles.stepFormContent}>
              {/* 1. Place is available for */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Place is available for</Text>
                <View style={styles.optionPillsRow}>
                  {pgPlaceAvailableOptions.map(opt => {
                    const isSelected = form.pgPlaceAvailableFor === opt;
                    return (
                      <TouchableOpacity
                        key={opt}
                        onPress={() => setForm(f => ({ ...f, pgPlaceAvailableFor: opt }))}
                        style={[styles.optionPill, isSelected && styles.optionPillSelected]}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.optionPillText,
                            isSelected && styles.optionPillTextSelected,
                          ]}
                        >
                          {opt}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* 2. Preferred guests */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Preferred guests</Text>
                <TouchableOpacity
                  style={styles.selectInput}
                  activeOpacity={0.7}
                  onPress={() =>
                    openPicker(
                      'Preferred guests',
                      pgPreferredGuestsOptions,
                      form.pgPreferredGuests,
                      val => setForm(f => ({ ...f, pgPreferredGuests: val }))
                    )
                  }
                >
                  <Text style={[styles.selectText, !form.pgPreferredGuests && styles.placeholderText]}>
                    {form.pgPreferredGuests || 'Select'}
                  </Text>
                  <ChevronDown size={18} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {/* 3. Available from */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Available from</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder=""
                  placeholderTextColor="#9CA3AF"
                  value={form.pgAvailableFrom}
                  onChangeText={text => setForm(f => ({ ...f, pgAvailableFrom: text }))}
                />
              </View>

              {/* 4. Food available */}
              <View style={styles.foodToggleCard}>
                <Text style={styles.foodToggleText}>Food available</Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setForm(f => ({ ...f, pgFoodAvailable: !f.pgFoodAvailable }))}
                  style={[
                    styles.toggleSwitchTrack,
                    form.pgFoodAvailable ? styles.toggleSwitchTrackOn : styles.toggleSwitchTrackOff,
                  ]}
                >
                  <View
                    style={[
                      styles.toggleSwitchThumb,
                      form.pgFoodAvailable ? styles.toggleSwitchThumbOn : styles.toggleSwitchThumbOff,
                    ]}
                  />
                </TouchableOpacity>
              </View>

              {/* 5. Dining area */}
              <View style={styles.foodToggleCard}>
                <Text style={styles.foodToggleText}>Dining area</Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setForm(f => ({ ...f, pgDiningArea: !f.pgDiningArea }))}
                  style={[
                    styles.toggleSwitchTrack,
                    form.pgDiningArea ? styles.toggleSwitchTrackOn : styles.toggleSwitchTrackOff,
                  ]}
                >
                  <View
                    style={[
                      styles.toggleSwitchThumb,
                      form.pgDiningArea ? styles.toggleSwitchThumbOn : styles.toggleSwitchThumbOff,
                    ]}
                  />
                </TouchableOpacity>
              </View>

              {/* 6. Kitchen available */}
              <View style={styles.foodToggleCard}>
                <Text style={styles.foodToggleText}>Kitchen available</Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setForm(f => ({ ...f, pgKitchenAvailable: !f.pgKitchenAvailable }))}
                  style={[
                    styles.toggleSwitchTrack,
                    form.pgKitchenAvailable ? styles.toggleSwitchTrackOn : styles.toggleSwitchTrackOff,
                  ]}
                >
                  <View
                    style={[
                      styles.toggleSwitchThumb,
                      form.pgKitchenAvailable ? styles.toggleSwitchThumbOn : styles.toggleSwitchThumbOff,
                    ]}
                  />
                </TouchableOpacity>
              </View>

              {/* 7. Outside food allowed */}
              <View style={styles.foodToggleCard}>
                <Text style={styles.foodToggleText}>Outside food allowed</Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() =>
                    setForm(f => ({ ...f, pgOutsideFoodAllowed: !f.pgOutsideFoodAllowed }))
                  }
                  style={[
                    styles.toggleSwitchTrack,
                    form.pgOutsideFoodAllowed ? styles.toggleSwitchTrackOn : styles.toggleSwitchTrackOff,
                  ]}
                >
                  <View
                    style={[
                      styles.toggleSwitchThumb,
                      form.pgOutsideFoodAllowed ? styles.toggleSwitchThumbOn : styles.toggleSwitchThumbOff,
                    ]}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* STEP 4 (PG / HOSTEL): FACILITIES */}
          {mode === 'pg' && step === 4 && (
            <View style={styles.stepFormContent}>
              {/* 1. Available services Card */}
              <View style={styles.facilitiesCard}>
                <Text style={styles.facilitiesCardTitle}>Available services</Text>

                {/* Laundry service */}
                <View style={styles.innerToggleRow}>
                  <Text style={styles.innerToggleText}>Laundry service</Text>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                      setForm(f => ({ ...f, pgLaundryService: !f.pgLaundryService }))
                    }
                    style={[
                      styles.toggleSwitchTrack,
                      form.pgLaundryService
                        ? styles.toggleSwitchTrackOn
                        : styles.toggleSwitchTrackOff,
                    ]}
                  >
                    <View
                      style={[
                        styles.toggleSwitchThumb,
                        form.pgLaundryService
                          ? styles.toggleSwitchThumbOn
                          : styles.toggleSwitchThumbOff,
                      ]}
                    />
                  </TouchableOpacity>
                </View>

                {/* Room cleaning */}
                <View style={styles.innerToggleRow}>
                  <Text style={styles.innerToggleText}>Room cleaning</Text>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                      setForm(f => ({ ...f, pgRoomCleaning: !f.pgRoomCleaning }))
                    }
                    style={[
                      styles.toggleSwitchTrack,
                      form.pgRoomCleaning
                        ? styles.toggleSwitchTrackOn
                        : styles.toggleSwitchTrackOff,
                    ]}
                  >
                    <View
                      style={[
                        styles.toggleSwitchThumb,
                        form.pgRoomCleaning
                          ? styles.toggleSwitchThumbOn
                          : styles.toggleSwitchThumbOff,
                      ]}
                    />
                  </TouchableOpacity>
                </View>

                {/* Warden facility */}
                <View style={[styles.innerToggleRow, { marginBottom: 0 }]}>
                  <Text style={styles.innerToggleText}>Warden facility</Text>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                      setForm(f => ({ ...f, pgWardenFacility: !f.pgWardenFacility }))
                    }
                    style={[
                      styles.toggleSwitchTrack,
                      form.pgWardenFacility
                        ? styles.toggleSwitchTrackOn
                        : styles.toggleSwitchTrackOff,
                    ]}
                  >
                    <View
                      style={[
                        styles.toggleSwitchThumb,
                        form.pgWardenFacility
                          ? styles.toggleSwitchThumbOn
                          : styles.toggleSwitchThumbOff,
                      ]}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* 2. Directions for tenants Card */}
              <View style={styles.facilitiesCard}>
                <Text style={styles.facilitiesCardTitle}>Directions for tenants</Text>
                <Text style={styles.facilitiesCardSub}>
                  Help tenants reach the property without calling for directions
                </Text>
                <Text style={styles.facilitiesFieldLabel}>
                  Directions using landmarks <Text style={styles.optionalText}>(optional)</Text>
                </Text>
                <TextInput
                  style={styles.facilitiesTextArea}
                  placeholder="e.g. Take the road opposite the college, turn right after 300m"
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  value={form.pgDirections}
                  onChangeText={text => setForm(f => ({ ...f, pgDirections: text }))}
                />
              </View>

              {/* 3. Available amenities */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Available amenities</Text>
                <View style={styles.optionPillsRow}>
                  {pgAmenitiesList.map(item => {
                    const isSelected = form.pgAvailableAmenities.includes(item);
                    return (
                      <TouchableOpacity
                        key={item}
                        onPress={() =>
                          setForm(f => ({
                            ...f,
                            pgAvailableAmenities: f.pgAvailableAmenities.includes(item)
                              ? f.pgAvailableAmenities.filter(x => x !== item)
                              : [...f.pgAvailableAmenities, item],
                          }))
                        }
                        style={[styles.optionPill, isSelected && styles.optionPillSelected]}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.optionPillText,
                            isSelected && styles.optionPillTextSelected,
                          ]}
                        >
                          {item}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* 4. Parking */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Parking</Text>
                <TouchableOpacity
                  style={styles.selectInput}
                  activeOpacity={0.7}
                  onPress={() =>
                    openPicker('Parking', parkingOptions, form.parking, val =>
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

              {/* 5. Add another amenity */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Add another amenity</Text>
                <View style={styles.addAmenityRow}>
                  <TextInput
                    style={styles.addAmenityInput}
                    placeholder="Type an amenity"
                    placeholderTextColor="#9CA3AF"
                    value={pgCustomAmenity}
                    onChangeText={setPgCustomAmenity}
                    onSubmitEditing={handleAddPgAmenity}
                    returnKeyType="done"
                  />
                  <TouchableOpacity
                    style={styles.addAmenityBtn}
                    onPress={handleAddPgAmenity}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.addAmenityBtnText}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* STEP 2 (SELL/RENT) / STEP 3 (COMMERCIAL) / STEP 7 (PG): LOCATION */}
          {((mode !== 'commercial' && mode !== 'pg' && step === 2) ||
            (mode === 'commercial' && step === 3) ||
            (mode === 'pg' && step === 7)) && (
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
                    placeholder={mode === 'commercial' ? 'Area' : 'Area / neighbourhood'}
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

          {/* STEP 3 (SELL/RENT) / STEP 4 (COMMERCIAL) / STEP 8 (PG): PRICING */}
          {((mode !== 'commercial' && mode !== 'pg' && step === 3) ||
            (mode === 'commercial' && step === 4) ||
            (mode === 'pg' && step === 8)) && (
            <View style={styles.stepFormContent}>
              {mode === 'rent' ? (
                <>
                  {/* 1. Expected rent (₹/month) */}
                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Expected rent (₹/month)</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder=""
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numeric"
                      value={form.price}
                      onChangeText={text => setForm(f => ({ ...f, price: text }))}
                    />
                  </View>

                  {/* 2. Expected deposit (₹) */}
                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Expected deposit (₹)</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder=""
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numeric"
                      value={form.deposit}
                      onChangeText={text => setForm(f => ({ ...f, deposit: text }))}
                    />
                  </View>

                  {/* 3. Monthly maintenance */}
                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Monthly maintenance</Text>
                    <View style={styles.optionPillsRow}>
                      {['Included in rent', 'Separate'].map(opt => {
                        const isSelected = form.maintenanceMode === opt;
                        return (
                          <TouchableOpacity
                            key={opt}
                            onPress={() => setForm(f => ({ ...f, maintenanceMode: opt }))}
                            style={[styles.optionPill, isSelected && styles.optionPillSelected]}
                            activeOpacity={0.8}
                          >
                            <Text
                              style={[
                                styles.optionPillText,
                                isSelected && styles.optionPillTextSelected,
                              ]}
                            >
                              {opt}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>

                  {/* 4. Maintenance cost (₹/month) */}
                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Maintenance cost (₹/month)</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder=""
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numeric"
                      value={form.maintenance}
                      onChangeText={text => setForm(f => ({ ...f, maintenance: text }))}
                    />
                  </View>

                  {/* 5. Rent is negotiable toggle card */}
                  <View style={styles.toggleCard}>
                    <Text style={styles.toggleCardText}>Rent is negotiable</Text>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => setForm(f => ({ ...f, priceNegotiable: !f.priceNegotiable }))}
                      style={[
                        styles.toggleSwitchTrack,
                        form.priceNegotiable ? styles.toggleSwitchTrackOn : styles.toggleSwitchTrackOff,
                      ]}
                    >
                      <View
                        style={[
                          styles.toggleSwitchThumb,
                          form.priceNegotiable ? styles.toggleSwitchThumbOn : styles.toggleSwitchThumbOff,
                        ]}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* 6. Available from */}
                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Available from</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder=""
                      placeholderTextColor="#9CA3AF"
                      value={form.availabilityDate}
                      onChangeText={text => setForm(f => ({ ...f, availabilityDate: text }))}
                    />
                  </View>
                </>
              ) : (
                <>
                  {/* Default / Sell Mode */}
                  {/* 1. Expected price (₹) */}
                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Expected price (₹)</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder=""
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numeric"
                      value={form.price}
                      onChangeText={text => setForm(f => ({ ...f, price: text }))}
                    />
                  </View>

                  {/* 2. Price is negotiable toggle card */}
                  <View style={styles.toggleCard}>
                    <Text style={styles.toggleCardText}>Price is negotiable</Text>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => setForm(f => ({ ...f, priceNegotiable: !f.priceNegotiable }))}
                      style={[
                        styles.toggleSwitchTrack,
                        form.priceNegotiable ? styles.toggleSwitchTrackOn : styles.toggleSwitchTrackOff,
                      ]}
                    >
                      <View
                        style={[
                          styles.toggleSwitchThumb,
                          form.priceNegotiable ? styles.toggleSwitchThumbOn : styles.toggleSwitchThumbOff,
                        ]}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* 3. Available from */}
                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Available from</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder=""
                      placeholderTextColor="#9CA3AF"
                      value={form.availabilityDate}
                      onChangeText={text => setForm(f => ({ ...f, availabilityDate: text }))}
                    />
                  </View>
                </>
              )}
            </View>
          )}

          {/* STEP 4 (SELL/RENT) / STEP 5 (COMMERCIAL): AMENITIES */}
          {((mode !== 'commercial' && mode !== 'pg' && step === 4) ||
            (mode === 'commercial' && step === 5)) && (
            <View style={styles.stepFormContent}>
              <Text style={styles.fieldLabel}>Amenities</Text>
              <View style={styles.amenityWrap}>
                {amenitiesList.map(a => {
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
                      activeOpacity={0.75}
                    >
                      <Text
                        style={[styles.amenityText, selected && styles.amenityTextSelected]}
                      >
                        {a}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Add another amenity */}
              <View style={styles.addAmenitySection}>
                <Text style={styles.fieldLabel}>Add another amenity</Text>
                <View style={styles.addAmenityRow}>
                  <TextInput
                    style={styles.addAmenityInput}
                    placeholder="Type an amenity"
                    placeholderTextColor="#9CA3AF"
                    value={customAmenity}
                    onChangeText={setCustomAmenity}
                    onSubmitEditing={handleAddAmenity}
                    returnKeyType="done"
                  />
                  <TouchableOpacity
                    style={styles.addAmenityBtn}
                    onPress={handleAddAmenity}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.addAmenityBtnText}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* STEP 5 (SELL/RENT/PG) / STEP 6 (COMMERCIAL): PHOTOS */}
          {((mode !== 'commercial' && step === 5) ||
            (mode === 'commercial' && step === 6)) && (
            <View style={styles.stepFormContent}>
              <Text style={styles.photosIntroText}>
                Add clear photos of rooms, building exterior, bathrooms and common areas. The first photo becomes the cover.
              </Text>

              <View style={styles.photosGrid}>
                <TouchableOpacity
                  style={styles.addPhotosBox}
                  activeOpacity={0.75}
                  onPress={handleAddPhoto}
                >
                  <ImagePlus size={24} color="#000000" strokeWidth={1.8} />
                  <Text style={styles.addPhotosText}>Add photos</Text>
                </TouchableOpacity>

                {form.photos.map((uri, index) => (
                  <View key={index} style={styles.photoThumbWrap}>
                    <Image source={{ uri }} style={styles.photoThumbImg} />
                    <TouchableOpacity
                      style={styles.photoRemoveBtn}
                      onPress={() => handleRemovePhoto(index)}
                      activeOpacity={0.8}
                    >
                      <X size={12} color="#FFFFFF" strokeWidth={2.5} />
                    </TouchableOpacity>
                    {index === 0 && (
                      <View style={styles.photoCoverBadge}>
                        <Text style={styles.photoCoverText}>Cover</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* STEP 6 (PG / HOSTEL): RULES */}
          {mode === 'pg' && step === 6 && (
            <View style={styles.stepFormContent}>
              {/* 1. PG / Hostel rules */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>PG / Hostel rules</Text>
                <View style={styles.optionPillsRow}>
                  {pgRulesOptions.map(opt => {
                    const isSelected = form.pgRules.includes(opt);
                    return (
                      <TouchableOpacity
                        key={opt}
                        onPress={() =>
                          setForm(f => ({
                            ...f,
                            pgRules: f.pgRules.includes(opt)
                              ? f.pgRules.filter(x => x !== opt)
                              : [...f.pgRules, opt],
                          }))
                        }
                        style={[styles.optionPill, isSelected && styles.optionPillSelected]}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.optionPillText,
                            isSelected && styles.optionPillTextSelected,
                          ]}
                        >
                          {opt}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* 2. Gate closing time */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Gate closing time</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder=""
                  placeholderTextColor="#9CA3AF"
                  value={form.pgGateClosingTime}
                  onChangeText={text => setForm(f => ({ ...f, pgGateClosingTime: text }))}
                />
              </View>

              {/* 3. Additional rules / description (optional) */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>
                  Additional rules / description <Text style={{ color: '#9CA3AF', fontWeight: '400' }}>(optional)</Text>
                </Text>
                <TextInput
                  style={styles.textAreaInput}
                  placeholder="Add any other house rules"
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  value={form.pgAdditionalRules}
                  onChangeText={text => setForm(f => ({ ...f, pgAdditionalRules: text }))}
                />
              </View>
            </View>
          )}

          {/* STEP 6 (RENT): TENANT PREFERENCES */}
          {mode === 'rent' && step === 6 && (
            <View style={styles.stepFormContent}>
              {/* 1. Preferred tenant */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Preferred tenant</Text>
                <View style={styles.optionPillsRow}>
                  {['Family', 'Bachelors', 'Working Professionals', 'Students', 'Anyone'].map(opt => {
                    const isSelected = form.preferredTenant.includes(opt);
                    return (
                      <TouchableOpacity
                        key={opt}
                        onPress={() =>
                          setForm(f => ({
                            ...f,
                            preferredTenant: isSelected
                              ? f.preferredTenant.filter(x => x !== opt)
                              : [...f.preferredTenant, opt],
                          }))
                        }
                        style={[styles.optionPill, isSelected && styles.optionPillSelected]}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.optionPillText,
                            isSelected && styles.optionPillTextSelected,
                          ]}
                        >
                          {opt}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* 2. Gender preference (if applicable) */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Gender preference (if applicable)</Text>
                <View style={styles.optionPillsRow}>
                  {['Male', 'Female', 'Any'].map(opt => {
                    const isSelected = form.genderPreference === opt;
                    return (
                      <TouchableOpacity
                        key={opt}
                        onPress={() => setForm(f => ({ ...f, genderPreference: isSelected ? '' : opt }))}
                        style={[styles.optionPill, isSelected && styles.optionPillSelected]}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.optionPillText,
                            isSelected && styles.optionPillTextSelected,
                          ]}
                        >
                          {opt}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* 3. Pets allowed toggle card */}
              <View style={styles.toggleCard}>
                <Text style={styles.toggleCardText}>Pets allowed</Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setForm(f => ({ ...f, petsAllowed: !f.petsAllowed }))}
                  style={[
                    styles.toggleSwitchTrack,
                    form.petsAllowed ? styles.toggleSwitchTrackOn : styles.toggleSwitchTrackOff,
                  ]}
                >
                  <View
                    style={[
                      styles.toggleSwitchThumb,
                      form.petsAllowed ? styles.toggleSwitchThumbOn : styles.toggleSwitchThumbOff,
                    ]}
                  />
                </TouchableOpacity>
              </View>

              {/* 4. Smoking allowed toggle card */}
              <View style={styles.toggleCard}>
                <Text style={styles.toggleCardText}>Smoking allowed</Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setForm(f => ({ ...f, smokingAllowed: !f.smokingAllowed }))}
                  style={[
                    styles.toggleSwitchTrack,
                    form.smokingAllowed ? styles.toggleSwitchTrackOn : styles.toggleSwitchTrackOff,
                  ]}
                >
                  <View
                    style={[
                      styles.toggleSwitchThumb,
                      form.smokingAllowed ? styles.toggleSwitchThumbOn : styles.toggleSwitchThumbOff,
                    ]}
                  />
                </TouchableOpacity>
              </View>

              {/* 5. Food preference */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Food preference</Text>
                <View style={styles.optionPillsRow}>
                  {['Vegetarian', 'Non-Vegetarian', 'Any'].map(opt => {
                    const isSelected = form.foodPreference === opt;
                    return (
                      <TouchableOpacity
                        key={opt}
                        onPress={() => setForm(f => ({ ...f, foodPreference: isSelected ? '' : opt }))}
                        style={[styles.optionPill, isSelected && styles.optionPillSelected]}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.optionPillText,
                            isSelected && styles.optionPillTextSelected,
                          ]}
                        >
                          {opt}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>
          )}

          {/* STEP 6 (FLATMATE): FLATMATE PROFILE */}
          {mode === 'flatmate' && step === 6 && (
            <View style={styles.stepFormContent}>
              {/* 1. Your name */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Your name</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder=""
                  placeholderTextColor="#9CA3AF"
                  value={form.flatmateName || form.ownerName}
                  onChangeText={text =>
                    setForm(f => ({ ...f, flatmateName: text, ownerName: text }))
                  }
                />
              </View>

              {/* 2. Mobile number */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Mobile number</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder=""
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                  value={form.flatmateMobile || form.ownerMobile}
                  onChangeText={text =>
                    setForm(f => ({ ...f, flatmateMobile: text, ownerMobile: text }))
                  }
                />
              </View>

              {/* 3. Email */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Email</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder=""
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={form.flatmateEmail || form.ownerEmail}
                  onChangeText={text =>
                    setForm(f => ({ ...f, flatmateEmail: text, ownerEmail: text }))
                  }
                />
              </View>

              {/* 4. Profession */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Profession</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder=""
                  placeholderTextColor="#9CA3AF"
                  value={form.flatmateProfession}
                  onChangeText={text => setForm(f => ({ ...f, flatmateProfession: text }))}
                />
              </View>

              {/* 5. Gender */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Gender</Text>
                <View style={styles.optionPillsRow}>
                  {['Male', 'Female', 'Other'].map(gen => {
                    const isSelected = form.flatmateGender === gen;
                    return (
                      <TouchableOpacity
                        key={gen}
                        onPress={() =>
                          setForm(f => ({ ...f, flatmateGender: isSelected ? '' : gen }))
                        }
                        style={[styles.optionPill, isSelected && styles.optionPillSelected]}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.optionPillText,
                            isSelected && styles.optionPillTextSelected,
                          ]}
                        >
                          {gen}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>
          )}

          {/* STEP 7 (FLATMATE): PREFERENCES */}
          {mode === 'flatmate' && step === 7 && (
            <View style={styles.stepFormContent}>
              {/* 1. Preferred gender */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Preferred gender</Text>
                <View style={styles.optionPillsRow}>
                  {['Male', 'Female', 'Any'].map(gen => {
                    const isSelected = form.flatmatePreferredGender === gen;
                    return (
                      <TouchableOpacity
                        key={gen}
                        onPress={() =>
                          setForm(f => ({
                            ...f,
                            flatmatePreferredGender: isSelected ? '' : gen,
                          }))
                        }
                        style={[styles.optionPill, isSelected && styles.optionPillSelected]}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.optionPillText,
                            isSelected && styles.optionPillTextSelected,
                          ]}
                        >
                          {gen}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* 2. Preferred age group */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Preferred age group</Text>
                <TouchableOpacity
                  style={styles.selectInput}
                  activeOpacity={0.7}
                  onPress={() =>
                    openPicker('Preferred age group', ageGroupOptions, form.flatmateAgeGroup, val =>
                      setForm(f => ({ ...f, flatmateAgeGroup: val }))
                    )
                  }
                >
                  <Text
                    style={[styles.selectText, !form.flatmateAgeGroup && styles.placeholderText]}
                  >
                    {form.flatmateAgeGroup || 'Select'}
                  </Text>
                  <ChevronDown size={18} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {/* 3. Occupation */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Occupation</Text>
                <View style={styles.optionPillsRow}>
                  {['Student', 'Working Professional', 'Business Person', 'Any'].map(occ => {
                    const isSelected = form.flatmateOccupation.includes(occ);
                    return (
                      <TouchableOpacity
                        key={occ}
                        onPress={() =>
                          setForm(f => ({
                            ...f,
                            flatmateOccupation: isSelected
                              ? f.flatmateOccupation.filter(x => x !== occ)
                              : [...f.flatmateOccupation, occ],
                          }))
                        }
                        style={[styles.optionPill, isSelected && styles.optionPillSelected]}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.optionPillText,
                            isSelected && styles.optionPillTextSelected,
                          ]}
                        >
                          {occ}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* 4. Food preference */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Food preference</Text>
                <View style={styles.optionPillsRow}>
                  {['Vegetarian', 'Non-Vegetarian', 'Any'].map(food => {
                    const isSelected = form.flatmateFoodPref === food;
                    return (
                      <TouchableOpacity
                        key={food}
                        onPress={() =>
                          setForm(f => ({
                            ...f,
                            flatmateFoodPref: isSelected ? '' : food,
                          }))
                        }
                        style={[styles.optionPill, isSelected && styles.optionPillSelected]}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.optionPillText,
                            isSelected && styles.optionPillTextSelected,
                          ]}
                        >
                          {food}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* 5. Smoking allowed toggle card */}
              <View style={styles.toggleCard}>
                <Text style={styles.toggleCardText}>Smoking allowed</Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setForm(f => ({ ...f, flatmateSmoking: !f.flatmateSmoking }))}
                  style={[
                    styles.toggleSwitchTrack,
                    form.flatmateSmoking ? styles.toggleSwitchTrackOn : styles.toggleSwitchTrackOff,
                  ]}
                >
                  <View
                    style={[
                      styles.toggleSwitchThumb,
                      form.flatmateSmoking ? styles.toggleSwitchThumbOn : styles.toggleSwitchThumbOff,
                    ]}
                  />
                </TouchableOpacity>
              </View>

              {/* 6. Drinking allowed toggle card */}
              <View style={styles.toggleCard}>
                <Text style={styles.toggleCardText}>Drinking allowed</Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setForm(f => ({ ...f, flatmateDrinking: !f.flatmateDrinking }))}
                  style={[
                    styles.toggleSwitchTrack,
                    form.flatmateDrinking ? styles.toggleSwitchTrackOn : styles.toggleSwitchTrackOff,
                  ]}
                >
                  <View
                    style={[
                      styles.toggleSwitchThumb,
                      form.flatmateDrinking ? styles.toggleSwitchThumbOn : styles.toggleSwitchThumbOff,
                    ]}
                  />
                </TouchableOpacity>
              </View>

              {/* 7. Pets allowed toggle card */}
              <View style={styles.toggleCard}>
                <Text style={styles.toggleCardText}>Pets allowed</Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setForm(f => ({ ...f, flatmatePets: !f.flatmatePets }))}
                  style={[
                    styles.toggleSwitchTrack,
                    form.flatmatePets ? styles.toggleSwitchTrackOn : styles.toggleSwitchTrackOff,
                  ]}
                >
                  <View
                    style={[
                      styles.toggleSwitchThumb,
                      form.flatmatePets ? styles.toggleSwitchThumbOn : styles.toggleSwitchThumbOff,
                    ]}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* STEP 6 (SELL) / STEP 7 (RENT/COMMERCIAL) / STEP 9 (PG): OWNER & DECLARATION */}
          {((mode === 'sell' && step === 6) ||
            ((mode === 'rent' || mode === 'commercial') && step === 7) ||
            (mode === 'pg' && step === 9)) && (
            <View style={styles.stepFormContent}>
              {/* Top Banner Notice */}
              <View style={styles.ownerNoticeBox}>
                <Text style={styles.ownerNoticeText}>
                  No documents are required on this screen. Seedha will contact the owner if verification is needed.
                </Text>
              </View>

              {/* Owner name */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Owner name</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder=""
                  placeholderTextColor="#9CA3AF"
                  value={form.ownerName}
                  onChangeText={text => setForm(f => ({ ...f, ownerName: text }))}
                />
              </View>

              {/* Owner mobile number */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Owner mobile number</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder=""
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                  value={form.ownerMobile}
                  onChangeText={text => setForm(f => ({ ...f, ownerMobile: text }))}
                />
              </View>

              {/* Owner email (optional) */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Owner email (optional)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder=""
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={form.ownerEmail}
                  onChangeText={text => setForm(f => ({ ...f, ownerEmail: text }))}
                />
              </View>

              {/* Ownership declaration Card */}
              <View style={styles.whiteSectionCard}>
                <Text style={styles.sectionCardTitle}>Ownership declaration</Text>
                <Text style={styles.sectionCardSub}>
                  Used as owner-declared information until Seedha verifies it
                </Text>

                {/* 1. Posting as */}
                <View style={styles.declarationFieldGroup}>
                  <Text style={styles.declarationLabel}>Posting as</Text>
                  <View style={styles.optionPillsRow}>
                    {['Owner', 'Co-owner', 'Power of attorney', 'Builder'].map(opt => {
                      const isSelected = form.postingAs === opt;
                      return (
                        <TouchableOpacity
                          key={opt}
                          onPress={() => setForm(f => ({ ...f, postingAs: opt }))}
                          style={[styles.optionPill, isSelected && styles.optionPillSelected]}
                          activeOpacity={0.8}
                        >
                          <Text
                            style={[
                              styles.optionPillText,
                              isSelected && styles.optionPillTextSelected,
                            ]}
                          >
                            {opt}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* 2. How was the property acquired? */}
                <View style={styles.declarationFieldGroup}>
                  <Text style={styles.declarationLabel}>How was the property acquired?</Text>
                  <View style={styles.optionPillsRow}>
                    {['Purchased', 'Inherited', 'Gifted', 'Builder allotment'].map(opt => {
                      const isSelected = form.propertyAcquired === opt;
                      return (
                        <TouchableOpacity
                          key={opt}
                          onPress={() => setForm(f => ({ ...f, propertyAcquired: opt }))}
                          style={[styles.optionPill, isSelected && styles.optionPillSelected]}
                          activeOpacity={0.8}
                        >
                          <Text
                            style={[
                              styles.optionPillText,
                              isSelected && styles.optionPillTextSelected,
                            ]}
                          >
                            {opt}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* 3. Loan on property */}
                <View style={styles.declarationFieldGroup}>
                  <Text style={styles.declarationLabel}>Loan on property</Text>
                  <View style={styles.optionPillsRow}>
                    {['No loan', 'Loan active', 'Loan closed'].map(opt => {
                      const isSelected = form.loanOnProperty === opt;
                      return (
                        <TouchableOpacity
                          key={opt}
                          onPress={() => setForm(f => ({ ...f, loanOnProperty: opt }))}
                          style={[styles.optionPill, isSelected && styles.optionPillSelected]}
                          activeOpacity={0.8}
                        >
                          <Text
                            style={[
                              styles.optionPillText,
                              isSelected && styles.optionPillTextSelected,
                            ]}
                          >
                            {opt}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* 4. Property tax paid? */}
                <View style={styles.declarationFieldGroup}>
                  <Text style={styles.declarationLabel}>Property tax paid?</Text>
                  <View style={styles.optionPillsRow}>
                    {['Yes', 'No'].map(opt => {
                      const isSelected = form.propertyTaxPaid === opt;
                      return (
                        <TouchableOpacity
                          key={opt}
                          onPress={() => setForm(f => ({ ...f, propertyTaxPaid: opt }))}
                          style={[styles.optionPill, isSelected && styles.optionPillSelected]}
                          activeOpacity={0.8}
                        >
                          <Text
                            style={[
                              styles.optionPillText,
                              isSelected && styles.optionPillTextSelected,
                            ]}
                          >
                            {opt}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* 5. Pending dues? */}
                <View style={styles.declarationFieldGroup}>
                  <Text style={styles.declarationLabel}>Pending dues?</Text>
                  <View style={styles.optionPillsRow}>
                    {['None', 'Yes'].map(opt => {
                      const isSelected = form.pendingDues === opt;
                      return (
                        <TouchableOpacity
                          key={opt}
                          onPress={() => setForm(f => ({ ...f, pendingDues: opt }))}
                          style={[styles.optionPill, isSelected && styles.optionPillSelected]}
                          activeOpacity={0.8}
                        >
                          <Text
                            style={[
                              styles.optionPillText,
                              isSelected && styles.optionPillTextSelected,
                            ]}
                          >
                            {opt}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* 6. Court case on property? */}
                <View style={styles.declarationFieldGroup}>
                  <Text style={styles.declarationLabel}>Court case on property?</Text>
                  <View style={styles.optionPillsRow}>
                    {['None', 'Yes'].map(opt => {
                      const isSelected = form.courtCase === opt;
                      return (
                        <TouchableOpacity
                          key={opt}
                          onPress={() => setForm(f => ({ ...f, courtCase: opt }))}
                          style={[styles.optionPill, isSelected && styles.optionPillSelected]}
                          activeOpacity={0.8}
                        >
                          <Text
                            style={[
                              styles.optionPillText,
                              isSelected && styles.optionPillTextSelected,
                            ]}
                          >
                            {opt}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* STEP 7 (SELL) / STEP 8 (RENT/COMMERCIAL/FLATMATE) / STEP 10 (PG): PREVIEW */}
          {((mode === 'sell' && step === 7) ||
            ((mode === 'rent' || mode === 'commercial' || mode === 'flatmate') && step === 8) ||
            (mode === 'pg' && step === 10)) && (
            <View style={styles.stepFormContent}>
              {/* Top Listing Card Preview */}
              <View style={styles.previewTopCard}>
                {form.photos.length > 0 ? (
                  <Image source={{ uri: form.photos[0] }} style={styles.previewCardImg} />
                ) : (
                  <View style={styles.previewImgPlaceholder}>
                    <Camera size={34} color="#000000" strokeWidth={1.8} />
                  </View>
                )}
                <View style={styles.previewCardBody}>
                  <View style={styles.previewBadgePill}>
                    <Text style={styles.previewBadgeText}>Post to {modeLabel}</Text>
                  </View>
                  <Text style={styles.previewTitleText}>
                    {form.title || 'Untitled listing'}
                  </Text>
                  <Text style={styles.previewLocalityText}>
                    {form.locality || form.city || 'Hyderabad'}
                  </Text>
                  <Text style={styles.previewPriceText}>
                    {form.price ? `₹${form.price}` : 'Price not added'}
                  </Text>
                </View>
              </View>

              {/* All listing details Card */}
              <View style={styles.allDetailsCard}>
                <Text style={styles.allDetailsTitle}>All listing details</Text>
                <Text style={styles.allDetailsSub}>Review before you submit</Text>

                <View style={styles.detailsListWrap}>
                  {(mode === 'rent'
                    ? [
                        { label: 'City', value: form.city || 'Hyderabad' },
                        { label: 'Maintenance Mode', value: form.maintenanceMode || 'Separate' },
                        { label: 'Visit Days', value: form.availableDays || 'Any day' },
                        { label: 'Property Position', value: form.propertyPosition || 'Main road property' },
                        { label: 'Owner Role', value: form.postingAs || 'Owner' },
                        { label: 'Acquired', value: form.propertyAcquired || 'Purchased' },
                        { label: 'Room Type', value: 'Private Room' },
                        { label: 'Ac Type', value: 'Non-AC' },
                        { label: 'Pg Available For', value: 'Anyone' },
                        { label: 'Property Offer', value: 'Only rent' },
                        { label: 'Photos', value: String(form.photos.length) },
                      ]
                    : [
                        { label: 'City', value: form.city || 'Hyderabad' },
                        { label: 'Negotiable', value: form.priceNegotiable ? 'Yes' : 'No' },
                        { label: 'Maintenance Mode', value: form.maintenanceMode || 'Separate' },
                        { label: 'Visit Days', value: form.availableDays || 'Any day' },
                        { label: 'Property Position', value: form.propertyPosition || 'Main road property' },
                        { label: 'Owner Role', value: form.postingAs || 'Owner' },
                        { label: 'Acquired', value: form.propertyAcquired || 'Purchased' },
                        { label: 'Property Loan', value: form.loanOnProperty || 'No loan' },
                        { label: 'Property Tax', value: form.propertyTaxPaid || 'Yes' },
                        { label: 'Property Dues', value: form.pendingDues || 'None' },
                        { label: 'Litigation', value: form.courtCase || 'None' },
                        { label: 'Room Type', value: 'Private Room' },
                        { label: 'Ac Type', value: 'Non-AC' },
                        { label: 'Pg Available For', value: 'Anyone' },
                        { label: 'Property Offer', value: 'Only rent' },
                        { label: 'Photos', value: String(form.photos.length) },
                      ]
                  ).map((row, idx, arr) => (
                    <View
                      key={row.label}
                      style={[
                        styles.detailRow,
                        idx === arr.length - 1 && styles.detailRowLast,
                      ]}
                    >
                      <Text style={styles.detailRowLabel}>{row.label}</Text>
                      <Text style={styles.detailRowVal}>{row.value}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Bottom Action Footer matching design */}
        <View style={styles.footerRow}>
          {step < totalSteps && (
            <TouchableOpacity
              style={styles.draftButton}
              activeOpacity={0.8}
              onPress={() => {
                pop();
              }}
            >
              <Text style={styles.draftButtonText}>Save draft</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.continueButton, step === totalSteps && styles.fullSubmitButton]}
            activeOpacity={0.9}
            disabled={loading}
            onPress={() => {
              if (step < totalSteps) {
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
                {step < totalSteps ? 'Continue' : 'Submit property'}
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
  toggleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    height: 48,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  toggleCardText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  toggleSwitchTrack: {
    width: 46,
    height: 26,
    borderRadius: 13,
    padding: 3,
    justifyContent: 'center',
  },
  toggleSwitchTrackOn: {
    backgroundColor: '#000000',
  },
  toggleSwitchTrackOff: {
    backgroundColor: '#E5E7EB',
  },
  toggleSwitchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  toggleSwitchThumbOn: {
    alignSelf: 'flex-end',
  },
  toggleSwitchThumbOff: {
    alignSelf: 'flex-start',
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
    gap: 10,
    marginTop: 8,
  },
  amenityChip: {
    height: 38,
    borderRadius: 19,
    paddingHorizontal: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  amenityChipSelected: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  amenityText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  amenityTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  addAmenitySection: {
    marginTop: 24,
  },
  addAmenityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  addAmenityInput: {
    flex: 1,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  addAmenityBtn: {
    height: 48,
    paddingHorizontal: 20,
    backgroundColor: '#000000',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 2,
  },
  addAmenityBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  photosIntroText: {
    fontSize: 12,
    lineHeight: 20,
    color: '#6B7280',
    marginTop: 4,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  addPhotosBox: {
    width: 111,
    height: 111,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#000000',
    backgroundColor: '#ECEEF5',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  addPhotosText: {
    fontSize: 10,
    lineHeight: 15,
    color: '#000000',
    textAlign: 'center',
    fontWeight: '500',
  },
  photoThumbWrap: {
    width: 111,
    height: 111,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#E5E7EB',
  },
  photoThumbImg: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  photoRemoveBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoCoverBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: '#000000',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  photoCoverText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  ownerNoticeBox: {
    backgroundColor: '#E4E7F0',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 8,
  },
  ownerNoticeText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#6B7280',
  },
  declarationFieldGroup: {
    marginTop: 16,
  },
  declarationLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 8,
  },
  optionPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  purposeHeading: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 14,
    marginTop: 4,
  },
  purposeCardsWrap: {
    gap: 12,
  },
  purposeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    elevation: 1,
  },
  purposeCardSelected: {
    borderColor: '#E5E7EB',
  },
  purposeCheckCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  purposeUncheckCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    marginRight: 14,
  },
  purposeTextCol: {
    flex: 1,
  },
  purposeTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  purposeSub: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  previewTopCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  previewImgPlaceholder: {
    height: 180,
    backgroundColor: '#ECEEF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewCardImg: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  previewCardBody: {
    padding: 20,
  },
  previewBadgePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  previewBadgeText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#374151',
  },
  previewTitleText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 10,
  },
  previewLocalityText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  previewPriceText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 10,
  },
  allDetailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  allDetailsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  allDetailsSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    marginBottom: 8,
  },
  detailsListWrap: {
    marginTop: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  detailRowLast: {
    borderBottomWidth: 0,
  },
  detailRowLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '400',
  },
  detailRowVal: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '500',
  },
  fullSubmitButton: {
    flex: 1,
    height: 50,
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
  submittedContainer: {
    flex: 1,
    backgroundColor: '#ECEEF5',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  submittedContent: {
    alignItems: 'center',
    width: '100%',
  },
  submittedSuccessCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  submittedTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginTop: 20,
    textAlign: 'center',
  },
  submittedSubtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 12,
  },
  submittedStatusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 22,
    width: '100%',
    marginTop: 28,
    gap: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  statusStepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  statusStepCircleActive: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusStepNumActive: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  statusStepCirclePending: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#EBF2FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusStepNumPending: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '600',
  },
  statusStepTextCol: {
    flex: 1,
  },
  statusStepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  statusStepSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  submittedDoneBtn: {
    marginTop: 24,
    width: '100%',
    height: 52,
    borderRadius: 16,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 2,
  },
  submittedDoneBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  occupancyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  occupancyCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1,
  },
  occupancyCardSelected: {
    borderColor: '#000000',
    backgroundColor: '#000000',
  },
  occupancyTitleSelected: {
    color: '#FFFFFF',
  },
  occupancySubSelected: {
    color: '#9CA3AF',
  },
  bedCapsuleSelected: {
    borderColor: '#9CA3AF',
    backgroundColor: '#000000',
  },
  bedCapsulesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    height: 22,
    marginBottom: 8,
  },
  bedCapsule: {
    width: 9,
    height: 20,
    borderRadius: 4.5,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    backgroundColor: '#FFFFFF',
  },
  occupancyTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
  occupancySub: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 3,
    textAlign: 'center',
  },
  noticeBanner: {
    backgroundColor: '#FEF9C3',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  noticeBannerText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#854D0E',
    fontWeight: '400',
  },
  roomTabsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  roomTabPill: {
    paddingHorizontal: 20,
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
  roomTabPillActive: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  roomTabPillText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  roomTabPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  roomCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
    marginBottom: 20,
  },
  roomCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  roomCardSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 3,
    marginBottom: 14,
  },
  roomFieldGroup: {
    marginTop: 14,
  },
  roomFieldLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 8,
  },
  roomTextInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 48,
    fontSize: 14,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  roomToggleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    height: 48,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 12,
  },
  roomToggleText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#111827',
  },
  foodToggleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    height: 52,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    elevation: 1,
  },
  foodToggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  facilitiesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    elevation: 1,
  },
  facilitiesCardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  facilitiesCardSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: -8,
    marginBottom: 14,
    lineHeight: 17,
  },
  facilitiesFieldLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 8,
  },
  optionalText: {
    color: '#9CA3AF',
    fontWeight: '400',
  },
  innerToggleRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    height: 48,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 10,
  },
  innerToggleText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#111827',
  },
  facilitiesTextArea: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    minHeight: 90,
    fontSize: 14,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
});
