"use client";

import React, { createContext, useState, useContext, ReactNode } from 'react';

// Buat tipe untuk data user
interface UserContextType {
  userId: string | null;
  setUserId: (id: string) => void;
}

// Inisialisasi Context dengan default null
const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

// Provider untuk membungkus aplikasi
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook untuk mengakses context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
