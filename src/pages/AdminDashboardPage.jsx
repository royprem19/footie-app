import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { X, Calendar, Activity, CheckCircle, Building, ArrowDownRight, Loader, Clock, Landmark, MapPin, Map, CalendarCheck, User, Megaphone, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminDashboardPage = () => {
    const { user, role, token } = useAuthStore();
    const navigate = useNavigate();

    // Admin View States
    const [activeTab, setActiveTab] = useState('bookings');
    const [data, setData] = useState({ matches: [], venues: [], users: [] });
    const [isLoading, setIsLoading] = useState(true);

    // Payout Modal States
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const [localWithdrawals, setLocalWithdrawals] = useState([]); // Tracking UI withdrawals

    // --- FETCH REAL DATA FROM DJANGO ---
    const fetchAdminData = async () => {
        try {
            const [matchesRes, venuesRes, usersRes] = await Promise.all([
                fetch('http://127.0.0.1:8000/api/matches/'),
                fetch('http://127.0.0.1:8000/api/venues/'),
                fetch('http://127.0.0.1:8000/api/users/')
            ]);

            setData({
                matches: await matchesRes.json(),
                venues: await venuesRes.json(),
                users: await usersRes.json()
            });
        } catch (error) {
            console.error("Admin fetch error:", error);
            toast.error("Failed to load platform data.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (role !== 'admin') {
            navigate('/matches');
            return;
        }
        fetchAdminData();
    }, [role, navigate]);

    // Financial Math (Using real Django data)
    const totalRevenue = data.matches.reduce((sum, match) => {
        if (match.status !== 'cancelled') {
            return sum + (Number(match.price_inr) || 0) + (match.match_type === 'open' ? 0 : 15);
        }
        return sum;
    }, 0);
    const totalWithdrawn = localWithdrawals.reduce((sum, w) => sum + w.amount, 0);
    const availableBalance = totalRevenue - totalWithdrawn;

    // --- 1. VENUE CREATION HANDLER ---
    const handleCreateVenue = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const payload = {
            name: formData.get('name'),
            location: formData.get('location'),
            pitch_size: formData.get('size'), // Mapped to Django model
            price_per_hour: parseInt(formData.get('price_per_hour')),
        };

        try {
            const res = await fetch('http://127.0.0.1:8000/api/venues/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                toast.success("New turf successfully added to directory!");
                e.target.reset();
                fetchAdminData(); // Refresh the list!
            } else {
                toast.error("Failed to add turf.");
            }
        } catch (error) {
            toast.error("Network error.");
        }
    };

    // --- 2. HOST OPEN PLAY HANDLER ---
    const handleHostOpenPlay = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const selectedVenueId = formData.get('venue_id');

        if (!selectedVenueId) return toast.error("Please select a valid venue.");

        const datetimeRaw = formData.get('datetime');
        let dateStr = datetimeRaw.split('T')[0];
        let [h, m] = datetimeRaw.split('T')[1].split(':');
        let suffix = "AM";
        let hourInt = parseInt(h);
        if (hourInt >= 12) { suffix = "PM"; if (hourInt > 12) hourInt -= 12; }
        if (hourInt === 0) hourInt = 12;
        let timeStr = `${hourInt.toString().padStart(2, '0')}:${m} ${suffix}`;

        const payload = {
            venue: selectedVenueId,
            match_type: 'open',
            date: dateStr,
            time_slots: [timeStr],
            total_slots: parseInt(formData.get('total_slots')),
            price_inr: parseInt(formData.get('price_inr')),
        };

        try {
            const res = await fetch('http://127.0.0.1:8000/api/matches/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                toast.success("Open Play Match blasted to the global feed!");
                e.target.reset();
                setActiveTab('bookings');
                fetchAdminData();
            } else {
                const err = await res.json();
                toast.error(err.error || "Failed to create match.");
            }
        } catch (error) {
            toast.error("Network error.");
        }
    };

    // --- 3. PAYOUT HANDLER ---
    const handleConfirmWithdrawal = (e) => {
        e.preventDefault();
        const amount = parseInt(withdrawAmount);
        if (amount > availableBalance) return toast.error("Insufficient funds.");

        setIsWithdrawing(true);
        setTimeout(() => {
            setIsWithdrawing(false);
            setIsWithdrawModalOpen(false);
            setLocalWithdrawals([{
                id: Date.now(),
                amount: amount,
                bank: 'HDFC Bank ****4021',
                date: new Date().toISOString(),
                status: 'processing'
            }, ...localWithdrawals]);
            setWithdrawAmount('');
            toast.success(`₹${amount.toLocaleString()} transfer initiated to HDFC Bank.`);
        }, 2000);
    };

    // --- 4. MARK COMPLETE HANDLER ---
    const handleCompleteMatch = async (matchId) => {
        try {
            // Note: If you want this to persist in Django, you need a PATCH endpoint.
            // For now, we update it in the UI temporarily until you build the endpoint.
            toast.success("Match archived successfully!");
            setData(prev => ({
                ...prev,
                matches: prev.matches.map(m => m.id === matchId ? { ...m, status: 'completed' } : m)
            }));
        } catch (error) {
            toast.error("Failed to update match.");
        }
    };

    if (isLoading) return <div className="p-20 text-center text-primary animate-pulse font-bold tracking-widest">DECRYPTING ADMIN SECRETS...</div>;

    return (
        <div className="p-4 md:p-8 pb-24 animate-in fade-in duration-500 max-w-6xl mx-auto">
            <div className="mb-8 border-b border-gray-800 pb-4">
                <h1 className="text-3xl font-black text-white uppercase tracking-wide">
                    Turf <span className="text-secondary">Manager</span>
                </h1>
                <p className="text-gray-400 mt-2">Manage your venues, view bookings, and withdraw earnings. Welcome, {user?.username}.</p>
            </div>

            {/* Admin Tab Navigation */}
            <div className="flex overflow-x-auto gap-2 mb-8 pb-2 scrollbar-hide border-b border-gray-800">
                <button onClick={() => setActiveTab('bookings')} className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'bookings' ? 'bg-surface text-secondary border-b-2 border-secondary' : 'text-gray-500 hover:text-white'}`}>
                    <CalendarCheck size={18} /> Master Ledger
                </button>
                <button onClick={() => setActiveTab('openplay')} className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'openplay' ? 'bg-surface text-secondary border-b-2 border-secondary' : 'text-gray-500 hover:text-white'}`}>
                    <Megaphone size={18} /> Host Open Play
                </button>
                <button onClick={() => setActiveTab('venues')} className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'venues' ? 'bg-surface text-secondary border-b-2 border-secondary' : 'text-gray-500 hover:text-white'}`}>
                    <Map size={18} /> My Venues
                </button>
                <button onClick={() => setActiveTab('financials')} className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'financials' ? 'bg-surface text-secondary border-b-2 border-secondary' : 'text-gray-500 hover:text-white'}`}>
                    <Landmark size={18} /> Financials
                </button>
            </div>

            {/* TAB 1: MASTER BOOKING LEDGER */}
            {activeTab === 'bookings' && (
                <div className="animate-in fade-in duration-300">
                    <div className="flex justify-between items-end mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center">
                            <span className="w-2 h-6 bg-secondary mr-3 rounded-full"></span>Upcoming Reservations
                        </h2>
                    </div>

                    <div className="bg-surface border border-gray-800 rounded-2xl overflow-hidden shadow-lg">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-400">
                                <thead className="bg-background/50 border-b border-gray-800 text-xs uppercase font-bold text-gray-500">
                                    <tr>
                                        <th className="px-6 py-4">Booking ID</th>
                                        <th className="px-6 py-4">Venue</th>
                                        <th className="px-6 py-4">Date & Time Slots</th>
                                        <th className="px-6 py-4">Customer</th>
                                        <th className="px-6 py-4 text-right">Revenue</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {data.matches.length === 0 ? (
                                        <tr><td colSpan="6" className="text-center py-12 text-gray-500 border-dashed border-gray-800 border">No bookings yet.</td></tr>
                                    ) : data.matches.map((booking) => {
                                        const displayDate = booking.date || (booking.datetime && booking.datetime.split('T')[0]);
                                        const displayTime = booking.time_slots?.length > 0 ? booking.time_slots.join(', ') : 'Open Schedule';
                                        const isPrivate = booking.match_type === 'private';

                                        const venueDetails = data.venues?.find(v => String(v.id) === String(booking.venue));
                                        const displayVenueName = venueDetails ? venueDetails.name : booking.venue_name || "Premium Turf";

                                        return (
                                            <tr key={booking.id} className="hover:bg-gray-800/30 transition-colors">
                                                <td className="px-6 py-4 font-mono text-xs text-gray-500">#{String(booking.id).padStart(4, '0')}</td>
                                                <td className="px-6 py-4 font-bold text-white">{displayVenueName}</td>
                                                <td className="px-6 py-4">
                                                    <div className="text-primary font-bold">{displayDate}</div>
                                                    <div className="text-xs text-gray-500 mt-1">{displayTime}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {isPrivate ? (
                                                        <div className="flex items-center text-secondary font-bold"><Shield size={14} className="mr-2" /> Private Squad</div>
                                                    ) : (
                                                        <div className="flex items-center"><User size={14} className="mr-2" /> Open Play ({booking.filled_slots || 0}/{booking.total_slots || 14})</div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right font-black text-white">
                                                    ₹{isPrivate ? (booking.price_inr + 15) : (booking.price_inr * (booking.filled_slots || 0))}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {booking.status === 'completed' ? (
                                                        <span className="text-xs font-bold text-gray-500 uppercase flex items-center justify-end"><CheckCircle size={14} className="mr-1" /> Done</span>
                                                    ) : booking.status === 'cancelled' ? (
                                                        <span className="text-xs font-bold text-red-500 uppercase flex items-center justify-end"><X size={14} className="mr-1" /> Cancelled</span>
                                                    ) : (
                                                        <button onClick={() => handleCompleteMatch(booking.id)} className="bg-gray-800 hover:bg-primary/20 text-gray-300 hover:text-primary border border-gray-700 hover:border-primary px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap active:scale-95">
                                                            Mark Complete
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: HOST OPEN PLAY */}
            {activeTab === 'openplay' && (
                <div className="animate-in fade-in duration-300 grid lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="bg-surface border border-gray-800 rounded-2xl p-8 shadow-lg">
                            <Megaphone size={40} className="text-secondary mb-4" />
                            <h2 className="text-2xl font-black text-white mb-2">Turn Dead Hours into Profit</h2>
                            <p className="text-gray-400 leading-relaxed mb-6">Got an empty pitch on Tuesday afternoon? Host a discounted public match. Solo players in your city will get a notification to buy individual tickets, filling your turf automatically.</p>
                            <div className="bg-background border border-gray-800 p-4 rounded-xl">
                                <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">How it works</div>
                                <ul className="text-sm text-gray-400 space-y-2">
                                    <li className="flex items-center"><CheckCircle size={14} className="text-secondary mr-2" /> Select one of your verified turfs</li>
                                    <li className="flex items-center"><CheckCircle size={14} className="text-secondary mr-2" /> Set a low individual ticket price (e.g., ₹150)</li>
                                    <li className="flex items-center"><CheckCircle size={14} className="text-secondary mr-2" /> We blast it to the global Match Feed</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface border border-gray-800 rounded-2xl p-6 h-fit shadow-lg">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                            <span className="w-2 h-6 bg-secondary mr-3 rounded-full"></span>Create Open Match
                        </h2>
                        <form onSubmit={handleHostOpenPlay} className="space-y-4">
                            <div>
                                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Select Your Turf</label>
                                <select required name="venue_id" className="w-full bg-background border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-secondary transition-colors cursor-pointer">
                                    <option value="">-- Choose a Venue --</option>
                                    {data.venues?.map(v => (
                                        <option key={v.id} value={v.id}>{v.name} ({v.location})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Kickoff Date & Time</label>
                                <input required name="datetime" type="datetime-local" className="w-full bg-background border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-secondary transition-colors" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Total Player Slots</label>
                                    <input required name="total_slots" type="number" min="10" max="22" defaultValue="14" className="w-full bg-background border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-secondary transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Ticket Price (₹)</label>
                                    <input required name="price_inr" type="number" min="50" defaultValue="150" className="w-full bg-background border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-secondary transition-colors" />
                                </div>
                            </div>

                            <button type="submit" className="w-full mt-4 bg-secondary text-black font-black py-4 rounded-xl hover:bg-[#00cce6] transition-colors active:scale-[0.98] shadow-[0_0_20px_rgba(0,204,230,0.1)] hover:shadow-[0_0_20px_rgba(0,204,230,0.3)]">
                                Blast to Match Feed
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* TAB 3: VENUES MANAGER */}
            {activeTab === 'venues' && (
                <div className="animate-in fade-in duration-300 grid lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-7">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                            <span className="w-2 h-6 bg-primary mr-3 rounded-full"></span>Active Turfs ({data.venues?.length || 0})
                        </h2>
                        <div className="space-y-4">
                            {data.venues?.length === 0 ? (
                                <div className="p-8 border border-dashed border-gray-800 rounded-2xl text-center text-gray-500">No turfs created yet. Use the form to add one.</div>
                            ) : data.venues?.map(venue => (
                                <div key={venue.id} className="bg-surface border border-gray-800 rounded-2xl p-6 shadow-lg flex justify-between items-center group hover:border-gray-600 transition-all">
                                    <div>
                                        <h3 className="text-xl font-black text-white">{venue.name}</h3>
                                        <div className="text-sm text-gray-400 flex items-center mt-2">
                                            <MapPin size={14} className="mr-1 text-primary" /> {venue.location}
                                        </div>
                                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-3 bg-background border border-gray-800 inline-block px-3 py-1 rounded-lg">
                                            {venue.pitch_size || '5v5 Only'}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Private Hourly Rate</div>
                                        <div className="text-2xl font-black text-primary">₹{venue.price_per_hour}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-5 bg-surface border border-gray-800 rounded-2xl p-6 h-fit shadow-lg sticky top-24">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center"><Building size={20} className="mr-2 text-secondary" /> Add New Turf</h2>
                        <form onSubmit={handleCreateVenue} className="space-y-4">
                            <div>
                                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Turf Name</label>
                                <input required name="name" type="text" className="w-full bg-background border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-secondary transition-colors" placeholder="e.g. AstroPark Arena" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Full Address</label>
                                <input required name="location" type="text" className="w-full bg-background border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-secondary transition-colors" placeholder="Sector 12, Main Road" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Pitch Size</label>
                                    <select name="size" className="w-full bg-background border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-secondary">
                                        <option value="5v5 Only">5v5 Only</option>
                                        <option value="7v7 & 5v5">7v7 & 5v5</option>
                                        <option value="9v9 / 11v11">9v9 / 11v11</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Rate Per Hour (₹)</label>
                                    <input required name="price_per_hour" type="number" min="500" className="w-full bg-background border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-secondary transition-colors" placeholder="1200" />
                                </div>
                            </div>
                            <button type="submit" className="w-full mt-4 bg-secondary text-black font-black py-4 rounded-xl hover:bg-[#00cce6] transition-colors active:scale-[0.98]">Publish Turf to Directory</button>
                        </form>
                    </div>
                </div>
            )}

            {/* TAB 4: FINANCIALS */}
            {activeTab === 'financials' && (
                <div className="animate-in fade-in duration-300">
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-surface border border-gray-800 rounded-2xl p-8 text-center shadow-2xl mb-8 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary to-transparent"></div>
                            <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Available for Payout</div>
                            <div className="text-6xl font-black text-secondary mb-2 flex justify-center items-center">
                                <span className="text-4xl mr-2 text-gray-500">₹</span>{availableBalance.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500 mb-8">Lifetime Earnings: ₹{totalRevenue.toLocaleString()}</div>
                            <button onClick={() => setIsWithdrawModalOpen(true)} disabled={availableBalance <= 0} className="w-full md:w-auto px-8 bg-secondary text-black font-bold py-4 rounded-xl hover:bg-[#00cce6] transition-all flex items-center justify-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-lg">
                                <Landmark size={20} /> Withdraw Funds
                            </button>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-4">Recent Settlements</h3>
                        <div className="space-y-3">
                            {localWithdrawals.map((w) => (
                                <div key={w.id} className="bg-background border border-gray-800 rounded-xl p-4 flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl ${w.status === 'processing' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-gray-800 text-gray-400'}`}>
                                            {w.status === 'processing' ? <Clock size={20} /> : <ArrowDownRight size={20} />}
                                        </div>
                                        <div>
                                            <div className="font-bold text-white text-sm">Payout: {w.bank}</div>
                                            <div className="text-xs text-gray-500 mt-1 flex items-center">
                                                {new Date(w.date).toLocaleDateString()} <span className="mx-2">•</span> <span className={w.status === 'processing' ? 'text-yellow-500 font-bold uppercase' : 'uppercase'}>{w.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="font-bold text-white">- ₹{w.amount.toLocaleString()}</div>
                                </div>
                            ))}
                            {localWithdrawals.length === 0 && <div className="text-center text-gray-500">No recent withdrawals.</div>}
                        </div>
                    </div>
                </div>
            )}

            {/* Payout Modal */}
            {isWithdrawModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-surface border border-gray-800 rounded-xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-background">
                            <h3 className="font-bold text-white flex items-center"><Landmark size={18} className="mr-2 text-secondary" /> Request Payout</h3>
                            <button onClick={() => !isWithdrawing && setIsWithdrawModalOpen(false)} className="text-gray-400 hover:text-white transition-colors"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleConfirmWithdrawal} className="p-6">
                            <div className="bg-background border border-gray-800 p-4 rounded-xl mb-6 flex items-center justify-between">
                                <div>
                                    <div className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Transferring to</div>
                                    <div className="text-sm font-bold text-white flex items-center"><Building size={14} className="mr-2 text-gray-500" /> HDFC Bank ****4021</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Available</div>
                                    <div className="text-sm font-bold text-secondary">₹{availableBalance.toLocaleString()}</div>
                                </div>
                            </div>
                            <div className="mb-8">
                                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-bold">Amount to Withdraw (₹)</label>
                                <input required type="number" min="100" max={availableBalance} value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} className="w-full text-2xl font-black bg-background border border-gray-700 rounded-xl p-4 text-white focus:outline-none focus:border-secondary transition-colors" placeholder="0" />
                                <div className="flex justify-between mt-2">
                                    <span className="text-xs text-gray-500">Min: ₹100</span>
                                    <button type="button" onClick={() => setWithdrawAmount(availableBalance)} className="text-xs font-bold text-secondary hover:underline">Withdraw Max</button>
                                </div>
                            </div>
                            <button type="submit" disabled={isWithdrawing || !withdrawAmount || parseInt(withdrawAmount) > availableBalance} className="w-full bg-secondary text-black font-black py-4 rounded-xl hover:bg-[#00cce6] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,204,230,0.2)] disabled:opacity-50 disabled:cursor-not-allowed">
                                {isWithdrawing ? <><Loader className="animate-spin" size={20} /> Processing...</> : <>Initiate Transfer of ₹{withdrawAmount ? parseInt(withdrawAmount).toLocaleString() : '0'}</>}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};