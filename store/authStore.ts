import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { authService } from '@/services/auth';
import { supabase } from '@/services/supabase';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: false,
  initialized: false,

  setUser: (user) => set({ user }),

  signIn: async (email, password) => {
    set({ loading: true });
    const { data, error } = await authService.signIn(email, password);
    set({ user: data?.user || null, loading: false });
    return { error };
  },

  signUp: async (email, password) => {
    set({ loading: true });
    const { data, error } = await authService.signUp(email, password);
    set({ user: data?.user || null, loading: false });
    return { error };
  },

  signOut: async () => {
    set({ loading: true });
    await authService.signOut();
    set({ user: null, loading: false });
  },

  initialize: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Invalid session, signing out:', error);
        await supabase.auth.signOut();
        set({ session: null, user: null, initialized: true });
        return;
      }

      set({ session: data.session, user: data.session?.user ?? null, initialized: true });
    } catch (error) {
      console.error('Session initialization failed:', error);
      set({ session: null, user: null, initialized: true });
    }

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null });
    });
  },
}));
