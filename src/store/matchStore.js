import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { dummyMatches } from '../services/mockData';

export const useMatchStore = create(
    persist(
        (set) => ({
            matches: dummyMatches,
            playerBookings: [],

            addMatch: (newMatch) => set((state) => ({
                matches: [{
                    ...newMatch,
                    id: `m-${Date.now()}`,
                    filled_slots: 0,
                    status: 'open',
                    roster: []
                }, ...state.matches]
            })),

            bookSlot: (matchId, playerDetails) => set((state) => ({
                matches: state.matches.map(match => {
                    if (match.id === matchId) {
                        const newFilledSlots = match.filled_slots + 1;
                        return {
                            ...match,
                            filled_slots: newFilledSlots,
                            status: newFilledSlots >= match.total_slots ? 'full' : 'open',
                            roster: [...(match.roster || []), playerDetails]
                        };
                    }
                    return match;
                }),
                playerBookings: [...state.playerBookings, matchId]
            })),

            // The Cancellation Engine
            cancelBooking: (matchId, playerId) => set((state) => ({
                matches: state.matches.map(match => {
                    if (match.id === matchId) {
                        return {
                            ...match,
                            filled_slots: Math.max(0, match.filled_slots - 1),
                            status: 'open',
                            roster: (match.roster || []).filter(p => p.id !== playerId)
                        };
                    }
                    return match;
                }),
                // Ensure we remove it from the player's wallet too!
                playerBookings: state.playerBookings.filter(id => id !== matchId)
            })),

            // Admin Action to lock a game
            completeMatch: (matchId) => set((state) => ({
                matches: state.matches.map(match =>
                    match.id === matchId ? { ...match, status: 'completed' } : match
                )
            }))

        }),
        { name: 'footie-match-storage' }
    )
);