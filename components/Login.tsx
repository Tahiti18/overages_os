
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { LogInIcon, ShieldCheckIcon } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@prospector.ai');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API Login
    setTimeout(() => {
      const mockUser: User = {
        id: 'u1',
        email,
        role: UserRole.ADMIN,
        is_active: true
      };
      localStorage.setItem('access_token', 'mock_jwt_token');
      localStorage.setItem('user', JSON.stringify(mockUser));
      onLogin(mockUser);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 overflow-hidden">
      {/* Left side: Form */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-24 bg-white shadow-2xl z-10">
        <div className="max-w-md w-full mx-auto space-y-8">
          <div>
            <div className="bg-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-200">
               <ShieldCheckIcon size={28} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>
            <p className="text-slate-500 mt-2">Sign in to manage surplus cases and AI extractions.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all text-slate-800 placeholder:text-slate-400"
                  placeholder="name@company.com"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-1">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all text-slate-800 placeholder:text-slate-400"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-600" />
                <span className="text-sm text-slate-600">Remember for 30 days</span>
              </label>
              <a href="#" className="text-sm font-bold text-indigo-600 hover:text-indigo-700">Forgot Password?</a>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogInIcon size={20} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm">
            Need an account? <span className="text-indigo-600 font-bold">Contact your Admin</span>
          </p>
        </div>
      </div>

      {/* Right side: Branding/Visual */}
      <div className="hidden lg:flex flex-1 bg-indigo-900 relative items-center justify-center overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
           <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
             <defs>
               <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                 <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
               </pattern>
             </defs>
             <rect width="100%" height="100%" fill="url(#grid)" />
           </svg>
        </div>
        
        <div className="relative z-10 text-white px-12 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-800/50 backdrop-blur-md px-4 py-2 rounded-full text-indigo-200 text-xs font-bold uppercase tracking-widest mb-8 border border-indigo-700">
            Now Powered by Gemini 3.0
          </div>
          <h2 className="text-5xl font-extrabold mb-6 leading-tight">Property Surplus <br/><span className="text-indigo-400">Recovery Reinvented.</span></h2>
          <p className="text-xl text-indigo-200/80 max-w-lg mx-auto leading-relaxed">
            Automate document extraction, monitor deadlines, and maximize recovery returns with our enterprise-grade management platform.
          </p>

          <div className="mt-12 grid grid-cols-3 gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold">85%</p>
              <p className="text-xs text-indigo-400 uppercase font-bold mt-1">Faster Extraction</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">12k+</p>
              <p className="text-xs text-indigo-400 uppercase font-bold mt-1">Cases Managed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">$100M+</p>
              <p className="text-xs text-indigo-400 uppercase font-bold mt-1">Recovered Funds</p>
            </div>
          </div>
        </div>
        
        {/* Abstract circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default Login;
