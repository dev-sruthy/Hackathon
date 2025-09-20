import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

// Mock API calls
const sendPasswordResetEmail = async (email: string) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const users = JSON.parse(localStorage.getItem('ecotrace_users') || '{}');
  if (!users[email]) {
    return { success: false, error: 'No account found with this email address' };
  }
  const resetCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  localStorage.setItem(`reset_${email}`, resetCode);
  console.log(`Password reset code for ${email}: ${resetCode}`);
  return { success: true, code: resetCode };
};

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string; }>;
    register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string; }>;
    logout: () => void;
    requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string; code?: string }>;
    resetPassword: (email: string, code: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
    // FIX: Add verifyEmail and resendVerification to the context type to resolve errors in VerifyEmailPage.
    verifyEmail: (email: string, code: string) => Promise<{ success: boolean; error?: string; }>;
    resendVerification: (email: string) => Promise<{ success: boolean; error?: string; }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const savedUser = JSON.parse(localStorage.getItem('ecotrace_user') || 'null');
      if (savedUser && savedUser.emailVerified) {
        setUser(savedUser);
      }
      setLoading(false);
    }, 1000);
  }, []);

  const login = async (email: string, password: string) => {
    if (!email || !password) return { success: false, error: 'Please fill in all fields' };

    const users = JSON.parse(localStorage.getItem('ecotrace_users') || '{}');
    const storedUser = users[email];

    if (!storedUser || storedUser.password !== password) return { success: false, error: 'Invalid email or password' };

    // FIX: Add email verification check before allowing login.
    if (!storedUser.emailVerified) {
      return { success: false, error: 'Please verify your email address before logging in.' };
    }

    setUser(storedUser);
    localStorage.setItem('ecotrace_user', JSON.stringify(storedUser));
    return { success: true };
  };

  const register = async (email: string, password: string, name: string) => {
    if (!email || !password || !name) return { success: false, error: 'Please fill in all fields' };
    if (password.length < 6) return { success: false, error: 'Password must be at least 6 characters' };

    const users = JSON.parse(localStorage.getItem('ecotrace_users') || '{}');
    if (users[email]) return { success: false, error: 'An account with this email already exists' };

    const userData: User = { 
      uid: Date.now().toString(), 
      email, 
      name,
      password,
      // FIX: Set emailVerified to false to enable the verification flow.
      emailVerified: false,
      createdAt: new Date().toISOString()
    };

    users[email] = userData;
    localStorage.setItem('ecotrace_users', JSON.stringify(users));

    // FIX: Send verification code on registration.
    const verificationCode = '123456';
    localStorage.setItem(`verify_${email}`, verificationCode);
    console.log(`Verification code for ${email}: ${verificationCode}`);

    return { success: true };
  };

  const requestPasswordReset = async (email: string) => await sendPasswordResetEmail(email);

  const resetPassword = async (email: string, code: string, newPassword: string) => {
    const storedCode = localStorage.getItem(`reset_${email}`);
    if (!storedCode || storedCode !== code.toUpperCase()) return { success: false, error: 'Invalid reset code' };
    if (newPassword.length < 6) return { success: false, error: 'Password must be at least 6 characters' };

    const users = JSON.parse(localStorage.getItem('ecotrace_users') || '{}');
    if (users[email]) {
      users[email].password = newPassword;
      localStorage.setItem('ecotrace_users', JSON.stringify(users));
      localStorage.removeItem(`reset_${email}`);
      return { success: true };
    }
    return { success: false, error: 'User not found' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ecotrace_user');
  };

  // FIX: Implement verifyEmail function.
  const verifyEmail = async (email: string, code: string) => {
    const storedCode = localStorage.getItem(`verify_${email}`);
    if (!storedCode || storedCode !== code.toUpperCase()) return { success: false, error: 'Invalid verification code' };

    const users = JSON.parse(localStorage.getItem('ecotrace_users') || '{}');
    if (users[email]) {
      users[email].emailVerified = true;
      localStorage.setItem('ecotrace_users', JSON.stringify(users));
      localStorage.removeItem(`verify_${email}`);
      return { success: true };
    }
    return { success: false, error: 'User not found' };
  };
  
  // FIX: Implement resendVerification function.
  const resendVerification = async (email: string) => {
    const users = JSON.parse(localStorage.getItem('ecotrace_users') || '{}');
    if (!users[email]) {
      return { success: false, error: 'No account found with this email address' };
    }
    const verificationCode = '123456';
    localStorage.setItem(`verify_${email}`, verificationCode);
    console.log(`New verification code for ${email}: ${verificationCode}`);
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, requestPasswordReset, resetPassword, verifyEmail, resendVerification }}>
      {children}
    </AuthContext.Provider>
  );
};