import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { validateEmail, validatePassword } from '../utils/validators';
import { Cpu, Mail, Lock, UserPlus, Sparkles, AlertCircle } from 'lucide-react';

export const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const data = await register(email, password);
      // If we got access token, session is immediate (e.g. SQLite local mode or Supabase auto login)
      if (data.access_token) {
        navigate('/');
      } else {
        setSuccess('Registration successful! Please check your email inbox to verify your account.');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-height-screen flex flex-col md:flex-row w-full min-h-[calc(100vh-73px)]">
      {/* Visual Splash Side */}
      <div className="flex-1 glowing-bg-violet flex flex-col justify-center p-8 md:p-16 border-b md:border-b-0 md:border-r border-white/5 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full glowing-bg-violet opacity-30 blur-3xl animate-glow-pulse" />
        
        <div className="relative z-10 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-500/10 border border-brand-500/20 rounded-full text-xs font-semibold text-brand-400">
            <Sparkles className="w-3.5 h-3.5" />
            100% Secure Auth via Supabase
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white font-sans leading-tight">
            Start Practicing <br/>
            <span className="text-gradient">Without Delay</span>
          </h1>
          
          <p className="text-sm md:text-base text-gray-400 leading-relaxed">
            Create your profile in seconds. Access unlimited question generation matching your tech stack, compile prep packets, and keep logs of your improvement.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-xl border border-white/5 bg-white/5">
              <span className="text-xl font-bold text-white block mb-1">Export PDF</span>
              <p className="text-xs text-gray-500">Compile questions and model answers into printable study files.</p>
            </div>
            <div className="p-4 rounded-xl border border-white/5 bg-white/5">
              <span className="text-xl font-bold text-white block mb-1">History Sync</span>
              <p className="text-xs text-gray-500">All generated assessments are archived for instant re-study.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-[#060A13]">
        <div className="w-full max-w-md space-y-8 glass-panel p-8 rounded-2xl border border-white/5 shadow-2xl relative">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white tracking-wide">Create Account</h2>
            <p className="text-xs text-gray-500 mt-2">Sign up for free and get access to the AI question engine</p>
          </div>

          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs flex items-center gap-2 animate-fade-in-up">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-center gap-2 animate-fade-in-up">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Password</label>
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
                  placeholder="At least 6 characters"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm glass-input"
                  placeholder="Re-enter password"
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
                  <UserPlus className="w-4 h-4" />
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-gray-500 mt-6 pt-4 border-t border-white/5">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-semibold">
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
