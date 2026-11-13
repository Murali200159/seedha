import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ScreenState, AdminItem, AdminCategory, AuthUser, UserRole } from '../types';
import { api, setAuthToken, getAuthToken } from '../services/api';
import { authenticateCredentials, authorizeAdmin } from '../services/authService';

export type { UserRole };

export type UserProfile = {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  role?: UserRole;
};

export interface FilterOptions {
  bhk: string[];
  propertyType: string[];
  furnishing: string[];
  parking: string | null;
  verifiedOnly: boolean;
}

const defaultAdminRequests: AdminItem[] = [
  {
    id: 'REQ-101',
    category: 'flat_building',
    title: '3 BHK High-Rise Apartment (For Sale)',
    subtitle: 'Tower 4, Aparna Serene Park',
    submittedBy: 'Kiran Varma (Owner)',
    phone: '+91 98480 11223',
    date: 'Today, 2:30 PM',
    location: 'Kondapur, Hyderabad',
    city: 'Hyderabad',
    status: 'pending_review',
    stage: 0,
    details: {
      bhk: '3 BHK',
      area: '1850 sq.ft',
      price: '₹1.55 Cr',
      furnishing: 'Semi-Furnished',
      facing: 'East',
      possession: 'Immediate',
      ownershipDoc: 'Sale Deed Verified',
    },
  },
  {
    id: 'REQ-102',
    category: 'rent',
    title: '2 BHK Gated Community Flat (For Rent)',
    subtitle: 'Flat 602, Rainbow Vistas Rockgarden',
    submittedBy: 'Suresh Babu (Owner)',
    phone: '+91 97000 44556',
    date: 'Today, 1:15 PM',
    location: 'Moosapet / HITEC City, Hyderabad',
    city: 'Hyderabad',
    status: 'pending_review',
    stage: 0,
    details: {
      bhk: '2 BHK',
      area: '1250 sq.ft',
      rent: '₹34,000/mo',
      deposit: '₹68,000',
      furnishing: 'Semi-Furnished',
      preferredTenant: 'Family / Working Professionals',
    },
  },
  {
    id: 'REQ-103',
    category: 'commercial',
    title: 'Warm Shell IT Office Space (Commercial)',
    subtitle: 'Floor 5, Cyber Gateway IT Tower',
    submittedBy: 'Lakshmi Narayan (Commercial Builder)',
    phone: '+91 99887 76655',
    date: 'Today, 11:40 AM',
    location: 'HITEC City, Hyderabad',
    city: 'Hyderabad',
    status: 'pending_review',
    stage: 0,
    details: {
      type: 'IT Office',
      area: '3,200 sq.ft',
      rent: '₹1,80,000/mo',
      seats: '45 Workstations',
      parking: '4 Reserved Car Parks',
      powerBackup: '100% 24x7',
    },
  },
  {
    id: 'REQ-104',
    category: 'property_management',
    title: 'Flat Management Request (Owner)',
    subtitle: 'Unit B-1204, My Home Bhooja',
    submittedBy: 'Naveen Goud (Owner)',
    phone: '+91 98661 54321',
    date: 'Today, 10:20 AM',
    location: 'HITEC City, Hyderabad',
    city: 'Hyderabad',
    status: 'pending_review',
    stage: 0,
    details: {
      flatNo: 'B-1204',
      society: 'My Home Bhooja',
      bhk: '3 BHK',
      expectedRent: '₹75,000/mo',
      serviceRequested: 'Tenant Placement, Rent Collection & Maintenance',
    },
  },
  {
    id: 'REQ-105',
    category: 'home_loan',
    title: 'Home Purchase Loan Application',
    subtitle: 'SBI Home Loans (8.40% interest)',
    submittedBy: 'Deepak Chawla',
    phone: '+91 91234 56789',
    date: 'Today, 9:50 AM',
    location: 'Gachibowli, Hyderabad',
    city: 'Hyderabad',
    status: 'pending_review',
    stage: 0,
    details: {
      loanAmount: '₹60,00,000',
      tenure: '20 Years',
      monthlySalary: '₹1,15,000',
      bankSelected: 'State Bank of India',
      documentsSubmitted: 'PAN, Aadhaar, 3 Months Salary Slips',
    },
  },
  {
    id: 'REQ-106',
    category: 'rental_agreement',
    title: 'e-Stamp Rental Agreement Drafting',
    subtitle: 'Order #RA-2026-90412 (₹499 Paid)',
    submittedBy: 'Rahul Sharma & Rajeshwar Rao',
    phone: '+91 98765 43210',
    date: 'Today, 9:15 AM',
    location: 'Madhapur, Hyderabad',
    city: 'Hyderabad',
    status: 'pending_review',
    stage: 0,
    details: {
      propertyAddress: 'Flat 402, Rainbow Vistas, HITEC City',
      monthlyRent: '₹32,000',
      securityDeposit: '₹64,000',
      duration: '11 Months',
      eStampRequired: 'Government of Telangana (₹100 Non-Judicial)',
    },
  },
  {
    id: 'REQ-107',
    category: 'owner_background',
    title: 'Landlord Background Verification',
    subtitle: 'Order #SEEDHA-OBV-82914 (₹399 Paid)',
    submittedBy: 'Prospective Tenant: Vikram Joshi',
    phone: '+91 98490 12345',
    date: 'Today, 8:45 AM',
    location: 'Financial District, Hyderabad',
    city: 'Hyderabad',
    status: 'pending_review',
    stage: 0,
    details: {
      ownerName: 'Rajeshwar Rao',
      ownerPhone: '+91 98490 12345',
      flatToVerify: 'Flat 304, Tower B, Prestige High Fields',
      checksRequested: 'Title Ownership, Police CCTNS, Court Litigations',
    },
  },
];

