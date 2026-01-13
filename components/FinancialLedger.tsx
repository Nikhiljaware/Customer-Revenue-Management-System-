
import React, { useState } from 'react';
import { MOCK_TRANSACTIONS } from '../constants';
import { Transaction } from '../types';

const FinancialLedger: React.FC = () => {
  const [filter, setFilter] = useState<'All' | 'Paid' | 'Pending' | 'Overdue'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = MOCK_TRANSACTIONS.filter(tx => {
    const matchesFilter = filter === 'All' || tx.status === filter;
    const matchesSearch = tx.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tx.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const summary = {
    total: MOCK_TRANSACTIONS.reduce((sum, tx) => sum + (tx.type === 'Refund' ? -tx.amount : tx.amount), 0),
    pending: MOCK_TRANSACTIONS.filter(tx => tx.status === 'Pending').reduce((sum, tx) => sum + tx.amount, 0),
    overdue: MOCK_TRANSACTIONS.filter(tx => tx.status === 'Overdue').reduce((sum, tx) => sum + tx.amount, 0),
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-black text-slate-800">Financial Ledger</h2>
        <p className="text-slate-500">Audit trail of all workspace transactions and billing events.</p>
      </header>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Settled Revenue (MTD)</p>
          <p className="text-3xl font-black text-emerald-600">${summary.total.toLocaleString()}</p>
          <div className="mt-4 flex items-center text-xs text-emerald-500 font-bold">
            <span className="mr-1">↑</span> 8.4% from last period
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Accounts Receivable</p>
          <p className="text-3xl font-black text-amber-500">${summary.pending.toLocaleString()}</p>
          <div className="mt-4 flex items-center text-xs text-slate-400 font-medium">
            5 invoices awaiting settlement
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Past Due Volume</p>
          <p className="text-3xl font-black text-red-500">${summary.overdue.toLocaleString()}</p>
          <div className="mt-4 flex items-center text-xs text-red-400 font-bold underline cursor-pointer">
            Run collections sequence
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
          <input 
            type="text" 
            placeholder="Search by ID or Customer..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          {['All', 'Paid', 'Pending', 'Overdue'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === f ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction ID</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredTransactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-bold text-slate-400 group-hover:text-blue-500">
                  {tx.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {new Date(tx.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-800">
                  {tx.customerName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs">
                  <span className={`px-2 py-1 rounded-lg font-bold ${
                    tx.type === 'Payment' ? 'bg-blue-50 text-blue-600' :
                    tx.type === 'Invoice' ? 'bg-slate-100 text-slate-600' :
                    'bg-purple-50 text-purple-600'
                  }`}>
                    {tx.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-black text-slate-900">
                  {tx.type === 'Refund' ? '-' : ''}${tx.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                    tx.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' :
                    tx.status === 'Pending' ? 'bg-amber-50 text-amber-600' :
                    'bg-red-50 text-red-600'
                  }`}>
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredTransactions.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-slate-400 font-medium italic">No ledger entries found for this selection.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialLedger;
