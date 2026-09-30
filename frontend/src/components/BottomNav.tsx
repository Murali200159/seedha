import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, Compass, Plus, CreditCard, UserRound } from 'lucide-react-native';
import { useApp } from '../context/AppContext';

export default function BottomNav() {
  const { activeTab, setTab } = useApp();

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
            color={activeTab === 'home' ? '#2260FF' : '#9CA3AF'}
            strokeWidth={activeTab === 'home' ? 2.4 : 1.8}
          />
          <Text style={[styles.tabLabel, { color: activeTab === 'home' ? '#2260FF' : '#9CA3AF' }]}>
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
            color={activeTab === 'explore' ? '#2260FF' : '#9CA3AF'}
            strokeWidth={activeTab === 'explore' ? 2.4 : 1.8}
          />
          <Text style={[styles.tabLabel, { color: activeTab === 'explore' ? '#2260FF' : '#9CA3AF' }]}>
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
            <Plus size={24} color="#FFFFFF" strokeWidth={2.5} />
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
            color={activeTab === 'payments' ? '#2260FF' : '#9CA3AF'}
            strokeWidth={activeTab === 'payments' ? 2.4 : 1.8}
          />
          <Text style={[styles.tabLabel, { color: activeTab === 'payments' ? '#2260FF' : '#9CA3AF' }]}>
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
            color={activeTab === 'profile' ? '#2260FF' : '#9CA3AF'}
            strokeWidth={activeTab === 'profile' ? 2.4 : 1.8}
          />
          <Text style={[styles.tabLabel, { color: activeTab === 'profile' ? '#2260FF' : '#9CA3AF' }]}>
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
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingBottom: 6,
    paddingTop: 4,
    shadowColor: '#0F172A',
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
    fontSize: 11,
    fontWeight: '600',
    marginTop: 3,
    letterSpacing: -0.1,
  },
  activeDot: {
    position: 'absolute',
    top: 2,
    width: 20,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#2260FF',
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
    backgroundColor: '#2260FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#2260FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  postLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
});
