import { Trophy, Medal, Star } from 'lucide-react';

// Mock data for the leaderboard
const TOP_PLAYERS = [
    { id: 1, name: 'Rahul Sharma', caps: 42, role: 'Striker', badge: 'Turf Legend', avatar: '🔥' },
    { id: 2, name: 'Vikram Singh', caps: 38, role: 'Midfielder', badge: 'Turf Legend', avatar: '⚡' },
    { id: 3, name: 'Arjun Patel', caps: 24, role: 'Defender', badge: 'Regular', avatar: '🧱' },
    { id: 4, name: 'David Costa', caps: 19, role: 'Goalkeeper', badge: 'Regular', avatar: '🧤' },
    { id: 5, name: 'Amit Kumar', caps: 12, role: 'Striker', badge: 'Regular', avatar: '🏃‍♂️' },
];

export const CommunityPage = () => {
    return (
        <div className="p-4 md:p-8 pb-24 animate-in fade-in duration-500 max-w-4xl mx-auto">
            <div className="mb-8 border-b border-gray-800 pb-4">
                <h1 className="text-3xl font-black text-white uppercase tracking-wide">
                    Player <span className="text-secondary">Leaderboard</span>
                </h1>
                <p className="text-gray-400 mt-2">The most active players in your city.</p>
            </div>

            <div className="bg-surface border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="bg-gray-800/50 p-4 border-b border-gray-800 grid grid-cols-12 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <div className="col-span-2 md:col-span-1 text-center">Rank</div>
                    <div className="col-span-6 md:col-span-5">Player</div>
                    <div className="col-span-4 md:col-span-3 text-center hidden md:block">Position</div>
                    <div className="col-span-4 md:col-span-3 text-right pr-4">Total Caps</div>
                </div>

                <div className="divide-y divide-gray-800">
                    {TOP_PLAYERS.map((player, index) => (
                        <div key={player.id} className="grid grid-cols-12 items-center p-4 hover:bg-gray-800/30 transition-colors">
                            <div className="col-span-2 md:col-span-1 flex justify-center">
                                {index === 0 ? <Trophy className="text-yellow-400" size={24} /> :
                                    index === 1 ? <Medal className="text-gray-300" size={24} /> :
                                        index === 2 ? <Medal className="text-orange-400" size={24} /> :
                                            <span className="text-gray-500 font-bold text-lg">#{index + 1}</span>}
                            </div>

                            <div className="col-span-6 md:col-span-5 flex items-center gap-3">
                                <div className="w-10 h-10 bg-background border border-gray-700 rounded-full flex items-center justify-center text-xl">
                                    {player.avatar}
                                </div>
                                <div>
                                    <div className="font-bold text-white text-sm md:text-base">{player.name}</div>
                                    <div className="text-[10px] text-primary uppercase tracking-wider font-bold">{player.badge}</div>
                                </div>
                            </div>

                            <div className="col-span-4 md:col-span-3 text-center hidden md:block">
                                <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs font-medium">
                                    {player.role}
                                </span>
                            </div>

                            <div className="col-span-4 md:col-span-3 text-right pr-4">
                                <div className="text-lg font-black text-white">{player.caps}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};