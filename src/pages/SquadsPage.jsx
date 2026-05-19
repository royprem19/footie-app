import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, UserPlus, Users, Trophy, ChevronRight, X, Copy, Search } from 'lucide-react';
import { useMatchStore } from '../store/matchStore'; // 1. Import your Zustand store
import toast from 'react-hot-toast';

export const SquadsPage = () => {
    // 2. Connect to global memory and backend actions
    const { squads, createSquad, fetchDatabase } = useMatchStore();

    const [activeSquadIndex, setActiveSquadIndex] = useState(0);

    // Modal States
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isInviteOpen, setIsInviteOpen] = useState(false);

    // 3. Keep data freshly synced from Django on page mount
    useEffect(() => {
        fetchDatabase();
    }, []);

    // Grab the currently selected squad from the backend list
    const activeSquad = squads[activeSquadIndex];

    // Button Action Handlers
    const handleCopyLink = () => {
        if (!activeSquad) return;
        navigator.clipboard.writeText(`https://footie.app/invite/${activeSquad.name.toLowerCase().replace(/\s+/g, '-')}`);
        toast.success("Invite link copied to clipboard!");
    };

    const handleCreateSquad = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const squadName = formData.get('squadName');

        toast.loading("Registering squad on server...", { id: 'squad-toast' });

        // 4. Fire the POST request to Python/SQLite
        const success = await createSquad(squadName);

        if (success) {
            toast.success(`${squadName} created successfully!`, { id: 'squad-toast' });
            setIsCreateOpen(false);
            setActiveSquadIndex(0); // View the newest squad (sorted by newest first)
        } else {
            toast.error("Failed to create squad. Name might be taken!", { id: 'squad-toast' });
        }
    };

    const handleSendInvite = (e) => {
        e.preventDefault();
        toast.success("Invitation sent to player!");
        setIsInviteOpen(false);
    };

    return (
        <div className="p-4 md:p-8 pb-24 animate-in fade-in duration-500 max-w-5xl mx-auto">

            {/* Header */}
            <div className="mb-8 border-b border-gray-800 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-wide">
                        My <span className="text-primary">Squads</span>
                    </h1>
                    <p className="text-gray-400 mt-2">Manage your teams and invite friends.</p>
                </div>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="w-full md:w-auto justify-center bg-primary text-black font-bold px-6 py-3 rounded-xl hover:bg-[#2ce00f] transition-all flex items-center shadow-lg active:scale-95"
                >
                    <Shield size={18} className="mr-2" /> Create New Squad
                </button>
            </div>

            {/* If no squads are available anywhere in the city */}
            {squads.length === 0 ? (
                <div className="text-center py-20 bg-surface border border-gray-800 rounded-2xl">
                    <Shield size={48} className="mx-auto text-gray-600 mb-4" />
                    <p className="text-gray-500 font-bold">No squads registered in your city yet.</p>
                    <p className="text-gray-600 text-sm mt-1">Click the button above to register the very first team!</p>
                </div>
            ) : (
                <>
                    {/* Squad Selector Tabs */}
                    <div className="flex overflow-x-auto gap-2 mb-6 pb-2 scrollbar-hide border-b border-gray-800">
                        {squads.map((squad, index) => (
                            <button
                                key={squad.id}
                                onClick={() => setActiveSquadIndex(index)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-bold text-sm transition-all whitespace-nowrap ${activeSquadIndex === index ? 'bg-surface text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-white'}`}
                            >
                                {/* Fallback emoji since DB holds text strings */}
                                <span className="text-lg">🛡️</span> {squad.name}
                            </button>
                        ))}
                    </div>

                    {/* Active Squad Context Verification */}
                    {activeSquad && (
                        <div className="grid lg:grid-cols-3 gap-8">

                            {/* Active Squad Card */}
                            <div className="lg:col-span-2">
                                <div className="bg-surface border border-gray-800 rounded-2xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-300" key={activeSquad.id}>
                                    <div className="h-32 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-800 flex items-end p-4 md:p-6">
                                        <div className="w-16 h-16 md:w-20 md:h-20 bg-background border-4 border-surface rounded-2xl flex items-center justify-center text-3xl md:text-4xl shadow-xl absolute top-6 left-4 md:left-6">
                                            🛡️
                                        </div>
                                        <div className="ml-20 md:ml-24 pb-1">
                                            <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider">{activeSquad.name}</h2>
                                            <div className="text-xs md:text-sm text-gray-400 flex items-center mt-1">
                                                <Users size={14} className="mr-1" /> {activeSquad.roster?.length || 0}/11 Players • Chandigarh
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 md:p-6">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                                            <h3 className="font-bold text-white uppercase tracking-wider text-sm">Active Roster</h3>
                                            <button
                                                onClick={handleCopyLink}
                                                className="text-primary text-sm font-bold flex items-center hover:underline bg-primary/10 px-3 py-1.5 rounded-lg sm:bg-transparent sm:px-0 sm:py-0 active:scale-95 transition-transform"
                                            >
                                                <Copy size={16} className="mr-2 sm:mr-1" /> Copy Invite Link
                                            </button>
                                        </div>

                                        <div className="space-y-3">
                                            {/* 5. Loop over the real Django Roster objects instead of strings */}
                                            {activeSquad.roster?.map((member, i) => {
                                                const isCaptain = member.user === activeSquad.captain;
                                                return (
                                                    <div key={member.id} className="flex items-center justify-between p-3 bg-background border border-gray-800 rounded-xl">
                                                        <div className="flex items-center">
                                                            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-white mr-3 shrink-0">
                                                                {member.username?.charAt(0).toUpperCase()}
                                                            </div>
                                                            <span className="font-bold text-gray-300 text-xs md:text-sm truncate">
                                                                @{member.username} {isCaptain ? '(Captain)' : ''}
                                                            </span>
                                                        </div>
                                                        {isCaptain && (
                                                            <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2 py-1 rounded text-[10px] font-black uppercase shrink-0">C</span>
                                                        )}
                                                    </div>
                                                );
                                            })}

                                            {/* Roster limit adjustment */}
                                            {activeSquad.roster?.length < 11 && (
                                                <button
                                                    onClick={() => setIsInviteOpen(true)}
                                                    className="w-full flex items-center justify-center p-4 bg-background border border-dashed border-gray-700 rounded-xl text-gray-500 hover:text-primary hover:border-primary transition-colors group"
                                                >
                                                    <UserPlus size={18} className="mr-2 group-hover:scale-110 transition-transform shrink-0" />
                                                    <span className="font-bold text-xs md:text-sm">Add Player ({11 - activeSquad.roster.length} Slots Open)</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Squad Stats Panel */}
                            <div className="space-y-6">
                                <div className="bg-surface border border-gray-800 rounded-2xl p-6 shadow-lg">
                                    <h3 className="font-bold text-white uppercase tracking-wider text-sm mb-4 flex items-center">
                                        <Trophy size={16} className="text-yellow-500 mr-2" /> Team Stats
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-background rounded-xl p-4 border border-gray-800 text-center">
                                            <div className="text-2xl font-black text-white">
                                                {activeSquad.roster?.length > 1 ? '12' : '0'}
                                            </div>
                                            <div className="text-[10px] text-gray-500 uppercase font-bold mt-1">Matches</div>
                                        </div>
                                        <div className="bg-background rounded-xl p-4 border border-gray-800 text-center">
                                            <div className="text-2xl font-black text-primary">
                                                {activeSquad.roster?.length > 1 ? '80%' : 'N/A'}
                                            </div>
                                            <div className="text-[10px] text-gray-500 uppercase font-bold mt-1">Win Rate</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-2xl p-6 shadow-lg">
                                    <h3 className="font-bold text-white mb-2">Ready to play?</h3>
                                    <p className="text-sm text-gray-400 mb-4">Book a turf for your squad. We'll automatically send payment split links to your team.</p>
                                    <Link
                                        to="/venues"
                                        className="w-full bg-surface text-white border border-gray-700 font-bold py-3 rounded-xl hover:border-primary transition-all flex items-center justify-center"
                                    >
                                        Find Matches <ChevronRight size={16} className="ml-1 shrink-0" />
                                    </Link>
                                </div>
                            </div>

                        </div>
                    )}
                </>
            )}

            {/* --- MODALS --- */}

            {/* 1. Create Squad Modal */}
            {isCreateOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-surface border border-gray-800 rounded-xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-4 border-b border-gray-800">
                            <h3 className="font-bold text-white flex items-center">
                                <Shield size={18} className="mr-2 text-primary" /> Create New Squad
                            </h3>
                            <button onClick={() => setIsCreateOpen(false)} className="text-gray-400 hover:text-white transition-colors"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleCreateSquad} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs text-gray-400 uppercase font-bold mb-2">Squad Name</label>
                                <input required name="squadName" autoFocus type="text" placeholder="e.g. Dream Team" className="w-full bg-background border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-primary transition-colors" />
                            </div>
                            <button type="submit" className="w-full mt-4 bg-primary text-black font-bold py-3 rounded-lg hover:bg-[#2ce00f] transition-all">Create Squad</button>
                        </form>
                    </div>
                </div>
            )}

            {/* 2. Invite Player Modal */}
            {isInviteOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-surface border border-gray-800 rounded-xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-4 border-b border-gray-800">
                            <h3 className="font-bold text-white flex items-center">
                                <UserPlus size={18} className="mr-2 text-primary" /> Add Player
                            </h3>
                            <button onClick={() => setIsInviteOpen(false)} className="text-gray-400 hover:text-white transition-colors"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSendInvite} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs text-gray-400 uppercase font-bold mb-2">Search by Email or Username</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input required autoFocus type="text" placeholder="player@example.com" className="w-full bg-background border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary transition-colors" />
                                </div>
                            </div>
                            <button type="submit" className="w-full mt-4 bg-gray-800 border border-gray-700 text-white font-bold py-3 rounded-lg hover:border-primary hover:text-primary transition-all">Send Invitation</button>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};