import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authAPI, getToken, setToken, removeToken, getStoredUser, setStoredUser, removeStoredUser } from '../services/api';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'supervisor' | 'admin' | 'jury';
  rollNumber?: string;
  department?: string;
  isApproved: boolean;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: { name: string; email: string; password: string; role: string; rollNumber?: string; department?: string }) => Promise<User>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getStoredUser());
  const [token, setTokenState] = useState<string | null>(getToken());
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await authAPI.login({ email, password }) as { success: boolean; data: { token: string; user: User } };
      const { token: newToken, user: newUser } = res.data;
      setToken(newToken);
      setStoredUser(newUser);
      setTokenState(newToken);
      setUser(newUser);
      return newUser;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { name: string; email: string; password: string; role: string; rollNumber?: string; department?: string }): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await authAPI.register(data) as { success: boolean; data: User };
      return res.data;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    removeToken();
    removeStoredUser();
    setTokenState(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
