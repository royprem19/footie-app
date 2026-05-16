import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Mail, Lock, User, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

export const LoginPage = () => {
    const { loginAsPlayer, loginAsAdmin } = useAuthStore();
    const navigate = useNavigate();

    // State to track which mode we are in
    const [isSignUp, setIsSignUp] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        if (isSignUp && !name) {
            toast.error("Please tell us your name!");
            return;
        }
        if (!email || !password) {
            toast.error("Please fill in all fields!");
            return;
        }

        // Fake Backend Logic
        if (email.toLowerCase() === 'admin@footie.com') {
            loginAsAdmin();
            toast.success("Welcome back to the dashboard, Admin!");
            navigate('/admin');
        } else {
            // If signing up, pass the name. If signing in, pass a fallback or just extract from email for the mockup.
            const displayFullName = isSignUp ? name : (email.split('@')[0] || "Player");
            loginAsPlayer(displayFullName);
            toast.success(isSignUp ? "Account created successfully!" : "Welcome back to FOOTIE!");
            navigate('/matches');
        }
    };

    const toggleMode = () => {
        setIsSignUp(!isSignUp);
        setName('');
        setPassword('');
        // Keep the email if they already typed it!
    };

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center animate-in fade-in duration-500 p-4">

            {/* Branding */}
            <div className="text-5xl font-black tracking-widest text-white mb-2">
                FOOTIE<span className="text-primary">.</span>
            </div>
            <p className="text-gray-400 mb-8 text-center">
                {isSignUp ? 'Join the ultimate turf community.' : 'Sign in to book your turf.'}
            </p>

            {/* Form Container */}
            <div className="bg-surface border border-gray-800 rounded-2xl p-8 w-full max-w-md shadow-2xl transition-all duration-300">

                {/* Toggle Header */}
                <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        {isSignUp ? <><UserPlus size={24} className="text-primary" /> Create Account</> : <><LogIn size={24} className="text-primary" /> Account Login</>}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Name Input (ONLY VISIBLE ON SIGN UP) */}
                    {isSignUp && (
                        <div className="animate-in slide-in-from-top-4 fade-in duration-300">
                            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                            <div className="relative">
                                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Lionel Messi"
                                    className="w-full bg-background border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>
                        </div>
                    )}

                    {/* Email Input */}
                    <div>
                        <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="player@example.com"
                                className="w-full bg-background border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Password</label>
                        <div className="relative">
                            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-background border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 bg-primary text-black font-bold py-3 rounded-lg hover:bg-[#2ce00f] transition-all hover:scale-[1.02] active:scale-[0.98] mt-4"
                    >
                        {isSignUp ? 'Create Account' : 'Sign In'} <ArrowRight size={18} />
                    </button>
                </form>

                {/* Mode Toggle Footer */}
                <div className="mt-6 pt-6 border-t border-gray-800 text-sm text-center text-gray-400">
                    {isSignUp ? (
                        <p>Already have an account? <button onClick={toggleMode} className="text-primary font-bold hover:underline">Sign In</button></p>
                    ) : (
                        <p>Don't have an account? <button onClick={toggleMode} className="text-primary font-bold hover:underline">Sign Up</button></p>
                    )}
                </div>

            </div>
        </div>
    );
};