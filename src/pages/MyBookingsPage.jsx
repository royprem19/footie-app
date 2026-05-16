import { Link } from 'react-router-dom';
import { Ticket, MapPin, Calendar, QrCode, XCircle, Award } from 'lucide-react';
import { useMatchStore } from '../store/matchStore';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export const MyBookingsPage = () => {
    const { matches, playerBookings, cancelBooking } = useMatchStore();
    const { user } = useAuthStore();

    const myMatches = matches.filter(match => playerBookings.includes(match.id));

    // GAMIFICATION: Calculate player badge based on bookings
    const getBadge = (count) => {
        if (count >= 5) return { title: 'Turf Legend', color: 'text-yellow-400', bg: 'bg-yellow-400/10' };
        if (count >= 3) return { title: 'Regular', color: 'text-blue-400', bg: 'bg-blue-400/10' };
        if (count >= 1) return { title: 'Rookie', color: 'text-primary', bg: 'bg-primary/10' };
        return { title: 'Benchwarmer', color: 'text-gray-400', bg: 'bg-gray-800' };
    };
    const badge = getBadge(myMatches.length);

    const handleCancel = (matchId) => {
        if (window.confirm("Are you sure you want to cancel? A 50% cancellation fee applies.")) {
            cancelBooking(matchId, user.id);
            toast.success("Booking cancelled. Slot freed up!");
        }
    };

    return (
        <div className="p-4 md:p-8 pb-24 animate-in fade-in duration-500">

            {/* Header & Gamification Panel */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-gray-800 pb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-wide">
                        My <span className="text-primary">Bookings</span>
                    </h1>
                    <p className="text-gray-400 mt-2">Manage your tickets and stats.</p>
                </div>

                {/* Player Badge */}
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-800 ${badge.bg}`}>
                    <Award size={24} className={badge.color} />
                    <div>
                        <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">Current Status</div>
                        <div className={`font-black ${badge.color}`}>{badge.title} ({myMatches.length} Games)</div>
                    </div>
                </div>
            </div>

            {myMatches.length === 0 ? (
                <div className="bg-surface border border-gray-800 rounded-xl p-12 text-center shadow-lg">
                    <Ticket size={48} className="text-gray-600 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">No upcoming games</h2>
                    <p className="text-gray-400 mb-6">Your ticket wallet is empty. Get off the bench!</p>
                    <Link to="/matches" className="bg-primary text-black font-bold py-3 px-6 rounded-lg hover:bg-[#2ce00f] transition-colors">
                        Find a Match
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2">
                    {myMatches.map(match => (
                        <div key={match.id} className="bg-background border border-gray-700 rounded-xl overflow-hidden flex flex-col relative shadow-lg shadow-primary/5 group">

                            <div className="flex flex-1">
                                <div className="p-5 flex-1 border-r border-dashed border-gray-600">
                                    <div className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded inline-block mb-3 uppercase tracking-wider">
                                        Confirmed
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-1">{match.venue_name}</h3>
                                    <div className="text-sm text-gray-400 mb-4 flex items-center">
                                        <MapPin size={14} className="mr-1" /> {match.location}
                                    </div>
                                    <div className="text-sm font-medium text-white flex items-center bg-surface p-2 rounded">
                                        <Calendar size={16} className="mr-2 text-primary" />
                                        {new Date(match.datetime).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>

                                <div className="bg-surface w-32 p-4 flex flex-col items-center justify-center relative">
                                    <QrCode size={56} className="text-gray-400 mb-2" />
                                    <div className="text-[10px] text-gray-500 font-mono text-center mb-2">
                                        ID: {match.id.substring(0, 8).toUpperCase()}
                                    </div>
                                    <div className="absolute top-0 -left-3 w-6 h-6 bg-background rounded-full -mt-3"></div>
                                    <div className="absolute bottom-0 -left-3 w-6 h-6 bg-background rounded-full -mb-3"></div>
                                </div>
                            </div>

                            {/* Cancel Button Footer */}
                            <button
                                onClick={() => handleCancel(match.id)}
                                className="w-full bg-danger/10 hover:bg-danger text-danger hover:text-white py-3 text-sm font-bold flex items-center justify-center transition-colors border-t border-danger/20"
                            >
                                <XCircle size={16} className="mr-2" /> Cancel Booking
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};