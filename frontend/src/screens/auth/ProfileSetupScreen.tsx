import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { ChevronLeft, User, Mail, MapPin, Camera } from 'lucide-react-native';
import { useApp } from '../../context/AppContext';

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
          <ChevronLeft size={20} color="#111827" strokeWidth={2.5} />
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
              <User size={32} color="#2260FF" />
              <View style={styles.cameraCircle}>
                <Camera size={12} color="white" />
              </View>
            </View>
          </View>

          {/* Full Name */}
          <Text style={styles.inputLabel}>Full Name *</Text>
          <View style={styles.inputRow}>
            <User size={16} color="#9CA3AF" />
            <TextInput
              style={styles.textInput}
              placeholder="Enter your full name"
              placeholderTextColor="#9CA3AF"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Email */}
          <Text style={styles.inputLabel}>Email Address (optional)</Text>
          <View style={styles.inputRow}>
            <Mail size={16} color="#9CA3AF" />
            <TextInput
              style={styles.textInput}
              placeholder="Enter email address"
              placeholderTextColor="#9CA3AF"
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
            <MapPin size={16} color={city ? '#2260FF' : '#9CA3AF'} />
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
    backgroundColor: '#EFF6FF',
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
    backgroundColor: '#2260FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 6,
    marginTop: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    height: 48,
    paddingHorizontal: 14,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    marginLeft: 10,
  },
  selectText: {
    flex: 1,
    fontSize: 14,
    color: '#9CA3AF',
    marginLeft: 10,
  },
  selectedText: {
    color: '#111827',
  },
  continueButton: {
    height: 50,
    borderRadius: 16,
    backgroundColor: '#2260FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  disabledButton: {
    backgroundColor: '#C7D5FF',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    alignSelf: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  cityRow: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 6,
    backgroundColor: '#F9FAFB',
  },
  selectedCityRow: {
    backgroundColor: '#EFF6FF',
  },
  cityName: {
    fontSize: 14,
    color: '#111827',
  },
  selectedCityName: {
    fontWeight: '700',
    color: '#2260FF',
  },
});
