import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  light?: boolean;
}

interface MarkProps {
  size?: 'default' | 'nav';
}

export function SeedhaMark({ size = 'default' }: MarkProps) {
  const isNav = size === 'nav';
  const dim = isNav ? 48 : 40;
  const radius = isNav ? 16 : 12;

  return (
    <View style={[styles.markContainer, { width: dim, height: dim, borderRadius: radius }]}>
      <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Path
          d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V10.5z"
          fill="rgba(255,255,255,0.25)"
          stroke="white"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <Path d="M9 21v-7h6v7" fill="white" />
        <Circle cx="18" cy="18" r="5.5" fill="white" />
        <Path d="M15.5 18l1.5 1.5 3-3" stroke="#2260FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </View>
  );
}

export default function SeedhaLogo({ size = 'md', light = false }: Props) {
  const scales = { sm: 0.8, md: 1, lg: 1.2 };
  const scale = scales[size];
  const textColor = light ? '#FFFFFF' : '#111827';
  const subColor = light ? 'rgba(255,255,255,0.75)' : '#6B7280';

  return (
    <View style={[styles.logoRow, { transform: [{ scale }] }]}>
      <SeedhaMark />
      <View style={styles.textColumn}>
        <Text style={[styles.brandTitle, { color: textColor }]}>Seedha Properties</Text>
        <Text style={[styles.brandSub, { color: subColor }]}>BUY · RENT · SELL · MANAGE</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  markContainer: {
    backgroundColor: '#2260FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textColumn: {
    marginLeft: 10,
  },
  brandTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  brandSub: {
    fontSize: 9,
    fontWeight: '500',
    marginTop: 2,
    letterSpacing: 0.6,
  },
});
