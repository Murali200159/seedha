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
  ShieldCheck,
  Lock,
  HelpCircle,
  LogOut,
  Edit3,
  Camera,
  Phone,
  Mail,
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';

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
    title: 'Admin & Operations (Section 2)',
    items: [
      { icon: Shield, label: 'Admin Review Queues (7 Workflows)', badge: '7', screen: 'adminPortal' },
      { icon: ShieldCheck, label: 'Verify Owner Background', badge: null, screen: 'ownerVerification' },
      { icon: Building2, label: 'Property Management', badge: null, screen: 'propertyManagement' },
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
  const { push, user, isAdmin, signOut, isAuthenticated, requireAuth } = useApp();

  const displayName = user?.name || (isAuthenticated ? 'Verified User' : 'Guest User');
  const displayPhone = user?.phone || (isAuthenticated ? '+91 98765 43210' : 'No phone linked');
  const displayEmail = user?.email || (isAuthenticated ? 'user@seedhaproperties.com' : 'Guest Access Mode');
  const roleLabel = user?.role || (isAuthenticated ? 'USER' : 'GUEST');

  const handleMenuPress = (label: string, screen: string | null) => {
    if (!screen) return;
    if (!isAuthenticated && (screen === 'myProperty' || screen === 'savedProperties' || screen === 'rentalAgreement')) {
      requireAuth(undefined, { name: screen as any }, label);
      return;
    }
    push({ name: screen as any });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        <View style={styles.headerPadding}>
          <View style={styles.headerRow}>
            <Text style={styles.pageTitle}>Profile</Text>
            {isAdmin ? (
              <View style={styles.adminHeaderBadge}>
                <ShieldCheck size={14} color="#B45309" />
                <Text style={styles.adminHeaderBadgeText}>ADMIN ACTIVE</Text>
              </View>
            ) : null}
          </View>

          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.userRow}>
              <View style={styles.avatarWrapper}>
                <Image
                  source={{ uri: isAdmin
                    ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&auto=format'
                    : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format'
                  }}
                  style={styles.avatarImage}
                />
                <TouchableOpacity style={styles.cameraCircle}>
                  <Camera size={11} color={colors.textWhite} />
                </TouchableOpacity>
              </View>
              <View style={styles.userInfoCol}>
                <View style={styles.nameRow}>
                  <View>
                    <Text style={styles.userName}>{displayName}</Text>
                    <View style={styles.verifiedRow}>
                      <View style={[styles.greenDot, isAdmin && { backgroundColor: colors.gold }]} />
                      <Text style={[styles.verifiedText, isAdmin && { color: colors.gold }]}>
                        {isAdmin ? 'System Administrator' : 'Verified Customer'} ({roleLabel})
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.editButton}>
                    <Edit3 size={15} color={colors.secondary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.contactRow}>
                  <Phone size={11} color={colors.textMuted} />
                  <Text style={styles.contactText}>{displayPhone}</Text>
                </View>
                <View style={[styles.contactRow, { marginTop: 2 }]}>
                  <Mail size={11} color={colors.textMuted} />
                  <Text style={styles.contactText}>{displayEmail}</Text>
                </View>
              </View>
            </View>

            {/* Guest Banner if not authenticated */}
            {!isAuthenticated ? (
              <View style={styles.guestBannerBox}>
                <View style={styles.guestBannerTextCol}>
                  <Text style={styles.guestBannerHeading}>Guest Browsing Mode</Text>
                  <Text style={styles.guestBannerSub}>
                    Sign in with mobile OTP to post properties, view owner contacts, save favorites, and track applications.
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.signInBtn}
                  onPress={() => requireAuth(undefined, undefined, 'Access Full Profile')}
                  activeOpacity={0.85}
                >
                  <Text style={styles.signInBtnText}>Sign In with Mobile OTP</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            {/* Quick Login / Role Switcher for Testing */}
            <View style={styles.roleSwitchCard}>
              <Text style={styles.roleSwitchTitle}>Role & Auth Status: <Text style={{ color: colors.primary, fontWeight: '700' }}>{roleLabel}</Text></Text>
              <View style={styles.roleSwitchActions}>
                <TouchableOpacity
                  style={[styles.roleChip, isAdmin && styles.roleChipActive]}
                  onPress={() => push({ name: 'login' })}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.roleChipText, isAdmin && styles.roleChipTextActive]}>
                    {isAdmin ? '✓ Admin Mode' : 'Switch / Login as Admin'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.roleChip, !isAdmin && isAuthenticated && styles.roleChipActive]}
                  onPress={() => requireAuth(undefined, undefined, 'Sign In')}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.roleChipText, !isAdmin && isAuthenticated && styles.roleChipTextActive]}>
                    {!isAdmin && isAuthenticated ? '✓ User Mode' : 'Mobile OTP Login'}
                  </Text>
                </TouchableOpacity>
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
                    onPress={() => handleMenuPress(label, screen)}
                    style={styles.menuRow}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.menuIconCircle, screen === 'adminPortal' && { backgroundColor: '#FEF3C7' }]}>
                      <Icon size={17} color={screen === 'adminPortal' ? '#B45309' : colors.secondary} />
                    </View>
                    <Text style={[styles.menuText, screen === 'adminPortal' && { fontWeight: '700', color: colors.primary }]}>
                      {label}
                    </Text>
                    {badge ? (
                      <View style={[styles.badgeCircle, screen === 'adminPortal' && { backgroundColor: '#F59E0B' }]}>
                        <Text style={styles.badgeText}>{badge}</Text>
                      </View>
                    ) : null}
                    <ChevronRight size={15} color={colors.textMuted} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          {/* Operations & Administration */}
          <View style={styles.sectionMargin}>
            <Text style={styles.sectionHeader}>Operations & Administration</Text>
            <View style={styles.menuCard}>
              <TouchableOpacity
                onPress={() => push({ name: 'adminPortal' })}
                style={styles.adminRow}
                activeOpacity={0.8}
              >
                <View style={styles.adminIconCircle}>
                  <ShieldCheck size={18} color={colors.primary} />
                </View>
                <View style={styles.adminTextCol}>
                  <Text style={styles.adminTitle}>Admin Operations Portal</Text>
                  <Text style={styles.adminSubtitle}>
                    {isAdmin ? 'Active Session · Tap to manage queues' : 'Authorized Seedha staff only · Passcode required'}
                  </Text>
                </View>
                <View style={[styles.adminStatusBadge, isAdmin ? styles.adminStatusActive : styles.adminStatusSecure]}>
                  <Text style={[styles.adminStatusText, isAdmin && { color: colors.secondary }]}>
                    {isAdmin ? 'ACTIVE' : 'PORTAL'}
                  </Text>
                </View>
                <ChevronRight size={15} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => signOut()}
            activeOpacity={0.8}
          >
            <View style={styles.logoutIconBox}>
              <LogOut size={17} color={colors.accent} />
            </View>
            <Text style={styles.logoutText}>
              {isAuthenticated ? 'Logout' : 'Sign In / Register'}
            </Text>
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
    backgroundColor: colors.background,
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
    color: colors.textPrimary,
    marginBottom: 12,
  },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
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
    backgroundColor: colors.primary,
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
    color: colors.textPrimary,
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
    backgroundColor: colors.secondary,
    marginRight: 4,
  },
  verifiedText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  editButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.tertiaryBg,
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
    color: colors.textSecondary,
    marginLeft: 4,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
  },
  statVal: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
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
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 1,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.tertiaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: colors.textPrimary,
    marginLeft: 12,
  },
  badgeCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textWhite,
  },
  adminRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  adminIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminTextCol: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  adminTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  adminSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  adminStatusBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 6,
  },
  adminStatusActive: {
    backgroundColor: colors.secondaryBg,
  },
  adminStatusSecure: {
    backgroundColor: colors.tertiaryBg,
  },
  adminStatusText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentBg,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.tertiary,
  },
  logoutIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
    marginLeft: 12,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  adminHeaderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: colors.radiusSm,
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: 4,
  },
  adminHeaderBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#92400E',
    letterSpacing: 0.5,
  },
  roleSwitchCard: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: colors.radiusMd,
    padding: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  guestBannerBox: {
    backgroundColor: '#F8F6EE',
    borderWidth: 1,
    borderColor: '#D9C9B2',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  guestBannerTextCol: {
    marginBottom: 10,
  },
  guestBannerHeading: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    fontWeight: '700',
    color: '#2E3A2F',
    marginBottom: 3,
  },
  guestBannerSub: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11,
    color: '#687F5B',
    lineHeight: 16,
  },
  signInBtn: {
    backgroundColor: '#2E3A2F',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInBtnText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  roleSwitchTitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  roleSwitchActions: {
    flexDirection: 'row',
    gap: 8,
  },
  roleChip: {
    flex: 1,
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderRadius: colors.radiusSm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  roleChipActive: {
    backgroundColor: colors.primaryBg,
    borderColor: colors.primary,
  },
  roleChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  roleChipTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
});
