import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ScreenState } from '../types';

type UserProfile = { name: string; phone: string; email?: string; city?: string };

interface AppContextType {
  stack: ScreenState[];
  activeTab: string;
  savedIds: Set<string>;
  notifications: number;
  isAuthenticated: boolean;
  user: UserProfile | null;
  push: (screen: ScreenState) => void;
  pop: () => void;
  setTab: (tab: string) => void;
  toggleSaved: (id: string) => void;
  currentScreen: ScreenState;
  signIn: (user: UserProfile) => void;
  signOut: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [stack, setStack] = useState<ScreenState[]>([{ name: 'splash' }]);
  const [activeTab, setActiveTab] = useState('explore');
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set(['1', '3']));

  const push = useCallback((screen: ScreenState) => {
    setStack(s => [...s, screen]);
  }, []);

  const pop = useCallback(() => {
    setStack(s => s.length > 1 ? s.slice(0, -1) : s);
  }, []);

  const setTab = useCallback((tab: string) => {
    setActiveTab(tab);
    const tabScreens: Record<string, ScreenState> = {
      home: { name: 'home' },
      landing: { name: 'landing' },
      explore: { name: 'explore' },
      myProperty: { name: 'myProperty' },
      payments: { name: 'payments' },
      profile: { name: 'profile' },
    };
    if (tab === 'post') {
      setStack(s => [...s, { name: 'postProperty' }]);
    } else {
      setStack([tabScreens[tab] || { name: 'landing' }]);
    }
  }, []);

  const toggleSaved = useCallback((id: string) => {
    setSavedIds(s => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const signIn = useCallback((userData: UserProfile) => {
    setUser(userData);
    setIsAuthenticated(true);
    setStack([{ name: 'landing' }]);
    setActiveTab('explore');
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    setStack([{ name: 'onboarding' }]);
    setActiveTab('explore');
  }, []);

  const currentScreen = stack[stack.length - 1];

  return (
    <AppContext.Provider value={{
      stack, activeTab, savedIds, notifications: 3,
      isAuthenticated, user,
      push, pop, setTab, toggleSaved, currentScreen,
      signIn, signOut,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
