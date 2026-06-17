import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { questionService } from '../services/api';
import { exportToPdfClient } from '../utils/pdfExport';
import QuestionCard from '../components/QuestionCard';
import Loader from '../components/Loader';
import { ArrowLeft, Download, Trash2, Calendar, Sparkles, BookOpen, AlertCircle } from 'lucide-react';

export const Results = () => {
  const { setId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [interviewSet, setInterviewSet] = useState(null);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await questionService.getSetDetails(setId);
        setInterviewSet(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch the interview set. It may have been deleted or you do not have permission to view it.');
      } finally {
        setLoading(false);
      }
    };

    if (setId) {
      fetchDetails();
    }
  }, [setId]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this interview set? This action cannot be undone.")) {
      return;
    }
    setDeleting(true);
    try {
      await questionService.deleteSet(setId);
      navigate('/history');
    } catch (err) {
      console.error(err);
      alert('Failed to delete the interview set.');
      setDeleting(false);
    }
  };

  const handleExportPDF = () => {
    if (!interviewSet) return;
    try {
      // Trigger client-side PDF export
      exportToPdfClient(interviewSet);
    } catch (err) {
      console.error(err);
      // Fallback: Try triggering backend PDF streaming endpoint
      const backendUrl = questionService.getPdfUrl(setId);
      window.open(backendUrl, '_blank');
    }
  };

  const handleBackendPDF = () => {
    if (!interviewSet) return;
    const backendUrl = questionService.getPdfUrl(setId);
    window.open(backendUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-[#090D16]">
        <Loader message="Loading interview questions, hints, and details..." />
      </div>
    );
  }

  if (error || !interviewSet) {
    return (
      <div className="flex-1 p-6 md:p-10 max-w-lg mx-auto text-center space-y-4">
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl flex items-center justify-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm font-semibold">{error || "Interview set not found."}</span>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-brand-400 hover:text-brand-300 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 md:p-10 space-y-8 max-w-5xl mx-auto">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-200 transition mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            {interviewSet.role}
            <Sparkles className="w-5 h-5 text-brand-400" />
          </h1>
          <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {(interviewSet.created_at || '').slice(0, 10)}
            </span>
            <span>•</span>
            <span className="text-brand-400 font-semibold uppercase">{interviewSet.question_type}</span>
          </div>
        </div>

        {/* Buttons: PDF Export, Delete */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold border border-brand-500/30 transition shadow-lg shadow-brand-500/10"
            title="Download PDF (Fast Client Generation)"
          >
            <Download className="w-4 h-4" />
            Export PDF (Client)
          </button>
          
          <button
            onClick={handleBackendPDF}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-xs font-bold border border-white/10 transition"
            title="Download PDF (Styled Backend Version)"
          >
            <BookOpen className="w-4 h-4 text-brand-400" />
            Export PDF (Server)
          </button>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 rounded-xl text-xs font-bold transition disabled:opacity-50"
            title="Delete this set"
          >
            <Trash2 className="w-4 h-4" />
            Delete Pack
          </button>
        </div>
      </div>

      {/* Criteria Info Board */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl border border-white/5 bg-white/5">
        <div>
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold block mb-0.5">Role</span>
          <span className="text-sm font-semibold text-white">{interviewSet.role}</span>
        </div>
        <div>
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold block mb-0.5">Core Skill</span>
          <span className="text-sm font-semibold text-white">{interviewSet.skill}</span>
        </div>
        <div>
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold block mb-0.5">Difficulty</span>
          <span className="text-sm font-semibold text-white">{interviewSet.difficulty}</span>
        </div>
        <div>
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold block mb-0.5">Level</span>
          <span className="text-sm font-semibold text-white">{interviewSet.experience_level || 'Mid-Level'}</span>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {interviewSet.questions && interviewSet.questions.length > 0 ? (
          interviewSet.questions.map((q, index) => (
            <QuestionCard key={q.id || index} question={q} index={index} />
          ))
        ) : (
          <div className="text-center py-10 glass-panel rounded-xl text-gray-400 text-sm">
            No questions found in this packet.
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