export type PendingAction = {
  action?: () => void;
  targetScreen?: ScreenState;
  sourceScreen?: ScreenState;
  actionName?: string;
};

interface AppContextType {
  stack: ScreenState[];
  activeTab: string;
  savedIds: Set<string>;
  notifications: number;
  isAuthenticated: boolean;
  isGuest: boolean;
  authLoading: boolean;
  user: UserProfile | null;
  token: string | null;
  authToken: string | null;
  isAdmin: boolean;
  pendingAction: PendingAction | null;
  requireAuth: (action?: () => void, targetScreen?: ScreenState, actionName?: string) => boolean;
  completeAuth: (verifiedUser: UserProfile, token?: string) => void;
  cancelAuth: () => void;
  push: (screen: ScreenState) => void;
  pop: () => void;
  setTab: (tab: string) => void;
  toggleSaved: (id: string) => void;
  currentScreen: ScreenState;
  signIn: (user: Partial<UserProfile> | Partial<AuthUser>, token?: string) => void;
  signOut: () => void;
  login: (email: string, pass: string, requestedRole?: UserRole) => Promise<{ success: boolean; error?: string; role?: UserRole }>;
  activeFilters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  adminRequests: AdminItem[];
  loginAdmin: (passcode: string) => boolean;
  logoutAdmin: () => void;
  addAdminRequest: (req: Omit<AdminItem, 'id' | 'date' | 'status' | 'stage'>) => void;
  updateAdminRequest: (id: string, updates: Partial<AdminItem>) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setTokenState] = useState<string | null>(getAuthToken());
  // Launch flow: Starts with the Seedha Properties logo animation, then transitions to the Landing page
  const [stack, setStack] = useState<ScreenState[]>([{ name: 'splash' }]);
  const [activeTab, setActiveTab] = useState('landing');
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set(['1', '3']));
  const [adminRequests, setAdminRequests] = useState<AdminItem[]>(defaultAdminRequests);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    bhk: [],
    propertyType: [],
    furnishing: [],
    parking: null,
    verifiedOnly: false,
  });

  const isGuest = !isAuthenticated || !user;

  const setFilters = useCallback((filters: FilterOptions) => {
    setActiveFilters(filters);
  }, []);

  // Restore stored session on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const storedUser = window.localStorage.getItem('seedha_user');
        const storedToken = window.localStorage.getItem('seedha_auth_token');
        if (storedUser && storedToken) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setTokenState(storedToken);
          setAuthToken(storedToken);
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.warn('Failed restoring stored session', e);
      }
    }
  }, []);

  const push = useCallback((screen: ScreenState) => {
    setStack(s => [...s, screen]);
  }, []);

  const pop = useCallback(() => {
    setStack(s => (s.length > 1 ? s.slice(0, -1) : [{ name: 'home' }]));
  }, []);

  // Centralized authentication guard for protected guest actions
  const requireAuth = useCallback(
    (action?: () => void, targetScreen?: ScreenState, actionName?: string): boolean => {
      if (isAuthenticated && user) {
        if (action) action();
        if (targetScreen) setStack(s => [...s, targetScreen]);
        return true;
      }

      // Guest trying protected action -> queue pending action and show Mobile Login
      setStack(s => {
        const current = s[s.length - 1] || { name: 'home' };
        setPendingAction({
          action,
          targetScreen,
          sourceScreen: current,
          actionName,
        });
        return [...s, { name: 'mobileLogin', params: { returnScreen: current.name, actionName } }];
      });
      return false;
    },
    [isAuthenticated, user]
  );

  const cancelAuth = useCallback(() => {
    setPendingAction(null);
    setStack(s => {
      const filtered = s.filter(screen => screen.name !== 'mobileLogin' && screen.name !== 'login' && screen.name !== 'otp');
      return filtered.length > 0 ? filtered : [{ name: 'home' }];
    });
  }, []);

  const completeAuth = useCallback(
    (verifiedUser: UserProfile, authToken?: string) => {
      setUser(verifiedUser);
      setIsAuthenticated(true);
      if (authToken) {
        setTokenState(authToken);
        setAuthToken(authToken);
      }
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          window.localStorage.setItem('seedha_user', JSON.stringify(verifiedUser));
          if (authToken) {
            window.localStorage.setItem('seedha_auth_token', authToken);
          }
        } catch {}
      }

      // Resume requested action or destination without resetting to home
      if (pendingAction) {
        const { action, targetScreen } = pendingAction;
        setPendingAction(null);
        setStack(s => {
          const withoutLogin = s.filter(screen => screen.name !== 'mobileLogin' && screen.name !== 'login' && screen.name !== 'otp');
          if (targetScreen) {
            return [...withoutLogin, targetScreen];
          }
          return withoutLogin.length > 0 ? withoutLogin : [{ name: 'home' }];
        });
        if (action) {
          setTimeout(() => {
            try {
              action();
            } catch (e) {
              console.warn('Error executing pending action after auth:', e);
            }
          }, 100);
        }
      } else {
        setStack(s => {
          const withoutLogin = s.filter(screen => screen.name !== 'mobileLogin' && screen.name !== 'login' && screen.name !== 'otp');
          return withoutLogin.length > 0 ? withoutLogin : [{ name: 'home' }];
        });
      }
    },
    [pendingAction]
  );

  const setTab = useCallback((tab: string) => {
    if (tab === 'post') {
      requireAuth(undefined, { name: 'postProperty' }, 'Post Property');
      return;
    }
    setActiveTab(tab);
    const tabScreens: Record<string, ScreenState> = {
      home: { name: 'home' },
      landing: { name: 'landing' },
      explore: { name: 'explore' },
      search: { name: 'search' },
      saved: { name: 'explore', params: { filter: 'saved' } },
      myProperty: { name: 'myProperty' },
      payments: { name: 'payments' },
      profile: { name: 'profile' },
    };
    setStack([tabScreens[tab] || { name: 'home' }]);
  }, [requireAuth]);

  const toggleSaved = useCallback(
    (id: string) => {
      if (!isAuthenticated) {
        requireAuth(
          () => {
            setSavedIds(s => {
              const next = new Set(s);
              next.has(id) ? next.delete(id) : next.add(id);
              return next;
            });
          },
          undefined,
          'Save Property'
        );
        return;
      }
      setSavedIds(s => {
        const next = new Set(s);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
      });
    },
    [isAuthenticated, requireAuth]
  );

  const signIn = useCallback(
    (userData: Partial<UserProfile> | Partial<AuthUser>, authToken?: string) => {
      const normalizedUser: UserProfile = {
        id: userData.id || `usr_${Date.now()}`,
        name: userData.name || 'Verified User',
        phone: userData.phone || '+91 98765 43210',
        email: userData.email || 'user@seedhaproperties.com',
        city: userData.city || 'Hyderabad',
        role: (userData.role as UserRole) || 'USER',
      };
      completeAuth(normalizedUser, authToken);
    },
    [completeAuth]
  );

  const login = useCallback(
    async (email: string, pass: string, requestedRole?: UserRole) => {
      const res = await authenticateCredentials(email, pass, requestedRole);
      if (!res.success || !res.session) {
        return { success: false, error: res.error || 'Authentication failed' };
      }
      const authUser = res.session.user;
      signIn(authUser, res.session.token);
      return { success: true, role: authUser.role };
    },
    [signIn]
  );

  const signOut = useCallback(() => {
    setUser(null);
    setTokenState(null);
    setIsAuthenticated(false);
    setPendingAction(null);
    setAuthToken(null);
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.removeItem('seedha_user');
        window.localStorage.removeItem('seedha_auth_token');
      } catch {}
    }
    // Stay gracefully in Guest mode on Landing screen
    setStack([{ name: 'landing' }]);
    setActiveTab('landing');
  }, []);

  const logoutAdmin = useCallback(() => {
    if (user?.role === 'ADMIN') {
      signOut();
    } else {
      setTab('home');
    }
  }, [user, signOut, setTab]);

  const loginAdmin = useCallback((passcode: string) => {
    if (passcode.trim() === 'admin123' || passcode.trim() === 'seedha2026' || passcode.trim() === 'admin') {
      setUser(prev => ({
        id: prev?.id || 'admin_1',
        name: prev?.name || 'Administrator',
        phone: prev?.phone || '+91 98480 11223',
        email: prev?.email || 'admin@seedhaproperties.com',
        city: 'Hyderabad',
        role: 'ADMIN',
      }));
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const addAdminRequest = useCallback((req: Omit<AdminItem, 'id' | 'date' | 'status' | 'stage'>) => {
    const newItem: AdminItem = {
      ...req,
      id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
      submittedBy: req.submittedBy || 'Rahul Sharma',
      phone: req.phone || '+91 98765 43210',
      subtitle: req.subtitle || req.location,
      city: req.city || 'Hyderabad',
      date: 'Just now',
      status: 'pending_review',
      stage: 0,
    };
    setAdminRequests(prev => [newItem, ...prev]);
  }, []);

  const updateAdminRequest = useCallback((id: string, updates: Partial<AdminItem>) => {
    setAdminRequests(prev => prev.map(item => (item.id === id ? { ...item, ...updates } : item)));
  }, []);

  const currentScreen = stack[stack.length - 1];
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AppContext.Provider value={{
      stack, activeTab, savedIds, notifications: 3,
      isAuthenticated, isGuest, authLoading, user, token, authToken: token, isAdmin,
      pendingAction, requireAuth, completeAuth, cancelAuth,
      push, pop, setTab, toggleSaved, currentScreen,
      signIn, signOut, login,
      activeFilters, setFilters,
      adminRequests, loginAdmin, logoutAdmin, addAdminRequest, updateAdminRequest,
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
