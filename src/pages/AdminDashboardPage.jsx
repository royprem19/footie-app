import { Users, X, Calendar, Activity, IndianRupee, TrendingUp, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useMatchStore } from '../store/matchStore';
export const AdminDashboardPage = () => {
    const { matches, addMatch, completeMatch } = useMatchStore();
    const [successMessage, setSuccessMessage] = useState("");
    const [selectedMatch, setSelectedMatch] = useState(null);

    const liveMatches = matches.filter(m => m.status !== 'completed');

    // ANALYTICS CALCULATIONS
    const totalRevenue = matches.reduce((sum, match) => sum + (match.filled_slots * match.price_inr), 0);
    const totalPlayers = matches.reduce((sum, match) => sum + match.filled_slots, 0);
    const totalMatches = matches.length;

    const handleCreateMatch = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        addMatch({
            venue_name: formData.get('venue_name'),
            location: formData.get('location'),
            datetime: formData.get('datetime'),
            total_slots: parseInt(formData.get('total_slots')),
            price_inr: parseInt(formData.get('price_inr')),
        });
        e.target.reset();
        setSuccessMessage("Match successfully created!");
        setTimeout(() => setSuccessMessage(""), 3000);
    };

    return (
        <div className="p-4 md:p-8 pb-24 animate-in fade-in duration-500">
            <div className="mb-8 border-b border-gray-800 pb-4">
                <h1 className="text-3xl font-black text-white uppercase tracking-wide">
                    Admin <span className="text-secondary">Dashboard</span>
                </h1>
                <p className="text-gray-400 mt-2">Manage your turf bookings, rosters, and revenue.</p>
            </div>

            {/* NEW: Analytics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-surface border border-gray-800 rounded-xl p-5 shadow-lg relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity"><IndianRupee size={100} /></div>
                    <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total Revenue</div>
                    <div className="text-3xl font-black text-secondary">₹{totalRevenue.toLocaleString()}</div>
                </div>

                <div className="bg-surface border border-gray-800 rounded-xl p-5 shadow-lg relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity"><Users size={100} /></div>
                    <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total Players Booked</div>
                    <div className="text-3xl font-black text-primary">{totalPlayers}</div>
                </div>

                <div className="bg-surface border border-gray-800 rounded-xl p-5 shadow-lg relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity"><TrendingUp size={100} /></div>
                    <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Active Matches</div>
                    <div className="text-3xl font-black text-white">{totalMatches}</div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Match Creation Form */}
                <div className="bg-surface border border-gray-800 rounded-xl p-6 h-fit shadow-lg">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                        <span className="w-2 h-6 bg-secondary mr-3 rounded-full"></span>
                        Create New Match
                    </h2>

                    {successMessage && (
                        <div className="bg-green-900/50 border border-primary text-primary p-3 rounded mb-6 text-sm font-medium">
                            {successMessage}
                        </div>
                    )}

                    <form onSubmit={handleCreateMatch} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Venue Name</label>
                            <input required name="venue_name" type="text" className="w-full bg-background border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-secondary transition-colors" placeholder="e.g. Kickoff Arena" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Location Address</label>
                            <input required name="location" type="text" className="w-full bg-background border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-secondary transition-colors" placeholder="e.g. Sector 42, Main Road" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Date & Time</label>
                            <input required name="datetime" type="datetime-local" className="w-full bg-background border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-secondary transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Total Slots</label>
                            <input required name="total_slots" type="number" min="2" max="22" className="w-full bg-background border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-secondary transition-colors" placeholder="14" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Price Per Player (₹)</label>
                            <input required name="price_inr" type="number" min="50" className="w-full bg-background border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-secondary transition-colors" placeholder="250" />
                        </div>
                        <button type="submit" className="md:col-span-2 mt-4 bg-secondary text-black font-bold py-3 rounded-lg hover:bg-[#00cce6] transition-colors active:scale-[0.98]">
                            Publish Match
                        </button>
                    </form>
                </div>

                {/* Live Match Management */}
                <div>
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                        <span className="w-2 h-6 bg-primary mr-3 rounded-full"></span>
                        Live Matches
                    </h2>
                    <div className="flex flex-col gap-4">
                        {liveMatches.map((match) => (
                            <div key={match.id} className="bg-surface border border-gray-800 rounded-xl p-4 flex justify-between items-center hover:border-gray-600 transition-colors shadow-lg">
                                <div>
                                    <h3 className="font-bold text-white">{match.venue_name}</h3>
                                    <div className="text-xs text-gray-400 flex items-center mt-1">
                                        <Activity size={12} className="mr-1 text-primary" />
                                        {match.filled_slots} / {match.total_slots} Slots Filled
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedMatch(match)}
                                    className="bg-gray-800 text-secondary text-sm font-bold py-2 px-4 rounded hover:bg-secondary hover:text-black transition-colors"
                                >
                                    View Roster
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Roster Modal */}
            {selectedMatch && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-surface border border-gray-800 rounded-xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-background">
                            <h3 className="font-bold text-white flex items-center">
                                <Users size={18} className="mr-2 text-secondary" /> Player Roster
                            </h3>
                            <button onClick={() => setSelectedMatch(null)} className="text-gray-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="mb-6">
                            <h4 className="text-lg font-black text-white">{selectedMatch.venue_name}</h4>
                            <div className="text-sm text-gray-400 flex items-center mt-1">
                                <Calendar size={14} className="mr-1" />
                                {new Date(selectedMatch.datetime).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </div>

                            {/* NEW: Complete Match Action */}
                            {selectedMatch.status !== 'completed' && (
                                <button
                                    onClick={() => {
                                        completeMatch(selectedMatch.id);
                                        setSelectedMatch(null);
                                    }}
                                    className="mt-4 w-full bg-gray-800 hover:bg-green-900/50 text-gray-300 hover:text-primary border border-gray-700 hover:border-primary py-2 rounded-lg text-sm font-bold flex items-center justify-center transition-all"
                                >
                                    <CheckCircle size={16} className="mr-2" /> Mark Match as Completed
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="bg-background rounded-lg border border-gray-800 overflow-hidden">
                        <div className="bg-gray-900/50 p-3 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-800 flex justify-between">
                            <span>Paid Players ({selectedMatch.filled_slots}/{selectedMatch.total_slots})</span>
                            <span className="text-secondary">₹{selectedMatch.filled_slots * selectedMatch.price_inr}</span>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                            {selectedMatch.filled_slots === 0 ? (
                                <div className="p-4 text-center text-gray-500 text-sm">No players have booked slots yet.</div>
                            ) : (
                                <ul className="divide-y divide-gray-800">
                                    {(selectedMatch.roster || []).map((player, i) => (
                                        <li key={i} className="p-3 flex items-center justify-between hover:bg-gray-800/50 transition-colors">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-primary text-black flex items-center justify-center mr-3 font-black text-sm">
                                                    {player.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-white">{player.name}</div>
                                                    <div className="text-xs flex gap-2 mt-0.5">
                                                        <span className="text-secondary font-medium">{player.position}</span>
                                                        <span className="text-gray-500">•</span>
                                                        <span className="text-gray-400">{player.level}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                    {/* Fallback for old dummy data */}
                                    {Array.from({ length: selectedMatch.filled_slots - (selectedMatch.roster?.length || 0) }).map((_, i) => (
                                        <li key={`anon-${i}`} className="p-3 flex items-center text-sm text-gray-500">
                                            <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center mr-3 text-xs font-bold">?</div>
                                            Unknown Legacy Player
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

            )}
        </div >
    );
};