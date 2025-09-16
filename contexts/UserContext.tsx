import React, { createContext, ReactNode, useContext, useState } from 'react';

interface UserContextType {
  publicKey: string | null;
  setPublicKey: (key: string | null) => void;
  isConnected: boolean;
  getUserData: () => UserData | null;
  clearUserData: () => void;
}

interface UserData {
  publicKey: string;
  shortAddress: string;
  connectionDate: Date;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [publicKey, setPublicKeyState] = useState<string | null>(null);

  const setPublicKey = (key: string | null) => {
    setPublicKeyState(key);
  };

  const isConnected = !!publicKey;

  const getUserData = (): UserData | null => {
    if (!publicKey) return null;
    
    return {
      publicKey,
      shortAddress: `${publicKey.substring(0, 4)}...${publicKey.substring(publicKey.length - 3)}`,
      connectionDate: new Date(),
    };
  };

  const clearUserData = () => {
    setPublicKey(null);
  };

  const value: UserContextType = {
    publicKey,
    setPublicKey,
    isConnected,
    getUserData,
    clearUserData,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
