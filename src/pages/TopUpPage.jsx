import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageWrapper, { SupportSection } from '../components/PageWrapper';
import { CreditCard, Wallet, ChevronRight, CheckCircle2, QrCode, Landmark, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePayment } from '../context/PaymentContext';
import PaymentModal from '../components/PaymentModal';
import { doc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const TopUpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { activePayment } = usePayment();
  const [amount, setAmount] = useState('100.00');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    if (location.state?.requiredAmount) {
      setAmount(location.state.requiredAmount);
    }
  }, [location.state]);

  const amounts = ['100.00', '200.00', '500.00', '1000.00', '2000.00', '5000.00'];

  const handleTopup = async (transactionId, _unusedUpiId, paidAmount) => {
    if (!user) return;
    
    setShowPayment(false); 
    setIsProcessing(true);
    try {
      const topupVal = parseFloat(amount);
      if (isNaN(topupVal) || topupVal <= 0) throw new Error("Invalid amount");

      await addDoc(collection(db, 'pending_transactions'), {
        userId: user.uid,
        userName: user.name || 'Unknown',
        userMobile: user.mobile || 'No Mobile',
        userEnteredAmount: parseFloat(paidAmount) || 0,
        type: 'topup',
        amount: topupVal,
        transactionId: transactionId,
        status: 'pending',
        timestamp: serverTimestamp()
      });

      alert(`Top-up request for ₹${topupVal} submitted! Your balance will be updated once admin verifies.`);
      setIsProcessing(false);
      navigate('/home'); 
    } catch (error) {
      console.error("Topup error:", error);
      alert("Transaction failed! Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <PageWrapper title="WALLET TOP UP" showBack={true}>
      <div className="bg-white min-h-screen p-4 flex flex-col items-center pb-20">
        {/* Wallet Overview */}
        <div className="w-full max-w-sm bg-gradient-to-br from-[#ff0033] to-[#ff4d6a] rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden mb-8 group">
           <div className="absolute top-0 right-0 p-6 opacity-10 bg-white rounded-bl-[2.5rem] group-hover:scale-110 transition-transform">
              <Wallet size={48} />
           </div>
           <p className="text-[10px] font-black uppercase tracking-widest text-white/70 mb-2">Available Balance</p>
           <h3 className="text-4xl font-black italic tracking-tighter">₹ {user?.balance?.toLocaleString() || '0.00'}</h3>
           
           <div className="mt-8 flex gap-4 pt-6 border-t border-white/10">
              <div className="flex-1 opacity-60">
                 <p className="text-[8px] font-black uppercase tracking-widest leading-none mb-1">Vault Status</p>
                 <p className="text-[10px] font-bold italic uppercase tracking-tighter shadow-sm border border-white/10 rounded px-2 py-0.5 inline-block text-emerald-300">Active & Secured</p>
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center border border-white/10 shadow-inner">
                 <ShieldCheck size={20} />
              </div>
           </div>
        </div>

        {/* Amount Selection */}
        <div className="w-full max-w-sm space-y-4">
           <div className="flex items-center gap-3 ml-2 mb-2">
              <CreditCard className="text-[#ff0033]" size={18} />
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Recharge Amount</h4>
           </div>
           
           <div className="grid grid-cols-3 gap-3">
              {amounts.map((a, i) => (
                <button 
                  key={i}
                  onClick={() => setAmount(a)}
                  className={`py-3 rounded-[1.2rem] font-black text-xs border-[1.5px] transition-all shadow-sm ${
                    amount === a 
                      ? 'bg-[#ff0033] text-white border-[#ff0033] shadow-lg scale-105 active:scale-100' 
                      : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'
                  }`}
                >
                   ₹ {Math.floor(parseFloat(a))}
                </button>
              ))}
           </div>

           <div className="relative mt-8 group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#ff0033] transition-colors font-black text-xl italic">₹</div>
              <input 
                type="text" 
                inputMode="decimal"
                pattern="[0-9]*"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-16 bg-gray-50 border-[1.5px] border-gray-100 rounded-[1.5rem] pl-14 pr-6 font-black text-gray-900 text-lg outline-none focus:bg-white focus:border-[#ff0033]/30 transition-all shadow-inner placeholder:text-gray-200" 
                placeholder="Custom Amount"
              />
           </div>

            <div className="space-y-3 mt-10">
              <button 
                onClick={() => setShowPayment(true)}
                className="w-full h-16 bg-[#ff0033] text-white py-4 rounded-[1.5rem] font-black tracking-widest text-xs uppercase shadow-xl shadow-red-500/10 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                Proceed to Pay <ChevronRight size={18} />
              </button>
              
              <div className="flex gap-4">
                 <button 
                  onClick={() => setShowPayment(true)}
                  className="flex-1 bg-white border border-gray-100 p-4 rounded-xl flex flex-col items-center gap-2 shadow-sm active:bg-red-50 transition-colors"
                >
                    <QrCode size={18} className="text-[#ff0033]" />
                    <span className="text-[8px] font-black text-gray-800 uppercase tracking-widest">Active UPI QR</span>
                 </button>
                 <div className="flex-1 bg-gray-50 border border-gray-100 p-4 rounded-xl flex flex-col items-center gap-2 shadow-sm opacity-50">
                    <Landmark size={18} className="text-gray-400" />
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Bank Transfer</span>
                 </div>
              </div>
              
              {activePayment && (
                <div className="mt-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1 text-center">Currently Active Payment ID</p>
                  <p className="text-sm font-black text-gray-800 text-center italic">{activePayment.upiId}</p>
                </div>
              )}
           </div>
        </div>

        <SupportSection />

        <div className="mt-12 text-center opacity-30">
           <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em] italic leading-tight">Secured by SMS Lottery Payments Authority Gateway v2.4</p>
        </div>
      </div>

      <PaymentModal 
        isOpen={showPayment} 
        onClose={() => setShowPayment(false)} 
        amount={amount}
        onConfirm={handleTopup}
      />
    </PageWrapper>
  );
};

export default TopUpPage;
