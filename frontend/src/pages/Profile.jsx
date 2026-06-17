import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { questionService, authService } from '../services/api';
import { User, Cpu, Sparkles, BookOpen, Award, CheckCircle, Database, Trash2, ShieldAlert } from 'lucide-react';

export const Profile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalSets: 0,
    technicalCount: 0,
    behavioralCount: 0,
    easyCount: 0,
    mediumCount: 0,
    hardCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [adminError, setAdminError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      try {
        const history = await questionService.getHistory();
        if (history && history.length > 0) {
          const statsObj = {
            totalSets: history.length,
            technicalCount: history.filter(h => h.question_type === 'Technical').length,
            behavioralCount: history.filter(h => h.question_type === 'Behavioral').length,
            easyCount: history.filter(h => h.difficulty === 'Easy').length,
            mediumCount: history.filter(h => h.difficulty === 'Medium').length,
            hardCount: history.filter(h => h.difficulty === 'Hard').length
          };
          setStats(statsObj);
        }
      } catch (err) {
        console.error("Could not calculate stats:", err);
      } finally {
        setLoading(false);
      }
    };

    const loadAdminData = async () => {
      if (user?.email === 'admin@interview.ai') {
        setLoadingUsers(true);
        try {
          const data = await authService.getAllUsers();
          setUsersList(data);
        } catch (err) {
          console.error("Could not load users:", err);
          setAdminError("Failed to load registered users.");
        } finally {
          setLoadingUsers(false);
        }
      }
    };

    loadStats();
    loadAdminData();
  }, [user]);

  const handleDeleteUser = async (targetUserId) => {
    if (!window.confirm("Are you sure you want to delete this user? This will also wipe all their generated interview sets and questions!")) {
      return;
    }
    try {
      await authService.deleteUser(targetUserId);
      setUsersList(usersList.filter(u => u.id !== targetUserId));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Failed to delete user.");
    }
  };

  return (
    <div className="flex-1 p-6 md:p-10 space-y-8 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight font-sans">
          Candidate <span className="text-gradient">Profile</span>
        </h1>
        <p className="text-sm text-gray-400">
          Monitor your preparation statistics, difficulty balance, and database configurations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Card */}
        <div className="md:col-span-1 glass-panel p-6 rounded-2xl border border-white/5 space-y-6 relative overflow-hidden flex flex-col items-center text-center">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="p-4 bg-brand-600/10 rounded-full border border-brand-500/20 text-brand-400">
            <User className="w-10 h-10" />
          </div>
          
          <div className="space-y-1 w-full">
            <h3 className="text-base font-bold text-white truncate max-w-full">{user?.email}</h3>
            <span className="text-[10px] text-brand-400 uppercase tracking-widest font-bold block">
              Registered Candidate
            </span>
          </div>

          <div className="w-full pt-4 border-t border-white/5 flex flex-col gap-2 text-left">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">ID:</span>
              <span className="text-gray-300 font-mono text-[10px] truncate max-w-[120px]">{user?.id}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Status:</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                Verified
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="md:col-span-2 space-y-6">
          {/* Main counts */}
          <div className="grid grid-cols-3 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-white/5 text-center space-y-1">
              <BookOpen className="w-5 h-5 text-indigo-400 mx-auto" />
              <span className="text-2xl font-black text-white">{stats.totalSets}</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold block">
                Total Packs
              </span>
            </div>
            
            <div className="glass-panel p-5 rounded-2xl border border-white/5 text-center space-y-1">
              <Cpu className="w-5 h-5 text-emerald-400 mx-auto" />
              <span className="text-2xl font-black text-white">{stats.technicalCount}</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold block">
                Technical
              </span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/5 text-center space-y-1">
              <Award className="w-5 h-5 text-amber-400 mx-auto" />
              <span className="text-2xl font-black text-white">{stats.behavioralCount}</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold block">
                Behavioral
              </span>
            </div>
          </div>

          {/* Difficulty breakdown */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-400" />
              Difficulty Balance
            </h3>
            
            <div className="space-y-3 pt-2">
              {/* Easy */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400 font-medium">Easy Questions</span>
                  <span className="text-emerald-400 font-bold">{stats.easyCount} packs</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: stats.totalSets ? `${(stats.easyCount / stats.totalSets) * 100}%` : '0%' }}
                  />
                </div>
              </div>

              {/* Medium */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400 font-medium">Medium Questions</span>
                  <span className="text-amber-400 font-bold">{stats.mediumCount} packs</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full"
                    style={{ width: stats.totalSets ? `${(stats.mediumCount / stats.totalSets) * 100}%` : '0%' }}
                  />
                </div>
              </div>

              {/* Hard */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400 font-medium">Hard Questions</span>
                  <span className="text-rose-400 font-bold">{stats.hardCount} packs</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full"
                    style={{ width: stats.totalSets ? `${(stats.hardCount / stats.totalSets) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin User Management Console */}
      {user?.email === 'admin@interview.ai' && (
        <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4 animate-fade-in-up">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            System Administrator Console
          </h2>
          <p className="text-xs text-gray-400">
            Below is the list of all registered candidates in the SQLite database. As an administrator, you have access to cascade-delete candidate accounts.
          </p>

          {adminError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-xs">
              {adminError}
            </div>
          )}

          {loadingUsers ? (
            <div className="text-center py-6 text-gray-400 text-xs flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Loading candidate list...
            </div>
          ) : (
            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 uppercase tracking-wider">
                    <th className="py-2.5 px-4 font-bold">Email</th>
                    <th className="py-2.5 px-4 font-bold">Registration Date</th>
                    <th className="py-2.5 px-4 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-200">
                  {usersList.map((usr) => (
                    <tr key={usr.id} className="hover:bg-white/5 transition">
                      <td className="py-3 px-4 font-medium font-mono">{usr.email}</td>
                      <td className="py-3 px-4 text-gray-400">{(usr.created_at || '').slice(0, 10)}</td>
                      <td className="py-3 px-4 text-right">
                        {usr.id === user.id ? (
                          <span className="text-[10px] text-brand-400 font-bold uppercase border border-brand-500/25 px-2 py-0.5 rounded bg-brand-500/10">
                            Current Admin
                          </span>
                        ) : (
                          <button
                            onClick={() => handleDeleteUser(usr.id)}
                            className="p-1.5 bg-red-500/10 hover:bg-red-500/25 text-red-400 hover:text-red-300 border border-red-500/20 rounded-lg transition"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {usersList.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-6 text-center text-gray-400">
                        No users registered.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
