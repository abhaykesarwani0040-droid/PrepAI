import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Award,
  Sparkles,
  ArrowRight,
  RotateCcw,
  LayoutDashboard,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Copy,
  Check,
  Printer,
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  Loader2,
  Share2
} from 'lucide-react';

const Results = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Copy feedback state for sample answers
  const [copiedIdx, setCopiedIdx] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchResults = async () => {
      try {
        const { data } = await api.get(`/interviews/${id}`);
        setInterview(data);
      } catch (err) {
        console.error('Error fetching results:', err);
        setError('Failed to load interview results. Please try refreshing.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [id, user, navigate]);

  const handleCopySampleAnswer = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0D14] flex flex-col items-center justify-center text-slate-400 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="text-sm font-medium">Computing AI Evaluation Report...</p>
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="min-h-screen bg-[#0A0D14] flex flex-col items-center justify-center p-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
        <h2 className="text-xl font-bold text-white mb-2">{error || 'Interview Not Found'}</h2>
        <Link
          to="/dashboard"
          className="mt-4 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-500 transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const overall = Math.round(interview.overallScore || 0);

  // SVG circular gauge properties
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overall / 100) * circumference;

  const getScoreVerdict = (score) => {
    if (score >= 80) return { label: 'Outstanding Candidate', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' };
    if (score >= 60) return { label: 'Strong Competency', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' };
    if (score >= 40) return { label: 'Needs Target Practice', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' };
    return { label: 'Requires Core Preparation', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' };
  };

  const verdict = getScoreVerdict(overall);

  return (
    <div className="min-h-screen bg-[#0A0D14] text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Top Header Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0E131F]/90 border border-slate-800/80 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            {/* Left summary */}
            <div className="space-y-3 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-400">
                <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
                <span>AI Performance Evaluation Report</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {interview.role}
              </h1>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-xs text-slate-400 font-medium">
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                  {interview.type} Interview
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {interview.difficulty} Level
                </span>
                <span>•</span>
                <span>{interview.questions.length} Questions Evaluated</span>
                <span>•</span>
                <span>{new Date(interview.updatedAt || interview.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="pt-2">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${verdict.bg} ${verdict.color}`}>
                  ✦ {verdict.label}
                </span>
              </div>
            </div>

            {/* Right: Circular SVG Gauge */}
            <div className="flex flex-col items-center justify-center shrink-0">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
                  {/* Background Track */}
                  <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="10"
                    className="text-slate-800/80"
                    fill="transparent"
                  />
                  {/* Animated Progress Arc */}
                  <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    stroke="url(#scoreGradient)"
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366F1" />
                      <stop offset="50%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#10B981" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-4xl font-black text-white tracking-tight">{overall}</span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">out of 100</span>
                </div>
              </div>

              <div className="text-center mt-1">
                <span className="text-xs font-semibold text-slate-400">Overall Score</span>
              </div>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Practice Another Interview
              </button>

              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Back to Dashboard
              </Link>
            </div>

            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save Summary
            </button>
          </div>
        </div>

        {/* Detailed Question-by-Question Feedback */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-400" />
              Question-by-Question AI Breakdown
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              Evaluated by Google Gemini 3.5 Flash
            </span>
          </div>

          <div className="space-y-6">
            {interview.questions.map((q, idx) => {
              const score = q.evaluation?.score ?? 0;
              const isAnswered = q.userAnswer && q.userAnswer !== 'No answer provided.';

              return (
                <div
                  key={idx}
                  className="p-6 sm:p-8 rounded-2xl bg-[#0E131F]/90 border border-slate-800/80 shadow-xl space-y-6 backdrop-blur-md"
                >
                  {/* Question Title & Score Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          Question {idx + 1}
                        </span>
                        {!isAnswered && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-red-500/10 text-red-400 border border-red-500/20">
                            Skipped / Unanswered
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-white leading-relaxed pt-1">
                        {q.questionText}
                      </h3>
                    </div>

                    <div className="shrink-0 self-start sm:self-auto">
                      <div className={`px-4 py-2 rounded-xl text-center border ${
                        score >= 70
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : score >= 40
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                          : 'bg-red-500/10 border-red-500/30 text-red-400'
                      }`}>
                        <div className="text-[10px] font-bold uppercase tracking-wider">Score</div>
                        <div className="text-2xl font-black">{score}<span className="text-xs font-normal opacity-70">/100</span></div>
                      </div>
                    </div>
                  </div>

                  {/* Candidate Submitted Answer */}
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Your Submitted Answer:
                    </span>
                    <div className={`p-4 rounded-xl text-sm leading-relaxed border ${
                      isAnswered
                        ? 'bg-slate-900/90 text-slate-200 border-slate-800'
                        : 'bg-red-500/5 text-red-400 border-red-500/20 italic'
                    }`}>
                      {q.userAnswer || 'No answer provided.'}
                    </div>
                  </div>

                  {/* AI Evaluation Cards (2 Column Grid) */}
                  {q.evaluation ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Left: Correctness & Gaps */}
                      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-4">
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" />
                            Correctness & Technical Depth
                          </div>
                          <p className="text-sm font-medium text-slate-200 leading-relaxed">
                            {q.evaluation.correctness}
                          </p>
                        </div>

                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Demonstrated Strengths
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {q.evaluation.strengths}
                          </p>
                        </div>

                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1 flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Missing Key Points
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {q.evaluation.missingPoints}
                          </p>
                        </div>
                      </div>

                      {/* Right: Improvement & Sample Answer */}
                      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-4">
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-1 flex items-center gap-1.5">
                            <TrendingUp className="w-3.5 h-3.5" />
                            How to Elevate This Answer
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {q.evaluation.improvementSuggestions}
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                              Expert Sample Answer
                            </div>
                            <button
                              onClick={() => handleCopySampleAnswer(q.evaluation.sampleAnswer, idx)}
                              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors px-2 py-0.5 rounded bg-slate-800/60 hover:bg-slate-800"
                              title="Copy sample answer"
                            >
                              {copiedIdx === idx ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400 font-semibold">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>

                          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                            {q.evaluation.sampleAnswer}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                      No evaluation record available for this question.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Navigation CTA */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-slate-800 text-center space-y-4">
          <h3 className="text-lg font-bold text-white">Consistent Practice Builds Interview Mastery</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Take on another session or choose a different difficulty level to challenge your skills.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition-colors"
            >
              Start Next Practice Session
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Results;
