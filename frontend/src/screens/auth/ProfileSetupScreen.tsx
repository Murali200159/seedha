import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { ChevronLeft, User, Mail, MapPin, Camera } from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import colors from '../../theme/colors';

const cities = ['Hyderabad', 'Vizag', 'Vijayawada', 'Bengaluru', 'Chennai', 'Mumbai', 'Pune', 'Delhi'];

export default function ProfileSetupScreen() {
  const { currentScreen, push, pop } = useApp();
  const { phone = '' } = (currentScreen.params ?? {}) as { phone?: string };

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [showCityPicker, setShowCityPicker] = useState(false);

  const canContinue = name.trim().length >= 2;

  const handleContinue = () => {
    if (!canContinue) return;
    push({ name: 'propertyIntent', params: { name, email, phone, city } });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <TouchableOpacity onPress={pop} style={styles.backCircle} activeOpacity={0.8}>
          <ChevronLeft size={20} color={colors.primary} strokeWidth={2.5} />
        </TouchableOpacity>

        <Text style={styles.stepTag}>STEP 1 OF 3</Text>
        <Text style={styles.mainTitle}>Set up your profile</Text>
        <Text style={styles.subTitle}>Tell us a little about yourself to personalise Seedha Properties.</Text>
      </View>

      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        <View style={styles.formPadding}>
          {/* Avatar Icon */}
          <View style={styles.avatarCenter}>
            <View style={styles.avatarCircle}>
              <User size={32} color={colors.primary} />
              <View style={styles.cameraCircle}>
                <Camera size={12} color={colors.textWhite} />
              </View>
            </View>
          </View>

          {/* Full Name */}
          <Text style={styles.inputLabel}>Full Name *</Text>
          <View style={styles.inputRow}>
            <User size={16} color={colors.textMuted} />
            <TextInput
              style={styles.textInput}
              placeholder="Enter your full name"
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Email */}
          <Text style={styles.inputLabel}>Email Address (optional)</Text>
          <View style={styles.inputRow}>
            <Mail size={16} color={colors.textMuted} />
            <TextInput
              style={styles.textInput}
              placeholder="Enter email address"
              placeholderTextColor={colors.textMuted}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* City Selector */}
          <Text style={styles.inputLabel}>Preferred City (optional)</Text>
          <TouchableOpacity
            onPress={() => setShowCityPicker(true)}
            style={styles.inputRow}
            activeOpacity={0.8}
          >
            <MapPin size={16} color={city ? colors.primary : colors.textMuted} />
            <Text style={[styles.selectText, city ? styles.selectedText : null]}>
              {city || 'Select your city'}
            </Text>
          </TouchableOpacity>

          {/* Continue CTA */}
          <TouchableOpacity
            onPress={handleContinue}
            disabled={!canContinue}
            style={[styles.continueButton, !canContinue ? styles.disabledButton : null]}
            activeOpacity={0.9}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => push({ name: 'propertyIntent', params: { name: '', email: '', phone, city: '' } })}
            style={styles.skipButton}
          >
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* City Picker Modal */}
      <Modal visible={showCityPicker} transparent animationType="slide" onRequestClose={() => setShowCityPicker(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowCityPicker(false)}>
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Select City</Text>
            {cities.map(c => (
              <TouchableOpacity
                key={c}
                onPress={() => { setCity(c); setShowCityPicker(false); }}
                style={[styles.cityRow, city === c ? styles.selectedCityRow : null]}
              >
                <Text style={[styles.cityName, city === c ? styles.selectedCityName : null]}>{c}</Text>
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
    backgroundColor: colors.surface,
  },
  topSection: {
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  backCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
    marginBottom: 16,
  },
  stepTag: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.secondary,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.primary,
  },
  subTitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  scrollArea: {
    flex: 1,
  },
  formPadding: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  avatarCenter: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.secondaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cameraCircle: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
    marginTop: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.tertiary,
    borderRadius: 16,
    height: 48,
    paddingHorizontal: 14,
    backgroundColor: colors.surface,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: colors.primary,
    marginLeft: 10,
    borderWidth: 0,
    outlineWidth: 0,
    ...( { outlineStyle: 'none' } as any ),
  },
  selectText: {
    flex: 1,
    fontSize: 14,
    color: colors.textMuted,
    marginLeft: 10,
  },
  selectedText: {
    color: colors.primary,
  },
  continueButton: {
    height: 50,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  disabledButton: {
    backgroundColor: colors.tertiaryDark,
    opacity: 0.5,
  },
  continueButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textWhite,
  },
  skipButton: {
    marginTop: 14,
    alignItems: 'center',
  },
  skipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
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
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
  },
  cityRow: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 6,
    backgroundColor: colors.surfaceSoft,
  },
  selectedCityRow: {
    backgroundColor: colors.secondaryBg,
  },
  cityName: {
    fontSize: 14,
    color: colors.primary,
  },
  selectedCityName: {
    fontWeight: '700',
    color: colors.primary,
  },
});
