import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, User, ShieldCheck, Compass, ArrowRight } from 'lucide-react';
import { useDemoUser } from '../context/DemoUserContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { user, login } = useDemoUser();
  const navigate = useNavigate();

  const [email, setEmail] = useState(user?.email || '');
  const [name, setName] = useState(user?.name || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    login(email, name);
    toast.success(`Welcome to TravelEase, ${name || email.split('@')[0]}!`);
    navigate('/my-trips');
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/90 shadow-2xl relative overflow-hidden space-y-6">
        
        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-teal-500/20">
            <Compass className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-navy-900 tracking-tight">
            Demo Traveler Sign-In
          </h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            Enter any email address to immediately access personalized trip planning, favorites, and demo bookings.
          </p>
        </div>

        {/* Demo Identity Notice */}
        <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-100 flex items-start gap-2.5 text-xs text-teal-900">
          <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Demonstration Identity Mode:</strong> No password or OTP required. State is persisted in your browser session.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[10px] tracking-wider">
              Email Address <span className="text-teal-600">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                placeholder="e.g. traveler@travelease.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 font-medium text-navy-900 text-sm focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[10px] tracking-wider">
              Display Name (Optional)
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. Priya Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 font-medium text-navy-900 text-sm focus:border-teal-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl font-bold text-xs text-white bg-teal-600 hover:bg-teal-700 shadow-md transition flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <span>Continue to Platform</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <Link to="/" className="hover:text-slate-600">Return to Homepage</Link>
          <Link to="/admin" className="font-semibold text-teal-600 hover:text-teal-700">Open Admin Demo &rarr;</Link>
        </div>

      </div>
    </div>
  );
}
