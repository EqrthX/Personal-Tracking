import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getJWTToken,
  saveJWTToken,
  isAuthenticated as checkIsAuthenticated,
  clearAuthData,
  decodeJWT,
} from '../utils/auth';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setJWTToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Initialize auth state from stored token
  useEffect(() => {
    const token = getJWTToken();
    if (token && checkIsAuthenticated()) {
      setIsAuthenticated(true);
      
      const decoded = decodeJWT(token);
      console.log(decoded);
      
      if (decoded) {
        setUser({
          id: decoded.sub || decoded.nameid || '',
          email: decoded.email || '',
          name: decoded.name || '',
        });
      }
    }
    setLoading(false);
  }, []);

  const login = async (_email: string, _password: string): Promise<boolean> => {
    // This would be called from LoginPage after successful API call
    // The actual login logic is in LoginPage component
    return true;
  };

  const logout = () => {
    clearAuthData();
    setIsAuthenticated(false);
    setUser(null);
  };

  const setJWTToken = (token: string) => {
    saveJWTToken(token);
    setIsAuthenticated(true);

    // Handle HTTP-Only Cookie case
    if (token === 'COOKIE_AUTH') {
      // ✓ Cookie-based auth (can't decode, no user info available)
      // User data will be fetched from /api/user/profile if needed
      setUser(null);
      return;
    }

    const decoded = decodeJWT(token);
    if (decoded) {
      setUser({
        id: decoded.sub || decoded.userId || '',
        email: decoded.email || '',
        name: decoded.name || '',
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login,
        logout,
        setUser,
        setJWTToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
