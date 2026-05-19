import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Clock, CheckCircle, Shield, CreditCard, Smartphone, X, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useMatchStore } from '../store/matchStore';

const OPERATIONAL_HOURS = [
    '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
    '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM'
];

export const VenueDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // LIVE DATABASE HOOK
    const { venues, matches, addCustomBooking } = useMatchStore();
    const venue = venues.find(v => String(v.id) === String(id));

    const todayStr = new Date().toISOString().split('T')[0];

    const [bookingDate, setBookingDate] = useState(todayStr);
    const [selectedSlots, setSelectedSlots] = useState([]);

    // Payment States
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('upi');
    const [isProcessing, setIsProcessing] = useState(false);

    if (!venue) return <div className="p-20 text-center text-gray-400">Venue not found in directory.</div>;

    // Set fallbacks for dynamically created venues
    const color = venue.color || 'from-gray-800 to-gray-900';
    const rating = venue.rating || 'New';
    const desc = venue.desc || 'Premium playing surface available for instant booking.';

    // NEW: Real database validation
    // 1. Get Today's Date safely in 'YYYY-MM-DD' format
    const today = new Date().toLocaleDateString('en-CA');

    // 2. THE TIME MACHINE BLOCKER: Disables past dates AND past hours today!
    const isPastSlot = (dateStr, timeStr) => {
        if (!dateStr) return true;

        const now = new Date();
        // If they somehow select a past day, block it
        if (dateStr < today) return true;

        // If the date is TODAY, we must check the exact hour
        if (dateStr === today) {
            let [time, modifier] = timeStr.split(' ');
            let [hours, minutes] = time.split(':');
            hours = parseInt(hours, 10);

            if (hours === 12 && modifier === 'AM') hours = 0;
            if (modifier === 'PM' && hours < 12) hours += 12;

            const slotTime = new Date();
            slotTime.setHours(hours, parseInt(minutes, 10), 0, 0);

            // If the time has already passed today, disable the button!
            return slotTime < now;
        }
        return false;
    };

    // 3. BULLETPROOF SLOT CHECKER: Handles both Arrays and Django Strings
    const isSlotBooked = (dateStr, timeStr) => {
        return matches.some(match => {
            if (String(match.venue) !== String(venue.id) && match.venue_name !== venue.name) return false;
            if (match.status === 'cancelled') return false;

            const matchDate = match.date || (match.datetime && match.datetime.split('T')[0]);
            if (matchDate !== dateStr) return false;

            // FIX: Safely check if the time exists, whether Django sent an Array or a raw String
            if (match.time_slots) {
                if (Array.isArray(match.time_slots)) {
                    return match.time_slots.includes(timeStr);
                } else if (typeof match.time_slots === 'string') {
                    return match.time_slots.includes(timeStr); // Works for stringified lists too!
                }
            }
            return false;
        });
    };

    const handleToggleSlot = (time) => {
        if (selectedSlots.includes(time)) {
            setSelectedSlots(selectedSlots.filter(slot => slot !== time));
        } else {
            const newSlots = [...selectedSlots, time].sort((a, b) => {
                return OPERATIONAL_HOURS.indexOf(a) - OPERATIONAL_HOURS.indexOf(b);
            });
            setSelectedSlots(newSlots);
        }
    };

    const totalHours = selectedSlots.length;
    const subtotal = venue.price_per_hour * totalHours;
    const platformFee = totalHours > 0 ? 25 : 0;
    const totalAmount = subtotal + platformFee;

    const handleProceedToCheckout = () => {
        if (selectedSlots.length === 0) return toast.error("Please select at least one time slot.");
        setIsPaymentOpen(true);
    };

    const handleFinalPayment = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setIsPaymentOpen(false);

            // Convert 12hr to strict 24hr without timezone 'Z' shifts
            const startTime = selectedSlots[0];
            let [time, modifier] = startTime.split(' ');
            let [hours, minutes] = time.split(':');

            if (hours === '12') hours = '00';
            if (modifier === 'PM') hours = (parseInt(hours, 10) + 12).toString().padStart(2, '0');

            const djangoDateTime = `${bookingDate}T${hours}:${minutes}:00`;

            addCustomBooking({
                venue_name: venue.name,
                date: bookingDate,
                datetime: djangoDateTime,
                time_slots: selectedSlots, // <-- Passes the array to the store!
                price_inr: totalAmount,
                total_slots: 14,
                filled_slots: 1
            });

            toast.success(`Payment of ₹${totalAmount} successful! Pitch secured.`);
            navigate('/my-games');
        }, 2000);
    };

    return (
        <div className="p-4 md:p-8 pb-24 animate-in fade-in duration-500 max-w-5xl mx-auto relative">

            <Link to="/venues" className="inline-flex items-center text-sm text-gray-400 hover:text-primary transition-colors mb-6">
                <ArrowLeft size={16} className="mr-2" /> Back to Directory
            </Link>

            <motion.div
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                className={`w-full h-64 md:h-80 rounded-3xl bg-gradient-to-br ${color} mb-8 relative overflow-hidden flex flex-col justify-end p-6 md:p-8 border border-gray-800 shadow-2xl`}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="flex items-center text-sm font-bold text-white bg-black/50 px-3 py-1 rounded-full backdrop-blur-md">
                            <Star size={14} className="text-yellow-400 fill-yellow-400 mr-1" /> {rating}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">{venue.name}</h1>
                    <div className="text-gray-300 flex items-center mt-2 text-sm md:text-base font-medium">
                        <MapPin size={16} className="mr-2 text-primary" /> {venue.location}
                    </div>
                </div>
            </motion.div>

            <div className="grid lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 space-y-6">
                    <section className="bg-surface border border-gray-800 rounded-2xl p-6 shadow-lg">
                        <h2 className="text-xl font-bold text-white mb-4">About the Ground</h2>
                        <p className="text-gray-400 leading-relaxed mb-6">{desc}</p>

                        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-800">
                            <div className="flex items-center text-gray-300 text-sm"><CheckCircle size={16} className="text-primary mr-2 flex-shrink-0" /> Free Parking</div>
                            <div className="flex items-center text-gray-300 text-sm"><CheckCircle size={16} className="text-primary mr-2 flex-shrink-0" /> Premium Floodlights</div>
                            <div className="flex items-center text-gray-300 text-sm"><CheckCircle size={16} className="text-primary mr-2 flex-shrink-0" /> Changing Rooms</div>
                            <div className="flex items-center text-gray-300 text-sm"><CheckCircle size={16} className="text-primary mr-2 flex-shrink-0" /> Purified Water</div>
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-5 bg-surface border border-gray-800 rounded-2xl p-6 shadow-lg h-fit sticky top-24">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                        <Clock size={20} className="mr-2 text-primary" /> Setup Custom Booking
                    </h2>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-xs text-gray-400 uppercase tracking-wider font-bold mb-2">1. Choose Date</label>
                            <input
                                type="date"
                                min={today} /* THE FIX: Blocks past dates from being selected */
                                value={bookingDate}
                                onChange={(e) => { setBookingDate(e.target.value); setSelectedSlots([]); }}
                                className="w-full bg-background border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-primary transition-colors cursor-pointer"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <label className="block text-xs text-gray-400 uppercase tracking-wider font-bold">2. Select Kickoff Hours</label>
                                <span className="text-xs text-primary font-bold">{totalHours} Selected</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1 border border-gray-800 p-2 rounded-xl bg-background/50 custom-scrollbar">
                                {OPERATIONAL_HOURS.map((time) => {
                                    // THE FIX: Check both database bookings AND past time!
                                    const isBooked = isSlotBooked(bookingDate, time);
                                    const isPast = isPastSlot(bookingDate, time);
                                    const disabled = isBooked || isPast;

                                    const isSelected = selectedSlots.includes(time);

                                    return (
                                        <button
                                            key={time}
                                            type="button"
                                            disabled={disabled}
                                            onClick={() => handleToggleSlot(time)}
                                            className={`py-2 px-1 rounded-lg text-xs font-bold border transition-all truncate text-center ${disabled
                                                ? 'bg-gray-900 border-gray-900 text-gray-600 line-through cursor-not-allowed opacity-50' :
                                                isSelected
                                                    ? 'bg-primary text-black border-primary shadow-[0_0_10px_rgba(44,224,15,0.4)]' :
                                                    'bg-background border-gray-800 text-gray-300 hover:border-gray-600 hover:bg-gray-800'
                                                }`}
                                        >
                                            {time}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-6 pt-6">
                        <div className="bg-background/40 border border-gray-800 rounded-xl p-4 mb-6 space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-400">Hourly Rate</span>
                                <span className="text-white font-medium">₹{venue.price_per_hour}/hr</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-400">Duration Multiplier</span>
                                <span className="text-white font-medium">x {totalHours} Hr</span>
                            </div>
                            <div className="flex justify-between text-xs pb-2 border-b border-gray-800">
                                <span className="text-gray-400">Platform Insurance</span>
                                <span className="text-white font-medium">₹{platformFee}</span>
                            </div>
                            <div className="flex justify-between items-center pt-1">
                                <span className="text-sm font-bold text-white">Estimated Due</span>
                                <span className="text-2xl font-black text-primary">₹{totalAmount}</span>
                            </div>
                        </div>

                        <button
                            disabled={totalHours === 0}
                            onClick={handleProceedToCheckout}
                            className={`w-full font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2 ${totalHours > 0
                                ? 'bg-primary text-black hover:bg-[#2ce00f] shadow-[0_0_20px_rgba(44,224,15,0.2)] active:scale-[0.98]'
                                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            Confirm & Book Pitch
                        </button>
                    </div>
                </div>
            </div>

            {isPaymentOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-surface border border-gray-800 rounded-xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-4 border-b border-gray-800">
                            <h3 className="font-bold text-white flex items-center">
                                <Shield size={18} className="mr-2 text-primary" /> Secure Checkout
                            </h3>
                            <button onClick={() => !isProcessing && setIsPaymentOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="bg-background border border-gray-800 p-4 rounded-xl mb-6">
                                <div className="text-sm font-bold text-white mb-1">{venue.name}</div>
                                <div className="text-xs text-gray-400">
                                    {bookingDate} • {totalHours} Hour{totalHours > 1 ? 's' : ''}
                                </div>
                                <div className="text-xs text-primary mt-1 font-bold">
                                    {selectedSlots.join(', ')}
                                </div>
                            </div>

                            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Payment Method</h2>
                            <div className="space-y-3 mb-6">
                                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'upi' ? 'bg-gray-800/50 border-primary' : 'bg-background border-gray-800 hover:border-gray-600'}`}>
                                    <input type="radio" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="hidden" />
                                    <Smartphone size={20} className={paymentMethod === 'upi' ? 'text-primary' : 'text-gray-500'} />
                                    <span className="ml-3 font-bold text-white text-sm">UPI (GPay, PhonePe)</span>
                                    {paymentMethod === 'upi' && <CheckCircle size={16} className="ml-auto text-primary" />}
                                </label>

                                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'card' ? 'bg-gray-800/50 border-primary' : 'bg-background border-gray-800 hover:border-gray-600'}`}>
                                    <input type="radio" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="hidden" />
                                    <CreditCard size={20} className={paymentMethod === 'card' ? 'text-primary' : 'text-gray-500'} />
                                    <span className="ml-3 font-bold text-white text-sm">Credit / Debit Card</span>
                                    {paymentMethod === 'card' && <CheckCircle size={16} className="ml-auto text-primary" />}
                                </label>
                            </div>

                            <button
                                onClick={handleFinalPayment}
                                disabled={isProcessing}
                                className="w-full bg-primary text-black font-black py-4 rounded-xl hover:bg-[#2ce00f] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(44,224,15,0.2)] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? (
                                    <><Loader className="animate-spin" size={20} /> Processing...</>
                                ) : (
                                    <>Pay ₹{totalAmount} Now</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};