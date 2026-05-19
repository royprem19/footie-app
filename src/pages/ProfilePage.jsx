import { useState, useEffect } from 'react';
import { useMatchStore } from '../store/matchStore';
import { useAuthStore } from '../store/authStore'; // THE FIX: Import the new Auth Store!
import { Trophy, Activity, Save, Award, MessageSquare, CreditCard, Settings, User as UserIcon, Bell, IndianRupee, Receipt } from 'lucide-react';
import toast from 'react-hot-toast';

const AVATAR_OPTIONS = ['⚽', '🔥', '⚡', '🦅', '🎯', '🧱', '🏃‍♂️', '🧠', '💼'];

export const ProfilePage = () => {
    // 1. Pull the REAL user data from our JWT Auth Store!
    const { user, profile, role, updateProfile } = useAuthStore();
    const { matches } = useMatchStore();

    // 2. Set default tabs based on role
    const [activeTab, setActiveTab] = useState(role === 'admin' ? 'settings' : 'identity');

    // 3. Initialize forms using the real Django data!
    const [position, setPosition] = useState(profile?.position || 'Striker');
    const [level, setLevel] = useState(profile?.level || 'Intermediate');
    const [avatar, setAvatar] = useState(profile?.avatar || '⚽');
    const [bio, setBio] = useState(profile?.bio || '');

    // 4. Safely calculate Wallet stats using our real username
    const myMatches = matches.filter(match =>
        user && match.creator_name === user.username
    );
    const totalSpent = myMatches.reduce((sum, match) => sum + Number(match.price_inr || 0), 0);

    // THE FIX: Style the badge based on the real Django Title!
    const getBadgeStyle = (title) => {
        if (title === 'Turf Legend') return { color: 'text-yellow-400', bg: 'bg-yellow-400/10' };
        if (title === 'Regular') return { color: 'text-blue-400', bg: 'bg-blue-400/10' };
        if (title === 'Rookie') return { color: 'text-primary', bg: 'bg-primary/10' };
        return { color: 'text-gray-400', bg: 'bg-gray-800' };
    };
    const badgeStyle = getBadgeStyle(profile?.title || 'Rookie');

    const handleSaveIdentity = (e) => {
        e.preventDefault();
        // Update the frontend store instantly
        updateProfile({ position, level, avatar, bio });
        // NOTE: In the next step, we will make this hit a Django PUT endpoint to save permanently!
        toast.success('Identity updated!');
    };

    const handleSaveSettings = (e) => {
        e.preventDefault();
        toast.success('Account settings saved successfully!');
    };

    // 5. Block unauthenticated visitors
    if (!user) return <div className="p-20 text-center text-gray-400">Please log in to view your profile.</div>;

    return (
        <div className="p-4 md:p-8 animate-in fade-in duration-500 max-w-4xl mx-auto pb-24">

            {/* Header & Status Banner */}
            <div className="bg-surface border border-gray-800 rounded-2xl overflow-hidden shadow-2xl mb-8">
                <div className="bg-gray-800 h-24 relative">
                    <div className="absolute -bottom-10 left-6">
                        <div className="h-20 w-20 bg-background border-4 border-surface rounded-full flex items-center justify-center text-4xl shadow-lg">
                            {/* THE FIX: Show the live Avatar */}
                            {profile?.avatar || avatar}
                        </div>
                    </div>
                </div>

                <div className="pt-14 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white">{user.username}</h2>
                        <p className="text-sm text-gray-500 italic">"{profile?.bio || bio}"</p>
                    </div>

                    {role === 'player' && (
                        <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border border-gray-800 ${badgeStyle.bg}`}>
                            <Award size={20} className={badgeStyle.color} />
                            <div>
                                <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Status</div>
                                {/* THE FIX: Use real Django Caps and Title */}
                                <div className={`font-black text-sm ${badgeStyle.color}`}>{profile?.title} ({profile?.caps} Caps)</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Tab Navigation System */}
            <div className="flex overflow-x-auto gap-2 mb-6 pb-2 scrollbar-hide border-b border-gray-800">
                {role === 'player' && (
                    <>
                        <button onClick={() => setActiveTab('identity')} className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'identity' ? 'bg-surface text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-white'}`}>
                            <UserIcon size={18} /> Player Identity
                        </button>
                        <button onClick={() => setActiveTab('wallet')} className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'wallet' ? 'bg-surface text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-white'}`}>
                            <CreditCard size={18} /> Wallet & History
                        </button>
                    </>
                )}

                <button onClick={() => setActiveTab('settings')} className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'settings' ? 'bg-surface text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-white'}`}>
                    <Settings size={18} /> Account Details
                </button>
            </div>

            {/* Dynamic Tab Content Area */}
            <div className="bg-surface border border-gray-800 rounded-2xl p-6 shadow-xl min-h-[400px]">

                {/* TAB 1: IDENTITY */}
                {activeTab === 'identity' && role === 'player' && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <h3 className="text-xl font-bold text-white mb-6 border-b border-gray-800 pb-4">Pitch Identity</h3>
                        <form onSubmit={handleSaveIdentity} className="space-y-6">
                            <div>
                                <label className="block text-sm text-gray-400 uppercase tracking-wider mb-3 font-bold">Choose Avatar</label>
                                <div className="flex flex-wrap gap-2">
                                    {AVATAR_OPTIONS.map(emoji => (
                                        <button key={emoji} type="button" onClick={() => setAvatar(emoji)} className={`h-12 w-12 text-2xl rounded-xl border transition-all ${avatar === emoji ? 'border-primary bg-primary/20 scale-110' : 'border-gray-700 bg-background hover:border-gray-500'}`}>
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center text-sm text-gray-400 uppercase tracking-wider mb-2 font-bold">
                                    <MessageSquare size={16} className="mr-2 text-primary" /> Player Bio (Quote)
                                </label>
                                <input type="text" maxLength="40" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Write a short quote..." className="w-full bg-background border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-primary transition-colors" />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="flex items-center text-sm text-gray-400 uppercase tracking-wider mb-2 font-bold"><Activity size={16} className="mr-2 text-secondary" /> Preferred Position</label>
                                    <select value={position} onChange={(e) => setPosition(e.target.value)} className="w-full bg-background border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-primary appearance-none">
                                        <option value="Goalkeeper">Goalkeeper</option>
                                        <option value="Defender">Defender</option>
                                        <option value="Midfielder">Midfielder</option>
                                        <option value="Striker">Striker</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="flex items-center text-sm text-gray-400 uppercase tracking-wider mb-2 font-bold"><Trophy size={16} className="mr-2 text-primary" /> Skill Level</label>
                                    <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full bg-background border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-primary appearance-none">
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                        <option value="Pro">Pro</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-primary text-black font-bold py-3 rounded-lg hover:bg-[#2ce00f] transition-all active:scale-[0.98] mt-4"><Save size={18} /> Update Identity</button>
                        </form>
                    </div>
                )}

                {/* TAB 2: WALLET */}
                {activeTab === 'wallet' && role === 'player' && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <h3 className="text-xl font-bold text-white mb-6 border-b border-gray-800 pb-4">Wallet & Payment History</h3>

                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 mb-8 flex justify-between items-center shadow-lg relative overflow-hidden">
                            <div className="absolute -right-4 -top-4 opacity-5"><IndianRupee size={150} /></div>
                            <div>
                                <div className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Total Lifetime Spend</div>
                                <div className="text-4xl font-black text-white">₹{totalSpent.toLocaleString()}</div>
                            </div>
                            <div className="bg-primary/20 text-primary px-3 py-1 rounded-lg text-xs font-bold border border-primary/30">Active Account</div>
                        </div>

                        <h4 className="text-sm text-gray-400 uppercase tracking-wider font-bold mb-4 flex items-center"><Receipt size={16} className="mr-2" /> Recent Transactions</h4>

                        {myMatches.length === 0 ? (
                            <div className="text-center py-10 text-gray-500 text-sm border border-dashed border-gray-700 rounded-xl">No transaction history found.</div>
                        ) : (
                            <div className="space-y-3">
                                {myMatches.map(match => {
                                    const isRefund = match.status === 'cancelled';
                                    const displayVenueName = match.venue_name || "Premium Turf";

                                    return (
                                        <div key={match.id} className="flex items-center justify-between p-4 bg-background border border-gray-800 rounded-xl hover:border-gray-600 transition-colors">
                                            <div>
                                                <div className={`font-bold text-sm ${isRefund ? 'text-green-400' : 'text-white'}`}>
                                                    {isRefund ? `Refund: ${displayVenueName}` : `${displayVenueName} Booking`}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {match.date || (match.datetime && match.datetime.split('T')[0])} • ID: {String(match.id).substring(0, 6)}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`font-bold text-sm ${isRefund ? 'text-green-400' : 'text-red-500'}`}>
                                                    {isRefund ? '+' : '-'} ₹{match.price_inr + 15 /* Added platform fee! */}
                                                </div>
                                                <div className={`text-[10px] uppercase font-bold mt-1 ${isRefund ? 'text-green-500' : 'text-gray-500'}`}>
                                                    {isRefund ? 'Refunded' : 'Successful'}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 3: ACCOUNT SETTINGS */}
                {activeTab === 'settings' && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <h3 className="text-xl font-bold text-white mb-6 border-b border-gray-800 pb-4">
                            {role === 'admin' ? 'Admin Profile Settings' : 'Account Details'}
                        </h3>
                        <form onSubmit={handleSaveSettings} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-bold">Username</label>
                                    <input type="text" disabled defaultValue={user.username} className="w-full bg-background/50 border border-gray-800 text-gray-500 rounded-lg py-3 px-4 cursor-not-allowed" />
                                    <p className="text-[10px] text-gray-500 mt-1">Username is locked.</p>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-bold">Email Address</label>
                                    <input type="email" placeholder="player@footie.com" className="w-full bg-background border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-primary transition-colors" />
                                </div>
                            </div>

                            <div className="border-t border-gray-800 pt-6">
                                <h4 className="text-sm text-gray-400 uppercase tracking-wider font-bold mb-4 flex items-center"><Bell size={16} className="mr-2" /> Preferences</h4>
                                <div className="space-y-4">
                                    <label className="flex items-center justify-between p-4 bg-background border border-gray-800 rounded-xl cursor-pointer hover:border-gray-600 transition-colors">
                                        <div>
                                            <div className="text-sm font-bold text-white">Email Notifications</div>
                                            <div className="text-xs text-gray-500 mt-1">{role === 'admin' ? 'Get alerts when players book slots.' : 'Get match reminders and receipts.'}</div>
                                        </div>
                                        <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary cursor-pointer" />
                                    </label>
                                </div>
                            </div>
                            <div className="border-t border-gray-800 pt-6">
                                <button type="submit" className="w-full bg-gray-800 text-white font-bold py-3 rounded-lg hover:bg-gray-700 transition-all">Save Account Settings</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};