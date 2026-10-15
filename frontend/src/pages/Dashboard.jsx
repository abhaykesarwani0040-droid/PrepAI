import { useState, useContext, useEffect, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import {
  LayoutDashboard,
  PlayCircle,
  History,
  BarChart3,
  Settings,
  Sparkles,
  ArrowRight,
  Clock,
  Award,
  CheckCircle2,
  AlertCircle,
  Code2,
  Briefcase,
  ChevronRight,
  TrendingUp,
  Search,
  Filter,
  User,
  Shield,
  Loader2,
  FileText
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

const QUICK_ROLES = [
  'Full Stack Engineer',
  'Frontend Developer',
  'Backend Engineer',
  'DevOps & Cloud',
  'Data Scientist',
  'System Design',
  'HR / Behavioral'
];

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Active tab in dashboard
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'practice' | 'history' | 'analytics' | 'settings'

  // Past interviews data from backend
  const [interviews, setInterviews] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // New interview form state
  const [role, setRole] = useState('Full Stack Engineer');
  const [type, setType] = useState('Technical');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState('');

  // History search & filter
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchInterviews = async () => {
      try {
        const { data } = await api.get('/interviews');
        setInterviews(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load past interviews:', err);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchInterviews();
  }, [user, navigate]);

  // Derived metrics from real data
  const stats = useMemo(() => {
    const total = interviews.length;
    if (total === 0) {
      return { total: 0, averageScore: 0, bestScore: 0, completedCount: 0 };
    }
    const completed = interviews.filter((i) => i.status === 'Completed');
    const totalScore = completed.reduce((sum, i) => sum + (i.overallScore || 0), 0);
    const averageScore = completed.length > 0 ? Math.round(totalScore / completed.length) : 0;
    const bestScore = completed.reduce((max, i) => Math.max(max, i.overallScore || 0), 0);

    return {
      total,
      completedCount: completed.length,
      averageScore,
      bestScore
    };
  }, [interviews]);

  // Chart data: Trend over time
  const trendData = useMemo(() => {
    return [...interviews]
      .reverse()
      .filter((i) => i.status === 'Completed')
      .map((i, idx) => ({
        name: `Session ${idx + 1}`,
        score: Math.round(i.overallScore || 0),
        role: i.role,
        date: new Date(i.createdAt).toLocaleDateString()
      }));
  }, [interviews]);

  // Chart data: Difficulty breakdown
  const difficultyData = useMemo(() => {
    const counts = { Beginner: 0, Intermediate: 0, Advanced: 0 };
    interviews.forEach((i) => {
      if (counts[i.difficulty] !== undefined) {
        counts[i.difficulty]++;
      }
    });
    return [
      { level: 'Beginner', count: counts.Beginner },
      { level: 'Intermediate', count: counts.Intermediate },
      { level: 'Advanced', count: counts.Advanced }
    ];
  }, [interviews]);

  // Filtered interviews for the History view
  const filteredInterviews = useMemo(() => {
    return interviews.filter((i) => {
      const matchesSearch = i.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDiff = difficultyFilter === 'All' || i.difficulty === difficultyFilter;
      return matchesSearch && matchesDiff;
    });
  }, [interviews, searchQuery, difficultyFilter]);

  // Start interview handler
  const handleStartInterview = async (e) => {
    e.preventDefault();
    setGenerating(true);
    setGenError('');
    try {
      const { data } = await api.post('/interviews', { role, type, difficulty });
      navigate(`/interview/${data._id}`);
    } catch (err) {
      console.error(err);
      setGenError(err.response?.data?.message || 'Failed to generate interview. Check Gemini API configuration.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 hidden md:block">
          <div className="sticky top-24 space-y-6">
            {/* User profile cardlet */}
            <div className="p-4 rounded-2xl bg-[#0E131F]/90 border border-slate-800/80 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white text-sm shadow-md shadow-indigo-600/30">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="overflow-hidden">
                  <div className="text-sm font-bold text-white truncate">{user?.username}</div>
                  <div className="text-xs text-slate-400 truncate">{user?.email}</div>
                </div>
              </div>
            </div>

            {/* Navigation links */}
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === 'overview'
                    ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Overview
              </button>

              <button
                onClick={() => setActiveTab('practice')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === 'practice'
                    ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <PlayCircle className="w-4 h-4" />
                Practice Interview
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === 'history'
                    ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <History className="w-4 h-4" />
                Interview History
                {interviews.length > 0 && (
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                    {interviews.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === 'analytics'
                    ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === 'settings'
                    ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </nav>

            {/* Quick Start CTA Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-slate-900 border border-indigo-500/20 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Instant Practice
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Generate 3 custom AI questions tailored to your target company role.
              </p>
              <button
                onClick={() => setActiveTab('practice')}
                className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30"
              >
                Start New Session
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {/* Mobile Tab Selector */}
          <div className="md:hidden flex overflow-x-auto gap-2 pb-4 mb-4 border-b border-slate-800">
            {['overview', 'practice', 'history', 'analytics', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap capitalize ${
                  activeTab === tab
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Header Greeting & Launch Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Welcome back, {user?.username} 👋
                  </h1>
                  <p className="text-sm text-slate-400 mt-1">
                    Track your interview readiness, review performance scores, and practice.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('practice')}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 flex items-center gap-2 self-start sm:self-auto transition-all duration-200 hover:scale-[1.02]"
                >
                  <PlayCircle className="w-4 h-4" />
                  Start New Interview
                </button>
              </div>

              {/* Stats Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Stat 1 */}
                <div className="p-5 rounded-2xl bg-[#0E131F]/90 border border-slate-800/80 backdrop-blur-md">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Total Sessions</span>
                    <History className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">{stats.total}</div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {stats.completedCount} completed sessions
                  </p>
                </div>

                {/* Stat 2 */}
                <div className="p-5 rounded-2xl bg-[#0E131F]/90 border border-slate-800/80 backdrop-blur-md">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Average Score</span>
                    <Award className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-purple-400">
                    {stats.averageScore}<span className="text-base font-normal text-slate-500">/100</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {stats.averageScore >= 70 ? 'Strong readiness' : stats.averageScore > 0 ? 'Consistent practice' : 'Start your first interview'}
                  </p>
                </div>

                {/* Stat 3 */}
                <div className="p-5 rounded-2xl bg-[#0E131F]/90 border border-slate-800/80 backdrop-blur-md">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Highest Score</span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                    {stats.bestScore}<span className="text-base font-normal text-slate-500">/100</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Personal best evaluation</p>
                </div>

                {/* Stat 4 */}
                <div className="p-5 rounded-2xl bg-[#0E131F]/90 border border-slate-800/80 backdrop-blur-md">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Completion Rate</span>
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-blue-400">
                    {stats.total > 0 ? Math.round((stats.completedCount / stats.total) * 100) : 100}%
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {stats.completedCount} of {stats.total} finalized
                  </p>
                </div>
              </div>

              {/* Performance Trend Chart */}
              {trendData.length > 0 ? (
                <div className="p-6 rounded-2xl bg-[#0E131F]/90 border border-slate-800/80 backdrop-blur-md space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-white">Performance Progression</h2>
                      <p className="text-xs text-slate-400">Your score trajectory across recent completed interviews</p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      Recharts Analytics
                    </span>
                  </div>

                  <div className="h-64 w-full pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendData}>
                        <defs>
                          <linearGradient id="scoreGlow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                        <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                        <YAxis stroke="#64748B" fontSize={11} domain={[0, 100]} tickLine={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#0F172A',
                            borderColor: '#334155',
                            borderRadius: '12px',
                            color: '#F8FAFC',
                            fontSize: '12px'
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="score"
                          stroke="#6366F1"
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#scoreGlow)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : null}

              {/* Recent Interview History Table */}
              <div className="p-6 rounded-2xl bg-[#0E131F]/90 border border-slate-800/80 backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-white">Recent Interview Sessions</h2>
                    <p className="text-xs text-slate-400">Past sessions and generated evaluation feedback</p>
                  </div>
                  {interviews.length > 0 && (
                    <button
                      onClick={() => setActiveTab('history')}
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      View All
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {loadingHistory ? (
                  <div className="py-12 text-center text-slate-500 text-sm">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-400" />
                    Loading your interview history...
                  </div>
                ) : interviews.length === 0 ? (
                  /* Empty state */
                  <div className="py-12 px-4 text-center rounded-xl border border-dashed border-slate-800/80 bg-slate-900/30 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto">
                      <PlayCircle className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-white">No interviews recorded yet</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Configure your first session to practice answering AI-generated questions and receive deep evaluation.
                    </p>
                    <button
                      onClick={() => setActiveTab('practice')}
                      className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition-colors"
                    >
                      Start Your First Interview
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-800/80">
                    {interviews.slice(0, 5).map((interview) => (
                      <div
                        key={interview._id}
                        className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-white group-hover:text-indigo-300 transition-colors">
                              {interview.role}
                            </span>
                            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60">
                              {interview.type}
                            </span>
                            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
                              interview.difficulty === 'Advanced'
                                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                : interview.difficulty === 'Intermediate'
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}>
                              {interview.difficulty}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            <span>{new Date(interview.createdAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{interview.questions?.length || 0} questions</span>
                            <span>•</span>
                            <span className={interview.status === 'Completed' ? 'text-emerald-400' : 'text-amber-400'}>
                              {interview.status}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-auto">
                          {interview.status === 'Completed' ? (
                            <div className="text-right">
                              <div className="text-xs text-slate-400 font-medium">Overall Score</div>
                              <div className={`text-base font-black ${
                                interview.overallScore >= 70 ? 'text-emerald-400' : interview.overallScore >= 40 ? 'text-amber-400' : 'text-red-400'
                              }`}>
                                {Math.round(interview.overallScore)}/100
                              </div>
                            </div>
                          ) : null}

                          <Link
                            to={interview.status === 'Completed' ? `/results/${interview._id}` : `/interview/${interview._id}`}
                            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-colors flex items-center gap-1"
                          >
                            {interview.status === 'Completed' ? 'View Results' : 'Resume'}
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PRACTICE / GUIDED SETUP */}
          {activeTab === 'practice' && (
            <div className="max-w-2xl mx-auto space-y-8">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-2 border border-indigo-500/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  Gemini AI Powered Simulation
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Configure Your Mock Interview
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  Customize your interview parameters. Gemini will instantly generate relevant, industry-grade questions.
                </p>
              </div>

              {genError && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
                  <div>
                    <div className="font-bold mb-0.5">Setup Error</div>
                    <div>{genError}</div>
                  </div>
                </div>
              )}

              <form onSubmit={handleStartInterview} className="space-y-6">
                {/* 1. Job Role */}
                <div className="p-6 rounded-2xl bg-[#0E131F]/90 border border-slate-800/80 backdrop-blur-md space-y-4">
                  <label className="block text-sm font-bold text-white">
                    1. Target Job Role
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                    placeholder="e.g. Frontend Developer, Full Stack Engineer..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/80 focus:border-indigo-500 transition-all font-medium"
                  />

                  {/* Quick Pills */}
                  <div>
                    <span className="text-xs text-slate-500 block mb-2 font-medium">Quick suggestions:</span>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_ROLES.map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRole(r)}
                          className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                            role === r
                              ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-semibold'
                              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. Interview Type */}
                <div className="p-6 rounded-2xl bg-[#0E131F]/90 border border-slate-800/80 backdrop-blur-md space-y-4">
                  <label className="block text-sm font-bold text-white">
                    2. Interview Type
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Technical */}
                    <div
                      onClick={() => setType('Technical')}
                      className={`cursor-pointer p-4 rounded-xl border transition-all ${
                        type === 'Technical'
                          ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-md shadow-indigo-600/20'
                          : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          type === 'Technical' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                        }`}>
                          <Code2 className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-sm text-white">Technical Interview</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Architecture, coding concepts, frameworks, API design, debugging, and algorithms.
                      </p>
                    </div>

                    {/* HR */}
                    <div
                      onClick={() => setType('HR')}
                      className={`cursor-pointer p-4 rounded-xl border transition-all ${
                        type === 'HR'
                          ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-md shadow-indigo-600/20'
                          : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          type === 'HR' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
                        }`}>
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-sm text-white">HR & Behavioral</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        STAR methodology, leadership, conflict resolution, work culture, and problem-solving.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. Difficulty Level */}
                <div className="p-6 rounded-2xl bg-[#0E131F]/90 border border-slate-800/80 backdrop-blur-md space-y-4">
                  <label className="block text-sm font-bold text-white">
                    3. Seniority / Difficulty Level
                  </label>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { level: 'Beginner', desc: 'Junior / Intern' },
                      { level: 'Intermediate', desc: 'Mid-Level (2-4 yrs)' },
                      { level: 'Advanced', desc: 'Senior / Staff' }
                    ].map(({ level, desc }) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setDifficulty(level)}
                        className={`p-3.5 rounded-xl border text-center transition-all ${
                          difficulty === level
                            ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                            : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="font-bold text-sm text-white">{level}</div>
                        <div className="text-[11px] text-slate-400 mt-1">{desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={generating}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60 hover:scale-[1.01]"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating AI Questions with Gemini...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Launch Interview Room
                      <ArrowRight className="w-5 h-5 ml-1" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: INTERVIEW HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Interview History
                  </h1>
                  <p className="text-sm text-slate-400 mt-1">
                    Complete log of all previous practice sessions and evaluation breakdowns.
                  </p>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search roles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <select
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none"
                  >
                    <option value="All">All Levels</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              {/* History Items */}
              {filteredInterviews.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-[#0E131F]/90 border border-slate-800/80 text-slate-400 space-y-3">
                  <FileText className="w-8 h-8 mx-auto text-slate-600" />
                  <p className="text-sm font-semibold text-white">No interview sessions found</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try adjusting your search filters or start a new practice session.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredInterviews.map((item) => (
                    <div
                      key={item._id}
                      className="p-5 rounded-2xl bg-[#0E131F]/90 border border-slate-800/80 hover:border-slate-700/80 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base text-white">{item.role}</span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                            {item.type}
                          </span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                            item.difficulty === 'Advanced' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'
                          }`}>
                            {item.difficulty}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span>Date: {new Date(item.createdAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{item.questions?.length || 0} Questions</span>
                          <span>•</span>
                          <span className={item.status === 'Completed' ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
                            {item.status}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-6 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/60">
                        {item.status === 'Completed' && (
                          <div className="text-right">
                            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold block">
                              Overall Score
                            </span>
                            <span className={`text-2xl font-black ${
                              item.overallScore >= 70 ? 'text-emerald-400' : item.overallScore >= 40 ? 'text-amber-400' : 'text-red-400'
                            }`}>
                              {Math.round(item.overallScore)}<span className="text-sm text-slate-500 font-normal">/100</span>
                            </span>
                          </div>
                        )}

                        <Link
                          to={item.status === 'Completed' ? `/results/${item._id}` : `/interview/${item._id}`}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                        >
                          {item.status === 'Completed' ? 'Full Evaluation' : 'Resume Session'}
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Performance Analytics
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  Quantitative breakdown of your interview preparedness using Recharts data visualization.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart 1: Progression Area */}
                <div className="p-6 rounded-2xl bg-[#0E131F]/90 border border-slate-800/80 backdrop-blur-md space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-400" />
                    Score Progression Over Time
                  </h3>
                  <div className="h-64 w-full">
                    {trendData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                          <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                          <YAxis stroke="#64748B" fontSize={11} domain={[0, 100]} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#0F172A',
                              borderColor: '#334155',
                              borderRadius: '10px'
                            }}
                          />
                          <Area type="monotone" dataKey="score" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs text-slate-500">
                        Complete at least 1 interview session to render trend data.
                      </div>
                    )}
                  </div>
                </div>

                {/* Chart 2: Difficulty Level Distribution */}
                <div className="p-6 rounded-2xl bg-[#0E131F]/90 border border-slate-800/80 backdrop-blur-md space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-purple-400" />
                    Interviews by Difficulty Level
                  </h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={difficultyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                        <XAxis dataKey="level" stroke="#64748B" fontSize={11} />
                        <YAxis stroke="#64748B" fontSize={11} allowDecimals={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#0F172A',
                            borderColor: '#334155',
                            borderRadius: '10px'
                          }}
                        />
                        <Bar dataKey="count" fill="#6366F1" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Account & Settings
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  Manage your candidate profile and active session credentials.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#0E131F]/90 border border-slate-800/80 backdrop-blur-md space-y-6">
                <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-blue-500 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-600/30">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{user?.username}</h3>
                    <p className="text-sm text-slate-400">{user?.email}</p>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 mt-1">
                      <Shield className="w-3.5 h-3.5" /> Authenticated via JWT
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                      Account Username
                    </label>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-sm font-medium text-slate-300">
                      {user?.username}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                      Email Address
                    </label>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-sm font-medium text-slate-300">
                      {user?.email}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end">
                  <button
                    onClick={logout}
                    className="px-5 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-semibold text-sm transition-colors flex items-center gap-2"
                  >
                    Sign Out of PrepAI
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
