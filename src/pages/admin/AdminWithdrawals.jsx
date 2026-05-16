import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc, writeBatch, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { CheckCircle2, XCircle, Clock, ShieldAlert, Zap, Phone, Landmark, ArrowUpRight } from 'lucide-react';

const AdminWithdrawals = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'withdrawals'),
      where('status', '==', 'pending')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      data.sort((a, b) => (b.timestamp?.toMillis() || 0) - (a.timestamp?.toMillis() || 0));
      setRequests(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleApprove = async (req) => {
    if (!window.confirm(`APPROVE WITHDRAWAL: ₹${req.amount} to ${req.upiId}?`)) return;

    try {
      const batch = writeBatch(db);
      const reqRef = doc(db, 'withdrawals', req.id);
      const userRef = doc(db, 'users', req.userId);

      // 1. Update Request Status
      batch.update(reqRef, { 
        status: 'approved', 
        processedAt: serverTimestamp() 
      });

      // 2. Deduct from User's Winning Balance & Total Balance
      // We deduct ONLY from winnings as per the restriction
      batch.update(userRef, { 
        winningBalance: increment(-req.amount),
        balance: increment(-req.amount)
      });

      // 3. Create Notification for User
      const notifRef = doc(collection(db, 'notifications'));
      batch.set(notifRef, {
        userId: req.userId,
        title: 'Withdrawal Success',
        message: `Your withdrawal of ₹${req.amount} has been approved and sent to ${req.upiId}.`,
        type: 'success',
        read: false,
        timestamp: serverTimestamp()
      });

      await batch.commit();
      alert(`Withdrawal approved and processed!`);
    } catch (error) {
      console.error("Approval error:", error);
      alert("Failed to process withdrawal.");
    }
  };

  const handleReject = async (req) => {
    const reason = window.prompt("Reason for rejection (Optional):");
    if (reason === null) return;

    try {
      const batch = writeBatch(db);
      const reqRef = doc(db, 'withdrawals', req.id);
      
      batch.update(reqRef, {
        status: 'rejected',
        rejectionReason: reason,
        rejectedAt: serverTimestamp()
      });

      // Create Notification for User
      const notifRef = doc(collection(db, 'notifications'));
      batch.set(notifRef, {
        userId: req.userId,
        title: 'Withdrawal Rejected',
        message: `Your withdrawal of ₹${req.amount} was rejected. ${reason ? 'Reason: ' + reason : ''}`,
        type: 'error',
        read: false,
        timestamp: serverTimestamp()
      });

      await batch.commit();
      alert("Withdrawal request rejected.");
    } catch (error) {
      console.error("Rejection error:", error);
      alert("Failed to reject request.");
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500 font-bold uppercase tracking-widest text-[10px]">Loading...</div>;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3 mb-6">
         <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
            <Landmark size={24} />
         </div>
         <h2 className="text-xl font-black uppercase tracking-tighter italic text-gray-800">Withdrawal Requests</h2>
      </div>

      {requests.length === 0 ? (
         <div className="bg-gray-50 rounded-[2rem] p-10 text-center border border-gray-100 shadow-inner">
            <ShieldAlert className="mx-auto text-gray-200 mb-4" size={48} />
            <p className="text-[12px] font-black uppercase tracking-widest text-gray-400 italic">No Pending Requests</p>
         </div>
      ) : (
        <div className="space-y-4">
          {requests.map(req => (
            <div key={req.id} className="bg-white rounded-3xl p-5 shadow-lg border border-gray-100 flex flex-col gap-4 group hover:border-emerald-100 transition-all">
              <div className="flex justify-between items-start">
                 <div>
                    <div className="flex items-center gap-2">
                       <span className="text-[9px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md uppercase tracking-widest">Payout Pending</span>
                    </div>
                    <p className="text-lg font-black text-gray-900 leading-none mt-2">{req.userName}</p>
                    <div className="flex items-center gap-2 mt-1">
                       <Phone size={10} className="text-gray-400" />
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{req.userMobile}</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Request Amount</p>
                    <p className="text-2xl font-black text-emerald-600 tracking-tighter italic">₹{req.amount}</p>
                 </div>
              </div>

              <div className="bg-gray-950 p-5 rounded-2xl flex flex-col relative overflow-hidden space-y-3 shadow-xl">
                 <div className="absolute top-0 right-0 p-4 opacity-10 text-white">
                    <ArrowUpRight size={32} />
                 </div>
                 <div>
                   <p className="text-[8px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-0.5">Account Holder Name</p>
                   <p className="text-xs font-black text-white tracking-tight italic select-all">{req.accountHolderName || req.userName}</p>
                 </div>
                 <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
                   <div>
                     <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-0.5">Account Number</p>
                     <p className="text-xs font-black text-white tracking-tight italic select-all">{req.accountNumber || 'N/A'}</p>
                   </div>
                   <div>
                     <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-0.5">IFSC Code</p>
                     <p className="text-xs font-black text-white tracking-tight italic select-all">{req.ifscCode || 'N/A'}</p>
                   </div>
                 </div>
                 <div className="pt-2 border-t border-white/10">
                   <p className="text-[8px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-0.5">Target UPI ID</p>
                   <p className="text-xs font-black text-white tracking-tight italic select-all">{req.upiId}</p>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => handleApprove(req)}
                  className="bg-emerald-600 text-white p-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-500/20 flex justify-center items-center gap-2 active:scale-95 transition-transform"
                >
                  <CheckCircle2 size={16} /> Approve & Paid
                </button>
                <button 
                  onClick={() => handleReject(req)}
                  className="bg-gray-100 text-gray-500 p-4 rounded-xl font-black text-[10px] uppercase tracking-widest flex justify-center items-center gap-2 hover:bg-red-50 hover:text-red-500 transition-colors active:scale-95"
                >
                  <XCircle size={16} /> Reject Request
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminWithdrawals;
