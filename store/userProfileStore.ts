import { create } from 'zustand';
import { supabase } from '@/services/supabase';

// Define la estructura de tu perfil
interface UserProfile {
  id: string;
  email?: string | null;
  age?: number;
  weight_kg?: number;
  height_cm?: number;
  activity_level?: string;
  goal?: string;
  bmr?: number;
  tdee?: number;
  daily_calorie_goal?: number;
  daily_protein_goal?: number;
  daily_carbs_goal?: number;
  daily_fats_goal?: number;
}

interface UserProfileState {
  profile: UserProfile | null;
  loading: boolean;
  
  // Acciones
  fetchProfile: (userId: string) => Promise<boolean>; 
  createOrUpdateProfile: (profile: UserProfile) => Promise<void>;
  clearProfile: () => void;
}

export const useUserProfileStore = create<UserProfileState>((set) => ({
  profile: null,
  loading: false,

  fetchProfile: async (userId: string) => {
    set({ loading: true });
    console.log("🔍 [STORE] Buscando perfil para ID:", userId);

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // El error PGRST116 significa "No se encontraron filas", lo cual es normal si es usuario nuevo
        if (error.code === 'PGRST116') {
            console.log("⚠️ [STORE] Usuario nuevo (no tiene fila en DB). Ir a Onboarding.");
        } else {
            console.error("❌ [STORE] Error de Supabase:", error.message, error.code);
        }
        set({ profile: null, loading: false });
        return false; 
      }

      if (!data) {
        console.log("⚠️ [STORE] Data es null. Ir a Onboarding.");
        set({ profile: null, loading: false });
        return false;
      }

      // Validación opcional: ¿Tiene los datos críticos?
      // Si permites perfiles a medias, quita este if.
      if (!data.weight_kg || !data.height_cm) {
         console.log("⚠️ [STORE] Perfil existe pero está incompleto. Ir a Onboarding.");
         set({ profile: data, loading: false }); // Guardamos lo que hay, pero retornamos false para forzar edición
         return false; 
      }

      console.log("✅ [STORE] Perfil completo encontrado. Ir a Home.");
      set({ profile: data, loading: false });
      return true; 

    } catch (error) {
      console.error('❌ [STORE] Error inesperado:', error);
      set({ profile: null, loading: false });
      return false;
    }
  },

  createOrUpdateProfile: async (profileData) => {
    set({ loading: true });
    console.log("💾 [STORE] Guardando perfil...", profileData);
    
    const { error } = await supabase
      .from('user_profiles')
      .upsert(profileData);

    if (error) {
        console.error("❌ [STORE] Error al guardar:", error.message);
        throw error;
    }
    
    console.log("✅ [STORE] Perfil guardado con éxito.");
    set({ profile: profileData, loading: false });
  },

  clearProfile: () => set({ profile: null }),
}));