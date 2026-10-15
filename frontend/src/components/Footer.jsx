import { BrainCircuit, Code2, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#070A0F] text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Prep<span className="text-indigo-400">AI</span>
              </span>
            </div>
            <p className="text-slate-400 max-w-sm text-sm leading-relaxed">
              Production-ready AI mock interview platform helping engineers and candidates master technical and behavioral interviews with real-time AI evaluation and actionable feedback.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Gemini 3.5 Flash Powered
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800">
                React 19 + Tailwind v4
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-indigo-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-indigo-400 transition-colors">Dashboard</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-indigo-400 transition-colors">Sign In</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-indigo-400 transition-colors">Create Account</Link>
              </li>
            </ul>
          </div>

          {/* Practice Tracks */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Interview Tracks</h4>
            <ul className="space-y-2 text-xs">
              <li className="text-slate-400">Frontend Engineering (React, CSS, JS)</li>
              <li className="text-slate-400">Backend Development (Node.js, Databases)</li>
              <li className="text-slate-400">Full Stack System Architecture</li>
              <li className="text-slate-400">HR & Behavioral (STAR Technique)</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PrepAI. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for tech placements.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
