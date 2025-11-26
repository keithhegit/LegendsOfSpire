import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, UserSquare } from 'lucide-react';
import { authService } from '../services/authService';

const EMAIL_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

const LoginView = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [serverError, setServerError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const helperText = useMemo(() => {
    if (errors.email) return errors.email;
    if (errors.password) return errors.password;
    return isRegistering
      ? 'Registering requires a username and 8+ alphanumeric credentials.'
      : 'Login requires 8+ alphanumeric credentials.';
  }, [errors, isRegistering]);

  const validate = () => {
    const nextErrors = {};
    if (!EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email = 'Email requires 8+ letters and numbers.';
    }
    if (!EMAIL_PATTERN.test(password)) {
      nextErrors.password = 'Password requires 8+ letters and numbers.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    if (!validate()) return;

    setSubmitting(true);
    setServerError('');
    try {
      const user = isRegistering
        ? await authService.register(username || email.split('@')[0], email, password)
        : await authService.login(email, password);
      onLogin?.(user);
    } catch (error) {
      setServerError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-transparent to-slate-900/90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.2),_transparent_60%)]" />
      <div className="absolute inset-0 bg-[url('https://wsrv.nl/?url=https%3A%2F%2Fdd.b.pvp.net%2Flatest%2Fset1%2Fen_us%2Fimg%2Fcards%2F01NX044-full.png&w=400&q=80&output=webp')] bg-cover bg-center opacity-30 blur-sm" />
      <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.1)_1px,_transparent_1px)] bg-[length:100px_100px] opacity-50" />

      <motion.div
        className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="max-w-4xl w-full flex flex-col gap-10">
          <div className="text-center space-y-3">
            <div className="relative inline-flex items-center justify-center text-6xl md:text-7xl font-black tracking-[0.35em] uppercase">
              <span className="text-amber-300 drop-shadow-[0_0_30px_rgba(251,191,36,0.8)]">LEGENDS</span>
              <span className="ml-4 text-cyan-300 drop-shadow-[0_0_30px_rgba(34,211,238,0.8)]">OF</span>
              <span className="ml-4 text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">SPIRE</span>
              <motion.div
                className="absolute inset-0 pointer-events-none border border-white/20 rounded-full"
                animate={{ rotate: [0, 360] }}
                transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}
              />
            </div>
            <p className="text-sm uppercase tracking-[0.6em] text-slate-300">Ascend into the future竞技场</p>
            <div className="flex items-center justify-center gap-2 text-xs text-amber-300 uppercase tracking-[0.4em]">
              <Sparkles className="w-4 h-4" />
              <span>Dark E-sports Aura</span>
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          <motion.form
            onSubmit={handleSubmit}
            className="relative bg-black/70 border border-amber-500/40 rounded-3xl backdrop-blur-3xl shadow-[0_0_50px_rgba(15,23,42,0.8)] p-8 md:p-12 space-y-6"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Enter the Spire</p>
                <h2 className="text-3xl font-extrabold text-white mt-2">Login Portal</h2>
              </div>
              <div className="flex items-center gap-2 text-amber-300 text-sm uppercase tracking-[0.4em]">
                <UserSquare className="w-5 h-5" />
                <span>Secure</span>
              </div>
            </div>

            <div className="space-y-4">
            {isRegistering && (
              <label className="flex flex-col text-slate-300 text-xs uppercase tracking-[0.4em]">
                Username
                <input
                  type="text"
                  placeholder="Choose a nickname"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="mt-2 bg-transparent border border-white/20 rounded-2xl px-4 py-3 text-lg outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30"
                />
              </label>
            )}
            <label className="flex flex-col text-slate-300 text-xs uppercase tracking-[0.4em]">
              Email
                <input
                  type="text"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  className={`mt-2 bg-transparent border border-white/20 rounded-2xl px-4 py-3 text-lg outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 ${errors.email ? 'border-red-500 focus:ring-red-500/40' : ''}`}
                  aria-label="Email"
                  aria-invalid={errors.email ? 'true' : 'false'}
                />
                {errors.email && (
                  <span className="text-[10px] font-semibold text-red-400 uppercase tracking-[0.3em] mt-1">
                    {errors.email}
                  </span>
                )}
              </label>

              <label className="flex flex-col text-slate-300 text-xs uppercase tracking-[0.4em]">
                Password
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  className={`mt-2 bg-transparent border border-white/20 rounded-2xl px-4 py-3 text-lg outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 ${errors.password ? 'border-red-500 focus:ring-red-500/40' : ''}`}
                  aria-label="Password"
                  aria-invalid={errors.password ? 'true' : 'false'}
                />
                {errors.password && (
                  <span className="text-[10px] font-semibold text-red-400 uppercase tracking-[0.3em] mt-1">
                    {errors.password}
                  </span>
                )}
              </label>
            </div>

            <div className="text-xs uppercase tracking-[0.4em] text-slate-400">
              <p>{serverError || helperText}</p>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-black text-lg uppercase tracking-[0.4em] shadow-[0_0_40px_rgba(251,191,36,0.7)] hover:shadow-[0_0_60px_rgba(251,191,36,0.95)] transition"
              disabled={submitting}
            >
              {submitting ? 'Loading...' : 'Enter The Spire'}
            </button>

            <div className="flex items-center justify-between text-xs text-slate-400 uppercase tracking-[0.4em]">
              <button
                type="button"
                onClick={() => {
                  setIsRegistering((prev) => !prev);
                  setServerError('');
                }}
                className="hover:text-white transition-colors"
              >
                {isRegistering ? 'Switch to Login' : 'Create Account'}
              </button>
              <div className="text-[10px] text-slate-500">Need 2FA? Enable in settings.</div>
            </div>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginView;

