import React, { useState } from 'react';
import { 
  Play, 
  Settings2, 
  RefreshCcw, 
  AlertCircle,
  Clock,
  Zap,
  ShieldCheck,
  Target,
  Gamepad2,
  Lock,
  ChevronRight,
  CreditCard
} from 'lucide-react';

const AdminControl = () => {
  const [activeLotteries, setActiveLotteries] = useState([
    { id: 1, name: 'Dear Lottery (01:00 PM)', status: 'Running', entries: 1245 },
    { id: 2, name: 'Dear Lottery (06:00 PM)', status: 'Scheduled', entries: 0 },
    { id: 3, name: 'Kerala State (03:00 PM)', status: 'Paused', entries: 450 },
  ]);

  return (
    <div className="space-y-10 pb-32 p-4 min-h-screen bg-[#f8f9fa]">
      {/* Global Status Banner - Treasure Chest Theme */}
      <div className="border-[1.5px] border-[#ff004d] rounded-[2.5rem] p-8 bg-gray-900 text-white shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff004d]/20 rounded-full blur-3xl"></div>
         <div className="flex gap-4 items-center mb-8">
            <img src="https://img.icons8.com/color/64/000000/treasure-chest.png" alt="Chest" className="w-16 h-16 drop-shadow-xl group-hover:scale-110 transition-transform" />
            <div className="flex-grow">
               <h2 className="text-2xl font-black text-white font-condensed uppercase tracking-tighter italic">Engine Core</h2>
               <p className="text-[#ff004d] font-black text-[10px] uppercase tracking-widest leading-none mt-1">Live Draw Management</p>
            </div>
         </div>
         
         <div className="flex gap-4 justify-between bg-white/5 p-5 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
               <span className="text-[10px] font-black uppercase tracking-widest text-[#f42464]">Active Node Proxy</span>
            </div>
            <div className="flex gap-3">
               <button className="bg-white/10 px-4 py-2 rounded-xl text-[9px] font-black uppercase hover:bg-white/20 transition-colors">Safety Lock</button>
               <button className="bg-red-600 px-4 py-2 rounded-xl text-[9px] font-black uppercase hover:bg-red-700 transition-colors">Kill Engine</button>
            </div>
         </div>
      </div>

      {/* Main Controls Grid */}
      <div className="space-y-10">
        {/* Slot Controls */}
        <div className="space-y-6">
           <div className="flex items-center gap-3 ml-2">
              <Gamepad2 className="text-[#f42464]" size={20} />
              <h3 className="text-xl font-black text-gray-800 font-condensed uppercase tracking-tighter italic leading-none">Live Slot Control</h3>
           </div>
           
           <div className="space-y-4">
              {activeLotteries.map((item) => (
                <div key={item.id} className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-lg flex items-center justify-between group active:scale-[0.98] transition-all hover:border-[#f42464]/20 relative overflow-hidden">
                   <div className="flex items-center gap-5 relative z-10">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg border border-white shadow-sm ${
                        item.status === 'Running' ? 'bg-[#fce4ec] text-[#f42464]' : 'bg-gray-50 text-gray-300'
                      }`}>
                         {item.status === 'Running' ? <Zap size={20} fill="currentColor" /> : <Lock size={20} />}
                      </div>
                      <div>
                         <h4 className="font-black text-gray-800 text-sm tracking-tight uppercase italic">{item.name}</h4>
                         <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] text-[#f42464] font-black uppercase tracking-widest">{item.status}</span>
                            <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{item.entries} Submissions</span>
                         </div>
                      </div>
                   </div>
                   
                   <div className="flex gap-2 relative z-10">
                      <button className="p-3 rounded-xl bg-gray-50 text-gray-400 hover:text-gray-900 transition-colors border border-gray-100"><Play size={18} fill="currentColor" /></button>
                      <button className="p-3 rounded-xl bg-gray-50 text-gray-400 hover:text-emerald-500 transition-colors border border-gray-100"><RefreshCcw size={18} /></button>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Global Parameters */}
        <div className="space-y-6 pt-4 border-t border-gray-100">
           <div className="flex items-center gap-3 ml-2">
              <ShieldCheck className="text-[#f42464]" size={20} />
              <h3 className="text-xl font-black text-gray-800 font-condensed uppercase tracking-tighter italic leading-none">Security Parameters</h3>
           </div>

           <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-xl space-y-8">
              <div className="grid grid-cols-1 gap-6">
                {[
                  { label: 'Platform Commission (%)', value: '10', icon: Target, unit: '%' },
                  { label: 'Daily Booking Cap/Slot', value: '5000', icon: CreditCard, unit: '#' },
                  { label: 'Booking Offset (Minutes)', value: '15', icon: Clock, unit: '⏰' },
                ].map((param, idx) => (
                  <div key={idx} className="space-y-2 group/param">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 block group-focus-within/param:text-[#f42464] transition-colors">{param.label}</label>
                    <div className="flex items-center bg-gray-50/50 border border-gray-100 rounded-2xl px-6 h-16 group-focus-within/param:border-[#f42464]/20 group-focus-within/param:bg-white transition-all shadow-sm">
                       <param.icon className="text-[#f42464] opacity-20 mr-4" size={24} />
                       <input 
                         type="text" 
                         inputMode="numeric"
                         pattern="[0-9]*"
                         defaultValue={param.value} 
                         className="bg-transparent border-none outline-none font-black text-gray-800 text-lg w-full placeholder:text-gray-200" 
                       />
                       <span className="font-black text-gray-300 text-[10px] uppercase ml-2">{param.unit}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full h-16 bg-gray-900 text-white rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-black/10">
                 Apply Global Safeguards <ChevronRight size={20} className="text-[#f42464]" />
              </button>
           </div>
        </div>
      </div>

      <div className="pt-8 text-center opacity-30">
         <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Hardware Encrypted Authority Portal</p>
      </div>
    </div>
  );
};

export default AdminControl;
