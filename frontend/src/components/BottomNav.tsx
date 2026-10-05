import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, Compass, Plus, CreditCard, UserRound } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import colors from '../theme/colors';

export default function BottomNav() {
  const { activeTab, setTab } = useApp();

  const getTabColor = (tab: string) => (activeTab === tab ? colors.primary : colors.textMuted);

  return (
    <View style={styles.container}>
      <View style={styles.navRow}>
        {/* Home */}
        <TouchableOpacity
          onPress={() => setTab('home')}
          style={styles.tabButton}
          activeOpacity={0.7}
        >
          <Home
            size={22}
            color={getTabColor('home')}
            strokeWidth={activeTab === 'home' ? 2.4 : 1.8}
          />
          <Text style={[styles.tabLabel, { color: getTabColor('home') }]}>
            Home
          </Text>
          {activeTab === 'home' && <View style={styles.activeDot} />}
        </TouchableOpacity>

        {/* Explore */}
        <TouchableOpacity
          onPress={() => setTab('explore')}
          style={styles.tabButton}
          activeOpacity={0.7}
        >
          <Compass
            size={22}
            color={getTabColor('explore')}
            strokeWidth={activeTab === 'explore' ? 2.4 : 1.8}
          />
          <Text style={[styles.tabLabel, { color: getTabColor('explore') }]}>
            Explore
          </Text>
          {activeTab === 'explore' && <View style={styles.activeDot} />}
        </TouchableOpacity>

        {/* Post Button */}
        <TouchableOpacity
          onPress={() => setTab('post')}
          style={styles.postTabContainer}
          activeOpacity={0.8}
        >
          <View style={styles.postButton}>
            <Plus size={24} color={colors.textWhite} strokeWidth={2.5} />
          </View>
          <Text style={styles.postLabel}>Post</Text>
        </TouchableOpacity>

        {/* Payments */}
        <TouchableOpacity
          onPress={() => setTab('payments')}
          style={styles.tabButton}
          activeOpacity={0.7}
        >
          <CreditCard
            size={22}
            color={getTabColor('payments')}
            strokeWidth={activeTab === 'payments' ? 2.4 : 1.8}
          />
          <Text style={[styles.tabLabel, { color: getTabColor('payments') }]}>
            Payments
          </Text>
          {activeTab === 'payments' && <View style={styles.activeDot} />}
        </TouchableOpacity>

        {/* Profile */}
        <TouchableOpacity
          onPress={() => setTab('profile')}
          style={styles.tabButton}
          activeOpacity={0.7}
        >
          <UserRound
            size={22}
            color={getTabColor('profile')}
            strokeWidth={activeTab === 'profile' ? 2.4 : 1.8}
          />
          <Text style={[styles.tabLabel, { color: getTabColor('profile') }]}>
            Profile
          </Text>
          {activeTab === 'profile' && <View style={styles.activeDot} />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.tertiary,
    paddingBottom: 6,
    paddingTop: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    position: 'relative',
  },
  tabLabel: {
    fontFamily: colors.fontFamily,
    fontSize: 11,
    fontWeight: '500',
    marginTop: 3,
  },
  activeDot: {
    position: 'absolute',
    top: 2,
    width: 20,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  postTabContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    marginTop: -14,
  },
  postButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.surface,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  postLabel: {
    fontFamily: colors.fontFamily,
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
    marginTop: 2,
  },
});
