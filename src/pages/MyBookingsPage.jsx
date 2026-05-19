import React, { useState } from 'react';
import { useMatchStore } from '../store/matchStore';
import { Calendar, History, Receipt, MapPin, IndianRupee, XCircle, QrCode } from 'lucide-react';

const MyBookingsPage = () => {
    // GOOD: Hook is safely inside the component!
    const { matches, venues, currentUser, cancelBooking, leaveMatch } = useMatchStore();

    const [activeTab, setActiveTab] = useState('upcoming');
    // ...

    // --- THE DETECTIVE TOOL ---
    console.log("CURRENT USER CREDENTIALS:", currentUser);
    console.log("DJANGO SENT THESE MATCHES:", matches);
    console.log("GLOBAL DIRECTORY VENUES:", venues);

    // 2. DYNAMIC AUTH FILTER: Filter matches that belong to your logged-in profile
    const myAllMatches = matches.filter(match => {
        if (!currentUser || !currentUser.username) return false;

        // Did I create/host this match?
        const isCreator = match.creator_name === currentUser.username;

        // Did I join this match as a player? (Safely check the array)
        const isPlayer = (match.player_usernames || []).includes(currentUser.username);

        return isCreator || isPlayer;
    });

    // 3. Split them into Upcoming and History tabs
    const upcomingMatches = myAllMatches.filter(m => m.status !== 'completed' && m.status !== 'cancelled');
    const pastMatches = myAllMatches.filter(m => m.status === 'completed' || m.status === 'cancelled');

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-black mb-8 text-green-400">MY DASHBOARD</h1>

                {/* --- THE TAB NAVIGATION --- */}
                <div className="flex space-x-4 border-b border-gray-800 mb-6">
                    <button
                        onClick={() => setActiveTab('upcoming')}
                        className={`flex items-center pb-3 px-4 font-bold transition-colors ${activeTab === 'upcoming' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-500 hover:text-white'}`}
                    >
                        <Calendar className="w-5 h-5 mr-2" /> Upcoming
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`flex items-center pb-3 px-4 font-bold transition-colors ${activeTab === 'history' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-500 hover:text-white'}`}
                    >
                        <History className="w-5 h-5 mr-2" /> History
                    </button>
                    <button
                        onClick={() => setActiveTab('transactions')}
                        className={`flex items-center pb-3 px-4 font-bold transition-colors ${activeTab === 'transactions' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-500 hover:text-white'}`}
                    >
                        <Receipt className="w-5 h-5 mr-2" /> Transactions
                    </button>
                </div>

                {/* --- TAB 1: UPCOMING MATCHES --- */}
                {activeTab === 'upcoming' && (
                    <div className="space-y-4">
                        {upcomingMatches.length === 0 ? (
                            <p className="text-gray-500">No upcoming matches scheduled.</p>
                        ) : (
                            upcomingMatches.map(match => {
                                // THE FIX: Look up the real venue name and location using the match.venue relation ID
                                const venueDetails = venues.find(v => String(v.id) === String(match.venue));
                                const displayVenueName = venueDetails ? venueDetails.name : match.venue_name || "Premium Turf";
                                const displayLocation = venueDetails ? venueDetails.location : match.location || "Location Directory TBD";
                                const displayTime = match.time_slots?.length > 0 ? match.time_slots.join(', ') : "Time TBD";
                                if (match.datetime && match.datetime.includes('T')) {
                                    const timePart = match.datetime.split('T')[1].substring(0, 5);
                                    let [h, m] = timePart.split(':');
                                    let suffix = "AM";
                                    let hourInt = parseInt(h);
                                    if (hourInt >= 12) { suffix = "PM"; if (hourInt > 12) hourInt -= 12; }
                                    if (hourInt === 0) hourInt = 12;
                                    displayTime = `${hourInt.toString().padStart(2, '0')}:${m} ${suffix}`;
                                }

                                return (
                                    <div key={match.id} className="bg-[#111] border border-gray-800 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div className="w-full">
                                            <h3 className="text-xl font-black text-white">{displayVenueName}</h3>
                                            <p className="text-gray-400 flex items-center mt-1 text-sm">
                                                <MapPin className="w-4 h-4 mr-1 text-green-400" /> {displayLocation}
                                            </p>

                                            {/* TIME & DATE BUBBLES */}
                                            <div className="flex gap-2 mt-3">
                                                <span className="text-green-400 font-mono bg-green-900/20 px-3 py-1 rounded text-sm border border-green-900/50">
                                                    {match.date || (match.datetime && match.datetime.split('T')[0])}
                                                </span>
                                                <span className="text-white font-mono bg-gray-800 px-3 py-1 rounded text-sm border border-gray-700">
                                                    {displayTime}
                                                </span>
                                            </div>

                                            {/* THE SECRET ENTRY PIN CODE */}
                                            <div className="mt-4 pt-4 border-t border-gray-800 w-full max-w-sm flex justify-between items-center bg-black/40 px-4 py-2 rounded-lg border-dashed">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">Entry PIN</span>
                                                </div>
                                                <span className="text-lg font-black text-white tracking-widest">
                                                    FT-{match.id.toString().padStart(4, '0')}
                                                </span>
                                            </div>
                                        </div>

                                        {/* THE SMART CANCEL BUTTON */}
                                        <button
                                            onClick={() => {
                                                // Check if the logged-in user is the one who created the match
                                                const isCreator = match.creator_name === currentUser.username;

                                                if (isCreator) {
                                                    // Nuclear Option: Kills the match (Private Squads / Admin Hosts)
                                                    cancelBooking(match.id);
                                                } else {
                                                    // Player Option: Removes them from roster, keeps match alive for others!
                                                    leaveMatch(match.id);
                                                }
                                            }}
                                            className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-4 py-3 rounded-lg font-bold transition-all flex items-center shrink-0 w-full md:w-auto justify-center border border-red-500/20 hover:border-red-500"
                                        >
                                            <XCircle className="w-5 h-5 mr-2" />
                                            {match.creator_name === currentUser?.username ? 'Cancel Entire Match' : 'Leave Match'}
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}

                {/* --- TAB 2: HISTORY --- */}
                {activeTab === 'history' && (
                    <div className="space-y-4">
                        {pastMatches.length === 0 ? (
                            <p className="text-gray-500">You haven't completed any matches yet.</p>
                        ) : (
                            pastMatches.map(match => {
                                const venueDetails = venues.find(v => String(v.id) === String(match.venue));
                                const displayVenueName = venueDetails ? venueDetails.name : match.venue_name || "Premium Turf";

                                return (
                                    <div key={match.id} className="bg-[#111] border border-gray-800 rounded-xl p-6 opacity-75">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-300">{displayVenueName}</h3>
                                                <p className="text-gray-500 mt-1">{match.date}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded font-bold text-sm ${match.status === 'cancelled' ? 'bg-red-900/30 text-red-400' : 'bg-gray-800 text-gray-300'}`}>
                                                {match.status.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}

                {/* --- TAB 3: TRANSACTIONS (RECEIPTS) --- */}
                {activeTab === 'transactions' && (
                    <div className="bg-[#111] border border-gray-800 rounded-xl overflow-hidden">
                        <div className="p-4 bg-[#1a1a1a] border-b border-gray-800 grid grid-cols-4 font-bold text-gray-400">
                            <div className="col-span-2">Description</div>
                            <div>Date</div>
                            <div className="text-right">Amount</div>
                        </div>
                        {myAllMatches.length === 0 ? (
                            <div className="p-6 text-gray-500">No transactions found.</div>
                        ) : (
                            myAllMatches.map(match => {
                                const venueDetails = venues?.find(v => String(v.id) === String(match.venue));
                                const displayVenueName = venueDetails ? venueDetails.name : match.venue_name || "Premium Turf";

                                const isRefund = match.status === 'cancelled';

                                // THE FIX: Visually add the ₹15 platform fee so it matches the database!
                                const displayAmount = match.price_inr + 15;

                                return (
                                    <div key={match.id} className="p-4 border-b border-gray-800/50 grid grid-cols-4 items-center hover:bg-[#161616] transition-colors">
                                        <div className="col-span-2">
                                            <p className={`font-bold ${isRefund ? 'text-green-400' : 'text-white'}`}>
                                                {isRefund ? 'Refund Processed' : 'Pitch Booking'}
                                            </p>
                                            <p className="text-sm text-gray-500">{displayVenueName}</p>
                                        </div>
                                        <div className="text-gray-400 font-mono text-sm">
                                            {match.date || (match.datetime && match.datetime.split('T')[0])}
                                        </div>
                                        <div className={`text-right font-bold flex items-center justify-end ${isRefund ? 'text-green-400' : 'text-white'}`}>
                                            {isRefund ? '+' : '-'} <IndianRupee className="w-4 h-4 mx-1" />
                                            {displayAmount}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

export default MyBookingsPage;