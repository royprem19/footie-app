import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMatchStore } from '../store/matchStore';
import { useAuthStore } from '../store/authStore';
import { ArrowLeft, MapPin, Calendar, Users, User, CreditCard, Smartphone, CheckCircle, Shield, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

export const MatchDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // THE FIX: Added 'venues' so we can look up the real ground name!
    const { matches, venues, bookMatch } = useMatchStore();
    const { user } = useAuthStore();

    // Find the exact match clicked from the feed
    const match = matches.find(m => String(m.id) === String(id));

    // Checkout States
    const [bookingType, setBookingType] = useState('solo'); // 'solo' or 'squad'
    const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' or 'card'
    const [isProcessing, setIsProcessing] = useState(false);

    if (!match) return <div className="p-20 text-center text-gray-400">Match not found.</div>;

    const availableSlots = match.total_slots - (match.filled_slots || 0);
    const canBookSquad = availableSlots >= 5;

    // Calculate Totals
    const slotsToBook = bookingType === 'solo' ? 1 : 5;
    const subtotal = match.price_inr * slotsToBook;
    const platformFee = 15 * slotsToBook;
    const total = subtotal + platformFee;

    // THE FIX: Bulletproof Date & Time extractor (No more "Invalid Date")
    const displayDate = match.date || (match.datetime && match.datetime.split('T')[0]) || "Date TBD";
    const displayTime = match.time_slots?.length > 0 ? match.time_slots.join(', ') : "Time TBD";

    // THE FIX: Real Venue Name lookup
    const venueDetails = venues?.find(v => String(v.id) === String(match.venue));
    const displayVenueName = venueDetails ? venueDetails.name : match.venue_name || "Premium Turf";
    const displayLocation = venueDetails ? venueDetails.location : match.location || "Location Directory TBD";

    const handlePayment = () => {
        setIsProcessing(true);

        // Simulate a 2-second payment gateway delay
        setTimeout(() => {
            setIsProcessing(false);

            // Tell the database we actually bought it!
            bookMatch(match.id, slotsToBook);

            toast.success(`Payment of ₹${total} successful!`);
            // Route the user to their bookings page after success
            navigate('/my-games');
        }, 2000);
    };

    return (
        <div className="p-4 md:p-8 pb-24 animate-in fade-in duration-500 max-w-6xl mx-auto">

            <Link to="/matches" className="inline-flex items-center text-sm text-gray-400 hover:text-primary transition-colors mb-6">
                <ArrowLeft size={16} className="mr-2" /> Back to Match Feed
            </Link>

            <div className="mb-8 border-b border-gray-800 pb-4">
                <h1 className="text-3xl font-black text-white uppercase tracking-wide">
                    Secure <span className="text-primary">Checkout</span>
                </h1>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">

                {/* Left Column: Match Summary & Booking Type */}
                <div className="space-y-6">

                    {/* Match Info Card */}
                    <div className="bg-surface border border-gray-800 rounded-2xl p-6 shadow-lg">
                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Match Details</h2>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                {/* THE FIX: Using real venue variables */}
                                <h3 className="text-2xl font-black text-white">{displayVenueName}</h3>
                                <div className="text-sm text-gray-400 flex items-center mt-1">
                                    <MapPin size={14} className="mr-1 text-primary" /> {displayLocation}
                                </div>
                            </div>
                        </div>
                        <div className="bg-background border border-gray-800 p-4 rounded-xl flex items-center mb-4">
                            <Calendar size={20} className="text-primary mr-3" />
                            <div>
                                {/* THE FIX: Using the safe displayDate and displayTime */}
                                <div className="text-sm font-bold text-white">
                                    {displayDate}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                    {displayTime}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center text-sm font-bold">
                            <Users size={16} className="text-secondary mr-2" />
                            <span className="text-white mr-2">{availableSlots}</span>
                            <span className="text-gray-500">slots remaining</span>
                        </div>
                    </div>

                    {/* Booking Type Selection */}
                    <div className="bg-surface border border-gray-800 rounded-2xl p-6 shadow-lg">
                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Who is playing?</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setBookingType('solo')}
                                className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${bookingType === 'solo' ? 'bg-primary/10 border-primary text-white' : 'bg-background border-gray-800 text-gray-500 hover:border-gray-600'}`}
                            >
                                <User size={24} className={`mb-2 ${bookingType === 'solo' ? 'text-primary' : ''}`} />
                                <span className="font-bold">Solo Player</span>
                                <span className="text-xs mt-1 opacity-70">Book 1 Slot</span>
                            </button>

                            <button
                                disabled={!canBookSquad}
                                onClick={() => setBookingType('squad')}
                                className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${bookingType === 'squad' ? 'bg-secondary/10 border-secondary text-white' : 'bg-background border-gray-800 text-gray-500 hover:border-gray-600'} ${!canBookSquad && 'opacity-50 cursor-not-allowed'}`}
                            >
                                <Users size={24} className={`mb-2 ${bookingType === 'squad' ? 'text-secondary' : ''}`} />
                                <span className="font-bold">Full Squad</span>
                                <span className="text-xs mt-1 opacity-70">Book 5 Slots</span>
                            </button>
                        </div>
                        {!canBookSquad && (
                            <p className="text-xs text-danger mt-3 text-center">Not enough slots left to book a full squad.</p>
                        )}
                    </div>
                </div>

                {/* Right Column: Payment & Receipt */}
                <div className="space-y-6">
                    <div className="bg-surface border border-gray-800 rounded-2xl p-6 shadow-lg sticky top-24">

                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Payment Method</h2>
                        <div className="space-y-3 mb-8">
                            <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'upi' ? 'bg-gray-800/50 border-primary' : 'bg-background border-gray-800 hover:border-gray-600'}`}>
                                <input type="radio" name="payment" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="hidden" />
                                <Smartphone size={20} className={paymentMethod === 'upi' ? 'text-primary' : 'text-gray-500'} />
                                <span className="ml-3 font-bold text-white">UPI (GPay, PhonePe, Paytm)</span>
                                {paymentMethod === 'upi' && <CheckCircle size={16} className="ml-auto text-primary" />}
                            </label>

                            <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'card' ? 'bg-gray-800/50 border-primary' : 'bg-background border-gray-800 hover:border-gray-600'}`}>
                                <input type="radio" name="payment" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="hidden" />
                                <CreditCard size={20} className={paymentMethod === 'card' ? 'text-primary' : 'text-gray-500'} />
                                <span className="ml-3 font-bold text-white">Credit / Debit Card</span>
                                {paymentMethod === 'card' && <CheckCircle size={16} className="ml-auto text-primary" />}
                            </label>
                        </div>

                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Order Summary</h2>
                        <div className="bg-background border border-gray-800 rounded-xl p-4 mb-6">
                            <div className="flex justify-between text-sm mb-3">
                                <span className="text-gray-400">Entry Fee (₹{match.price_inr} x {slotsToBook})</span>
                                <span className="font-bold text-white">₹{subtotal}</span>
                            </div>
                            <div className="flex justify-between text-sm mb-4 pb-4 border-b border-gray-800">
                                <span className="text-gray-400">Platform Fee</span>
                                <span className="font-bold text-white">₹{platformFee}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-white">Total Amount</span>
                                <span className="text-2xl font-black text-primary">₹{total}</span>
                            </div>
                        </div>

                        <button
                            onClick={handlePayment}
                            disabled={isProcessing}
                            className="w-full bg-primary text-black font-black py-4 rounded-xl hover:bg-[#2ce00f] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(44,224,15,0.2)] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isProcessing ? (
                                <><Loader className="animate-spin" size={20} /> Processing...</>
                            ) : (
                                <>Pay ₹{total} Securely <Shield size={18} /></>
                            )}
                        </button>
                        <p className="text-[10px] text-gray-500 text-center mt-4">By proceeding, you agree to our 24-hour cancellation policy.</p>
                    </div>
                </div>

            </div>
        </div>
    );
};