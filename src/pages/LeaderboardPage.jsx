import React, { useEffect } from 'react';
import { useMatchStore } from '../store/matchStore';
import { Trophy, Medal, Award } from 'lucide-react';

const LeaderboardPage = () => {
    // 1. Grab the users and the fetch function from the store
    const { users, fetchDatabase } = useMatchStore();

    // 2. Sort the users so the person with the most matches is at the top
    const rankedUsers = [...users].sort((a, b) => b.matches_played - a.matches_played);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
            <div className="max-w-4xl mx-auto">

                <div className="flex items-center space-x-4 mb-8">
                    <Trophy className="w-10 h-10 text-yellow-500" />
                    <h1 className="text-4xl font-black text-white tracking-wider">CITY <span className="text-yellow-500">LEADERBOARD</span></h1>
                </div>

                <div className="bg-[#111] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl shadow-yellow-500/5">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 p-6 border-b border-gray-800 bg-[#161616] text-sm font-bold text-gray-500 tracking-wider">
                        <div className="col-span-2 text-center">RANK</div>
                        <div className="col-span-6">PLAYER</div>
                        <div className="col-span-4 text-right">MATCHES PLAYED</div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-gray-800/50">
                        {rankedUsers.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">No players found on the server.</div>
                        ) : (
                            rankedUsers.map((user, index) => {
                                // Add some special styling for the top 3 players
                                const isFirst = index === 0;
                                const isSecond = index === 1;
                                const isThird = index === 2;

                                return (
                                    <div
                                        key={user.id}
                                        className={`grid grid-cols-12 gap-4 p-6 items-center transition-all hover:bg-[#1a1a1a] ${isFirst ? 'bg-yellow-500/5' : ''}`}
                                    >
                                        {/* Rank Column */}
                                        <div className="col-span-2 flex justify-center">
                                            {isFirst ? <Medal className="w-8 h-8 text-yellow-500" /> :
                                                isSecond ? <Medal className="w-8 h-8 text-gray-400" /> :
                                                    isThird ? <Medal className="w-8 h-8 text-orange-700" /> :
                                                        <span className="text-xl font-bold text-gray-600">#{index + 1}</span>}
                                        </div>

                                        {/* Player Column */}
                                        <div className="col-span-6">
                                            <h3 className={`text-xl font-bold ${isFirst ? 'text-yellow-500' : 'text-gray-200'}`}>
                                                @{user.username}
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">Joined {new Date(user.date_joined).toLocaleDateString()}</p>
                                        </div>

                                        {/* Score Column */}
                                        <div className="col-span-4 text-right">
                                            <span className={`text-3xl font-black ${isFirst ? 'text-yellow-500' : 'text-white'}`}>
                                                {user.matches_played}
                                            </span>
                                            <span className="text-gray-500 text-sm ml-2 font-bold tracking-widest">PTS</span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LeaderboardPage;