import { supabase, UserProfile } from './supabase';

export const userProfileService = {
  async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    // PGRST116 significa "no rows found" - esto es normal para usuarios nuevos
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
      return null;
    }
    
    // Si no hay error o el error es PGRST116, retornar data (que será null si no existe)
    return data;
  },

  async createOrUpdateProfile(profile: Partial<UserProfile>): Promise<UserProfile | null> {
    const userId = profile.id;
    if (!userId) return null;

    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        ...profile,
        id: userId,
      }, {
        onConflict: 'id',
      })
      .select()
      .single();

    if (error) {
      console.error('Error upserting profile:', error);
      return null;
    }
    return data;
  },

  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return null;
    }
    return data;
  },
};

