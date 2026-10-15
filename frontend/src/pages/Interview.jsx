import { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import {
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
  Loader2,
  HelpCircle,
  Save,
  ArrowLeft
} from 'lucide-react';

const Interview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [interview, setInterview] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Session elapsed timer
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchInterview = async () => {
      try {
        const { data } = await api.get(`/interviews/${id}`);
        setInterview(data);
        const initialAnswers = {};
        data.questions.forEach((q, idx) => {
          if (q.userAnswer && q.userAnswer !== 'No answer provided.') {
            initialAnswers[idx] = q.userAnswer;
          }
        });
        setAnswers(initialAnswers);
      } catch (err) {
        console.error('Error fetching interview:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [id, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0D14] flex flex-col items-center justify-center text-slate-400 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="text-sm font-medium">Entering Interview Room...</p>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="min-h-screen bg-[#0A0D14] flex flex-col items-center justify-center p-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
        <h2 className="text-xl font-bold text-white mb-2">Interview Session Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">This session may have been deleted or does not exist.</p>
        <Link
          to="/dashboard"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-500 transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const currentAnswer = answers[currentIdx] || '';
  const currentQ = interview.questions[currentIdx];
  const isCurrentEvaluated = Boolean(currentQ?.evaluation && currentQ?.evaluation?.score !== undefined);
  const totalQuestions = interview.questions.length;
  const progressPercent = Math.round(((currentIdx + 1) / totalQuestions) * 100);

  // Word and character count
  const charCount = currentAnswer.length;
  const wordCount = currentAnswer.trim() ? currentAnswer.trim().split(/\s+/).length : 0;

  const saveCurrentAnswer = async () => {
    const textToSave = answers[currentIdx] !== undefined ? answers[currentIdx] : (currentQ.userAnswer || '');
    const alreadySaved = currentQ.userAnswer && currentQ.userAnswer !== 'No answer provided.' ? currentQ.userAnswer : '';

    // If answer didn't change and already evaluated, skip redundant API call
    if (textToSave.trim() === alreadySaved.trim() && isCurrentEvaluated) {
      return true;
    }

    setSaving(true);
    setStatusMessage('Evaluating and saving your answer with Gemini AI...');
    try {
      const { data } = await api.post(`/interviews/${id}/answer`, {
        questionIndex: currentIdx,
        answer: textToSave
      });
      setInterview(data);
      setStatusMessage('✓ Evaluated and saved successfully!');
      setTimeout(() => setStatusMessage(''), 2500);
      return true;
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to evaluate and save answer. Please try again.');
      setStatusMessage('');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleNext = async () => {
    if (currentAnswer.trim()) {
      const ok = await saveCurrentAnswer();
      if (!ok) return;
    }
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handlePrev = async () => {
    if (currentAnswer.trim()) {
      const ok = await saveCurrentAnswer();
      if (!ok) return;
    }
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleSubmit = async () => {
    if (currentAnswer.trim()) {
      const ok = await saveCurrentAnswer();
      if (!ok) return;
    }
    setSaving(true);
    setStatusMessage('Finalizing session & calculating total performance score...');
    try {
      await api.post(`/interviews/${id}/complete`);
      navigate(`/results/${id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to complete interview. Please try again.');
      setSaving(false);
      setStatusMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Session Bar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#0A0D14]/90 border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-800"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          <div className="h-4 w-[1px] bg-slate-800 hidden sm:block" />

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">{interview.role}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {interview.difficulty}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                {interview.type}
              </span>
            </div>
          </div>
        </div>

        {/* Right Session Status: Timer & Progress */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg shadow-inner">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>{formatTimer(seconds)}</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span>{progressPercent}% Complete</span>
          </div>
        </div>
      </header>

      {/* Progress Bar Line */}
      <div className="w-full bg-slate-900 h-1">
        <div
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 h-1 transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Focus Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Question Stepper Indicator */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-md">
                Question {currentIdx + 1} of {totalQuestions}
              </span>
              {isCurrentEvaluated && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Score: {currentQ.evaluation.score}/100
                </span>
              )}
            </div>

            <div className="flex gap-1.5">
              {interview.questions.map((_, i) => (
                <button
                  key={i}
                  onClick={async () => {
                    if (currentAnswer.trim()) {
                      await saveCurrentAnswer();
                    }
                    setCurrentIdx(i);
                  }}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                    currentIdx === i
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : interview.questions[i]?.evaluation
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-900 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Question Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0E131F]/90 border border-slate-800/80 shadow-2xl relative overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-indigo-500 via-purple-500 to-blue-500" />
            <h1 className="text-xl sm:text-2xl font-bold text-white leading-relaxed">
              {currentQ.questionText}
            </h1>
          </div>

          {/* Answer Text Area & Live Metrics */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-1">
              <label htmlFor="answer-input" className="flex items-center gap-1.5">
                <span>Your Answer</span>
                <span className="text-slate-600">(Be concise, structured, and technically accurate)</span>
              </label>

              <div className="flex items-center gap-3 text-slate-500 font-mono text-[11px]">
                <span>{wordCount} words</span>
                <span>•</span>
                <span>{charCount} chars</span>
              </div>
            </div>

            <div className="relative rounded-2xl border border-slate-800 bg-[#0E131F]/90 focus-within:border-indigo-500/80 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all shadow-inner">
              <textarea
                id="answer-input"
                rows={9}
                value={currentAnswer}
                disabled={saving}
                onChange={(e) => setAnswers({ ...answers, [currentIdx]: e.target.value })}
                placeholder="Type your response here. Structure your answer using clear technical reasoning, key architectural patterns, and real-world examples..."
                className="w-full p-5 bg-transparent text-slate-100 placeholder-slate-600 text-sm sm:text-base leading-relaxed focus:outline-none resize-none font-sans"
              />

              {/* Status Message pill inside editor footer */}
              {statusMessage && (
                <div className="px-5 py-2.5 border-t border-slate-800/80 bg-slate-950/60 flex items-center gap-2 text-xs font-semibold text-indigo-400 animate-pulse">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{statusMessage}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls Footer */}
        <div className="pt-8 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/80 mt-8">
          <button
            onClick={handlePrev}
            disabled={currentIdx === 0 || saving}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 font-semibold text-sm transition-all flex items-center justify-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {currentIdx < totalQuestions - 1 ? (
              <button
                onClick={handleNext}
                disabled={saving}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {currentAnswer.trim() ? (
                  <>
                    <span>Save & Next Question</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Skip & Next Question</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="w-full sm:w-auto px-8 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.02]"
              >
                <CheckCircle2 className="w-4 h-4" />
                Finalize & Submit Interview
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Interview;
