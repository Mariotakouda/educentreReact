import React, { createContext, useContext, useState, useEffect, type ReactNode, } from 'react';
import { RoleEnum, type User } from '../types';
import apiService from '../api/apiService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isTeacher: boolean;
  isStudent: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Charger l'utilisateur depuis le localStorage au démarrage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login(email, password);
      setUser(response.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Même en cas d'erreur, on déconnecte localement
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === RoleEnum.Admin,
    isTeacher: user?.role === RoleEnum.Teacher,
    isStudent: user?.role === RoleEnum.Student,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};