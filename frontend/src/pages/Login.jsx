import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { validateEmail, validatePassword } from '../utils/validators';
import { Cpu, Mail, Lock, LogIn, Sparkles, AlertCircle } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-height-screen flex flex-col md:flex-row w-full min-h-[calc(100vh-73px)]">
      {/* Visual Splash Side */}
      <div className="flex-1 glowing-bg-violet flex flex-col justify-center p-8 md:p-16 border-b md:border-b-0 md:border-r border-white/5 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full glowing-bg-violet opacity-30 blur-3xl animate-glow-pulse" />
        
        <div className="relative z-10 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-500/10 border border-brand-500/20 rounded-full text-xs font-semibold text-brand-400">
            <Sparkles className="w-3.5 h-3.5" />
            Empowered by AI Engineering
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white font-sans leading-tight">
            Supercharge Your <br/>
            <span className="text-gradient">Interview Success</span>
          </h1>
          
          <p className="text-sm md:text-base text-gray-400 leading-relaxed">
            Generate highly customized, role-specific interview assessments on the fly. Review model answers, receive helpful clues, and practice live mock answer scoring.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-xl border border-white/5 bg-white/5">
              <span className="text-xl font-bold text-white block mb-1">Tailored API</span>
              <p className="text-xs text-gray-500">Parameters for job role, core skill, experience, and difficulty level.</p>
            </div>
            <div className="p-4 rounded-xl border border-white/5 bg-white/5">
              <span className="text-xl font-bold text-white block mb-1">Live Evaluation</span>
              <p className="text-xs text-gray-500">Submit replies to receive instant grading and structural tips.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-[#060A13]">
        <div className="w-full max-w-md space-y-8 glass-panel p-8 rounded-2xl border border-white/5 shadow-2xl relative">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white tracking-wide">Welcome Back</h2>
            <p className="text-xs text-gray-500 mt-2">Sign in to your candidate account to start practicing</p>
          </div>

          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs flex items-center gap-2 animate-fade-in-up">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm glass-input"
                  placeholder="name@domain.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Password</label>
                <span className="text-[10px] text-brand-400 hover:text-brand-300 font-semibold cursor-pointer">
                  Forgot?
                </span>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm glass-input"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-sm font-semibold border border-brand-500/30 transition shadow-lg shadow-brand-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-gray-500 mt-6 pt-4 border-t border-white/5">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-400 hover:text-brand-300 font-semibold">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
