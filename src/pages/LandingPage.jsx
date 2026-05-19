import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Trophy, Activity } from 'lucide-react';

export const LandingPage = () => {
    return (
        <div className="flex flex-col min-h-screen pt-10 pb-24 overflow-hidden">

            {/* Hero Section */}
            <section className="relative px-4 flex flex-col items-center text-center mb-32 z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full -z-10 pointer-events-none"></div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-gray-800 text-sm text-gray-300 mb-8"
                >
                    <span className="flex h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_#2ce00f] animate-pulse"></span>
                    FOOTIE v1.0 is now live in your city
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6 max-w-4xl"
                >
                    The Ultimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Turf Booking</span> Experience.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl"
                >
                    Stop fighting in WhatsApp groups to organize a game. Find live matches, book your slot instantly, and build your player legacy.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                >
                    {/* UPDATED: Only the Player button remains! */}
                    <Link to="/login" className="px-8 py-4 bg-primary text-black font-black rounded-xl hover:bg-[#2ce00f] hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(44,224,15,0.3)]">
                        Join the Pitch <ArrowRight size={20} />
                    </Link>
                </motion.div>
            </section>

            {/* Features Grid */}
            <section className="px-4 max-w-5xl mx-auto w-full z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-black text-white uppercase tracking-wide">Everything you need to <span className="text-primary">play</span></h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-surface border border-gray-800 p-8 rounded-2xl hover:border-primary/50 transition-colors">
                        <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                            <Zap size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Instant Booking</h3>
                        <p className="text-gray-400 text-sm">No more calling the turf manager. See real-time availability and secure your slot with a single tap.</p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-surface border border-gray-800 p-8 rounded-2xl hover:border-secondary/50 transition-colors">
                        <div className="w-14 h-14 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center mb-6">
                            <Trophy size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Player Legacy</h3>
                        <p className="text-gray-400 text-sm">Build your profile. Rack up match caps, earn ranks like 'Turf Legend', and climb the community leaderboard.</p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-surface border border-gray-800 p-8 rounded-2xl hover:border-gray-500 transition-colors">
                        <div className="w-14 h-14 bg-gray-800 text-gray-300 rounded-xl flex items-center justify-center mb-6">
                            <Activity size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Smart Rosters</h3>
                        <p className="text-gray-400 text-sm">Know exactly who is playing. See the positions and skill levels of everyone on your team before you arrive.</p>
                    </motion.div>
                </div>
            </section>

        </div>
    );
};