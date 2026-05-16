import React, { useState, useEffect } from 'react';
import PageWrapper from '../components/PageWrapper';
import { User, Mail, Phone, ShieldCheck, ChevronLeft, Landmark, CreditCard, Key, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const PersonalInfoPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    mobile: user?.mobile || '',
    accountHolderName: user?.accountHolderName || '',
    accountNumber: user?.accountNumber || '',
    confirmAccountNumber: user?.accountNumber || '',
    ifscCode: user?.ifscCode || '',
    upiId: user?.upiId || ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        mobile: user.mobile || '',
        accountHolderName: user.accountHolderName || '',
        accountNumber: user.accountNumber || '',
        confirmAccountNumber: user.accountNumber || '',
        ifscCode: user.ifscCode || '',
        upiId: user.upiId || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.accountHolderName || !formData.accountNumber || !formData.confirmAccountNumber || !formData.ifscCode || !formData.upiId) {
      setError("Please fill in all mandatory banking and payment fields.");
      return;
    }

    if (formData.accountNumber !== formData.confirmAccountNumber) {
      setError("Account Numbers do not match. Please verify.");
      return;
    }

    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!ifscRegex.test(formData.ifscCode.trim().toUpperCase())) {
      setError("Invalid IFSC Code format. Example: SBIN0001234");
      return;
    }

    const upiRegex = /^[a-zA-Z0-9.\-_]+@[a-zA-Z]+$/;
    if (!upiRegex.test(formData.upiId.trim())) {
      setError("Invalid UPI ID format. Example: user@okaxis");
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        name: formData.name.trim(),
        accountHolderName: formData.accountHolderName.trim(),
        accountNumber: formData.accountNumber.trim(),
        ifscCode: formData.ifscCode.trim().toUpperCase(),
        upiId: formData.upiId.trim()
      };

      await updateDoc(doc(db, 'users', user.uid), updateData);
      alert('Profile & Payout Verification details updated successfully!');
      navigate('/profile');
    } catch (err) {
      setError("Failed to update profile: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const isComplete = Boolean(user?.accountHolderName && user?.accountNumber && user?.ifscCode && user?.upiId);

  return (
    <PageWrapper title="VERIFICATION DETAILS" showNav={false}>
      <div className="bg-[#f8f9fa] min-h-screen pb-24">
        {/* Header */}
        <div className="bg-[#ff0033] h-[70px] flex items-center px-4 text-white shadow-md relative z-10">
          <button onClick={() => navigate('/profile')} className="p-2 -ml-2 active:scale-95 transition-all">
            <ChevronLeft size={28} />
          </button>
          <h1 className="text-xl font-black font-condensed tracking-tighter uppercase italic ml-2">Payout Verification</h1>
        </div>

        <div className="p-6 space-y-6 max-w-lg mx-auto">
          {/* Avatar Section */}
          <div className="flex flex-col items-center mt-4">
            <div className="w-24 h-24 bg-white p-1 rounded-full shadow-xl mb-4 relative">
               <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center border border-gray-200 text-[#ff0033]">
                 <Landmark size={40} />
               </div>
               <div className="absolute bottom-0 right-0 bg-[#ff0033] p-2 rounded-full text-white shadow-lg border-2 border-white">
                 <ShieldCheck size={14} />
               </div>
            </div>
            <h2 className="text-lg font-black uppercase tracking-tight text-gray-900 italic">{user?.name || 'Member'}</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mt-0.5">
              {isComplete ? 'Verification Complete' : 'Mandatory Verification Pending'}
            </p>
          </div>

          {!isComplete && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3 shadow-sm animate-pulse">
               <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={20} />
               <div>
                  <p className="text-xs font-black text-amber-900 uppercase tracking-tight italic">Mandatory Requirement</p>
                  <p className="text-[10px] text-amber-800 font-bold mt-0.5 leading-relaxed">
                     You must complete your banking and UPI payout details below before you are allowed to purchase lottery tickets.
                  </p>
               </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-center gap-3 text-xs font-bold text-red-600 shadow-sm italic">
               <AlertCircle size={18} className="shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-5">
               <div className="flex items-center gap-2 border-b border-gray-50 pb-4 mb-2">
                  <User className="text-[#ff0033]" size={20} />
                  <h3 className="text-sm font-black uppercase tracking-tight text-gray-800 italic font-condensed">Personal Profile</h3>
               </div>

               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Full Name</label>
                 <div className="relative group">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ff0033] transition-colors"><User size={18} /></div>
                   <input 
                     type="text" 
                     name="name"
                     value={formData.name}
                     onChange={handleChange}
                     required
                     className="w-full h-14 bg-gray-50/50 border border-gray-200 rounded-2xl pl-12 pr-4 font-bold text-gray-900 outline-none focus:border-[#ff0033] focus:bg-white focus:ring-2 focus:ring-[#ff0033]/10 transition-all shadow-sm text-sm"
                   />
                 </div>
               </div>

               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Registered Phone Number</label>
                 <div className="relative group">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ff0033] transition-colors"><Phone size={18} /></div>
                   <input 
                     type="tel" 
                     name="mobile"
                     value={formData.mobile}
                     disabled
                     className="w-full h-14 bg-gray-100 border border-gray-200 rounded-2xl pl-12 pr-4 font-bold text-gray-500 outline-none opacity-70 cursor-not-allowed shadow-sm text-sm"
                   />
                 </div>
                 <p className="text-[9px] font-bold text-gray-400 ml-2 mt-1">Phone number acts as your account ID and cannot be changed.</p>
               </div>
            </div>

            <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-5">
               <div className="flex items-center gap-2 border-b border-gray-50 pb-4 mb-2">
                  <Landmark className="text-[#ff0033]" size={20} />
                  <h3 className="text-sm font-black uppercase tracking-tight text-gray-800 italic font-condensed">Mandatory Banking Details</h3>
               </div>

               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Account Holder Name</label>
                 <div className="relative group">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ff0033] transition-colors"><User size={18} /></div>
                   <input 
                     type="text" 
                     name="accountHolderName"
                     value={formData.accountHolderName}
                     onChange={handleChange}
                     required
                     placeholder="As per bank records"
                     className="w-full h-14 bg-gray-50/50 border border-gray-200 rounded-2xl pl-12 pr-4 font-bold text-gray-900 outline-none focus:border-[#ff0033] focus:bg-white focus:ring-2 focus:ring-[#ff0033]/10 transition-all shadow-sm text-sm"
                   />
                 </div>
               </div>

               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Account Number</label>
                 <div className="relative group">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ff0033] transition-colors"><CreditCard size={18} /></div>
                   <input 
                     type="text" 
                     inputMode="numeric"
                     pattern="[0-9]*"
                     name="accountNumber"
                     value={formData.accountNumber}
                     onChange={handleChange}
                     required
                     placeholder="Enter Account Number"
                     className="w-full h-14 bg-gray-50/50 border border-gray-200 rounded-2xl pl-12 pr-4 font-bold text-gray-900 outline-none focus:border-[#ff0033] focus:bg-white focus:ring-2 focus:ring-[#ff0033]/10 transition-all shadow-sm text-sm"
                   />
                 </div>
               </div>

               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Confirm Account Number</label>
                 <div className="relative group">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ff0033] transition-colors"><CreditCard size={18} /></div>
                   <input 
                     type="password" 
                     inputMode="numeric"
                     pattern="[0-9]*"
                     name="confirmAccountNumber"
                     value={formData.confirmAccountNumber}
                     onChange={handleChange}
                     required
                     placeholder="Re-enter Account Number"
                     className="w-full h-14 bg-gray-50/50 border border-gray-200 rounded-2xl pl-12 pr-4 font-bold text-gray-900 outline-none focus:border-[#ff0033] focus:bg-white focus:ring-2 focus:ring-[#ff0033]/10 transition-all shadow-sm text-sm"
                   />
                 </div>
               </div>

               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">IFSC Code</label>
                 <div className="relative group">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ff0033] transition-colors"><Key size={18} /></div>
                   <input 
                     type="text" 
                     name="ifscCode"
                     value={formData.ifscCode}
                     onChange={handleChange}
                     required
                     placeholder="e.g. SBIN0001234"
                     className="w-full h-14 bg-gray-50/50 border border-gray-200 rounded-2xl pl-12 pr-4 font-bold text-gray-900 outline-none focus:border-[#ff0033] focus:bg-white focus:ring-2 focus:ring-[#ff0033]/10 transition-all shadow-sm text-sm uppercase"
                   />
                 </div>
               </div>

               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">UPI Address / ID</label>
                 <div className="relative group">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ff0033] transition-colors"><Mail size={18} /></div>
                   <input 
                     type="text" 
                     name="upiId"
                     value={formData.upiId}
                     onChange={handleChange}
                     required
                     placeholder="e.g. username@okaxis"
                     className="w-full h-14 bg-gray-50/50 border border-gray-200 rounded-2xl pl-12 pr-4 font-bold text-gray-900 outline-none focus:border-[#ff0033] focus:bg-white focus:ring-2 focus:ring-[#ff0033]/10 transition-all shadow-sm text-sm"
                   />
                 </div>
               </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#ff0033] text-white h-16 rounded-2xl font-black uppercase tracking-widest text-xs mt-8 shadow-xl shadow-red-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "SAVING DETAILS..." : "Save Verification Details"}
            </button>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
};

export default PersonalInfoPage;
