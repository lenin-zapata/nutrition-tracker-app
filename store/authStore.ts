import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { authService } from '@/services/auth';
import { supabase } from '@/services/supabase';

interface AuthState {
  user: User | null;
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
    set({ loading: true });
    try {
      const session = await authService.getSession();
      set({ user: session?.user || null });
    } catch (error) {
      console.error('Error inicializando auth:', error);
      set({ user: null });
    } finally {
      set({ loading: false, initialized: true });
    }
    
    // Escuchar cambios en la autenticación
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user || null });
    });
  },
}));

