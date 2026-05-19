import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { Shield, Users, Plus, LogOut, Crown, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export const SquadsPage = () => {
    // 1. Pull the user and secure JWT token from the auth store
    const { user, token } = useAuthStore();

    // 2. Component State
    const [squads, setSquads] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newSquadName, setNewSquadName] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // 3. Fetch all squads from Django
    const fetchSquads = async () => {
        try {
            const res = await fetch('http://127.0.0.1:8000/api/squads/');
            const data = await res.json();
            setSquads(data);
        } catch (error) {
            console.error("Failed to fetch squads", error);
            toast.error("Failed to load the Squad Directory.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSquads();
    }, []);

    // 4. Derived State: Figure out the user's current status
    const mySquad = squads.find(squad =>
        squad.roster.some(member => member.username === user?.username)
    );
    const isCaptain = mySquad?.captain_name === user?.username;

    // --- API HANDLERS ---

    const handleCreateSquad = async (e) => {
        e.preventDefault();
        if (!newSquadName.trim()) return;
        setIsProcessing(true);

        try {
            const res = await fetch('http://127.0.0.1:8000/api/squads/create/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: newSquadName })
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(`Welcome to the league, Captain of ${newSquadName}!`);
                setNewSquadName('');
                fetchSquads();
            } else {
                // THE FIX: Catch Django's default "detail" messages too!
                toast.error(data.error || data.detail || "Failed to create squad.");
            }
        } catch (error) {
            console.error("Network error creating squad:", error);
            toast.error("Network error. Could not connect to the server.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleJoinSquad = async (squadId) => {
        setIsProcessing(true);
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/squads/${squadId}/join/`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                toast.success("You have successfully joined the roster!");
                fetchSquads();
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to join squad.");
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const handleLeaveSquad = async () => {
        if (isCaptain && !window.confirm("As captain, leaving will DISBAND the entire squad. Are you sure?")) {
            return;
        }

        setIsProcessing(true);
        try {
            const res = await fetch('http://127.0.0.1:8000/api/squads/leave/', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                toast.success(isCaptain ? "Squad disbanded." : "You have left the squad.");
                fetchSquads();
            } else {
                toast.error("Failed to leave squad.");
            }
        } finally {
            setIsProcessing(false);
        }
    };

    // --- RENDER LOGIC ---

    if (!user) {
        return <div className="p-20 text-center text-gray-400">Please log in to access the Squads Hub.</div>;
    }

    if (isLoading) {
        return <div className="p-20 text-center text-gray-400 animate-pulse">Loading Squad Directory...</div>;
    }

    return (
        <div className="p-4 md:p-8 animate-in fade-in duration-500 max-w-5xl mx-auto pb-24">

            {/* Header */}
            <div className="mb-10">
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-4 mb-4">
                    <Shield className="text-primary" size={40} /> Squads Hub
                </h1>
                <p className="text-gray-400 max-w-2xl text-lg">
                    {mySquad ? "Manage your roster and prepare for the next kickoff." : "You are a Free Agent. Create a new franchise or join an existing roster to unlock team stats."}
                </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">

                {/* LEFT COLUMN: User's Current Status */}
                <div className="lg:col-span-4 space-y-6">

                    {mySquad ? (
                        /* SCENARIO A: THEY ARE IN A SQUAD */
                        <div className="bg-surface border border-primary/50 rounded-2xl p-6 shadow-[0_0_30px_rgba(44,224,15,0.1)] relative overflow-hidden">
                            <div className="absolute -right-4 -top-4 opacity-5"><Shield size={150} /></div>

                            <div className="relative z-10">
                                <div className="text-xs text-primary font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span> Active Roster
                                </div>
                                <h2 className="text-3xl font-black text-white mb-1 truncate">{mySquad.name}</h2>
                                <p className="text-sm text-gray-400 flex items-center gap-2 mb-6">
                                    <Crown size={14} className="text-yellow-500" /> Captain: {mySquad.captain_name}
                                </p>

                                <div className="space-y-2 mb-6 bg-background/50 rounded-xl p-4 border border-gray-800/50 max-h-60 overflow-y-auto">
                                    {mySquad.roster.map(member => (
                                        <div key={member.id} className="flex justify-between items-center text-sm">
                                            <span className={`font-bold ${member.username === user.username ? 'text-primary' : 'text-gray-300'}`}>
                                                {member.username} {member.username === user.username && '(You)'}
                                            </span>
                                            <span className="text-gray-500 text-xs">
                                                {member.username === mySquad.captain_name ? 'Captain' : 'Player'}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={handleLeaveSquad}
                                    disabled={isProcessing}
                                    className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white font-bold py-3 rounded-lg transition-all"
                                >
                                    <LogOut size={18} /> {isCaptain ? 'Disband Squad' : 'Leave Squad'}
                                </button>
                                {isCaptain && <p className="text-[10px] text-gray-500 text-center mt-3"><AlertTriangle size={10} className="inline mr-1" /> Disbanding is permanent.</p>}
                            </div>
                        </div>
                    ) : (
                        /* SCENARIO B: THEY ARE A FREE AGENT */
                        <div className="bg-surface border border-gray-800 rounded-2xl p-6 shadow-lg">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-primary/10 rounded-xl text-primary"><Users size={24} /></div>
                                <h2 className="text-xl font-bold text-white">Create a Franchise</h2>
                            </div>
                            <p className="text-sm text-gray-400 mb-6">Step up as Captain. Draft players, book private pitches, and climb the team leaderboards.</p>

                            <form onSubmit={handleCreateSquad} className="space-y-4">
                                <div>
                                    <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-bold">Squad Name</label>
                                    <input
                                        type="text"
                                        maxLength="25"
                                        value={newSquadName}
                                        onChange={(e) => setNewSquadName(e.target.value)}
                                        placeholder="e.g. The Invincibles"
                                        className="w-full bg-background border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-primary transition-colors"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isProcessing || !newSquadName.trim()}
                                    className="w-full flex items-center justify-center gap-2 bg-primary text-black font-bold py-3 rounded-lg hover:bg-[#2ce00f] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Plus size={18} /> Register Squad
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                {/* RIGHT COLUMN: The Global Squad Directory */}
                <div className="lg:col-span-8">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center border-b border-gray-800 pb-4">
                        Open Directories <span className="ml-3 bg-gray-800 text-xs px-2 py-1 rounded-full text-gray-400">{squads.length} Active</span>
                    </h2>

                    {squads.length === 0 ? (
                        <div className="text-center py-20 bg-surface border border-dashed border-gray-800 rounded-2xl">
                            <Shield size={40} className="mx-auto text-gray-700 mb-4" />
                            <p className="text-gray-500 font-medium">The league is completely empty.</p>
                            <p className="text-sm text-gray-600 mt-1">Be the first to create a squad.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-4">
                            {squads.map(squad => (
                                <div key={squad.id} className="bg-surface border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition-colors flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-lg text-white truncate pr-2">{squad.name}</h3>
                                            <div className="bg-background px-2 py-1 rounded text-xs font-bold text-gray-400 flex items-center gap-1 border border-gray-800">
                                                <Users size={12} /> {squad.roster.length}
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                                            <Crown size={12} className="text-yellow-500/70" /> {squad.captain_name}
                                        </p>
                                    </div>

                                    {/* Action Button: Only show JOIN if they are a Free Agent and NOT already in this squad */}
                                    {!mySquad && (
                                        <button
                                            onClick={() => handleJoinSquad(squad.id)}
                                            disabled={isProcessing}
                                            className="w-full mt-4 bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 font-bold py-2 rounded-lg text-sm transition-all border border-gray-700 hover:border-gray-500"
                                        >
                                            Request to Join
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};