import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '~/types';

/**
 * Profile Store using Zustand
 * 
 * Benefits:
 * - Optimistic UI updates
 * - Persistent state across navigation
 * - No prop drilling
 * - Simple API
 * 
 * Following SOLID principles:
 * - Single Responsibility: Only manages profile state
 * - Interface Segregation: Focused actions
 */

interface ProfileState {
  // State
  user: User | null;
  isDirty: boolean;
  isSaving: boolean;
  
  // Actions
  setUser: (user: User) => void;
  updateField: (field: keyof User, value: string) => void;
  setSaving: (saving: boolean) => void;
  reset: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      isDirty: false,
      isSaving: false,

      // Actions
      setUser: (user) => set({ user, isDirty: false }),
      
      updateField: (field, value) =>
        set((state) => ({
          user: state.user ? { ...state.user, [field]: value } : null,
          isDirty: true,
        })),
      
      setSaving: (saving) => set({ isSaving: saving }),
      
      reset: () => set({ user: null, isDirty: false, isSaving: false }),
    }),
    {
      name: 'profile-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }), // Only persist user data
    }
  )
);

/**
 * Example usage in component:
 * 
 * const { user, updateField, isDirty } = useProfileStore();
 * 
 * <input 
 *   value={user?.firstName || ''} 
 *   onChange={(e) => updateField('firstName', e.target.value)}
 * />
 * 
 * {isDirty && <span>Unsaved changes</span>}
 */
