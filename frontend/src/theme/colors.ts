// Centralized Theme Color System for Seedha Properties
// Palette definition:
// Primary: #2E3A2F (Dark Forest / Olive Green)
// Secondary: #687F5B (Sage Green)
// Tertiary: #D9C9B2 (Warm Beige / Tan)
// Accent: #C96F4F (Terracotta / Coral Orange)
// Background: #F8F6EE (Soft Off-White Canvas)

export const colors = {
  // Core Brand Palette
  primary: '#2E3A2F',
  secondary: '#687F5B',
  tertiary: '#D9C9B2',
  accent: '#C96F4F',
  background: '#F8F6EE',

  // Derived Variations & Soft Background Tints
  primaryDark: '#1E271F',
  primaryLight: '#3D4D3E',
  primaryBg: 'rgba(46, 58, 47, 0.08)',

  secondaryLight: '#7E9670',
  secondaryDark: '#526547',
  secondaryBg: 'rgba(104, 127, 91, 0.12)',

  tertiaryLight: '#ECE4D8',
  tertiaryDark: '#B8A48B',
  tertiaryBg: 'rgba(217, 201, 178, 0.3)',

  accentLight: '#F5EBE6',
  accentDark: '#A85234',
  accentBg: 'rgba(201, 111, 79, 0.12)',

  // Surfaces & Cards
  surface: '#FFFFFF',
  surfaceSoft: '#FAF8F3',

  // Borders & Dividers
  border: '#D9C9B2',
  borderLight: '#EBE4D8',
  divider: '#E5DEC9',

  // Text Colors
  textPrimary: '#2E3A2F',
  textSecondary: '#5C665D',
  textMuted: '#8A948B',
  textLight: '#F8F6EE',
  textWhite: '#FFFFFF',
  textAccent: '#C96F4F',
  textSecondaryColor: '#687F5B',

  // Status & Badges
  success: '#687F5B',
  successBg: '#EFF3EC',
  danger: '#C96F4F',
  dangerBg: '#FCEFEA',
  warning: '#D99B26',
  warningBg: '#FEF9EE',
  info: '#2E3A2F',
  infoBg: '#EAECE9',

  // Overlay tokens (refined for clear image visibility & readability)
  overlaySubtle: 'rgba(46, 58, 47, 0.25)',
  overlayLight: 'rgba(46, 58, 47, 0.35)',
  overlayMedium: 'rgba(46, 58, 47, 0.45)',
  overlayDark: 'rgba(46, 58, 47, 0.55)',
  backdropOverlay: 'rgba(46, 58, 47, 0.40)',
  modalOverlay: 'rgba(0, 0, 0, 0.35)',

  // Shadow Colors & Constants
  shadowColor: '#2E3A2F',

  // Typography Standard Sizes
  fontSizeXs: 11,
  fontSizeSm: 13,
  fontSizeMd: 15,
  fontSizeLg: 18,
  fontSizeXl: 24,

  // Uniform Corner Radius Tokens
  radiusSm: 8,      // Small tags, badges, chips
  radiusMd: 12,     // Inputs, buttons, small cards
  radiusLg: 16,     // Large cards, modals, containers
  radiusPill: 24,   // Segment controls, pill buttons

  // Typography Tokens & Font Family
  fontFamily: 'Plus Jakarta Sans',
  fontFamilyStack: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontWeightRegular: '400',
  fontWeightMedium: '500',
  fontWeightSemiBold: '600',
  fontWeightBold: '700',
  fontWeightExtraBold: '800',

  // Dark Canvas (For splash or dark highlights)
  darkBg: '#2E3A2F',
};

export default colors;
