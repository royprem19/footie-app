import { useState, useEffect } from 'react';
import { Trophy, Activity, Shield } from 'lucide-react';

export default function LeaderboardPage() {
    const [players, setPlayers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // THE FIX: Fetch the live rankings straight from Django!
        fetch('http://127.0.0.1:8000/api/leaderboard/')
            .then(res => res.json())
            .then(data => {
                setPlayers(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch leaderboard", err);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return <div className="p-20 text-center text-gray-400 animate-pulse">Calculating Global Rankings...</div>;
    }

    if (players.length === 0) {
        return (
            <div className="p-20 text-center flex flex-col items-center justify-center h-[50vh]">
                <Shield size={48} className="text-gray-800 mb-4" />
                <h2 className="text-xl font-bold text-gray-500">The leaderboard is currently empty.</h2>
                <p className="text-gray-600 mt-2">Book a pitch to become the first ranked player!</p>
            </div>
        );
    }

    // Separate the Top 3 for the special Podium UI
    const topThree = players.slice(0, 3);
    const theRest = players.slice(3);

    return (
        <div className="p-4 md:p-8 animate-in fade-in duration-500 max-w-4xl mx-auto pb-24">

            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center justify-center gap-4 mb-4">
                    <Trophy className="text-yellow-400" size={40} /> Global Rankings
                </h1>
                <p className="text-gray-400 max-w-xl mx-auto">
                    The most active players on the platform. Book matches, hit the pitch, and climb the ranks to earn your Turf Legend status.
                </p>
            </div>

            {/* The Podium (Top 3) */}
            <div className="grid grid-cols-3 gap-4 mb-12 items-end max-w-2xl mx-auto px-2">
                {/* Rank 2 (Silver) */}
                {topThree[1] && (
                    <div className="flex flex-col items-center animate-in slide-in-from-bottom-8 duration-700 delay-100">
                        <div className="text-3xl mb-2">{topThree[1].avatar || '⚽'}</div>
                        <div className="w-full bg-gradient-to-t from-gray-300/20 to-gray-300/5 border-t-2 border-gray-300 rounded-t-2xl p-4 flex flex-col items-center h-32 justify-end text-center backdrop-blur-sm">
                            <span className="font-black text-white text-sm truncate w-full">{topThree[1].username}</span>
                            <span className="text-gray-300 text-xs font-bold mt-1">{topThree[1].caps} Caps</span>
                            <div className="mt-2 text-gray-300 bg-gray-300/20 rounded-full w-6 h-6 flex items-center justify-center font-black text-xs">2</div>
                        </div>
                    </div>
                )}

                {/* Rank 1 (Gold) */}
                {topThree[0] && (
                    <div className="flex flex-col items-center animate-in slide-in-from-bottom-12 duration-700 z-10 relative">
                        <Trophy size={24} className="text-yellow-400 absolute -top-8 animate-bounce" />
                        <div className="text-5xl mb-2 drop-shadow-[0_0_15px_rgba(250,204,21,0.4)]">{topThree[0].avatar || '👑'}</div>
                        <div className="w-full bg-gradient-to-t from-yellow-400/20 to-yellow-400/5 border-t-2 border-yellow-400 rounded-t-2xl p-4 flex flex-col items-center h-40 justify-end text-center backdrop-blur-sm shadow-[0_-10px_30px_rgba(250,204,21,0.1)]">
                            <span className="font-black text-white text-base truncate w-full">{topThree[0].username}</span>
                            <span className="text-yellow-400 text-sm font-bold mt-1">{topThree[0].caps} Caps</span>
                            <div className="mt-2 text-yellow-900 bg-yellow-400 rounded-full w-8 h-8 flex items-center justify-center font-black text-sm shadow-lg">1</div>
                        </div>
                    </div>
                )}

                {/* Rank 3 (Bronze) */}
                {topThree[2] && (
                    <div className="flex flex-col items-center animate-in slide-in-from-bottom-4 duration-700 delay-200">
                        <div className="text-3xl mb-2">{topThree[2].avatar || '⚽'}</div>
                        <div className="w-full bg-gradient-to-t from-orange-400/20 to-orange-400/5 border-t-2 border-orange-400 rounded-t-2xl p-4 flex flex-col items-center h-24 justify-end text-center backdrop-blur-sm">
                            <span className="font-black text-white text-sm truncate w-full">{topThree[2].username}</span>
                            <span className="text-orange-300 text-xs font-bold mt-1">{topThree[2].caps} Caps</span>
                            <div className="mt-2 text-orange-900 bg-orange-400 rounded-full w-6 h-6 flex items-center justify-center font-black text-xs">3</div>
                        </div>
                    </div>
                )}
            </div>

            {/* The Rest of the Roster (Ranks 4+) */}
            {theRest.length > 0 && (
                <div className="space-y-3">
                    {theRest.map((player, index) => (
                        <div key={player.id} className="flex items-center justify-between p-4 bg-surface border border-gray-800 rounded-xl hover:border-gray-600 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="w-8 text-center font-bold text-gray-500 group-hover:text-white transition-colors">
                                    #{index + 4}
                                </div>
                                <div className="w-10 h-10 bg-background border border-gray-700 rounded-full flex items-center justify-center text-xl shadow-sm">
                                    {player.avatar || '⚽'}
                                </div>
                                <div>
                                    <div className="font-bold text-white">{player.username}</div>
                                    <div className="text-xs text-gray-500 flex items-center mt-1">
                                        <Activity size={12} className="mr-1 text-primary" /> {player.title}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-black text-white text-lg">{player.caps}</div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Matches</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}