import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, AuthState, LoginCredentials, RegisterCredentials } from '../types';
import { authApi } from '../api/auth.api';
import toast from 'react-hot-toast';

interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? (JSON.parse(stored) as User) : null;
  });

  const isAuthenticated = !!token && !!user;

  const persistAuth = (newToken: string, newUser: User) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const res = await authApi.login(credentials);
      if (res.success && res.data) {
        persistAuth(res.data.token, res.data.user);
        toast.success('Welcome back!');
        return true;
      }
      toast.error(res.message || 'Login failed.');
      return false;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Login failed.';
      toast.error(message);
      return false;
    }
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials): Promise<boolean> => {
    try {
      const res = await authApi.register(credentials);
      if (res.success && res.data) {
        persistAuth(res.data.token, res.data.user);
        toast.success('Account created successfully!');
        return true;
      }
      toast.error(res.message || 'Registration failed.');
      return false;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Registration failed.';
      toast.error(message);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    toast.success('Logged out successfully.');
  }, []);

  // Refresh user on mount if token exists
  useEffect(() => {
    if (token && !user) {
      authApi.getMe().then((res) => {
        if (res.success && res.data) setUser(res.data);
        else clearAuth();
      }).catch(clearAuth);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
