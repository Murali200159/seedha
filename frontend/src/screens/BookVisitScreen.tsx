import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { ChevronLeft, Calendar, Clock, MapPin, CheckCircle2, CalendarPlus, Navigation, Star, ArrowRight } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import type { Property } from '../types';
import colors from '../theme/colors';

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
  const { currentScreen, pop, setTab } = useApp();
  const property = currentScreen.params?.property as Property;
  const [step, setStep] = useState<Step>('date');
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [ratingSubmitted, setRatingSubmitted] = useState<boolean>(false);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const dates = getDates();

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep('success'); }, 800);
  };

  if (step === 'success') {
    return (
      <ScrollView contentContainerStyle={styles.successContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.successBadgeCircle}>
          <CheckCircle2 size={40} color={colors.secondary} />
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
                <MapPin size={11} color={colors.textMuted} />
                <Text style={styles.locationText}>{property.location}</Text>
              </View>
            </View>
          </View>
          <View style={styles.visitTimeDetails}>
            <View style={styles.rowCenter}>
              <Calendar size={14} color={colors.primary} />
              <Text style={styles.visitTimeText}>{dates[selectedDate!]?.full}</Text>
            </View>
            <View style={[styles.rowCenter, { marginTop: 4 }]}>
              <Clock size={14} color={colors.primary} />
              <Text style={styles.visitTimeText}>{selectedTime}</Text>
            </View>
          </View>
        </View>

        {/* Optional Rating Component */}
        <View style={styles.ratingCard}>
          <Text style={styles.ratingTitle}>Rate Your Experience (Optional)</Text>
          <Text style={styles.ratingSub}>How was the scheduling and property selection flow?</Text>

          {/* Star selector */}
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map(star => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                activeOpacity={0.7}
                style={styles.starTouch}
              >
                <Star
                  size={26}
                  fill={star <= rating ? colors.warning : 'transparent'}
                  color={star <= rating ? colors.warning : colors.border}
                  strokeWidth={1.8}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Quick tags */}
          <View style={styles.tagsRow}>
            {['Smooth Booking', 'Great Location', 'Clear Details', 'Quick Process'].map(tag => (
              <TouchableOpacity
                key={tag}
                onPress={() => setSelectedTag(tag === selectedTag ? '' : tag)}
                style={[styles.rateTag, selectedTag === tag && styles.rateTagActive]}
                activeOpacity={0.8}
              >
                <Text style={[styles.rateTagText, selectedTag === tag && styles.rateTagTextActive]}>
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {ratingSubmitted ? (
            <View style={styles.ratingThankYou}>
              <CheckCircle2 size={16} color={colors.secondary} />
              <Text style={styles.ratingThankYouText}>Thank you for your rating!</Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => setRatingSubmitted(true)}
              disabled={rating === 0}
              style={[styles.submitRatingBtn, rating === 0 && { opacity: 0.5 }]}
              activeOpacity={0.85}
            >
              <Text style={styles.submitRatingBtnText}>Submit Rating</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity onPress={() => setTab('home')} style={styles.backHomeBtn} activeOpacity={0.85}>
            <Text style={styles.backHomeBtnText}>Back to Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={pop} style={styles.backPropertyBtn} activeOpacity={0.8}>
            <Text style={styles.backPropertyBtnText}>View Property</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
          <ChevronLeft size={20} color={colors.primary} strokeWidth={2.5} />
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
            <ActivityIndicator color={colors.textWhite} />
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
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: colors.background,
  },
  backCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
    borderWidth: 1,
    borderColor: colors.tertiary,
  },
  headerColumn: {
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  headerSub: {
    fontSize: 11,
    color: colors.textSecondary,
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
    color: colors.primary,
    marginBottom: 12,
  },
  selectedDateSub: {
    fontSize: 12,
    color: colors.textSecondary,
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
    backgroundColor: colors.primary,
  },
  unselectedDateCard: {
    backgroundColor: colors.surface,
    elevation: 1,
    borderWidth: 1,
    borderColor: colors.tertiary,
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
    color: colors.textWhite,
  },
  unselectedText: {
    color: colors.textSecondary,
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
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.tertiary,
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
    color: colors.primary,
  },
  locationText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  confirmTimeRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.tertiaryLight,
  },
  footerContainer: {
    padding: 16,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.tertiary,
  },
  submitButton: {
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: colors.tertiaryDark,
    opacity: 0.5,
  },
  submitButtonText: {
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
    backgroundColor: colors.secondaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  confirmationCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    marginTop: 20,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.tertiary,
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
    borderTopColor: colors.tertiaryLight,
  },
  visitTimeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 6,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
  },
  ratingTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  ratingSub: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  starTouch: {
    padding: 4,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 14,
  },
  rateTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rateTagActive: {
    backgroundColor: colors.primaryBg,
    borderColor: colors.primary,
  },
  rateTagText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  rateTagTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  submitRatingBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  submitRatingBtnText: {
    color: colors.textWhite,
    fontSize: 13,
    fontWeight: '700',
  },
  ratingThankYou: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.secondaryBg,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  ratingThankYouText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.secondary,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    marginBottom: 30,
    width: '100%',
  },
  backHomeBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backHomeBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textWhite,
  },
  backPropertyBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backPropertyBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
