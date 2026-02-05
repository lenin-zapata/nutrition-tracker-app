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
  
  // Función para SOLICITAR el correo (Paso 1)
  resetPassword: (email: string) => Promise<{ error: any }>;
  
  // NUEVA FUNCIÓN: Para ACTUALIZAR la contraseña una vez dentro (Paso 3)
  updatePassword: (password: string) => Promise<{ error: any }>;
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

  resetPassword: async (email: string) => {
    set({ loading: true });
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      // Si configuras Deep Linking en el futuro, aquí va: redirectTo
    });
    set({ loading: false });
    return { error };
  },

  // IMPLEMENTACIÓN DE UPDATE PASSWORD
  updatePassword: async (password: string) => {
    set({ loading: true });
    
    // Esta función actualiza al usuario que tiene la sesión activa actualmente
    const { data, error } = await supabase.auth.updateUser({
      password: password
    });

    set({ loading: false });
    return { error };
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