
import React, { useState } from 'react';
import { Customer } from '../types';

interface CustomerListProps {
  customers: Customer[];
  onAddCustomer: (customer: Customer) => void;
  onDeleteCustomer: (id: string) => void;
  onSelectCustomer: (id: string) => void;
}

const CustomerList: React.FC<CustomerListProps> = ({ customers, onAddCustomer, onDeleteCustomer, onSelectCustomer }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    industry: 'SaaS',
    mrr: '',
  });

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCustomer: Customer = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      email: formData.email,
      company: formData.company,
      industry: formData.industry,
      status: 'Active',
      mrr: Number(formData.mrr),
      ltv: Number(formData.mrr) * 12, // Estimated LTV
      joinedDate: new Date().toISOString().split('T')[0],
      avatar: `https://picsum.photos/seed/${Math.random()}/100`,
    };
    onAddCustomer(newCustomer);
    setIsModalOpen(false);
    setFormData({ name: '', email: '', company: '', industry: 'SaaS', mrr: '' });
  };

  return (
    <div className="space-y-6 relative">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Customer Directory</h2>
          <p className="text-slate-500">Manage and segment your client base.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center shadow-lg shadow-blue-500/25 active:scale-95"
        >
          <span className="mr-2 text-xl">+</span> Add New Customer
        </button>
      </header>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full text-slate-400 focus-within:text-blue-500 transition-colors">
          <span className="absolute left-3 top-2.5">🔍</span>
          <input 
            type="text" 
            placeholder="Search by name or company..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex space-x-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {['All', 'Active', 'Pending', 'Churned'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                filterStatus === status 
                  ? 'bg-slate-800 text-white shadow-md' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Customer</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">MRR</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">LTV</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Joined</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredCustomers.length > 0 ? filteredCustomers.map((customer) => (
              <tr 
                key={customer.id} 
                className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                onClick={() => onSelectCustomer(customer.id)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <img src={customer.avatar} className="w-10 h-10 rounded-full ring-2 ring-slate-100 shadow-sm" alt="" />
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{customer.name}</div>
                      <div className="text-xs text-slate-500">{customer.company}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
                    customer.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                    customer.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                    'bg-slate-50 text-slate-600 border border-slate-200'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                      customer.status === 'Active' ? 'bg-emerald-500' :
                      customer.status === 'Pending' ? 'bg-amber-500' :
                      'bg-slate-400'
                    }`}></span>
                    {customer.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-700">
                  ${customer.mrr.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  ${customer.ltv.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                  {customer.joinedDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteCustomer(customer.id);
                    }}
                    className="text-slate-300 hover:text-red-500 transition-all px-2 opacity-0 group-hover:opacity-100 hover:scale-110 transform"
                    title="Delete Customer"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="px-6 py-24 text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-4xl mb-3">📂</span>
                    <p className="text-slate-400 italic font-medium">No records found matching your current view.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10 animate-in fade-in zoom-in slide-in-from-bottom-8 duration-300">
            {/* Modal Header */}
            <div className="relative h-32 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 flex flex-col justify-end">
               <button 
                onClick={() => setIsModalOpen(false)} 
                className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 w-8 h-8 rounded-full flex items-center justify-center transition-all"
               >
                 ✕
               </button>
               <h3 className="text-2xl font-black text-white leading-tight">New Partner Account</h3>
               <p className="text-blue-100 text-sm font-medium">Initialize a new revenue stream</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-5 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-300">👤</span>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. John Doe"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-slate-900"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest">Contact Email</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-300">✉️</span>
                    <input 
                      required
                      type="email" 
                      placeholder="name@company.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-slate-900"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest">Company Organization</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-300">🏢</span>
                  <input 
                    required
                    type="text" 
                    placeholder="Enter legal entity name"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-slate-900"
                    value={formData.company}
                    onChange={e => setFormData({...formData, company: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest">Industry Segment</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-300">🏷️</span>
                    <select 
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-slate-900 appearance-none"
                      value={formData.industry}
                      onChange={e => setFormData({...formData, industry: e.target.value})}
                    >
                      <option>SaaS</option>
                      <option>Retail</option>
                      <option>Manufacturing</option>
                      <option>Energy</option>
                      <option>Legal</option>
                      <option>Fintech</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest">Initial MRR Contribution</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-300 font-bold">$</span>
                    <input 
                      required
                      type="number" 
                      placeholder="0.00"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-slate-900 font-bold"
                      value={formData.mrr}
                      onChange={e => setFormData({...formData, mrr: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 flex flex-col md:flex-row gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="order-2 md:order-1 flex-1 px-6 py-3 border-2 border-slate-100 rounded-2xl text-slate-500 font-black text-sm hover:bg-slate-50 transition-all uppercase tracking-widest"
                >
                  Discard
                </button>
                <button 
                  type="submit"
                  className="order-1 md:order-2 flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-sm hover:shadow-xl hover:shadow-blue-500/30 transition-all active:scale-95 uppercase tracking-widest"
                >
                  Complete Onboarding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;
