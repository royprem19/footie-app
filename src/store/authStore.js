import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            token: null, // THE FIX: Real JWT Token storage!
            role: 'guest',
            profile: {
                position: 'Striker',
                level: 'Intermediate',
                avatar: '⚽',
                bio: 'Ready to play!',
                caps: 0,
                title: 'Rookie'
            },

            // 1. REAL LOGIN FUNCTION
            login: async (username, password) => {
                try {
                    const res = await fetch('https://footie-backend.onrender.com/api/auth/login/', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username, password })
                    });

                    if (res.ok) {
                        const data = await res.json();

                        const isManager = username.toLowerCase().includes('admin');

                        // Catch all the gamification data Django sends us!
                        set({
                            token: data.access,
                            user: { username: data.username },
                            role: isManager ? 'admin' : 'player',
                            profile: {
                                position: data.position || 'Striker',
                                level: data.level || 'Intermediate',
                                avatar: data.avatar || '⚽',
                                bio: data.bio || 'Ready to play!',
                                caps: data.caps || 0,
                                title: data.title || 'Rookie'
                            }
                        });

                        toast.success(`Welcome back, ${data.username}!`);
                        return true;
                    } else {
                        const errorData = await res.json();
                        toast.error(errorData.detail || "Invalid credentials");
                        return false;
                    }
                } catch (error) {
                    console.error("Login failed", error);
                    toast.error("Network error. Is the server running?");
                    return false;
                }
            },

            // 2. REAL REGISTER FUNCTION
            register: async (username, password, email) => {
                try {
                    const res = await fetch('https://footie-backend.onrender.com/api/auth/register/', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username, password, email })
                    });

                    if (res.ok) {
                        toast.success("Account created! Logging you in...");
                        // Automatically log them in after registration
                        return await get().login(username, password);
                    } else {
                        toast.error("Registration failed. Username might be taken.");
                        return false;
                    }
                } catch (error) {
                    toast.error("Network error during registration.");
                    return false;
                }
            },

            updateProfile: (updates) => set((state) => ({
                profile: { ...state.profile, ...updates }
            })),

            // 3. SECURE LOGOUT
            logout: () => {
                set({ user: null, token: null, role: 'guest' });
                toast.success("Logged out successfully");
            },
        }),
        {
            name: 'footie-auth-storage' // Zustand saves the token to localStorage automatically!
        }
    )
);