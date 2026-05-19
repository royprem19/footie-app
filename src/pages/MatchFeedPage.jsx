import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMatchStore } from '../store/matchStore';
import { Search, MapPin, Calendar, Users, Filter, Sun, CloudRain, CloudLightning, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export const MatchFeedPage = () => {
    const { matches, venues } = useMatchStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // 'all', 'open', 'full'

    // THE FIX 1: Only show public open plays! Strictly hide 'private' bookings from the global feed.
    const liveMatches = matches.filter(m =>
        (m.status === 'open' || m.status === 'active') &&
        m.match_type !== 'private'
    );

    // Search Engine Logic
    const filteredMatches = liveMatches.filter(match => {
        const vName = match.venue_name || "";
        const vLoc = match.location || "";
        const matchesSearch = vName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vLoc.toLowerCase().includes(searchTerm.toLowerCase());

        if (filter === 'open') return matchesSearch && (match.filled_slots || 0) < (match.total_slots || 14);
        if (filter === 'full') return matchesSearch && (match.filled_slots || 0) >= (match.total_slots || 14);
        return matchesSearch;
    });

    // Mock Weather Generator
    const getWeather = (id) => {
        if (!id) return { icon: <Sun size={16} className="text-orange-400" />, text: "Clear Skies" };
        const idString = String(id);
        if (idString.length % 3 === 0) return { icon: <CloudRain size={16} className="text-blue-400" />, text: "Rain Expected" };
        if (idString.length % 2 === 0) return { icon: <CloudLightning size={16} className="text-yellow-500" />, text: "Thunderstorms" };
        return { icon: <Sun size={16} className="text-orange-400" />, text: "Clear Skies" };
    };

    return (
        <div className="p-4 md:p-8 pb-24 animate-in fade-in duration-500 max-w-5xl mx-auto">

            {/* Header & Search Bar */}
            <div className="mb-8 border-b border-gray-800 pb-6">
                <h1 className="text-3xl font-black text-white uppercase tracking-wide mb-6">
                    Upcoming <span className="text-primary">Matches</span>
                </h1>

                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                        <input
                            type="text"
                            placeholder="Search venues or locations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-surface border border-gray-800 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>

                    <div className="flex gap-2">
                        <button onClick={() => setFilter('all')} className={`px-6 py-4 rounded-xl font-bold text-sm transition-all ${filter === 'all' ? 'bg-primary text-black' : 'bg-surface text-gray-400 border border-gray-800 hover:text-white'}`}>All</button>
                        <button onClick={() => setFilter('open')} className={`px-6 py-4 rounded-xl font-bold text-sm transition-all ${filter === 'open' ? 'bg-primary text-black' : 'bg-surface text-gray-400 border border-gray-800 hover:text-white'}`}>Open Slots</button>
                    </div>
                </div>
            </div>

            {/* Match Grid */}
            <div className="grid md:grid-cols-2 gap-6">
                {filteredMatches.length === 0 ? (
                    <div className="md:col-span-2 text-center py-12 text-gray-500 border border-dashed border-gray-800 rounded-2xl bg-surface/50">
                        <Filter size={48} className="mx-auto mb-4 opacity-20" />
                        No matches found for your search criteria.
                    </div>
                ) : (
                    filteredMatches.map((match, i) => {
                        const isFull = (match.filled_slots || 0) >= (match.total_slots || 14);
                        const weather = getWeather(match.id);
                        const displayDate = match.date || (match.datetime && match.datetime.split('T')[0]) || "Date TBD";
                        const displayTime = match.time_slots?.length > 0 ? match.time_slots.join(', ') : "Time TBD";

                        // THE FIX: Look up the real venue name and location!
                        const venueDetails = venues?.find(v => String(v.id) === String(match.venue));
                        const displayVenueName = venueDetails ? venueDetails.name : match.venue_name || "Premium Turf";
                        const displayLocation = venueDetails ? venueDetails.location : match.location || "Location Directory TBD";

                        return (
                            <motion.div
                                key={match.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                className="bg-surface border border-gray-800 rounded-2xl p-6 shadow-lg hover:border-gray-600 transition-colors relative overflow-hidden group"
                            >
                                {isFull && <div className="absolute top-4 right-4 bg-danger/10 text-danger border border-danger/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Sold Out</div>}

                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        {/* THE FIX: Use the mapped variables */}
                                        <h3 className="text-xl font-black text-white">{displayVenueName}</h3>
                                        <div className="text-sm text-gray-400 flex items-center mt-1">
                                            <MapPin size={14} className="mr-1 text-primary" /> {displayLocation}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-black text-secondary">₹{match.price_inr}</div>
                                        <div className="text-[10px] text-gray-500 uppercase tracking-wider">Per Player</div>
                                    </div>
                                </div>

                                {/* THE NEW DATE & TIME BUBBLE UI */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    <div className="bg-background border border-gray-800 px-3 py-2 rounded-lg flex items-center text-xs font-bold text-primary">
                                        <Calendar size={14} className="mr-2" />
                                        {displayDate}
                                    </div>
                                    <div className="bg-background border border-gray-800 px-3 py-2 rounded-lg flex items-center text-xs font-bold text-white">
                                        <Clock size={14} className="mr-2 text-gray-400" />
                                        {displayTime}
                                    </div>
                                    <div className="bg-background border border-gray-800 px-3 py-2 rounded-lg flex items-center text-xs font-bold text-gray-300">
                                        {weather.icon} <span className="ml-2">{weather.text}</span>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-6">
                                    <div className="flex justify-between text-xs font-bold mb-2">
                                        <span className="text-gray-400 flex items-center"><Users size={14} className="mr-1" /> Roster</span>
                                        <span className={isFull ? "text-danger" : "text-primary"}>{match.filled_slots || 0} / {match.total_slots || 14} Filled</span>
                                    </div>
                                    <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ${isFull ? 'bg-danger' : 'bg-primary'}`}
                                            style={{ width: `${((match.filled_slots || 0) / (match.total_slots || 14)) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <Link
                                    to={isFull ? "#" : `/matches/${match.id}`}
                                    className={`block text-center w-full font-bold py-3 rounded-xl transition-all ${isFull
                                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                        : 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-black shadow-[0_0_15px_rgba(44,224,15,0.1)] hover:shadow-[0_0_20px_rgba(44,224,15,0.3)]'
                                        }`}
                                >
                                    {isFull ? 'Waitlist Only' : 'Join Match & Pay'}
                                </Link>
                            </motion.div>
                        );
                    })
                )}
            </div>
        </div>
    );
};