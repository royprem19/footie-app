import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Shield, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useMatchStore } from '../store/matchStore'; // Real backend connection

export const AuthPage = () => {
    const navigate = useNavigate();
    const { login } = useMatchStore(); // Pull the login action from Zustand

    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [role, setRole] = useState('player'); // 'player' or 'admin'

    // Form States
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (isLogin) {
            // --- REAL LOGIN LOGIC ---
            toast.loading("Authenticating...", { id: 'auth-toast' });

            // The store now returns the user profile if successful
            const user = await login(username, password);

            if (user) {
                toast.success(`Welcome back, @${user.username}!`, { id: 'auth-toast' });

                // THE SMART ROUTER: Send Admins to the admin panel, players to matches!
                if (user.isAdmin) {
                    navigate('/admin');
                } else {
                    navigate('/matches');
                }
            } else {
                toast.error("Invalid username or password.", { id: 'auth-toast' });
            }
        }
        else {
            // --- REAL REGISTRATION LOGIC ---
            toast.loading("Creating your player account...", { id: 'auth-toast' });
            try {
                const res = await fetch('http://127.0.0.1:8000/api/auth/register/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                });

                if (res.ok) {
                    toast.success("Account created successfully!", { id: 'auth-toast' });
                    // Auto-login after successful registration
                    const autoLogin = await login(username, password);
                    if (autoLogin) {
                        navigate(role === 'admin' ? '/admin' : '/matches');
                    }
                } else {
                    const errors = await res.json();
                    // Grab the first error message Django spits out
                    const mainError = Object.values(errors)[0];
                    toast.error(Array.isArray(mainError) ? mainError[0] : "Registration failed.", { id: 'auth-toast' });
                }
            } catch (err) {
                console.error(err);
                toast.error("Could not connect to authentication server.", { id: 'auth-toast' });
            }
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">

            {/* Background Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="w-full max-w-md relative z-10">

                {/* Logo Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
                        Foo<span className="text-primary">tie.</span>
                    </h1>
                    <p className="text-gray-400 text-sm mt-2 font-medium">Your city. Your turf. Your game.</p>
                </div>

                {/* Auth Card */}
                <div className="bg-surface border border-gray-800 rounded-3xl p-8 shadow-2xl overflow-hidden relative">

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isLogin ? 'login' : 'signup'}
                            initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-wide">
                                {isLogin ? 'Welcome Back' : 'Create Account'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">

                                {/* Username (Required for BOTH Login and Signup) */}
                                <motion.div layout>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Username</label>
                                    <div className="relative">
                                        <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <input
                                            required
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            placeholder="royprem1902"
                                            className="w-full bg-background border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary transition-colors"
                                        />
                                    </div>
                                </motion.div>

                                {/* Email (Sign Up Only) */}
                                {!isLogin && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email Address</label>
                                        <div className="relative">
                                            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                            <input
                                                required
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="player@footie.app"
                                                className="w-full bg-background border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary transition-colors"
                                            />
                                        </div>
                                    </motion.div>
                                )}

                                {/* Password */}
                                <motion.div layout>
                                    <div className="flex justify-between items-end mb-1">
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Password</label>
                                        {isLogin && <a href="#" className="text-xs text-primary font-bold hover:underline">Forgot?</a>}
                                    </div>
                                    <div className="relative">
                                        <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <input
                                            required
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full bg-background border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary transition-colors"
                                        />
                                    </div>
                                </motion.div>

                                {/* Sign Up Only: Role Selector */}
                                {!isLogin && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-2">
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">I am a...</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setRole('player')}
                                                className={`p-3 rounded-xl border flex items-center justify-center font-bold text-sm transition-all ${role === 'player' ? 'bg-primary/10 border-primary text-primary' : 'bg-background border-gray-700 text-gray-400 hover:border-gray-500'}`}
                                            >
                                                <User size={16} className="mr-2" /> Player
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setRole('admin')}
                                                className={`p-3 rounded-xl border flex items-center justify-center font-bold text-sm transition-all ${role === 'admin' ? 'bg-secondary/10 border-secondary text-secondary' : 'bg-background border-gray-700 text-gray-400 hover:border-gray-500'}`}
                                            >
                                                <Shield size={16} className="mr-2" /> Turf Admin
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Submit Button */}
                                <button
                                    disabled={isLoading}
                                    type="submit"
                                    className="w-full bg-white text-black font-black py-4 rounded-xl mt-6 hover:bg-gray-200 active:scale-[0.98] transition-all flex items-center justify-center group disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Authenticating...' : (isLogin ? 'Secure Login' : 'Create Account')}
                                    {!isLoading && <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />}
                                </button>
                            </form>
                        </motion.div>
                    </AnimatePresence>

                    {/* Toggle Login/Signup */}
                    <div className="mt-8 pt-6 border-t border-gray-800 text-center relative z-20">
                        <p className="text-gray-400 text-sm">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <button
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    // Reset form when toggling
                                    setUsername('');
                                    setEmail('');
                                    setPassword('');
                                }}
                                className="ml-2 font-bold text-white hover:text-primary transition-colors"
                            >
                                {isLogin ? 'Sign up' : 'Log in'}
                            </button>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};