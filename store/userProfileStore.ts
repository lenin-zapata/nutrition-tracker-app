import { create } from 'zustand';
import { UserProfile } from '@/services/supabase';
import { userProfileService } from '@/services/userProfile';

interface UserProfileState {
  profile: UserProfile | null;
  loading: boolean;
  fetchProfile: (userId: string) => Promise<void>;
  createOrUpdateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  updateProfile: (userId: string, updates: Partial<UserProfile>) => Promise<void>;
  setProfile: (profile: UserProfile | null) => void;
}

export const useUserProfileStore = create<UserProfileState>((set) => ({
  profile: null,
  loading: false,
  
  fetchProfile: async (userId: string) => {
    set({ loading: true });
    const profile = await userProfileService.getProfile(userId);
    set({ profile, loading: false });
    return profile;
  },
  
  createOrUpdateProfile: async (profile: Partial<UserProfile>) => {
    set({ loading: true });
    const updated = await userProfileService.createOrUpdateProfile(profile);
    if (updated) {
      set({ profile: updated, loading: false });
    } else {
      set({ loading: false });
    }
  },
  
  updateProfile: async (userId: string, updates: Partial<UserProfile>) => {
    set({ loading: true });
    const updated = await userProfileService.updateProfile(userId, updates);
    if (updated) {
      set({ profile: updated, loading: false });
    } else {
      set({ loading: false });
    }
  },
  
  setProfile: (profile) => set({ profile }),
}));

