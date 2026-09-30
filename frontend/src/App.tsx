import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AppProvider, useApp } from './context/AppContext';
import BottomNav from './components/BottomNav';
import HomeScreen from './screens/HomeScreen';
import ExploreScreen from './screens/ExploreScreen';
import MyPropertyScreen from './screens/MyPropertyScreen';
import ProfileScreen from './screens/ProfileScreen';
import PropertyListingScreen from './screens/PropertyListingScreen';
import PropertyDetailScreen from './screens/PropertyDetailScreen';
import BookVisitScreen from './screens/BookVisitScreen';
import ChatScreen from './screens/ChatScreen';
import HomeLoanScreen from './screens/HomeLoanScreen';
import RentalAgreementScreen from './screens/RentalAgreementScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import PostPropertyScreen from './screens/PostPropertyScreen';
import FiltersScreen from './screens/FiltersScreen';
import SearchScreen from './screens/SearchScreen';
import CompareScreen from './screens/CompareScreen';
import PaymentsScreen from './screens/PaymentsScreen';
import LandingScreen from './screens/LandingScreen';
import OnboardingScreen from './screens/auth/OnboardingScreen';
import LoginScreen from './screens/auth/LoginScreen';
import OTPScreen from './screens/auth/OTPScreen';
import SignUpScreen from './screens/auth/SignUpScreen';
import ProfileSetupScreen from './screens/auth/ProfileSetupScreen';
import PropertyIntentScreen from './screens/auth/PropertyIntentScreen';
import LocationPermissionScreen from './screens/auth/LocationPermissionScreen';
import AuthSuccessScreen from './screens/auth/AuthSuccessScreen';

const TAB_SCREENS = new Set(['home', 'explore', 'payments', 'profile']);
const AUTH_SCREENS = new Set([
  'onboarding', 'login', 'signup', 'otp',
  'profileSetup', 'propertyIntent', 'locationPermission', 'authSuccess',
]);

function ScreenRouter() {
  const { currentScreen } = useApp();

  const renderScreen = () => {
    switch (currentScreen.name) {
      // Auth flow
      case 'onboarding': return <OnboardingScreen />;
      case 'login': return <LoginScreen />;
      case 'signup': return <SignUpScreen />;
      case 'otp': return <OTPScreen />;
      case 'profileSetup': return <ProfileSetupScreen />;
      case 'propertyIntent': return <PropertyIntentScreen />;
      case 'locationPermission': return <LocationPermissionScreen />;
      case 'authSuccess': return <AuthSuccessScreen />;
      // Main app
      case 'landing': return <LandingScreen />;
      case 'home': return <HomeScreen />;
      case 'explore': return <ExploreScreen />;
      case 'myProperty': return <MyPropertyScreen />;
      case 'payments': return <PaymentsScreen />;
      case 'profile': return <ProfileScreen />;
      case 'propertyListing': return <PropertyListingScreen />;
      case 'propertyDetail': return <PropertyDetailScreen />;
      case 'bookVisit': return <BookVisitScreen />;
      case 'chat': return <ChatScreen />;
      case 'homeLoan': return <HomeLoanScreen />;
      case 'rentalAgreement': return <RentalAgreementScreen />;
      case 'notifications': return <NotificationsScreen />;
      case 'postProperty': return <PostPropertyScreen />;
      case 'filters': return <FiltersScreen />;
      case 'search': return <SearchScreen />;
      case 'savedProperties': return <ExploreScreen />;
      case 'compare': return <CompareScreen />;
      default: return <HomeScreen />;
    }
  };

  const showBottomNav = TAB_SCREENS.has(currentScreen.name);

  return (
    <View style={styles.routerContainer}>
      <View style={styles.screenContainer}>
        {renderScreen()}
      </View>
      {showBottomNav && <BottomNav />}
    </View>
  );
}

function MainAppShell() {
  const { currentScreen } = useApp();
  const isOnboarding = currentScreen.name === 'onboarding';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style={isOnboarding ? 'light' : 'dark'} />
      <ScreenRouter />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <MainAppShell />
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ECEEF5',
  },
  routerContainer: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
  },
});
