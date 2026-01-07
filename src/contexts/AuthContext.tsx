import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, testSupabaseConnection } from '../lib/supabase';
import { useRetry } from '../hooks/useRetry';

interface UserProfile {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  is_admin?: boolean;
  has_premium?: boolean;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  connectionError: string | null;
  hasPremium: boolean;
  refreshPremiumStatus: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    success: boolean;
  }>;
  signUp: (email: string, password: string, metadata?: { username?: string; full_name?: string }) => Promise<{
    error: Error | null;
    success: boolean;
  }>;
  signInWithGoogle: () => Promise<{ error: Error | null; success: boolean }>;
  signInWithFacebook: () => Promise<{ error: Error | null; success: boolean }>;
  signInWithApple: () => Promise<{ error: Error | null; success: boolean }>;
  signOut: () => Promise<void>;
  retryConnection: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [hasPremium, setHasPremium] = useState(false);
  const { executeWithRetry } = useRetry();

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url, is_admin, has_premium')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
        setUserProfile(null);
        return;
      }

      setUserProfile(data);
      setHasPremium(data?.has_premium || false);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setUserProfile(null);
    }
  };

  const refreshPremiumStatus = async () => {
    if (!user) {
      setHasPremium(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('has_premium')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching premium status:', error);
        setHasPremium(false);
        return;
      }

      setHasPremium(data?.has_premium || false);
    } catch (err) {
      console.error('Error refreshing premium status:', err);
      setHasPremium(false);
    }
  };

  const retryConnection = async () => {
    setConnectionError(null);
    const result = await executeWithRetry(async () => {
      return await testSupabaseConnection();
    });
    if (!result.success) {
      setConnectionError(result.error || 'Connection failed');
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setConnectionError(null);

        const connectionTest = await executeWithRetry(async () => {
          return await testSupabaseConnection();
        });

        if (!connectionTest.success) {
          setConnectionError(connectionTest.error || 'Failed to connect to Supabase');
          setLoading(false);
          return;
        }

        const { data, error } = await executeWithRetry(async () => {
          try {
            const result = await supabase.auth.getSession();
            return result;
          } catch (err) {
            if (err instanceof DOMException && err.name === 'AbortError') {
              throw new Error('Request timed out. Please try again.');
            }
            if (err instanceof TypeError && err.message === 'Failed to fetch') {
              throw new Error('Network connection failed. Please check your internet connection.');
            }
            throw err;
          }
        });

        if (error) {
          if (error.message === 'Invalid Refresh Token: Refresh Token Not Found') {
            await supabase.auth.signOut();
            setUser(null);
            setUserProfile(null);
          } else {
            console.error('Error getting session:', error.message);
            setConnectionError(`Authentication error: ${error.message}`);
            setUser(null);
            setUserProfile(null);
          }
        } else {
          const currentUser = data?.session?.user ?? null;
          setUser(currentUser);
          if (currentUser) {
            await fetchUserProfile(currentUser.id);
          }
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown initialization error';
        setConnectionError(errorMessage);
        setUser(null);
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setConnectionError(null);
      }

      (async () => {
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setUserProfile(null);
          setHasPremium(false);
        }
        setLoading(false);
      })();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setConnectionError(null);

      const connectionTest = await executeWithRetry(async () => {
        return await testSupabaseConnection();
      });

      if (!connectionTest.success) {
        throw new Error(connectionTest.error || 'Cannot connect to authentication service');
      }

      const { data, error } = await executeWithRetry(async () => {
        try {
          return await supabase.auth.signInWithPassword({
            email,
            password,
          });
        } catch (err) {
          if (err instanceof DOMException && err.name === 'AbortError') {
            throw new Error('Sign in request timed out. Please try again.');
          }
          if (err instanceof TypeError && err.message === 'Failed to fetch') {
            throw new Error('Network connection failed. Please check your internet connection and try again.');
          }
          throw err;
        }
      });

      if (error) throw error;

      return { error: null, success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown sign in error';
      setConnectionError(errorMessage);
      return { error: error as Error, success: false };
    }
  };

  const signUp = async (email: string, password: string, metadata?: { username?: string; full_name?: string }) => {
    try {
      setConnectionError(null);

      const connectionTest = await executeWithRetry(async () => {
        return await testSupabaseConnection();
      });

      if (!connectionTest.success) {
        throw new Error(connectionTest.error || 'Cannot connect to authentication service');
      }

      const { data, error } = await executeWithRetry(async () => {
        try {
          return await supabase.auth.signUp({
            email,
            password,
            options: {
              data: metadata ? {
                username: metadata.username,
                full_name: metadata.full_name,
              } : undefined,
            },
          });
        } catch (err) {
          if (err instanceof DOMException && err.name === 'AbortError') {
            throw new Error('Sign up request timed out. Please try again.');
          }
          if (err instanceof TypeError && err.message === 'Failed to fetch') {
            throw new Error('Network connection failed. Please check your internet connection and try again.');
          }
          throw err;
        }
      });

      if (error) throw error;

      return { error: null, success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown sign up error';
      setConnectionError(errorMessage);
      return { error: error as Error, success: false };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error && error.message !== 'No current user') {
        console.error('Error signing out:', error.message);
      }

      setUser(null);
      setUserProfile(null);
      setHasPremium(false);
      setConnectionError(null);
    } catch (err) {
      console.error('Error during sign out:', err);
      setUser(null);
      setUserProfile(null);
      setHasPremium(false);
      setConnectionError(null);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setConnectionError(null);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/home`,
        },
      });
      if (error) throw error;
      return { error: null, success: true };
    } catch (error) {
      console.error('Google sign in error:', error);
      return { error: error as Error, success: false };
    }
  };

  const signInWithFacebook = async () => {
    try {
      setConnectionError(null);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/home`,
        },
      });
      if (error) throw error;
      return { error: null, success: true };
    } catch (error) {
      console.error('Facebook sign in error:', error);
      return { error: error as Error, success: false };
    }
  };

  const signInWithApple = async () => {
    try {
      setConnectionError(null);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/home`,
        },
      });
      if (error) throw error;
      return { error: null, success: true };
    } catch (error) {
      console.error('Apple sign in error:', error);
      return { error: error as Error, success: false };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      loading,
      connectionError,
      hasPremium,
      refreshPremiumStatus,
      signIn,
      signUp,
      signInWithGoogle,
      signInWithFacebook,
      signInWithApple,
      signOut,
      retryConnection
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
