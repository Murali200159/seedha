// Centralized Typography Design Token System for Seedha Properties
// Font Family: Plus Jakarta Sans (Primary font family across Native & Web)

export const typography = {
  fontFamily: 'Plus Jakarta Sans',
  fontFamilyStack: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",

  // Font Weight Scale
  weightRegular: '400' as const,   // Body, descriptions
  weightMedium: '500' as const,    // Navigation, secondary labels
  weightSemiBold: '600' as const,  // Buttons, card titles, input labels
  weightBold: '700' as const,      // Section headings, prices, key highlights
  weightExtraBold: '800' as const, // Hero headings, page titles, brand text

  // Typography Sizes Scale
  sizeHero: 32,
  sizePageTitle: 26,
  sizeSectionHeading: 20,
  sizeSubHeading: 16,
  sizeCardTitle: 15,
  sizeBody: 14,
  sizeSecondary: 12,
  sizeCaption: 11,

  // Line Heights
  lineHeightHero: 40,
  lineHeightPageTitle: 32,
  lineHeightSectionHeading: 26,
  lineHeightBody: 20,
};

export default typography;
