import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Sparkles, 
  ArrowRight, 
  BrainCircuit, 
  CheckCircle2, 
  BarChart3, 
  Clock, 
  ShieldCheck, 
  Code2, 
  Briefcase, 
  Target, 
  Layers, 
  ChevronRight,
  Award
} from 'lucide-react';

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A0D14] text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-12 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-semibold text-slate-300 shadow-sm backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse"></span>
              <span>Next-Gen AI Mock Interview Platform</span>
              <span className="text-slate-600">•</span>
              <span className="text-indigo-400 font-bold flex items-center gap-1">
                Gemini 3.5 AI <Sparkles className="w-3 h-3" />
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              Your Next Interview <br className="hidden sm:inline" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-blue-400">
                Starts Here.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-400 font-normal leading-relaxed max-w-2xl mx-auto">
              Simulate high-stakes technical and behavioral interviews with real-time AI evaluation. Receive detailed scores, pinpointed weaknesses, and tailored sample answers to crack top tech roles.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              {user ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 text-base"
                >
                  Go to Your Dashboard
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 text-base"
                  >
                    Start Practicing Free
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a
                    href="#features"
                    className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/80 text-slate-300 hover:text-white font-medium transition-all duration-200 flex items-center justify-center gap-2 text-base"
                  >
                    Explore Features
                  </a>
                </>
              )}
            </div>

            {/* Quick Badges */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Free to Start
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Full Stack & Frontend Roles
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Instant Scoring & Feedback
              </span>
            </div>
          </div>

          {/* Interactive UI Preview Card */}
          <div className="mt-16 max-w-4xl mx-auto rounded-2xl p-1 bg-gradient-to-b from-indigo-500/30 via-slate-800/40 to-transparent shadow-2xl shadow-indigo-950/50">
            <div className="rounded-[14px] bg-[#0E131F]/90 border border-slate-800/80 p-6 md:p-8 backdrop-blur-xl">
              {/* Fake Window Header */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-slate-500">prepai.app/interview/session</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    Full Stack Engineer • Intermediate
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Live Session
                  </span>
                </div>
              </div>

              {/* Sample Question Preview */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-medium text-slate-400">
                  <span>Question 2 of 3</span>
                  <span className="text-indigo-400">Time remaining: 12:45</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200 font-medium text-base leading-relaxed">
                  "How would you design a scalable caching layer using Redis for high-read database queries, and how do you handle cache invalidation?"
                </div>
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/60 font-mono text-xs text-slate-400 space-y-1">
                  <p className="text-indigo-300 font-semibold mb-1">// Real-time AI Evaluation Preview:</p>
                  <p className="text-emerald-400">✓ Score: 92/100 (Strong Candidate)</p>
                  <p className="text-slate-300">✓ Strengths: Clearly detailed Cache-Aside pattern & TTL expiration.</p>
                  <p className="text-purple-300">✦ Improvement: Consider write-through cache for write-heavy spikes.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Strip */}
      <section className="border-y border-slate-800/80 bg-slate-950/60 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-extrabold text-white">100%</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Real AI Evaluation</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-extrabold text-indigo-400">10+</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Engineering Roles</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-extrabold text-white">0–100</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Granular Scoring</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-extrabold text-purple-400">Instant</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Personalized Feedback</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-[#0A0D14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Platform Capabilities</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">
              Built for Serious Software Engineers
            </p>
            <p className="text-slate-400 text-sm">
              Everything you need to systematically build interview confidence and secure job offers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-1 group">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Dynamic Questioning</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Google Gemini generates adaptive questions tailored precisely to your chosen role, difficulty level, and focus area.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1 group">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Detailed AI Scoring</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Receive honest, unvarnished scores out of 100 with a detailed breakdown of strengths, missing technical nuances, and flaws.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 group">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Sample Answers</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Every question includes a battle-tested, professional sample answer showcasing the exact structure top hiring managers look for.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Performance Analytics</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Track your historical performance, analyze trends over practice sessions, and pinpoint areas that require revision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 border-t border-slate-800/80 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-purple-400">Step-by-Step Flow</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">
              How PrepAI Works
            </p>
            <p className="text-slate-400 text-sm">
              A frictionless practice environment replicating real company interview conditions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 relative">
              <div className="text-4xl font-black text-indigo-500/30 mb-4 font-mono">01</div>
              <h3 className="text-xl font-bold text-white mb-2">Configure Your Session</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Select your target role (Frontend, Backend, DevOps, etc.), interview format (Technical or HR), and seniority level.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 relative">
              <div className="text-4xl font-black text-purple-500/30 mb-4 font-mono">02</div>
              <h3 className="text-xl font-bold text-white mb-2">Simulate the Interview</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Answer AI-generated questions in a distraction-free interview room with state preservation and question navigation.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 relative">
              <div className="text-4xl font-black text-blue-500/30 mb-4 font-mono">03</div>
              <h3 className="text-xl font-bold text-white mb-2">Review Deep Feedback</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Review your scored report with key strengths, missing nuances, and copy-ready improved responses to study.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900/80 border border-indigo-500/30 text-center space-y-6 relative overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Ready to Ace Your Next Placement?
            </h2>
            <p className="text-slate-300 text-base max-w-xl mx-auto">
              Join candidates using PrepAI to practice without anxiety and get actionable evaluation before talking to real interviewers.
            </p>
            <div className="pt-2">
              <Link
                to={user ? "/dashboard" : "/register"}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-slate-950 font-bold hover:bg-slate-100 shadow-xl shadow-indigo-950/50 hover:scale-105 active:scale-95 transition-all text-base"
              >
                {user ? "Open Your Dashboard" : "Create Free Account"}
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
