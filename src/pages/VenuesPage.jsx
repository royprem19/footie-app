import { Link } from 'react-router-dom';
import { MapPin, Star, Shield, Car, Droplets, Lightbulb } from 'lucide-react';
import { useMatchStore } from '../store/matchStore';

export const VenuesPage = () => {
    // Pull the live venues from the database!
    const { venues } = useMatchStore();

    // Fallback gradients so admin-created turfs look beautiful automatically
    const defaultGradients = [
        'from-green-500/20 to-emerald-900/40',
        'from-blue-500/20 to-indigo-900/40',
        'from-purple-500/20 to-fuchsia-900/40',
        'from-orange-500/20 to-red-900/40'
    ];

    return (
        <div className="p-4 md:p-8 pb-24 max-w-6xl mx-auto animate-in fade-in duration-500">
            <div className="mb-8 border-b border-gray-800 pb-4">
                <h1 className="text-3xl font-black text-white uppercase tracking-wide">
                    Partner <span className="text-primary">Venues</span>
                </h1>
                <p className="text-gray-400 mt-2">Explore the best pitches in your city.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {venues.map((venue, index) => {
                    // If the venue doesn't have a hardcoded color/rating, give it a default one
                    const color = venue.color || defaultGradients[index % defaultGradients.length];
                    const rating = venue.rating || 'New';

                    return (
                        <div key={venue.id} className="bg-surface border border-gray-800 rounded-2xl overflow-hidden shadow-lg hover:border-gray-600 transition-all group flex flex-col">

                            {/* Graphic Banner */}
                            <div className={`h-48 bg-gradient-to-br ${color} relative flex items-center justify-center`}>
                                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full flex items-center text-sm font-bold text-white">
                                    <Star size={14} className="text-yellow-400 fill-yellow-400 mr-1" /> {rating}
                                </div>
                                <Shield size={48} className="text-white/20 group-hover:scale-110 transition-transform duration-500" />
                            </div>

                            {/* Info Block */}
                            <div className="p-5 flex flex-col flex-grow">
                                <h2 className="text-xl font-black text-white">{venue.name}</h2>
                                <div className="text-sm text-gray-400 flex items-center mt-1 mb-4">
                                    <MapPin size={14} className="mr-1 text-primary" /> {venue.location}
                                </div>

                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex gap-2 text-gray-500">
                                        <div className="p-2 border border-gray-800 rounded-lg"><Car size={14} /></div>
                                        <div className="p-2 border border-gray-800 rounded-lg"><Lightbulb size={14} /></div>
                                        <div className="p-2 border border-gray-800 rounded-lg"><Droplets size={14} /></div>
                                    </div>
                                    <div className="text-xs font-bold text-gray-400 border border-gray-800 px-3 py-1.5 rounded-lg bg-background">
                                        {venue.size || 'Standard Pitch'}
                                    </div>
                                </div>

                                <div className="mt-auto">
                                    <Link to={`/venues/${venue.id}`} className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-xl transition-all flex justify-center">
                                        View Ground Details
                                    </Link>
                                </div>
                            </div>

                        </div>
                    );
                })}
            </div>
        </div>
    );
};