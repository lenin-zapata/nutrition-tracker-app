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
      // Intentamos recuperar la sesión
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        // Si hay error (como el "Invalid Refresh Token"), forzamos logout
        console.log("Sesión inválida, cerrando sesión...");
        await supabase.auth.signOut();
        set({ session: null, user: null, initialized: true });
        return;
      }

      // Si todo bien, guardamos la sesión
      set({ session: data.session, user: data.session?.user ?? null, initialized: true });

    } catch (e) {
      // Si explota por cualquier otra razón
      set({ session: null, user: null, initialized: true });
    }
    
    // Escuchar cambios futuros (login, logout, auto-refresh)
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null });
    });
  },
}));

