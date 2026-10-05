export type PropertyType = 'apartment' | 'villa' | 'house' | 'plot' | 'office' | 'shop' | 'warehouse' | 'coworking';
export type ListingType = 'buy' | 'rent' | 'commercial';

export interface Property {
  id: string;
  title: string;
  location: string;
  city: string;
  price: number;
  priceLabel: string;
  listingType: ListingType;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  images: string[];
  verified: boolean;
  featured?: boolean;
  amenities: string[];
  description: string;
  ownerName: string;
  ownerAvatar: string;
  ownerType: 'owner' | 'builder' | 'agent';
  possessionDate?: string;
  furnishing: 'unfurnished' | 'semi-furnished' | 'fully-furnished';
  parking: boolean;
  deposit?: number;
  maintenance?: number;
  yearBuilt?: number;
  floor?: string;
  totalFloors?: number;
  facing?: string;
  tags?: string[];
}

export interface VisitSlot {
  date: string;
  time: string;
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
  propertyImage: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  from: 'user' | 'owner';
  time: string;
}

export type ScreenName =
  | 'splash'
  | 'onboarding'
  | 'login'
  | 'otp'
  | 'signup'
  | 'profileSetup'
  | 'propertyIntent'
  | 'locationPermission'
  | 'authSuccess'
  | 'landing'
  | 'home'
  | 'explore'
  | 'myProperty'
  | 'payments'
  | 'profile'
  | 'propertyListing'
  | 'propertyDetail'
  | 'bookVisit'
  | 'visitConfirmation'
  | 'chat'
  | 'homeLoan'
  | 'rentalAgreement'
  | 'propertyManagement'
  | 'notifications'
  | 'search'
  | 'filters'
  | 'postProperty'
  | 'compare'
  | 'savedProperties';

export interface ScreenState {
  name: ScreenName;
  params?: Record<string, unknown>;
}

export interface FilterState {
  listingType: ListingType | 'all';
  budget: [number, number];
  bhk: number[];
  propertyTypes: PropertyType[];
  furnishing: string[];
  parking: boolean | null;
  verifiedOnly: boolean;
  areaMin: number;
  areaMax: number;
}
