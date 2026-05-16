import { useState } from 'react';
import { Calendar, MapPin, Users, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckoutModal } from '../payment/CheckoutModal';

export const MatchCard = ({ match }) => {
    const isFull = match.status === 'full' || match.filled_slots >= match.total_slots;
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="bg-surface border border-gray-800 rounded-xl overflow-hidden hover:border-primary/50 transition-all shadow-lg"
            >
                <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                        <Link to={`/matches/${match.id}`} className="group">
                            <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors flex items-center">
                                {match.venue_name} <ChevronRight size={18} className="ml-1 opacity-0 group-hover:opacity-100 transition-all" />
                            </h3>
                            <div className="flex items-center text-sm text-gray-400 mt-1">
                                <MapPin size={14} className="mr-1" /> {match.location}
                            </div>
                        </Link>
                        <div className="text-right">
                            <div className="text-lg font-black text-primary">₹{match.price_inr}</div>
                        </div>
                    </div>

                    <div className="flex items-center text-sm text-gray-300 mb-6">
                        <Calendar size={14} className="mr-2 text-secondary" />
                        {new Date(match.datetime).toLocaleDateString()} at {new Date(match.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>

                    <div className="mb-5">
                        <div className="flex justify-between text-xs mb-2 text-gray-400">
                            <span className="flex items-center"><Users size={12} className="mr-1" /> Players</span>
                            <span><strong className="text-white">{match.filled_slots}</strong> / {match.total_slots}</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-1.5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(match.filled_slots / match.total_slots) * 100}%` }}
                                className={`h-1.5 rounded-full ${isFull ? 'bg-danger' : 'bg-primary'}`}
                            ></motion.div>
                        </div>
                    </div>

                    <button
                        disabled={isFull}
                        onClick={() => setShowModal(true)}
                        className={`w-full py-3 rounded-lg font-bold text-sm transition-all ${isFull ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-primary text-black hover:scale-[1.02] active:scale-[0.98]'
                            }`}
                    >
                        {isFull ? 'Match Full' : 'Join & Pay'}
                    </button>
                </div>
            </motion.div>

            {/* FIXED: The Modal is now OUTSIDE the motion.div so it won't get trapped! */}
            {showModal && <CheckoutModal match={match} onClose={() => setShowModal(false)} />}
        </>
    );
};