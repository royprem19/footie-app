import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Trophy, Activity, Users, Shield, CalendarCheck, MapPin } from 'lucide-react';

export const LandingPage = () => {
    return (
        <div className="flex flex-col min-h-screen pb-24 overflow-hidden relative">

            {/* --- CINEMATIC BACKGROUND --- */}
            <div className="absolute top-0 left-0 w-full h-[80vh] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-20"></div>
            <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 blur-[150px] rounded-full -z-10 pointer-events-none opacity-50"></div>

            {/* --- HERO SECTION --- */}
            <section className="relative px-4 pt-20 pb-16 flex flex-col items-center text-center z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface/50 border border-primary/30 text-sm text-primary mb-8 backdrop-blur-md shadow-[0_0_15px_rgba(44,224,15,0.1)]"
                >
                    <span className="flex h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_#2ce00f] animate-pulse"></span>
                    FOOTIE v1.0 is now live in your city
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight mb-6 max-w-5xl leading-tight"
                >
                    The Ultimate <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#10b981] drop-shadow-[0_0_30px_rgba(44,224,15,0.2)]">
                        Turf Booking
                    </span> Experience.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl font-medium"
                >
                    Stop fighting in WhatsApp groups to organize a game. Find live matches, secure your slot instantly, and build your player legacy on the global leaderboard.
                </motion.p>

                {/* THE FIX: Player-Only CTAs routing to the unified login page */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                >
                    <Link to="/login" className="px-8 py-4 bg-primary text-black font-black rounded-xl hover:bg-[#2ce00f] hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(44,224,15,0.3)]">
                        Create Player Account <ArrowRight size={20} />
                    </Link>
                    <Link to="/login" className="px-8 py-4 bg-surface border border-gray-700 text-white font-bold rounded-xl hover:bg-gray-800 hover:border-gray-500 transition-all flex items-center justify-center gap-2">
                        Sign In
                    </Link>
                </motion.div>
            </section>

            {/* --- APP FLOATING PREVIEW (Cinematic UI Element) --- */}
            <motion.section
                initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
                className="max-w-4xl mx-auto w-full px-4 mb-32 relative z-10 perspective-1000"
            >
                <div className="bg-surface/80 backdrop-blur-xl border border-gray-700 rounded-3xl p-4 md:p-8 shadow-2xl overflow-hidden relative transform rotate-x-12 hover:rotate-x-0 transition-transform duration-700">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-50"></div>

                    <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary"><MapPin size={20} /></div>
                            <div>
                                <h3 className="text-white font-bold text-lg">AstroPark Arena</h3>
                                <p className="text-xs text-gray-500">Kickoff in 2 hours • 7v7 Match</p>
                            </div>
                        </div>
                        <div className="bg-gray-800 px-3 py-1 rounded-full text-xs font-bold text-primary border border-gray-700">Open Play</div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-background rounded-xl p-3 border border-gray-800">
                            <div className="text-xs text-gray-500 font-bold uppercase mb-1">Players</div>
                            <div className="text-white font-black text-xl">12/14</div>
                        </div>
                        <div className="bg-background rounded-xl p-3 border border-gray-800">
                            <div className="text-xs text-gray-500 font-bold uppercase mb-1">Ticket</div>
                            <div className="text-white font-black text-xl">₹150</div>
                        </div>
                        <div className="bg-background rounded-xl p-3 border border-gray-800 col-span-2 hidden md:block">
                            <div className="text-xs text-gray-500 font-bold uppercase mb-1">Lineup Activity</div>
                            <div className="flex -space-x-2 mt-2">
                                {['⚽', '🔥', '⚡', '🦅', '🎯'].map((avatar, i) => (
                                    <div key={i} className="w-8 h-8 rounded-full bg-surface border-2 border-background flex items-center justify-center text-xs z-10">{avatar}</div>
                                ))}
                                <div className="w-8 h-8 rounded-full bg-gray-800 border-2 border-background flex items-center justify-center text-xs text-gray-400 font-bold z-0">+7</div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full bg-primary/10 text-primary font-bold py-3 rounded-xl text-center border border-primary/20">
                        Secure Your Spot Instantly
                    </div>
                </div>
            </motion.section>

            {/* --- STATS TICKER --- */}
            <div className="w-full bg-surface border-y border-gray-800 py-6 mb-32 flex justify-center gap-12 flex-wrap px-4">
                <div className="flex items-center gap-3"><Users className="text-gray-500" /><span className="text-2xl font-black text-white">5,000+</span><span className="text-sm font-bold text-gray-500 uppercase">Players</span></div>
                <div className="flex items-center gap-3"><CalendarCheck className="text-gray-500" /><span className="text-2xl font-black text-white">12,000+</span><span className="text-sm font-bold text-gray-500 uppercase">Matches</span></div>
                <div className="flex items-center gap-3"><Shield className="text-gray-500" /><span className="text-2xl font-black text-white">50+</span><span className="text-sm font-bold text-gray-500 uppercase">Verified Turfs</span></div>
            </div>

            {/* --- FEATURES GRID --- */}
            <section className="px-4 max-w-6xl mx-auto w-full z-10 mb-32">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black text-white tracking-tight mb-4">Everything you need to <span className="text-primary">play</span>.</h2>
                    <p className="text-gray-400 max-w-xl mx-auto">Designed by players, for players. We removed all the friction between you and the pitch.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-surface border border-gray-800 p-8 rounded-3xl hover:border-primary/50 transition-colors group">
                        <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Zap size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Instant Booking</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">No more calling the turf manager. See real-time availability and secure your slot with a single tap. Payments are split and handled automatically.</p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-surface border border-gray-800 p-8 rounded-3xl hover:border-yellow-500/50 transition-colors group">
                        <div className="w-14 h-14 bg-yellow-500/10 text-yellow-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Trophy size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Player Legacy</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">Build your profile. Rack up match caps, earn ranks like 'Turf Legend', and climb the global community leaderboard.</p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-surface border border-gray-800 p-8 rounded-3xl hover:border-secondary/50 transition-colors group">
                        <div className="w-14 h-14 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Activity size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Smart Rosters</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">Create a franchise or join as a Free Agent. Know exactly who is playing and see the positions of everyone on your team before you arrive.</p>
                    </motion.div>
                </div>
            </section>

            {/* --- FOOTER CTA --- */}
            <section className="px-4 max-w-4xl mx-auto w-full text-center pb-12">
                <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-6 relative z-10">Ready for Kickoff?</h2>
                    <p className="text-gray-400 mb-8 relative z-10 max-w-md mx-auto">Join thousands of players already booking matches in your area.</p>
                    <Link to="/login" className="inline-flex px-8 py-4 bg-white text-black font-black rounded-xl hover:bg-gray-200 transition-all items-center justify-center gap-2 relative z-10">
                        Create Free Account
                    </Link>
                </div>
            </section>
        </div>
    );
};