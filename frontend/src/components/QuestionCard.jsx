import React, { useState } from 'react';
import { HelpCircle, Eye, EyeOff, Sparkles, Send, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { questionService } from '../services/api';
import HintCard from './HintCard';
import AnswerCard from './AnswerCard';

export const QuestionCard = ({ question, index }) => {
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [error, setError] = useState('');

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) {
      setError('Please write an answer first.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const data = await questionService.evaluateAnswer(question.id, userAnswer);
      setEvaluation(data);
      setShowAnswer(true); // Automatically show the model answer for comparison
    } catch (err) {
      console.error(err);
      setError('Could not get AI evaluation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getDifficultyColor = (diff) => {
    const d = (diff || '').toLowerCase();
    if (d === 'easy') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (d === 'hard') return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 5) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  return (
    <div className="glass-panel rounded-2xl p-6 relative card-shine border border-white/5 animate-fade-in-up">
      {/* Index and Difficulty tag */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold text-brand-400 tracking-wider uppercase">
          Question {index + 1}
        </span>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getDifficultyColor(question.difficulty)}`}>
          {question.difficulty}
        </span>
      </div>

      {/* Question Text */}
      <h3 className="text-lg font-bold text-white leading-relaxed mb-6 font-sans">
        {question.question}
      </h3>

      {/* Answer Input Sandbox */}
      <div className="space-y-3 mb-6 bg-white/5 p-4 rounded-xl border border-white/5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            Practice your Answer
          </label>
          {evaluation && (
            <span className="text-[10px] text-gray-400 italic">Compare below</span>
          )}
        </div>
        <textarea
          rows={3}
          value={userAnswer}
          onChange={(e) => {
            setUserAnswer(e.target.value);
            if (error) setError('');
          }}
          disabled={submitting || evaluation}
          className="w-full text-sm rounded-lg glass-input p-3 focus:outline-none"
          placeholder="Type your explanation here to check your score..."
        />
        {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
        
        <div className="flex justify-end gap-2">
          {evaluation ? (
            <button
              onClick={() => {
                setEvaluation(null);
                setUserAnswer('');
              }}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-lg text-xs font-semibold transition"
            >
              Reset Attempt
            </button>
          ) : (
            <button
              onClick={handleSubmitAnswer}
              disabled={submitting}
              className="flex items-center gap-2 px-4 py-1.5 bg-brand-600 hover:bg-brand-500 text-white disabled:bg-brand-600/50 disabled:cursor-not-allowed rounded-lg text-xs font-semibold border border-brand-500/30 transition shadow-lg shadow-brand-500/10"
            >
              {submitting ? (
                <>
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Evaluating...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Submit & Evaluate
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Evaluation Feedback block */}
      {evaluation && (
        <div className="mb-6 animate-fade-in-up">
          <div className="p-4 rounded-xl border glass-panel flex flex-col md:flex-row gap-4 items-start md:items-center">
            {/* Circular glowing score indicator */}
            <div className={`w-14 h-14 rounded-full border-2 flex flex-col items-center justify-center shrink-0 shadow-lg ${getScoreColor(evaluation.score)}`}>
              <span className="text-xl font-extrabold tracking-tighter leading-none">{evaluation.score}</span>
              <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400 mt-0.5">/10</span>
            </div>
            
            <div className="flex-1">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                AI Interviewer Feedback
              </h4>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                {evaluation.feedback}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Buttons: Toggle Hint / Toggle Answer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/5">
        <button
          onClick={() => setShowHint(!showHint)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
            showHint
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-white/5 text-gray-400 border-white/5 hover:text-gray-200'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          {showHint ? 'Hide Hint' : 'Reveal Hint'}
        </button>

        <button
          onClick={() => setShowAnswer(!showAnswer)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
            showAnswer
              ? 'bg-brand-600/20 text-brand-400 border-brand-500/30'
              : 'bg-white/5 text-gray-400 border-white/5 hover:text-gray-200'
          }`}
        >
          {showAnswer ? (
            <>
              <EyeOff className="w-4 h-4" />
              Hide Model Answer
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              View Model Answer
            </>
          )}
        </button>
      </div>

      {/* Expanded Hint */}
      {showHint && <HintCard hint={question.hint} />}

      {/* Expanded Answer */}
      {showAnswer && <AnswerCard answer={question.answer} />}
    </div>
  );
};

export default QuestionCard;
