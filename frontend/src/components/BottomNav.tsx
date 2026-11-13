import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Home, Search, Plus, Heart, LayoutGrid } from 'lucide-react-native';
import { useApp } from '../context/AppContext';

export default function BottomNav() {
  const { activeTab, setTab, requireAuth } = useApp();

  const tabs = [
    { key: 'home', label: 'Home', Icon: Home },
    { key: 'explore', label: 'Search', Icon: Search },
    { key: 'post', label: 'Post', Icon: Plus, isSpecial: true },
    { key: 'saved', label: 'Saved', Icon: Heart },
    { key: 'profile', label: 'More', Icon: LayoutGrid },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.navRow}>
        {tabs.map((item) => {
          const isActive = activeTab === item.key;

          if (item.isSpecial) {
            return (
              <TouchableOpacity
                key={item.key}
                onPress={() => requireAuth(undefined, { name: 'postProperty' }, 'Post Property')}
                style={styles.postTabContainer}
                activeOpacity={0.85}
              >
                <View style={styles.postButton}>
                  <Plus size={18} color="#FFFFFF" strokeWidth={2.6} />
                </View>
                <Text style={styles.postLabel}>{item.label}</Text>
              </TouchableOpacity>
            );
          }

          const IconComponent = item.Icon;

          return (
            <TouchableOpacity
              key={item.key}
              onPress={() => setTab(item.key)}
              style={styles.tabButton}
              activeOpacity={0.7}
            >
              {isActive && item.key === 'home' ? (
                <View style={styles.activePillContainer}>
                  <IconComponent size={16} color="#FFFFFF" strokeWidth={2.4} />
                </View>
              ) : (
                <View style={styles.iconContainer}>
                  <IconComponent
                    size={20}
                    color={isActive ? '#000000' : '#737373'}
                    strokeWidth={isActive ? 2.4 : 1.8}
                  />
                </View>
              )}
              <Text
                style={[
                  styles.tabLabel,
                  isActive
                    ? { color: '#000000', fontWeight: '700' }
                    : { color: '#737373', fontWeight: '500' },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    paddingTop: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 10,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  activePillContainer: {
    width: 48,
    height: 24,
    backgroundColor: '#000000',
    borderRadius: 9999,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  iconContainer: {
    width: 36,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  tabLabel: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: -0.2,
  },
  postTabContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  postButton: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  postLabel: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: -0.2,
  },
});
