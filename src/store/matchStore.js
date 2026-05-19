import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useMatchStore = create(
    persist(
        (set, get) => ({
            // --- 1. INITIAL STATES ---
            token: null,
            currentUser: null,
            matches: [],
            playerBookings: [],
            users: [],
            squads: [],
            venues: [], // We will fetch real venues from Django now
            withdrawals: [],

            // --- 2. AUTHENTICATION ACTIONS ---
            login: async (username, password) => {
                try {
                    const res = await fetch('https://footie-backend.onrender.com/api/auth/login/', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username, password })
                    });

                    if (res.ok) {
                        const data = await res.json();
                        localStorage.setItem('token', data.access);
                        const userPayload = {
                            username: data.username,
                            isAdmin: data.is_admin
                        };
                        localStorage.setItem('user', JSON.stringify(userPayload));

                        set({ token: data.access, currentUser: userPayload });
                        get().fetchDatabase();

                        return userPayload;
                    }
                    return null;
                } catch (error) {
                    console.error("Login connection failed", error);
                    return null;
                }
            },

            logout: () => {
                set({ token: null, currentUser: null, playerBookings: [], squads: [], matches: [] });
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            },

            // --- 3. SECURED API ACTIONS ---
            fetchDatabase: async () => {
                const token = get().token;
                const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

                try {
                    const venueRes = await fetch('https://footie-backend.onrender.com/api/venues/', { headers });
                    const liveVenues = await venueRes.json();

                    const matchRes = await fetch('https://footie-backend.onrender.com/api/matches/', { headers });
                    const liveMatches = await matchRes.json();

                    const userRes = await fetch('https://footie-backend.onrender.com/api/users/', { headers });
                    const liveUsers = await userRes.json();

                    const squadRes = await fetch('https://footie-backend.onrender.com/api/squads/', { headers });
                    const liveSquads = await squadRes.json();

                    set({
                        venues: Array.isArray(liveVenues) ? liveVenues : [],
                        matches: Array.isArray(liveMatches) ? liveMatches : [],
                        users: Array.isArray(liveUsers) ? liveUsers : [],
                        squads: Array.isArray(liveSquads) ? liveSquads : []
                    });
                } catch (error) {
                    console.error("API connection failed", error);
                }
            },

            bookMatch: async (matchId) => {
                try {
                    const token = get().token; // Get token from state, not localstorage directly to be safe
                    const res = await fetch(`https://footie-backend.onrender.com/api/matches/${matchId}/join/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (res.ok) {
                        get().fetchDatabase();
                        return true;
                    }

                    const err = await res.json();
                    console.error("Join Rejected:", err);
                    return false;
                } catch (error) {
                    console.error("Booking connection failed", error);
                    return false;
                }
            },

            addCustomBooking: async (bookingData) => {
                const state = get();
                // Find the venue object to get its ID, as Django needs the ID, not the string name
                const venue = state.venues.find(v => v.name === bookingData.venue_name);

                if (!venue) {
                    console.error("Venue not found in database!");
                    return false;
                }

                const token = state.token;
                const headers = { 'Content-Type': 'application/json' };
                if (token) headers['Authorization'] = `Bearer ${token}`;

                // Structure the exact payload Django expects
                // Structure the exact payload Django expects
                const payload = {
                    venue: venue.id,
                    match_type: 'private',           // <--- FIX: Tells Admin Panel this is a Private Squad
                    date: bookingData.date,
                    datetime: bookingData.datetime,
                    time_slots: bookingData.time_slots, // <--- FIX: Sends the exact hours to the database!
                    total_slots: bookingData.total_slots || 14,
                    filled_slots: bookingData.filled_slots || 1,
                    price_inr: bookingData.price_inr
                };

                try {
                    const response = await fetch('https://footie-backend.onrender.com/api/matches/', {
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify(payload)
                    });

                    if (response.ok) {
                        get().fetchDatabase();
                        return true;
                    } else {
                        const err = await response.json();
                        console.error("Django rejected the custom booking creation:", err);
                        return false;
                    }
                } catch (error) {
                    console.error("Failed to connect to Django API", error);
                    return false;
                }
            },
            addVenue: async (venueData) => {
                const token = get().token;
                const headers = { 'Content-Type': 'application/json' };
                if (token) headers['Authorization'] = `Bearer ${token}`;

                try {
                    const response = await fetch('https://footie-backend.onrender.com/api/venues/', {
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify({
                            name: venueData.name,
                            location: venueData.location,
                            // THE FIX: Changed from 'size' to 'pitch_size' to match Django!
                            pitch_size: venueData.size || venueData.pitch_size || '5v5',
                            price_per_hour: venueData.price_per_hour,
                            color: 'from-blue-800 to-blue-900',
                            rating: 'New',
                            desc: 'Newly added premium turf.'
                        })
                    });

                    if (response.ok) {
                        console.log("Venue saved to Django successfully!");
                        get().fetchDatabase(); // Instantly refresh the UI!
                        return true;
                    } else {
                        const err = await response.json();
                        console.error("Django rejected the venue:", err);
                        return false;
                    }
                } catch (error) {
                    console.error("Failed to connect to Django API", error);
                    return false;
                }
            },
            addMatch: async (matchData) => {
                const token = get().token;
                const headers = { 'Content-Type': 'application/json' };
                if (token) headers['Authorization'] = `Bearer ${token}`;

                try {
                    const response = await fetch('https://footie-backend.onrender.com/api/matches/', {
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify(matchData)
                    });

                    if (response.ok) {
                        get().fetchDatabase(); // Refresh ledger
                        return true;
                    } else {
                        console.error("Django rejected Open Match:", await response.json());
                        return false;
                    }
                } catch (error) {
                    console.error("Failed to connect to API", error);
                    return false;
                }
            },

            createSquad: async (squadName) => {
                const token = get().token;
                const headers = { 'Content-Type': 'application/json' };
                if (token) headers['Authorization'] = `Bearer ${token}`;

                try {
                    const response = await fetch('https://footie-backend.onrender.com/api/squads/', {
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify({ name: squadName })
                    });

                    if (response.ok) {
                        get().fetchDatabase();
                        return true;
                    }
                    return false;
                } catch (error) {
                    console.error("API connection failed", error);
                    return false;
                }
            },



            cancelBooking: async (matchId) => {
                const token = get().token;
                const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

                try {
                    const response = await fetch(`https://footie-backend.onrender.com/api/matches/${matchId}/`, {
                        method: 'DELETE',
                        headers: headers
                    });

                    if (response.ok) {
                        get().fetchDatabase();
                    } else {
                        console.error("Django refused to cancel booking.");
                    }
                } catch (error) {
                    console.error("Failed to connect to API to cancel booking", error);
                }
            },
            // THE NEW FIX: Lets a player back out of an open match without destroying it!
            leaveMatch: async (matchId) => {
                const token = get().token;
                try {
                    const response = await fetch(`https://footie-backend.onrender.com/api/matches/${matchId}/leave/`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (response.ok) {
                        console.log("Successfully left the open match!");
                        get().fetchDatabase(); // Instantly refresh UI
                        return true;
                    } else {
                        console.error("Failed to leave match", await response.json());
                        return false;
                    }
                } catch (error) {
                    console.error("Network error leaving match", error);
                    return false;
                }
            },
            completeMatch: async (matchId) => {
                const token = get().token;
                try {
                    const response = await fetch(`https://footie-backend.onrender.com/api/matches/${matchId}/`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ status: 'completed' })
                    });

                    if (response.ok) {
                        console.log("Match updated to completed status in database!");
                        get().fetchDatabase(); // Refresh the ledger view instantly
                        return true;
                    } else {
                        const err = await response.json();
                        console.error("Django rejected match status modification:", err);
                        return false;
                    }
                } catch (error) {
                    console.error("Failed to connect to API to complete match", error);
                    return false;
                }
            }
        }),
        { name: 'footie-match-storage' }
    )
);
