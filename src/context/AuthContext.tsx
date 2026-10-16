import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface UserProfile {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  role?: string;
}

export type AuthMode = 'login' | 'register' | 'forgot';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isAuthModalOpen: boolean;
  authMode: AuthMode;
  openAuthModal: (mode?: AuthMode) => void;
  closeAuthModal: () => void;
  setAuthMode: (mode: AuthMode) => void;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ error: string | null; requiresConfirmation: boolean }>;
  signOut: () => Promise<void>;
  resetPasswordForEmail: (email: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const translateAuthError = (err: AuthError | Error | null): string => {
  if (!err) return '';
  const msg = err.message.toLowerCase();

  if (msg.includes('invalid login credentials') || msg.includes('invalid_grant')) {
    return 'E-mail ou senha incorretos. Verifique suas credenciais.';
  }
  if (msg.includes('user already registered') || msg.includes('email already in use')) {
    return 'Este e-mail já está registrado em nossa loja. Tente fazer login.';
  }
  if (msg.includes('password should be at least') || msg.includes('weak_password')) {
    return 'A senha deve ter pelo menos 6 caracteres.';
  }
  if (msg.includes('rate limit')) {
    return 'Muitas tentativas consecutivas. Aguarde um momento e tente novamente.';
  }
  if (msg.includes('invalid email')) {
    return 'Informe um endereço de e-mail válido.';
  }
  if (msg.includes('email not confirmed')) {
    return 'Por favor, confirme seu e-mail antes de entrar.';
  }

  return err.message || 'Ocorreu um erro na autenticação. Tente novamente.';
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  const fetchProfile = useCallback(async (currentUser: User) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (!error && data) {
        setProfile(data);
      } else {
        // Fallback to user metadata
        const metadata = currentUser.user_metadata || {};
        setProfile({
          id: currentUser.id,
          nome: metadata.nome || metadata.full_name || currentUser.email?.split('@')[0] || 'Cliente',
          email: currentUser.email || '',
          telefone: metadata.telefone || '',
          role: metadata.role || 'customer',
        });
      }
    } catch (e) {
      console.warn('Error fetching profile:', e);
    }
  }, []);

  useEffect(() => {
    // 1. Initial session check
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        fetchProfile(currentSession.user);
      }
      setLoading(false);
    });

    // 2. Real-time auth listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        await fetchProfile(newSession.user);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const openAuthModal = (mode: AuthMode = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const signInWithEmail = async (email: string, password: string): Promise<{ error: string | null }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        return { error: translateAuthError(error) };
      }

      if (data.user) {
        await fetchProfile(data.user);
      }

      closeAuthModal();
      return { error: null };
    } catch (err: any) {
      return { error: translateAuthError(err) };
    }
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    name: string
  ): Promise<{ error: string | null; requiresConfirmation: boolean }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            nome: name.trim(),
            full_name: name.trim(),
          },
        },
      });

      if (error) {
        return { error: translateAuthError(error), requiresConfirmation: false };
      }

      // If user profile table exists, sync the profile
      if (data.user) {
        try {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            nome: name.trim(),
            email: email.trim(),
          });
        } catch (e) {
          console.warn('Profile upsert fallback:', e);
        }
      }

      const requiresConfirmation = !data.session;
      if (!requiresConfirmation) {
        closeAuthModal();
      }

      return { error: null, requiresConfirmation };
    } catch (err: any) {
      return { error: translateAuthError(err), requiresConfirmation: false };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const resetPasswordForEmail = async (email: string): Promise<{ error: string | null }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: window.location.origin,
      });

      if (error) {
        return { error: translateAuthError(error) };
      }

      return { error: null };
    } catch (err: any) {
      return { error: translateAuthError(err) };
    }
  };

  const isAdmin = Boolean(
    profile?.role === 'admin' ||
    user?.app_metadata?.role === 'admin' ||
    user?.user_metadata?.role === 'admin' ||
    user?.email?.toLowerCase() === 'francoinvestimentoss@gmail.com'
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isAdmin,
        isAuthModalOpen,
        authMode,
        openAuthModal,
        closeAuthModal,
        setAuthMode,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        resetPasswordForEmail,
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
