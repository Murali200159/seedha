import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { ChevronLeft, Calendar, Clock, MapPin, CheckCircle2, CalendarPlus, Navigation } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import type { Property } from '../types';

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM',
];

const getDates = () => {
  const dates = [];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  for (let i = 1; i <= 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push({
      day: days[d.getDay()],
      date: d.getDate(),
      month: months[d.getMonth()],
      full: d.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    });
  }
  return dates;
};

type Step = 'date' | 'time' | 'confirm' | 'success';

export default function BookVisitScreen() {
  const { currentScreen, pop } = useApp();
  const property = currentScreen.params?.property as Property;
  const [step, setStep] = useState<Step>('date');
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const dates = getDates();

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep('success'); }, 1200);
  };

  if (step === 'success') {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successBadgeCircle}>
          <CheckCircle2 size={40} color="#16A34A" />
        </View>
        <Text style={styles.successTitle}>Visit Confirmed!</Text>
        <Text style={styles.successSubtitle}>
          Your visit has been scheduled. You'll receive a confirmation on your phone.
        </Text>

        <View style={styles.confirmationCard}>
          <View style={styles.rowCenter}>
            <Image source={{ uri: property.image }} style={styles.propertyThumb} />
            <View style={styles.propertyMeta}>
              <Text style={styles.propertyTitle}>{property.title}</Text>
              <View style={styles.locationRow}>
                <MapPin size={11} color="#9CA3AF" />
                <Text style={styles.locationText}>{property.location}</Text>
              </View>
            </View>
          </View>
          <View style={styles.visitTimeDetails}>
            <View style={styles.rowCenter}>
              <Calendar size={14} color="#2260FF" />
              <Text style={styles.visitTimeText}>{dates[selectedDate!]?.full}</Text>
            </View>
            <View style={[styles.rowCenter, { marginTop: 4 }]}>
              <Clock size={14} color="#2260FF" />
              <Text style={styles.visitTimeText}>{selectedTime}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity onPress={pop} style={styles.backButton} activeOpacity={0.8}>
          <Text style={styles.backButtonText}>Back to Property</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={step === 'date' ? pop : () => setStep(step === 'confirm' ? 'time' : 'date')}
          style={styles.backCircle}
          activeOpacity={0.8}
        >
          <ChevronLeft size={20} color="#111827" strokeWidth={2.5} />
        </TouchableOpacity>
        <View style={styles.headerColumn}>
          <Text style={styles.headerTitle}>Book a Visit</Text>
          <Text style={styles.headerSub}>{property.title}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
        {step === 'date' && (
          <View style={styles.stepSection}>
            <Text style={styles.stepTitle}>Select a Date</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateScroll}>
              {dates.map((d, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => setSelectedDate(i)}
                  style={[styles.dateCard, selectedDate === i ? styles.selectedDateCard : styles.unselectedDateCard]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.dayText, selectedDate === i ? styles.selectedText : styles.unselectedText]}>{d.day}</Text>
                  <Text style={[styles.dateNumber, selectedDate === i ? styles.selectedText : styles.unselectedText]}>{d.date}</Text>
                  <Text style={[styles.monthText, selectedDate === i ? styles.selectedText : styles.unselectedText]}>{d.month}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {step === 'time' && (
          <View style={styles.stepSection}>
            <Text style={styles.stepTitle}>Select a Time Slot</Text>
            <Text style={styles.selectedDateSub}>{dates[selectedDate!]?.full}</Text>
            <View style={styles.timeGrid}>
              {timeSlots.map(time => (
                <TouchableOpacity
                  key={time}
                  onPress={() => setSelectedTime(time)}
                  style={[styles.timeSlotCard, selectedTime === time ? styles.selectedDateCard : styles.unselectedDateCard]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.timeSlotText, selectedTime === time ? styles.selectedText : styles.unselectedText]}>{time}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {step === 'confirm' && (
          <View style={styles.stepSection}>
            <Text style={styles.stepTitle}>Confirm Your Visit</Text>
            <View style={styles.confirmCard}>
              <Image source={{ uri: property.image }} style={styles.confirmImage} />
              <View style={styles.confirmBody}>
                <Text style={styles.propertyTitle}>{property.title}</Text>
                <Text style={styles.locationText}>{property.location}</Text>
                <View style={styles.confirmTimeRow}>
                  <Text style={styles.visitTimeText}>
                    {dates[selectedDate!]?.day}, {dates[selectedDate!]?.date} {dates[selectedDate!]?.month} at {selectedTime}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.footerContainer}>
        <TouchableOpacity
          disabled={(step === 'date' && selectedDate === null) || (step === 'time' && !selectedTime) || loading}
          onPress={() => {
            if (step === 'date') setStep('time');
            else if (step === 'time') setStep('confirm');
            else handleConfirm();
          }}
          style={[
            styles.submitButton,
            ((step === 'date' && selectedDate === null) || (step === 'time' && !selectedTime)) ? styles.disabledButton : null,
          ]}
          activeOpacity={0.9}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>{step === 'confirm' ? 'Confirm Visit' : 'Continue'}</Text>
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
  backCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },
  headerColumn: {
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  headerSub: {
    fontSize: 11,
    color: '#6B7280',
  },
  scrollBody: {
    flex: 1,
    paddingHorizontal: 16,
  },
  stepSection: {
    paddingVertical: 12,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  selectedDateSub: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
  },
  dateScroll: {
    gap: 8,
  },
  dateCard: {
    width: 60,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  selectedDateCard: {
    backgroundColor: '#2260FF',
  },
  unselectedDateCard: {
    backgroundColor: '#FFFFFF',
    elevation: 1,
  },
  dayText: {
    fontSize: 11,
    fontWeight: '500',
  },
  dateNumber: {
    fontSize: 18,
    fontWeight: '800',
    marginVertical: 2,
  },
  monthText: {
    fontSize: 10,
    fontWeight: '500',
  },
  selectedText: {
    color: '#FFFFFF',
  },
  unselectedText: {
    color: '#374151',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlotCard: {
    width: '31%',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  timeSlotText: {
    fontSize: 13,
    fontWeight: '600',
  },
  confirmCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
  },
  confirmImage: {
    width: '100%',
    height: 140,
  },
  confirmBody: {
    padding: 14,
  },
  propertyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  locationText: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  confirmTimeRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  footerContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  submitButton: {
    height: 48,
    borderRadius: 14,
    backgroundColor: '#2260FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  submitButtonText: {
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
  },
  confirmationCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginTop: 20,
    elevation: 2,
  },
  propertyThumb: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  propertyMeta: {
    marginLeft: 10,
    flex: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  visitTimeDetails: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  visitTimeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 6,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#2260FF',
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
