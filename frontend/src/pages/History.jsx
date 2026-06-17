import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { questionService } from '../services/api';
import Loader from '../components/Loader';
import { Calendar, Trash2, ArrowRight, Eye, AlertCircle, Sparkles, BookOpen } from 'lucide-react';

export const History = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await questionService.getHistory();
      setHistory(data);
    } catch (err) {
      console.error(err);
      setError('Failed to retrieve your previous interview sets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (e, setId) => {
    e.stopPropagation(); // Prevent card navigation trigger
    e.preventDefault();
    
    if (!window.confirm("Are you sure you want to delete this interview set?")) {
      return;
    }
    
    try {
      await questionService.deleteSet(setId);
      setHistory(history.filter(item => item.id !== setId));
    } catch (err) {
      console.error(err);
      alert('Failed to delete interview set.');
    }
  };

  const getDifficultyColor = (diff) => {
    const d = (diff || '').toLowerCase();
    if (d === 'easy') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (d === 'hard') return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-[#090D16]">
        <Loader message="Fetching your previous interview history sessions..." />
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 md:p-10 space-y-8 max-w-5xl mx-auto">
      {/* Page header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight font-sans">
          Interview <span className="text-gradient">Session Logs</span>
        </h1>
        <p className="text-sm text-gray-400">
          Revisit previous generations, download PDF copies, or clean up your dashboard records.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm flex items-center gap-2 animate-fade-in-up">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {history.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl border border-white/5 text-center max-w-lg mx-auto space-y-6 animate-fade-in-up">
          <div className="p-4 bg-brand-600/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto border border-brand-500/20">
            <BookOpen className="w-8 h-8 text-brand-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">No Interview Sets Saved</h3>
            <p className="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto">
              You haven't generated any interview question sets yet. Configure your criteria on the dashboard to begin.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold border border-brand-500/30 transition shadow-lg shadow-brand-500/10"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        /* History Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
          {history.map((set) => (
            <Link
              key={set.id}
              to={`/results/${set.id}`}
              className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-brand-500/35 hover:bg-white/10 transition duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Background gradient flare */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 rounded-full blur-2xl group-hover:bg-brand-500/10 transition" />

              <div className="space-y-4">
                {/* Meta details */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                    <Calendar className="w-3.5 h-3.5" />
                    {(set.created_at || '').slice(0, 10)}
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getDifficultyColor(set.difficulty)}`}>
                    {set.difficulty}
                  </span>
                </div>

                {/* Role and Skill */}
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white group-hover:text-brand-400 transition font-sans">
                    {set.role}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium">
                    Skill: <span className="text-gray-200">{set.skill}</span>
                  </p>
                </div>
              </div>

              {/* Footer controls inside card */}
              <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/5 text-xs">
                <span className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                  {set.question_type}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleDelete(e, set.id)}
                    className="p-2 bg-red-500/10 hover:bg-red-500/25 text-red-400 hover:text-red-300 border border-red-500/20 rounded-lg transition"
                    title="Delete set"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-600/10 group-hover:bg-brand-600 group-hover:text-white text-brand-400 rounded-lg font-bold transition border border-brand-500/20 group-hover:border-brand-500/40">
                    View Packet
                    <Eye className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
