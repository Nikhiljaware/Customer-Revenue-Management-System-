
import React from 'react';
import { Customer } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CustomerProfileProps {
  customer: Customer;
  onBack: () => void;
}

const CustomerProfile: React.FC<CustomerProfileProps> = ({ customer, onBack }) => {
  // Mock monthly performance data for this specific customer
  const performanceData = [
    { month: 'Sep', revenue: customer.mrr * 0.8 },
    { month: 'Oct', revenue: customer.mrr * 0.9 },
    { month: 'Nov', revenue: customer.mrr * 0.95 },
    { month: 'Dec', revenue: customer.mrr * 1.0 },
    { month: 'Jan', revenue: customer.mrr * 1.0 },
    { month: 'Feb', revenue: customer.mrr * 1.05 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Back Button and Header */}
      <div className="flex items-center space-x-4">
        <button 
          onClick={onBack}
          className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm text-slate-500 hover:text-blue-600"
        >
          ← Back
        </button>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Account Detail</h2>
      </div>

      {/* Hero Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-slate-800 to-slate-900 relative">
          <div className="absolute -bottom-12 left-8 flex items-end space-x-6">
            <img 
              src={customer.avatar} 
              className="w-24 h-24 rounded-3xl border-4 border-white shadow-lg ring-1 ring-slate-100 object-cover" 
              alt={customer.name} 
            />
            <div className="pb-2">
              <h1 className="text-3xl font-black text-white drop-shadow-sm">{customer.name}</h1>
              <p className="text-blue-400 font-bold tracking-wide uppercase text-xs">{customer.company}</p>
            </div>
          </div>
        </div>
        <div className="pt-16 px-8 pb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 flex-1">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                customer.status === 'Active' ? 'bg-emerald-50 text-emerald-700' :
                customer.status === 'Pending' ? 'bg-amber-50 text-amber-700' :
                'bg-slate-50 text-slate-600'
              }`}>
                {customer.status}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Industry</p>
              <p className="text-sm font-bold text-slate-700">{customer.industry}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Customer Since</p>
              <p className="text-sm font-bold text-slate-700">{new Date(customer.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Contact</p>
              <p className="text-sm font-bold text-blue-600 hover:underline cursor-pointer">{customer.email}</p>
            </div>
          </div>
          <div className="flex space-x-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-md">
              Edit Account
            </button>
            <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-blue-600 hover:bg-blue-50 transition-all border border-slate-200">
              ✉️
            </button>
          </div>
        </div>
      </div>

      {/* Stats and Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Stats Column */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm group hover:border-blue-200 transition-colors">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Current Monthly Revenue</h4>
            <div className="flex items-end justify-between">
              <span className="text-4xl font-black text-slate-900">${customer.mrr.toLocaleString()}</span>
              <span className="text-emerald-500 font-bold text-sm bg-emerald-50 px-2 py-0.5 rounded-lg">+12% vs last month</span>
            </div>
            <div className="mt-6 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
               <div className="h-full bg-blue-600 w-3/4 rounded-full"></div>
            </div>
            <p className="mt-2 text-[10px] text-slate-400 font-medium">Utilization of Tier 3 License Plan</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm group hover:border-indigo-200 transition-colors">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Total Lifetime Value</h4>
            <span className="text-4xl font-black text-slate-900">${customer.ltv.toLocaleString()}</span>
            <p className="mt-2 text-sm text-slate-500 font-medium italic">"Top 5% of all accounts in {customer.industry} segment."</p>
          </div>
        </div>

        {/* Right Charts Column */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-slate-800">Account Revenue Trajectory</h3>
            <div className="flex space-x-2">
               <button className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-600">6 Months</button>
               <button className="px-3 py-1 bg-white border border-slate-100 rounded-lg text-xs font-bold text-slate-400 hover:text-slate-600">Max</button>
            </div>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorIndivid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue Contribution']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorIndivid)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Interaction History</h3>
          <button className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors">Export Logs</button>
        </div>
        <div className="p-8 space-y-8">
           {[
             { title: 'Contract Renewal', desc: 'Account executive confirmed Tier 3 annual renewal.', date: '2 days ago', icon: '📝', color: 'bg-blue-100' },
             { title: 'Support Ticket Resolved', desc: 'API integration latency issue resolved by engineering.', date: '1 week ago', icon: '🛠️', color: 'bg-green-100' },
             { title: 'Usage Spike Detected', desc: 'Automated alert: 40% increase in API requests over baseline.', date: 'Feb 12, 2024', icon: '⚡', color: 'bg-amber-100' },
           ].map((log, i) => (
             <div key={i} className="flex space-x-4">
               <div className={`w-10 h-10 rounded-2xl ${log.color} flex items-center justify-center text-xl shrink-0`}>
                 {log.icon}
               </div>
               <div className="flex-1 border-b border-slate-50 pb-6">
                 <div className="flex justify-between items-start mb-1">
                    <h5 className="font-bold text-slate-800">{log.title}</h5>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{log.date}</span>
                 </div>
                 <p className="text-sm text-slate-500 leading-relaxed">{log.desc}</p>
               </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
