import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PageWrapper, { SupportSection } from '../components/PageWrapper';
import { User, Phone, Users, ChevronRight, Lock, AlertCircle, Mail, Gift } from 'lucide-react';
import { COMMON_REFERRAL_CODE } from '../constants/referralConfig';

const SignupPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    referral: searchParams.get('ref') || ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name || !formData.mobile || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.mobile.length < 10) {
      setError('Please enter a valid mobile number');
      return;
    }

    setLoading(true);
    // Use real email if provided, otherwise virtual email
    const loginEmail = formData.email || `${formData.mobile}@lottery.com`;
    
    const result = await signup(loginEmail, formData.password, {
      name: formData.name,
      email: formData.email || '',
      mobile: formData.mobile,
      referral: formData.referral
    });

    setLoading(false);
    
    if (result.success) {
      navigate('/home');
    } else {
      setError(result.message);
    }
  };

  return (
    <PageWrapper title="MEMBER REGISTRATION" showNav={false}>
      <div className="bg-white min-h-screen p-4 flex flex-col items-center pt-10">
        {error && (
          <div className="w-full bg-red-50 text-red-500 p-3 rounded-xl mb-4 flex items-center gap-2 text-xs font-bold border border-red-100">
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="w-full space-y-4">
          {/* Name Input */}
          <div className="flex border border-gray-200 rounded-2xl overflow-hidden h-14 bg-gray-50/50 shadow-sm focus-within:border-red-200 transition-all">
            <div className="bg-gray-100/50 px-5 flex items-center justify-center border-r border-gray-100 text-gray-400">
               <User size={18} />
            </div>
            <input 
              className="flex-grow px-4 outline-none border-none focus:ring-0 text-sm font-bold text-gray-700 bg-transparent placeholder:text-gray-300" 
              placeholder="Enter your name" 
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          {/* Email Input (Optional/Recommended) */}
          <div className="flex border border-gray-200 rounded-2xl overflow-hidden h-14 bg-gray-50/50 shadow-sm focus-within:border-red-200 transition-all">
            <div className="bg-gray-100/50 px-5 flex items-center justify-center border-r border-gray-100 text-gray-400">
               <Mail className="text-gray-400" size={18} />
            </div>
            <input 
              className="flex-grow px-4 outline-none border-none focus:ring-0 text-sm font-bold text-gray-700 bg-transparent placeholder:text-gray-300" 
              placeholder="Email Address (For Secure Recovery)" 
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          {/* Mobile Number Input */}
          <div className="flex border border-gray-200 rounded-2xl overflow-hidden h-14 bg-gray-50/50 shadow-sm focus-within:border-red-200 transition-all">
            <div className="bg-gray-100/50 px-4 flex items-center justify-center border-r border-gray-100 text-gray-400 font-black text-[10px] uppercase tracking-widest">
              +91
            </div>
            <input 
              className="flex-grow px-4 outline-none border-none focus:ring-0 text-sm font-bold text-gray-700 bg-transparent placeholder:text-gray-300" 
              placeholder="Mobile Number" 
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              required
              value={formData.mobile}
              onChange={(e) => setFormData({...formData, mobile: e.target.value})}
            />
          </div>

          {/* Password Input */}
          <div className="flex border border-gray-200 rounded-2xl overflow-hidden h-14 bg-gray-50/50 shadow-sm focus-within:border-red-200 transition-all">
            <div className="bg-gray-100/50 px-5 flex items-center justify-center border-r border-gray-100 text-gray-400">
               <Lock size={18} />
            </div>
            <input 
              className="flex-grow px-4 outline-none border-none focus:ring-0 text-sm font-bold text-gray-700 bg-transparent placeholder:text-gray-300" 
              placeholder="Create Password" 
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          {/* Referral Code Input */}
          <div className="space-y-2">
            <div className="flex border border-gray-200 rounded-2xl overflow-hidden h-14 bg-gray-50/50 shadow-sm focus-within:border-red-200 transition-all">
              <div className="bg-gray-100/50 px-5 flex items-center justify-center border-r border-gray-100 text-gray-400">
                <Users size={18} />
              </div>
              <input 
                className="flex-grow px-4 outline-none border-none focus:ring-0 text-sm font-bold text-gray-700 bg-transparent placeholder:text-gray-300" 
                placeholder="Referral code (Optional)" 
                type="text"
                value={formData.referral}
                onChange={(e) => setFormData({...formData, referral: e.target.value})}
              />
            </div>
            {formData.referral.toUpperCase() === COMMON_REFERRAL_CODE && (
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100 animate-pulse">
                <Gift size={14} className="text-emerald-500" />
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Referral Active: ₹50 BONUS UNLOCKED!</p>
              </div>
            )}
          </div>

          <div className="pt-6 space-y-4">
            <button 
              disabled={loading}
              className="w-full bg-[#ff0000] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50" 
              type="submit"
            >
               {loading ? "Registering..." : "Create Account"} <ChevronRight size={16} />
            </button>
            <div className="flex gap-4">
              <button 
                className="flex-1 bg-white border border-gray-100 text-gray-400 py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:border-[#ff0000] hover:text-[#ff0000] transition-all" 
                type="button"
                onClick={() => navigate('/login')}
              >
                Login
              </button>
              <button 
                className="flex-[2] bg-white border border-gray-100 text-gray-400 py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:border-[#ff0000] hover:text-[#ff0000] transition-all" 
                type="button"
                onClick={() => navigate('/reset-password')}
              >
                Reset Password
              </button>
            </div>
          </div>
        </form>

        <SupportSection />
      </div>
    </PageWrapper>
  );
};

export default SignupPage;

