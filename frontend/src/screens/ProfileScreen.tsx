import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import {
  ChevronRight,
  Heart,
  Calendar,
  FileText,
  Landmark,
  Building2,
  Bell,
  CreditCard,
  Shield,
  Lock,
  HelpCircle,
  LogOut,
  Edit3,
  Camera,
  Phone,
  Mail,
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';

const menuSections = [
  {
    title: 'My Activity',
    items: [
      { icon: Heart, label: 'Saved Properties', badge: '2', screen: 'savedProperties' },
      { icon: Calendar, label: 'My Visits', badge: '1', screen: null },
      { icon: FileText, label: 'My Agreements', badge: null, screen: 'rentalAgreement' },
      { icon: Landmark, label: 'My Loans', badge: null, screen: 'homeLoan' },
      { icon: Building2, label: 'My Properties', badge: '3', screen: 'myProperty' },
    ],
  },
  {
    title: 'Account',
    items: [
      { icon: Bell, label: 'Notifications', badge: '3', screen: 'notifications' },
      { icon: CreditCard, label: 'Payments', badge: null, screen: 'payments' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: HelpCircle, label: 'Help & Support', badge: null, screen: null },
      { icon: Shield, label: 'Privacy Policy', badge: null, screen: null },
      { icon: Lock, label: 'Security Settings', badge: null, screen: null },
    ],
  },
];

export default function ProfileScreen() {
  const { push } = useApp();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        <View style={styles.headerPadding}>
          <Text style={styles.pageTitle}>Profile</Text>

          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.userRow}>
              <View style={styles.avatarWrapper}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format' }}
                  style={styles.avatarImage}
                />
                <TouchableOpacity style={styles.cameraCircle}>
                  <Camera size={11} color="white" />
                </TouchableOpacity>
              </View>
              <View style={styles.userInfoCol}>
                <View style={styles.nameRow}>
                  <View>
                    <Text style={styles.userName}>Rahul Sharma</Text>
                    <View style={styles.verifiedRow}>
                      <View style={styles.greenDot} />
                      <Text style={styles.verifiedText}>Verified Account</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.editButton}>
                    <Edit3 size={15} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                <View style={styles.contactRow}>
                  <Phone size={11} color="#9CA3AF" />
                  <Text style={styles.contactText}>+91 98765 43210</Text>
                </View>
                <View style={[styles.contactRow, { marginTop: 2 }]}>
                  <Mail size={11} color="#9CA3AF" />
                  <Text style={styles.contactText}>rahul@email.com</Text>
                </View>
              </View>
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
              {[
                { value: '3', label: 'Properties' },
                { value: '2', label: 'Saved' },
                { value: '1', label: 'Visits' },
              ].map(({ value, label }) => (
                <View key={label} style={styles.statCell}>
                  <Text style={styles.statVal}>{value}</Text>
                  <Text style={styles.statLabel}>{label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Menu Sections */}
        <View style={styles.menuPadding}>
          {menuSections.map(section => (
            <View key={section.title} style={styles.sectionMargin}>
              <Text style={styles.sectionHeader}>{section.title}</Text>
              <View style={styles.menuCard}>
                {section.items.map(({ icon: Icon, label, badge, screen }) => (
                  <TouchableOpacity
                    key={label}
                    onPress={() => screen && push({ name: screen as any })}
                    style={styles.menuRow}
                    activeOpacity={0.8}
                  >
                    <View style={styles.menuIconCircle}>
                      <Icon size={17} color="#6B7280" />
                    </View>
                    <Text style={styles.menuText}>{label}</Text>
                    {badge ? (
                      <View style={styles.badgeCircle}>
                        <Text style={styles.badgeText}>{badge}</Text>
                      </View>
                    ) : null}
                    <ChevronRight size={15} color="#9CA3AF" />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.logoutButton} activeOpacity={0.8}>
            <View style={styles.logoutIconBox}>
              <LogOut size={17} color="#DC2626" />
            </View>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          <Text style={styles.versionText}>Seedha Properties v1.0.0 · Made with ❤️ in India</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECEEF5',
  },
  scrollArea: {
    flex: 1,
  },
  headerPadding: {
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    elevation: 2,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
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
  },
  userInfoCol: {
    flex: 1,
    marginLeft: 14,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 4,
  },
  verifiedText: {
    fontSize: 11,
    color: '#6B7280',
  },
  editButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ECEEF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  contactText: {
    fontSize: 11,
    color: '#6B7280',
    marginLeft: 4,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
  },
  statVal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  menuPadding: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
  },
  sectionMargin: {
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 1,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#ECEEF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: '#111827',
    marginLeft: 12,
  },
  badgeCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#2260FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 8,
  },
  logoutIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
    marginLeft: 12,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 16,
  },
});
