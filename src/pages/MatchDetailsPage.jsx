import { useParams, useNavigate } from 'react-router-dom';
import { useMatchStore } from '../store/matchStore';
import { MapPin, Calendar, ShieldCheck, Share2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export const MatchDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const match = useMatchStore((state) => state.matches.find(m => m.id === id));

    if (!match) return <div className="p-20 text-center">Match not found.</div>;

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
    };

    return (
        <div className="p-4 md:p-8 animate-in fade-in duration-500">
            <button onClick={() => navigate(-1)} className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors">
                <ArrowLeft size={18} className="mr-2" /> Back to Feed
            </button>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-surface p-8 rounded-2xl border border-gray-800">
                        <h1 className="text-4xl font-black text-white mb-4">{match.venue_name}</h1>
                        <div className="flex flex-wrap gap-4 text-gray-300">
                            <span className="flex items-center"><MapPin size={18} className="mr-2 text-primary" /> {match.location}</span>
                            <span className="flex items-center"><Calendar size={18} className="mr-2 text-secondary" /> {new Date(match.datetime).toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="bg-surface p-6 rounded-2xl border border-gray-800">
                        <h3 className="text-xl font-bold mb-4 flex items-center">
                            <ShieldCheck size={20} className="mr-2 text-primary" /> Turf Rules
                        </h3>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li>• No metal studs allowed. Turf shoes only.</li>
                            <li>• Arrive 15 minutes before kickoff for bib distribution.</li>
                            <li>• Water is provided, but bring your own bottle.</li>
                            <li>• Be respectful to the referee and other players.</li>
                        </ul>
                    </div>
                </div>

                {/* Sidebar Action */}
                <div className="space-y-4">
                    <div className="bg-surface p-6 rounded-2xl border border-gray-800 text-center">
                        <div className="text-3xl font-black text-primary mb-1">₹{match.price_inr}</div>
                        <div className="text-sm text-gray-500 mb-6">Inclusive of platform fees</div>
                        <button onClick={handleShare} className="w-full flex items-center justify-center gap-2 border border-gray-700 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                            <Share2 size={18} /> Share Match
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};