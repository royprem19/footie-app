import { useState } from 'react';
import { X, CheckCircle, Loader2 } from 'lucide-react';
import { useMatchStore } from '../../store/matchStore';
import { useAuthStore } from '../../store/authStore'; // 1. Import auth store

export const CheckoutModal = ({ match, onClose }) => {
    const [status, setStatus] = useState('idle');
    const bookSlot = useMatchStore((state) => state.bookSlot);

    // 2. Grab the current user's profile
    const { user, profile } = useAuthStore();

    const handlePayment = () => {
        setStatus('processing');

        setTimeout(() => {
            // 3. Pass the user's details into the booking!
            bookSlot(match.id, {
                id: user?.id || `anon-${Date.now()}`,
                name: user?.name || 'Anonymous Player',
                position: profile?.position || 'Unknown',
                level: profile?.level || 'Unknown'
            });

            setStatus('success');
            setTimeout(() => onClose(), 2000);
        }, 2000);
    };

    // ... (KEEP THE REST OF THE COMPONENT'S RETURN STATEMENT EXACTLY THE SAME)
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-surface border border-gray-800 rounded-xl w-full max-w-md overflow-hidden shadow-2xl">

                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-800">
                    <h3 className="font-bold text-white">Complete Booking</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {status === 'success' ? (
                        <div className="text-center py-8">
                            <CheckCircle size={64} className="text-primary mx-auto mb-4 animate-bounce" />
                            <h2 className="text-2xl font-black text-white mb-2">Payment Successful!</h2>
                            <p className="text-gray-400">Your slot at {match.venue_name} is confirmed.</p>
                        </div>
                    ) : (
                        <>
                            <div className="bg-background rounded-lg p-4 mb-6 border border-gray-800">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-400">Venue</span>
                                    <span className="font-bold text-white">{match.venue_name}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-400">Entry Fee</span>
                                    <span className="font-bold text-white">₹{match.price_inr}</span>
                                </div>
                                <div className="flex justify-between border-t border-gray-800 pt-2 mt-2">
                                    <span className="text-gray-400">Platform Fee</span>
                                    <span className="font-bold text-white">₹10</span>
                                </div>
                                <div className="flex justify-between border-t border-gray-800 pt-2 mt-2">
                                    <span className="text-gray-200 font-bold">Total Amount</span>
                                    <span className="font-black text-primary text-xl">₹{match.price_inr + 10}</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={status === 'processing'}
                                className="w-full bg-primary text-black font-bold py-3 rounded-lg flex items-center justify-center hover:bg-[#2ce00f] transition-colors disabled:opacity-70"
                            >
                                {status === 'processing' ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin mr-2" />
                                        Processing Payment...
                                    </>
                                ) : (
                                    `Pay ₹${match.price_inr + 10} via UPI`
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};