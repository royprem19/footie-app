import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            role: 'guest',
            profile: {
                position: 'Striker',
                level: 'Intermediate',
                avatar: '⚽', // NEW: Default avatar
                bio: 'Ready to play!', // NEW: Default bio
            },

            updateProfile: (updates) => set((state) => ({
                profile: { ...state.profile, ...updates }
            })),

            loginAsPlayer: (playerName) => set({
                user: { id: `u-${Date.now()}`, name: playerName || 'Player' },
                role: 'player'
            }),

            loginAsAdmin: () => set({
                user: { id: 'a-1', name: 'Footie Admin' },
                role: 'admin'
            }),

            logout: () => set({ user: null, role: 'guest' }),
        }),
        { name: 'footie-auth-storage' }
    )
);