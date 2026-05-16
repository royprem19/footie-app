import { useState } from 'react';
import { useMatchStore } from '../store/matchStore';
import { MatchCard } from '../features/matches/MatchCard';
import { Search, Filter, Frown } from 'lucide-react';

export const MatchFeedPage = () => {
    const matches = useMatchStore((state) => state.matches);

    // Local state to track what the user is typing and filtering
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'open', or 'full'

    // The Magic Engine: Filter the matches before we map over them
    const filteredMatches = matches.filter((match) => {
        // 1. Check if the search term matches the venue or location
        const matchesSearch =
            match.venue_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            match.location.toLowerCase().includes(searchTerm.toLowerCase());

        // 2. Check if the match fits the selected status filter
        const matchesStatus = statusFilter === 'all' ? true : match.status === statusFilter;

        // Only keep the match if it passes BOTH tests
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="p-4 md:p-8 pb-24">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-white uppercase tracking-wide">
                    Upcoming <span className="text-primary">Matches</span>
                </h1>
                <p className="text-gray-400 mt-2">Find a turf, book your slot, and play.</p>
            </div>

            {/* Search & Filter Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 bg-surface p-4 rounded-xl border border-gray-800">

                {/* Search Bar */}
                <div className="relative flex-1">
                    <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search venues or locations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-background border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary transition-colors"
                    />
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                    <Filter size={20} className="text-gray-500 mr-1" />
                    {['all', 'open', 'full'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setStatusFilter(type)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold capitalize whitespace-nowrap transition-colors ${statusFilter === type
                                    ? 'bg-primary text-black'
                                    : 'bg-background text-gray-400 border border-gray-700 hover:text-white'
                                }`}
                        >
                            {type === 'all' ? 'All Matches' : type + ' Slots'}
                        </button>
                    ))}
                </div>

            </div>

            {/* Grid Layout */}
            {filteredMatches.length === 0 ? (
                <div className="text-center py-12 bg-surface border border-gray-800 rounded-xl">
                    <Frown size={48} className="text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Matches Found</h3>
                    <p className="text-gray-400">Try adjusting your search or filters.</p>
                    <button
                        onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
                        className="mt-6 text-primary hover:text-white text-sm font-bold underline"
                    >
                        Clear all filters
                    </button>
                </div>
            ) : (
                <div className="grid gap-5 md:grid-cols-2">
                    {filteredMatches.map((match) => (
                        <MatchCard key={match.id} match={match} />
                    ))}
                </div>
            )}
        </div>
    );
};