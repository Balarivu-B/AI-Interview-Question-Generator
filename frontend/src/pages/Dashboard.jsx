import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { questionService } from '../services/api';
import Loader from '../components/Loader';
import { Sparkles, ArrowRight, Settings, Code, HelpCircle, CheckCircle } from 'lucide-react';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Input states
  const [role, setRole] = useState('');
  const [skill, setSkill] = useState('');
  const [experience, setExperience] = useState('Mid-Level');
  const [difficulty, setDifficulty] = useState('Medium');
  const [questionType, setQuestionType] = useState('Technical');
  const [count, setCount] = useState(5);
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');

    if (!role.trim()) {
      setError('Job Role is required.');
      return;
    }
    if (!skill.trim()) {
      setError('Core Skill is required.');
      return;
    }

    setLoading(true);
    try {
      const data = await questionService.generate({
        role: role.trim(),
        skill: skill.trim(),
        experience_level: experience,
        difficulty: difficulty,
        question_type: questionType,
        number_of_questions: count
      });
      
      // Navigate to results page using the generated set ID
      if (data && data.id) {
        navigate(`/results/${data.id}`);
      } else {
        throw new Error("Invalid response from API");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to generate questions. Please verify connection and parameters.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-[#090D16]">
        <Loader message={`Spawning ${count} customized ${questionType.toLowerCase()} questions for a ${experience.toLowerCase()} ${role} skilled in ${skill}...`} />
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 md:p-10 space-y-8 max-w-4xl mx-auto">
      {/* Welcome Heading */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight font-sans">
          Welcome to the <span className="text-gradient">Question Engine</span>
        </h1>
        <p className="text-sm text-gray-400">
          Specify your target interview criteria below to generate a tailored packet of questions, answers, and hints.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm flex items-center gap-2 animate-fade-in-up">
          <Settings className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Parameters Console */}
      <form onSubmit={handleGenerate} className="glass-panel p-6 md:p-8 rounded-2xl border border-white/5 space-y-6 relative overflow-hidden">
        {/* Glow backdrop decorator */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Required Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-brand-400" />
              Job Role <span className="text-brand-500">*</span>
            </label>
            <input
              type="text"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg text-sm glass-input"
              placeholder="e.g. Software Engineer, Recruiter, UI Designer"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-brand-400" />
              Core Skill / Technology <span className="text-brand-500">*</span>
            </label>
            <input
              type="text"
              required
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg text-sm glass-input"
              placeholder="e.g. Python, React, Behavioral, Leadership"
            />
          </div>
        </div>

        {/* Optional Selectors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          {/* Experience level */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Experience Level</label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm glass-input bg-[#090D16]"
            >
              <option value="Entry">Entry (0-2 years)</option>
              <option value="Mid-Level">Mid-Level (2-5 years)</option>
              <option value="Senior">Senior (5+ years)</option>
            </select>
          </div>

          {/* Difficulty */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Difficulty Level</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm glass-input bg-[#090D16]"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Question Type */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Question Type</label>
            <select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm glass-input bg-[#090D16]"
            >
              <option value="Technical">Technical</option>
              <option value="Behavioral">Behavioral</option>
              <option value="Situational">Situational</option>
              <option value="HR">HR Questions</option>
              <option value="Mixed">Mixed Categories</option>
            </select>
          </div>
        </div>

        {/* Slider for Number of Questions */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Number of Questions
            </label>
            <span className="px-2.5 py-0.5 rounded-lg bg-brand-500/20 text-brand-400 text-xs font-bold border border-brand-500/30">
              {count} Questions
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={15}
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value))}
            className="w-full accent-brand-500 bg-white/5 h-2 rounded-lg cursor-pointer transition"
          />
          <div className="flex items-center justify-between text-[10px] text-gray-500 font-medium">
            <span>1 Question</span>
            <span>15 Questions (Max)</span>
          </div>
        </div>

        {/* Submit Action Button */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="group flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-semibold border border-brand-500/30 transition-all duration-200 shadow-lg shadow-brand-500/10"
          >
            <Sparkles className="w-4 h-4 text-indigo-200" />
            Generate Interview Packet
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Dashboard;
