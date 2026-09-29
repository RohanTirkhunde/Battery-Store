import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface AuthContextType {
  currentUser: UserProfile | null;
  isAdmin: boolean;
  loginCustomer: (phoneOrEmail: string, name?: string, address?: string) => void;
  loginAdmin: (password: string) => boolean;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  adminEmail: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = 'rohanofficial512@gmail.com';
const ADMIN_PHONE = '8329838314';
const ADMIN_PASS = 'bharat123'; // Default owner passkey

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('nbb_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.id === 'cust_9822344551' || parsed.phone === '9822344551' || parsed.name === 'Sanjay Deshmukh') {
          localStorage.removeItem('nbb_user');
          return null;
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('nbb_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('nbb_user');
    }
  }, [currentUser]);

  const loginCustomer = (phoneOrEmail: string, name: string = 'Valued Customer', address: string = 'Wagholi, Pune') => {
    const isEmail = phoneOrEmail.includes('@');
    const cleanKey = phoneOrEmail.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const newUser: UserProfile = {
      id: `cust_${cleanKey || 'guest'}`,
      name: name || 'Customer',
      email: isEmail ? phoneOrEmail : `${phoneOrEmail.replace(/\D/g, '')}@customer.nbb`,
      phone: isEmail ? '+91 83298 38314' : phoneOrEmail,
      role: 'customer',
      address,
      pincode: '412207'
    };
    setCurrentUser(newUser);
  };

  const loginAdmin = (password: string): boolean => {
    // Keep password of bharat123
    if (password === ADMIN_PASS || password === 'bharat123') {
      const adminUser: UserProfile = {
        id: 'admin_rohan',
        name: 'Rohan Tirkhunde (Owner)',
        email: ADMIN_EMAIL,
        phone: '+91 83298 38314',
        role: 'admin',
        address: 'NEW Bharat Battery, Opposite to sangrilla hotel near honda showroom wagholi pune-412207',
        pincode: '412207'
      };
      setCurrentUser(adminUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('nbb_user');
    } catch {}
  };

  const updateProfile = (profile: Partial<UserProfile>) => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      ...profile
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin: currentUser?.role === 'admin',
        loginCustomer,
        loginAdmin,
        logout,
        updateProfile,
        adminEmail: ADMIN_EMAIL
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
