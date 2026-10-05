import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronLeft, MessageCircle, Calendar, Building2, Landmark, CheckCircle2 } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';

const notifications = [
  { id: '1', type: 'message', icon: MessageCircle, color: colors.primary, bg: colors.tertiaryBg, title: 'New inquiry from Suresh Babu', body: 'Is this property still available?', time: '2 min ago', unread: true },
  { id: '2', type: 'visit', icon: Calendar, color: colors.secondary, bg: colors.tertiaryBg, title: 'Visit Reminder', body: 'Your visit to 3 BHK, Madhurawada is tomorrow at 10 AM', time: '1 hr ago', unread: true },
  { id: '3', type: 'property', icon: Building2, color: colors.primary, bg: colors.tertiaryBg, title: 'New properties in Madhapur', body: '5 new properties match your search criteria', time: '3 hr ago', unread: true },
  { id: '4', type: 'loan', icon: Landmark, color: colors.accent, bg: colors.tertiaryBg, title: 'Loan offer updated', body: 'SBI reduced rates to 8.35%. Check eligibility now!', time: '1 day ago', unread: false },
  { id: '5', type: 'verified', icon: CheckCircle2, color: colors.secondary, bg: colors.tertiaryBg, title: 'Property verified', body: 'Your listing at Jubilee Hills has been verified', time: '2 days ago', unread: false },
];

export default function NotificationsScreen() {
  const { pop } = useApp();

  const unread = notifications.filter(n => n.unread);
  const read = notifications.filter(n => !n.unread);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={pop} style={styles.backCircle} activeOpacity={0.8}>
            <ChevronLeft size={20} color={colors.textPrimary} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.markReadText}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        {unread.length > 0 && (
          <View style={styles.sectionPadding}>
            <Text style={styles.sectionHeading}>New · {unread.length}</Text>
            <View style={styles.listWrap}>
              {unread.map(notif => {
                const Icon = notif.icon;
                return (
                  <View key={notif.id} style={[styles.notifCard, styles.unreadCard]}>
                    <View style={[styles.iconBox, { backgroundColor: notif.bg }]}>
                      <Icon size={18} color={notif.color} />
                    </View>
                    <View style={styles.cardContent}>
                      <Text style={styles.notifTitle}>{notif.title}</Text>
                      <Text style={styles.notifBody}>{notif.body}</Text>
                      <Text style={styles.notifTime}>{notif.time}</Text>
                    </View>
                    <View style={styles.unreadDot} />
                  </View>
                );
              })}
            </View>
          </View>
        )}

        <View style={styles.sectionPadding}>
          <Text style={styles.sectionHeading}>Earlier</Text>
          <View style={styles.listWrap}>
            {read.map(notif => {
              const Icon = notif.icon;
              return (
                <View key={notif.id} style={styles.notifCard}>
                  <View style={[styles.iconBox, { backgroundColor: notif.bg }]}>
                    <Icon size={18} color={notif.color} />
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={styles.readTitle}>{notif.title}</Text>
                    <Text style={styles.notifBody}>{notif.body}</Text>
                    <Text style={styles.notifTime}>{notif.time}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backCircle: {
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
  markReadText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  scrollArea: {
    flex: 1,
  },
  sectionPadding: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  listWrap: {
    gap: 8,
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 1,
  },
  unreadCard: {
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
    marginLeft: 10,
  },
  notifTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  readTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  notifBody: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  notifTime: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 4,
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginTop: 4,
  },
});
