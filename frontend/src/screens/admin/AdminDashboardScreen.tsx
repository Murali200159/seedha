import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  ShieldCheck,
  House,
  KeyRound,
  Building2,
  Shield,
  Landmark,
  FileSignature,
  UserCheck,
  ChevronRight,
  LogOut,
  Clock,
  CheckCircle2,
  Filter,
} from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import type { AdminCategory, AdminItem } from '../../types';
import colors from '../../theme/colors';

const queueTabs: { id: AdminCategory | 'all'; label: string; icon: any }[] = [
  { id: 'all', label: 'All Incoming', icon: Filter },
  { id: 'flat_building', label: 'Flat / Building', icon: House },
  { id: 'rent', label: 'Rent Details', icon: KeyRound },
  { id: 'commercial', label: 'Commercial Space', icon: Building2 },
  { id: 'property_management', label: 'Property Mgmt', icon: Shield },
  { id: 'home_loan', label: 'Home Loans', icon: Landmark },
  { id: 'rental_agreement', label: 'Rental Agreements', icon: FileSignature },
  { id: 'owner_background', label: 'Owner Background', icon: UserCheck },
];

export default function AdminDashboardScreen() {
  const { adminRequests, push, logoutAdmin, setTab } = useApp();
  const [selectedTab, setSelectedTab] = useState<AdminCategory | 'all'>('all');

  const filteredRequests = adminRequests.filter(req => {
    if (selectedTab === 'all') return true;
    return req.category === selectedTab;
  });

  const getCategoryMeta = (cat: AdminCategory) => {
    switch (cat) {
      case 'flat_building':
        return { label: 'Flat/Building', color: colors.primary, bg: colors.primaryBg, icon: House };
      case 'rent':
        return { label: 'Rent', color: colors.secondary, bg: colors.secondaryBg, icon: KeyRound };
      case 'commercial':
        return { label: 'Commercial', color: colors.accent, bg: colors.accentBg, icon: Building2 };
      case 'property_management':
        return { label: 'Property Mgmt', color: colors.secondary, bg: colors.secondaryBg, icon: Shield };
      case 'home_loan':
        return { label: 'Home Loan', color: colors.primary, bg: colors.tertiaryBg, icon: Landmark };
      case 'rental_agreement':
        return { label: 'Rental Agreement', color: colors.accent, bg: colors.accentBg, icon: FileSignature };
      case 'owner_background':
        return { label: 'Owner BG Check', color: colors.primary, bg: colors.primaryBg, icon: UserCheck };
    }
  };

  const getStatusBadge = (item: AdminItem) => {
    if (item.status === 'published' || item.status === 'sent_to_user' || item.status === 'sent_digitally' || item.status === 'user_contacted' || item.status === 'owner_contacted') {
      return { text: 'COMPLETED', color: colors.secondary, bg: colors.secondaryBg };
    }
    if (item.status === 'rejected_unserviceable') {
      return { text: 'REJECTED', color: colors.danger, bg: colors.dangerBg };
    }
    if (item.stage > 0) {
      return { text: 'IN PROGRESS', color: colors.accent, bg: colors.accentBg };
    }
    return { text: 'PENDING CHECK', color: colors.primary, bg: colors.tertiaryBg };
  };

  const handleExitAdmin = () => {
    logoutAdmin();
    setTab('home');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.shieldBadge}>
            <ShieldCheck size={18} color={colors.textWhite} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Admin Operations</Text>
            <Text style={styles.headerSub}>Central Review Hub · 7 Queues</Text>
          </View>
        </View>

        <TouchableOpacity onPress={handleExitAdmin} style={styles.exitBtn} activeOpacity={0.8}>
          <LogOut size={16} color={colors.primary} />
          <Text style={styles.exitBtnText}>Exit Admin</Text>
        </TouchableOpacity>
      </View>

      {/* Metrics Banner */}
      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricVal}>{adminRequests.length}</Text>
          <Text style={styles.metricLabel}>Total Received</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={[styles.metricVal, { color: colors.accent }]}>
            {adminRequests.filter(r => r.stage === 0).length}
          </Text>
          <Text style={styles.metricLabel}>Pending Check</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={[styles.metricVal, { color: colors.secondary }]}>
            {adminRequests.filter(r => r.stage > 0).length}
          </Text>
          <Text style={styles.metricLabel}>Actioned</Text>
        </View>
      </View>

      {/* 7 Queues Horizontal Tab Bar */}
      <View style={styles.tabsSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {queueTabs.map(tab => {
            const count = tab.id === 'all'
              ? adminRequests.length
              : adminRequests.filter(r => r.category === tab.id).length;
            const isSelected = selectedTab === tab.id;
            const Icon = tab.icon;

            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setSelectedTab(tab.id)}
                style={[styles.tabChip, isSelected && styles.tabChipActive]}
                activeOpacity={0.8}
              >
                <Icon size={13} color={isSelected ? colors.textWhite : colors.primary} />
                <Text style={[styles.tabChipText, isSelected && styles.tabChipTextActive]}>
                  {tab.label}
                </Text>
                <View style={[styles.tabCountBadge, isSelected && styles.tabCountBadgeActive]}>
                  <Text style={[styles.tabCountText, isSelected && styles.tabCountTextActive]}>
                    {count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Submissions List */}
      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        <View style={styles.listPadding}>
          <View style={styles.listHeaderRow}>
            <Text style={styles.listTitle}>
              {selectedTab === 'all' ? 'All Received Submissions' : `Queue: ${queueTabs.find(t => t.id === selectedTab)?.label}`}
            </Text>
            <Text style={styles.listCount}>{filteredRequests.length} Requests</Text>
          </View>

          {filteredRequests.map(item => {
            const meta = getCategoryMeta(item.category);
            const statusBadge = getStatusBadge(item);
            const Icon = meta.icon;

            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => push({ name: 'adminReview', params: { item } })}
                style={styles.requestCard}
                activeOpacity={0.88}
              >
                <View style={styles.cardTopRow}>
                  <View style={[styles.catBadge, { backgroundColor: meta.bg }]}>
                    <Icon size={12} color={meta.color} />
                    <Text style={[styles.catBadgeText, { color: meta.color }]}>{meta.label}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusBadge.bg }]}>
                    <Text style={[styles.statusBadgeText, { color: statusBadge.color }]}>
                      {statusBadge.text}
                    </Text>
                  </View>
                </View>

                <Text style={styles.requestTitle}>{item.title}</Text>
                <Text style={styles.requestSubtitle}>{item.subtitle}</Text>

                <View style={styles.cardDetailsRow}>
                  <Text style={styles.detailItemText}>👤 {item.submittedBy}</Text>
                  <Text style={styles.detailItemText}>📍 {item.location}</Text>
                </View>

                <View style={styles.cardFooter}>
                  <View style={styles.timeRow}>
                    <Clock size={12} color={colors.textMuted} />
                    <Text style={styles.timeText}>{item.date}</Text>
                  </View>
                  <View style={styles.actionPrompt}>
                    <Text style={styles.actionPromptText}>Review & Process</Text>
                    <ChevronRight size={14} color={colors.primary} />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  shieldBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  headerSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  exitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSoft,
  },
  exitBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  metricsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 14,
    gap: 10,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  metricVal: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  metricLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
    fontWeight: '600',
  },
  tabsSection: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  tabsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tabChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  tabChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  tabChipTextActive: {
    color: colors.textWhite,
  },
  tabCountBadge: {
    backgroundColor: colors.tertiaryBg,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
  },
  tabCountBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  tabCountText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
  },
  tabCountTextActive: {
    color: colors.textWhite,
  },
  scrollArea: {
    flex: 1,
  },
  listPadding: {
    padding: 16,
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  listCount: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  requestCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  catBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  catBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  requestTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 3,
  },
  requestSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  cardDetailsRow: {
    flexDirection: 'row',
    gap: 14,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    marginBottom: 8,
  },
  detailItemText: {
    fontSize: 11,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  actionPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  actionPromptText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
});
