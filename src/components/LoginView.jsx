import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

const LoginView = ({ onLogin }) => {
    const [account, setAccount] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ account: '', password: '' });
    const [isRegistering, setIsRegistering] = useState(false);

    const validate = () => {
        const newErrors = { account: '', password: '' };

        // Account: 8+ characters, alphanumeric
        if (account.length < 8) {
            newErrors.account = 'Account must be at least 8 characters';
        } else if (!/^[a-zA-Z0-9]+$/.test(account)) {
            newErrors.account = 'Account must be alphanumeric only';
        }

        // Password: 8+ characters, alphanumeric
        if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/^[a-zA-Z0-9]+$/.test(password)) {
            newErrors.password = 'Password must be alphanumeric only';
        }

        setErrors(newErrors);
        return !newErrors.account && !newErrors.password;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onLogin();
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900">
            {/* Epic Background */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-30"
                style={{
                    backgroundImage: `url('https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jhin_0.jpg')`,
                    filter: 'blur(3px)'
                }}
            />

            {/* Dark Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-slate-900/50 to-slate-900" />

            {/* Particle Effect Layer */}
            <div className="absolute inset-0 opacity-20">
                {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-amber-400 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [-20, 20],
                            opacity: [0.2, 0.8, 0.2],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-md px-6">
                {/* Logo - Epic Title */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12"
                >
                    <Sparkles className="w-16 h-16 mx-auto mb-4 text-amber-400 animate-pulse" />
                    <h1 className="text-6xl font-black tracking-wider mb-2 relative">
                        <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 text-transparent bg-clip-text drop-shadow-[0_0_30px_rgba(251,191,36,0.5)]">
                            LEGENDS
                        </span>
                    </h1>
                    <h2 className="text-5xl font-black tracking-widest">
                        <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-cyan-500 text-transparent bg-clip-text drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]">
                            OF SPIRE
                        </span>
                    </h2>
                    <p className="text-slate-400 mt-4 text-sm tracking-wider">ROGUE-LIKE CARD BATTLER</p>
                </motion.div>

                {/* Login Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="backdrop-blur-md bg-slate-900/80 rounded-2xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-slate-700/50"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Account Input */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-2 tracking-wide">
                                ACCOUNT
                            </label>
                            <input
                                type="text"
                                value={account}
                                onChange={(e) => setAccount(e.target.value)}
                                className={`w-full px-4 py-3 bg-slate-800/50 border-2 ${errors.account ? 'border-red-500' : 'border-slate-600'
                                    } rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all`}
                                placeholder="Enter account (8+ alphanumeric)"
                            />
                            {errors.account && (
                                <p className="text-red-400 text-xs mt-1">{errors.account}</p>
                            )}
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-2 tracking-wide">
                                PASSWORD
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full px-4 py-3 bg-slate-800/50 border-2 ${errors.password ? 'border-red-500' : 'border-slate-600'
                                    } rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all`}
                                placeholder="Enter password (8+ alphanumeric)"
                            />
                            {errors.password && (
                                <p className="text-red-400 text-xs mt-1">{errors.password}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-black text-lg tracking-wider rounded-lg shadow-[0_0_30px_rgba(251,191,36,0.4)] hover:shadow-[0_0_40px_rgba(251,191,36,0.6)] transition-all flex items-center justify-center gap-2"
                        >
                            <span>ENTER THE SPIRE</span>
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>

                        {/* Toggle Register */}
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => setIsRegistering(!isRegistering)}
                                className="text-cyan-400 hover:text-cyan-300 text-sm tracking-wide transition-colors"
                            >
                                {isRegistering ? 'Already have an account?' : 'Create Account'}
                            </button>
                        </div>
                    </form>
                </motion.div>

                {/* Footer Text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-center text-slate-500 text-xs mt-8 tracking-wider"
                >
                    © 2024 LEGENDS OF SPIRE. ALL RIGHTS RESERVED.
                </motion.p>
            </div>
        </div>
    );
};

export default LoginView;
