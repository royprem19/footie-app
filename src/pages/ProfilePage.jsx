import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useMatchStore } from '../store/matchStore';
import { Trophy, Activity, Save, Award, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const AVATAR_OPTIONS = ['⚽', '🔥', '⚡', '🦅', '🎯', '🧱', '🏃‍♂️', '🧠'];

export const ProfilePage = () => {
    const { user, profile, updateProfile } = useAuthStore();
    const { playerBookings } = useMatchStore();

    const [position, setPosition] = useState(profile.position);
    const [level, setLevel] = useState(profile.level);
    const [avatar, setAvatar] = useState(profile.avatar || '⚽');
    const [bio, setBio] = useState(profile.bio || '');

    const getBadge = (count) => {
        if (count >= 5) return { title: 'Turf Legend', color: 'text-yellow-400', bg: 'bg-yellow-400/10' };
        if (count >= 3) return { title: 'Regular', color: 'text-blue-400', bg: 'bg-blue-400/10' };
        if (count >= 1) return { title: 'Rookie', color: 'text-primary', bg: 'bg-primary/10' };
        return { title: 'Benchwarmer', color: 'text-gray-400', bg: 'bg-gray-800' };
    };
    const badge = getBadge(playerBookings.length);

    const handleSave = (e) => {
        e.preventDefault();
        updateProfile({ position, level, avatar, bio });
        toast.success('Player profile updated!');
    };

    if (!user) return <div className="p-20 text-center text-gray-400">Please log in to view your profile.</div>;

    return (
        <div className="p-4 md:p-8 animate-in fade-in duration-500 max-w-2xl mx-auto">
            <div className="mb-8 border-b border-gray-800 pb-4">
                <h1 className="text-3xl font-black text-white uppercase tracking-wide">
                    Player <span className="text-primary">Profile</span>
                </h1>
            </div>

            <div className="bg-surface border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="bg-gray-800 h-24 relative">
                    <div className="absolute -bottom-10 left-6">
                        <div className="h-20 w-20 bg-background border-4 border-surface rounded-full flex items-center justify-center text-4xl shadow-lg">
                            {avatar}
                        </div>
                    </div>
                </div>

                <div className="pt-14 p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                            <p className="text-sm text-gray-500">"{bio}"</p>
                        </div>

                        <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border border-gray-800 ${badge.bg}`}>
                            <Award size={20} className={badge.color} />
                            <div>
                                <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Status</div>
                                <div className={`font-black text-sm ${badge.color}`}>{badge.title} ({playerBookings.length} Caps)</div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSave} className="space-y-6">

                        {/* Avatar Picker */}
                        <div>
                            <label className="block text-sm text-gray-400 uppercase tracking-wider mb-3 font-bold">Choose Avatar</label>
                            <div className="flex flex-wrap gap-2">
                                {AVATAR_OPTIONS.map(emoji => (
                                    <button
                                        key={emoji} type="button" onClick={() => setAvatar(emoji)}
                                        className={`h-12 w-12 text-2xl rounded-xl border transition-all ${avatar === emoji ? 'border-primary bg-primary/20 scale-110' : 'border-gray-700 bg-background hover:border-gray-500'}`}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Bio Field */}
                        <div>
                            <label className="flex items-center text-sm text-gray-400 uppercase tracking-wider mb-2 font-bold">
                                <MessageSquare size={16} className="mr-2 text-primary" /> Player Bio
                            </label>
                            <input
                                type="text" maxLength="40" value={bio} onChange={(e) => setBio(e.target.value)}
                                placeholder="Write a short quote..."
                                className="w-full bg-background border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>

                        {/* Existing Dropdowns */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="flex items-center text-sm text-gray-400 uppercase tracking-wider mb-2 font-bold"><Activity size={16} className="mr-2 text-secondary" /> Position</label>
                                <select value={position} onChange={(e) => setPosition(e.target.value)} className="w-full bg-background border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-primary appearance-none">
                                    <option value="Goalkeeper">Goalkeeper</option>
                                    <option value="Defender">Defender</option>
                                    <option value="Midfielder">Midfielder</option>
                                    <option value="Striker">Striker</option>
                                </select>
                            </div>
                            <div>
                                <label className="flex items-center text-sm text-gray-400 uppercase tracking-wider mb-2 font-bold"><Trophy size={16} className="mr-2 text-primary" /> Level</label>
                                <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full bg-background border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-primary appearance-none">
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                    <option value="Pro">Pro</option>
                                </select>
                            </div>
                        </div>

                        <button type="submit" className="w-full flex items-center justify-center gap-2 bg-primary text-black font-bold py-3 rounded-lg hover:bg-[#2ce00f] transition-all active:scale-[0.98] mt-4">
                            <Save size={18} /> Save Profile
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};