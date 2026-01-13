
import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CustomerList from './components/CustomerList';
import AIInsights from './components/AIInsights';
import CustomerProfile from './components/CustomerProfile';
import FinancialLedger from './components/FinancialLedger';
import { ViewType, Customer } from './types';
import { MOCK_CUSTOMERS } from './constants';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginSubView, setLoginSubView] = useState<'login' | 'forgot' | 'help'>('login');
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  
  // Dynamic Current User Identity
  const [currentUser, setCurrentUser] = useState({
    name: 'Jordan Reed',
    role: 'Sales Director',
    avatar: 'https://picsum.photos/seed/admin/100'
  });

  // Interactivity states
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCollaborators, setShowCollaborators] = useState(false);
  const [showAdminProfile, setShowAdminProfile] = useState(false);
  const [adminSubView, setAdminSubView] = useState<'profile' | 'security' | 'password-update'>('profile');
  const [collabSubView, setCollabSubView] = useState<'list' | 'invite' | 'manage'>('list');
  const notificationRef = useRef<HTMLDivElement>(null);

  // Password Update State
  const [passwordForm, setPasswordForm] = useState({ old: '', new: '', confirm: '' });
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);

  // Notifications State
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Revenue Milestone', message: 'Monthly target of $80k achieved!', time: '2h ago', icon: '🎯', color: 'bg-green-100', read: false },
    { id: 2, title: 'Churn Alert', message: 'Nexus Systems has flagged as "High Risk".', time: '4h ago', icon: '⚠️', color: 'bg-red-100', read: false },
    { id: 3, title: 'New Onboarding', message: 'Ethan Hunt successfully moved to Active.', time: '1d ago', icon: '👤', color: 'bg-blue-100', read: false },
  ]);

  // Team State
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'Jordan Reed', role: 'Sales Director', status: 'Online', avatar: 'https://picsum.photos/seed/admin/40' },
    { id: 2, name: 'Sarah Chen', role: 'Account Executive', status: 'Away', avatar: 'https://picsum.photos/seed/sarah/40' },
    { id: 3, name: 'Mike Ross', role: 'Revenue Ops', status: 'Online', avatar: 'https://picsum.photos/seed/mike/40' },
    { id: 4, name: 'Rachel Zane', role: 'Success Manager', status: 'In Meeting', avatar: 'https://picsum.photos/seed/rachel/40' },
  ]);

  // Admin Preferences
  const [adminPrefs, setAdminPrefs] = useState({
    emailAlerts: true,
    compactView: false,
    aiSuggestions: true,
    twoFactor: false,
    apiAccess: true
  });

  // Invite Form State
  const [inviteData, setInviteData] = useState({ name: '', role: 'Account Executive' });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInitializeSession = () => {
    const names = ['Jordan Reed', 'Alex Vance', 'Morgan Blake', 'Casey Wright', 'Sloane Harper', 'Riley Quinn'];
    const roles = ['Sales Director', 'VP of Revenue', 'Head of Success', 'Chief Revenue Officer', 'Revenue Operations Lead'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomRole = roles[Math.floor(Math.random() * roles.length)];
    const randomSeed = Math.floor(Math.random() * 1000);

    setCurrentUser({
      name: randomName,
      role: randomRole,
      avatar: `https://picsum.photos/seed/${randomSeed}/200`
    });

    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setShowAdminProfile(false);
    setIsLoggedIn(false);
    setLoginSubView('login');
    setCurrentView('dashboard');
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotPasswordSuccess(true);
    setTimeout(() => {
      setForgotPasswordSuccess(false);
      setLoginSubView('login');
      setForgotPasswordEmail('');
    }, 3000);
  };

  const handleAddCustomer = (newCustomer: Customer) => {
    setCustomers(prev => [newCustomer, ...prev]);
  };

  const handleDeleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    if (selectedCustomerId === id) {
      setSelectedCustomerId(null);
      setCurrentView('customers');
    }
  };

  const handleSelectCustomer = (id: string) => {
    setSelectedCustomerId(id);
    setCurrentView('customer-profile');
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteData.name) return;
    
    const newMember = {
      id: Date.now(),
      name: inviteData.name,
      role: inviteData.role,
      status: 'Online',
      avatar: `https://picsum.photos/seed/${inviteData.name}/40`
    };
    
    setTeamMembers(prev => [...prev, newMember]);
    setInviteData({ name: '', role: 'Account Executive' });
    setCollabSubView('list');
  };

  const cycleRole = (memberId: number) => {
    const roles = ['Sales Director', 'Account Executive', 'Revenue Ops', 'Success Manager', 'Admin'];
    setTeamMembers(prev => prev.map(m => {
      if (m.id === memberId) {
        const currentIndex = roles.indexOf(m.role);
        const nextIndex = (currentIndex + 1) % roles.length;
        return { ...m, role: roles[nextIndex] };
      }
      return m;
    }));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setTimeout(() => {
        setNotifications([]);
    }, 300);
  };

  const handleViewAllActivity = () => {
    setCurrentView('activity');
    setShowNotifications(false);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      alert("New passwords do not match.");
      return;
    }
    setPasswordSuccess(true);
    setTimeout(() => {
      setPasswordSuccess(false);
      setAdminSubView('security');
      setPasswordForm({ old: '', new: '', confirm: '' });
    }, 2000);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]"></div>
        
        <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[40px] shadow-2xl animate-in fade-in zoom-in duration-500 relative z-10">
          
          {loginSubView === 'login' && (
            <div className="animate-in slide-in-from-bottom-4 duration-300">
              <div className="text-center mb-10">
                <h1 className="text-4xl font-black text-white tracking-tight mb-2">RevGenius</h1>
                <p className="text-slate-400 font-medium text-sm">Enterprise Revenue Command Center</p>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="relative group">
                    <span className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-blue-400 transition-colors">👤</span>
                    <input 
                      type="text" 
                      defaultValue="jordan.reed@revgenius.io"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/10 transition-all placeholder:text-slate-600"
                      placeholder="Email or Username"
                    />
                  </div>
                  <div className="relative group">
                    <span className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-blue-400 transition-colors">🔒</span>
                    <input 
                      type="password" 
                      defaultValue="••••••••"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/10 transition-all placeholder:text-slate-600"
                      placeholder="Password"
                    />
                  </div>
                </div>
                
                <button 
                  onClick={handleInitializeSession}
                  className="w-full py-4 bg-blue-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-500 transition-all active:scale-[0.98]"
                >
                  Initialize Session
                </button>
                
                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-500 px-2">
                  <button onClick={() => setLoginSubView('forgot')} className="hover:text-white transition-colors">Forgot Password</button>
                  <button onClick={() => setLoginSubView('help')} className="hover:text-white transition-colors">Security Help</button>
                </div>
              </div>
            </div>
          )}

          {loginSubView === 'forgot' && (
            <div className="animate-in slide-in-from-right-4 duration-300">
               <button onClick={() => setLoginSubView('login')} className="mb-6 text-slate-400 hover:text-white transition-colors text-xs font-bold flex items-center">
                 ← BACK TO LOGIN
               </button>
               <h2 className="text-2xl font-black text-white mb-2">Account Recovery</h2>
               <p className="text-slate-400 text-sm mb-8 leading-relaxed">Enter your organization email to receive a secure recovery sequence.</p>

               {forgotPasswordSuccess ? (
                 <div className="py-8 text-center animate-in zoom-in">
                    <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border border-emerald-500/30">
                      ✓
                    </div>
                    <p className="text-white font-bold">Recovery Link Sent</p>
                    <p className="text-slate-400 text-xs mt-2">Check your inbox for instructions.</p>
                 </div>
               ) : (
                 <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
                    <div className="relative">
                      <span className="absolute left-4 top-3.5 text-slate-500">✉️</span>
                      <input 
                        required
                        type="email" 
                        value={forgotPasswordEmail}
                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="Organization Email"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full py-4 bg-white text-slate-900 font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all active:scale-[0.98]"
                    >
                      Send Reset Link
                    </button>
                 </form>
               )}
            </div>
          )}

          {loginSubView === 'help' && (
            <div className="animate-in slide-in-from-right-4 duration-300">
               <button onClick={() => setLoginSubView('login')} className="mb-6 text-slate-400 hover:text-white transition-colors text-xs font-bold flex items-center">
                 ← BACK TO LOGIN
               </button>
               <h2 className="text-2xl font-black text-white mb-2">Security Protocol</h2>
               <p className="text-slate-400 text-sm mb-8 leading-relaxed">RevGenius utilizes enterprise-grade encryption and adaptive threat detection.</p>

               <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {[
                    { q: 'Is 2FA mandatory?', a: 'Your organization administrator determines 2FA requirements. Enable it in settings for maximum security.' },
                    { q: 'Session expirations', a: 'Sessions automatically expire after 8 hours of inactivity to prevent unauthorized access.' },
                    { q: 'IP Whitelisting', a: 'Access can be restricted to specific CIDR blocks. Contact Ops for integration support.' },
                    { q: 'Forgot credentials', a: 'Use the recovery tool or contact your IT helpdesk if your email is unreachable.' },
                  ].map((item, i) => (
                    <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                       <p className="text-blue-400 text-xs font-black uppercase tracking-widest mb-1">{item.q}</p>
                       <p className="text-slate-300 text-xs leading-relaxed">{item.a}</p>
                    </div>
                  ))}
               </div>
               
               <div className="mt-8 pt-6 border-t border-white/10 text-center">
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Global Support Status: <span className="text-emerald-500">ONLINE</span></p>
               </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard customers={customers} />;
      case 'customers':
        return (
          <CustomerList 
            customers={customers} 
            onAddCustomer={handleAddCustomer} 
            onDeleteCustomer={handleDeleteCustomer}
            onSelectCustomer={handleSelectCustomer}
          />
        );
      case 'customer-profile':
        const customer = customers.find(c => c.id === selectedCustomerId);
        if (!customer) {
          setCurrentView('customers');
          return null;
        }
        return (
          <CustomerProfile 
            customer={customer} 
            onBack={() => setCurrentView('customers')} 
          />
        );
      case 'insights':
        return <AIInsights customers={customers} />;
      case 'activity':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <header>
              <h2 className="text-3xl font-black text-slate-800">System Activity Feed</h2>
              <p className="text-slate-500">Full audit trail of all recent workspace events.</p>
            </header>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="p-8 space-y-6">
                  {notifications.length === 0 && (
                    <div className="text-center py-12">
                      <span className="text-4xl mb-4 block">📭</span>
                      <p className="text-slate-400 font-medium">No recent activity to display.</p>
                    </div>
                  )}
                  {notifications.concat([
                    { id: 4, title: 'Security Audit', message: 'System integrity check completed successfully.', time: '2d ago', icon: '🛡️', color: 'bg-slate-100', read: true },
                    { id: 5, title: 'API Key Rotated', message: 'Main integration key was updated by Admin.', time: '3d ago', icon: '🔑', color: 'bg-amber-100', read: true },
                  ]).map((item) => (
                    <div key={item.id} className="flex items-start space-x-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors">
                      <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center text-2xl shrink-0`}>
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-slate-800">{item.title}</h4>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.time}</span>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">{item.message}</p>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        );
      case 'revenue':
        return <FinancialLedger />;
      default:
        return <Dashboard customers={customers} />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        user={currentUser}
        onProfileClick={() => {
          setShowAdminProfile(true);
          setAdminSubView('profile');
        }}
      />
      
      <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full overflow-hidden relative">
        <div className="flex justify-between items-center mb-8 relative z-20">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Workspace / {currentView.replace('-', ' ')}
            </span>
          </div>
          
          <div className="flex items-center space-x-6">
             <button 
              onClick={() => { setShowCollaborators(true); setCollabSubView('list'); }}
              className="flex -space-x-2 items-center hover:opacity-80 transition-opacity focus:outline-none group"
             >
               {teamMembers.slice(0, 3).map((m) => (
                 <img key={m.id} src={m.avatar} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" alt="" />
               ))}
               <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm group-hover:bg-blue-600 transition-colors">
                 +{Math.max(0, teamMembers.length - 3)}
               </div>
             </button>

             <div className="relative" ref={notificationRef}>
               <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2 rounded-xl transition-all relative ${showNotifications ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
               >
                 <span className="text-xl">🔔</span>
                 {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                 )}
               </button>

               {showNotifications && (
                 <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                   <div className="px-5 py-4 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                     <h4 className="font-black text-xs uppercase tracking-widest text-slate-500">Notifications</h4>
                     {notifications.length > 0 && (
                        <button onClick={handleMarkAllRead} className="text-[10px] font-bold text-blue-600 hover:underline">Mark all read</button>
                     )}
                   </div>
                   <div className="max-h-96 overflow-y-auto">
                     {notifications.length === 0 ? (
                        <div className="p-10 text-center">
                            <p className="text-slate-400 text-sm italic font-medium">Inbox zero! No new alerts.</p>
                        </div>
                     ) : notifications.map(n => (
                       <div key={n.id} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer flex space-x-4 border-b border-slate-50 last:border-0">
                         <div className={`w-10 h-10 rounded-xl ${n.color} flex items-center justify-center text-lg shrink-0`}>
                           {n.icon}
                         </div>
                         <div className="flex-1">
                           <p className="text-sm font-bold text-slate-800">{n.title}</p>
                           <p className="text-xs text-slate-500 leading-tight mt-0.5">{n.message}</p>
                           <p className="text-[10px] text-slate-400 mt-2 font-medium">{n.time}</p>
                         </div>
                       </div>
                     ))}
                   </div>
                   <button 
                    onClick={handleViewAllActivity}
                    className="w-full py-3 bg-slate-50 text-slate-500 text-xs font-bold hover:bg-slate-100 transition-colors border-t border-slate-100"
                   >
                     View All Activity
                   </button>
                 </div>
               )}
             </div>
          </div>
        </div>

        {renderContent()}

        {/* Collaborators Modal */}
        {showCollaborators && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowCollaborators(false)}></div>
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative z-10 animate-in zoom-in duration-300">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  {collabSubView !== 'list' && (
                    <button onClick={() => setCollabSubView('list')} className="text-slate-400 hover:text-blue-600 mr-1">←</button>
                  )}
                  <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                    {collabSubView === 'list' ? 'Active Workspace Team' : collabSubView === 'invite' ? 'Invite New Partner' : 'Manage Permissions'}
                  </h3>
                </div>
                <button onClick={() => setShowCollaborators(false)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>

              <div className="p-6 max-h-[400px] overflow-y-auto">
                {collabSubView === 'list' && (
                  <div className="space-y-4">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors group">
                        <div className="flex items-center space-x-4">
                          <img src={member.avatar} className="w-12 h-12 rounded-2xl object-cover" alt="" />
                          <div>
                            <h5 className="font-bold text-slate-800">{member.name}</h5>
                            <p className="text-xs text-slate-500">{member.role}</p>
                          </div>
                        </div>
                        <span className={`w-2 h-2 rounded-full ${member.status === 'Online' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                      </div>
                    ))}
                  </div>
                )}

                {collabSubView === 'invite' && (
                  <form onSubmit={handleInviteSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Full Name</label>
                      <input 
                        required 
                        autoFocus
                        type="text" 
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="e.g. Harvey Specter"
                        value={inviteData.name}
                        onChange={e => setInviteData({...inviteData, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Workspace Role</label>
                      <select 
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                        value={inviteData.role}
                        onChange={e => setInviteData({...inviteData, role: e.target.value})}
                      >
                        <option>Account Executive</option>
                        <option>Revenue Ops</option>
                        <option>Success Manager</option>
                        <option>Sales Director</option>
                      </select>
                    </div>
                    <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all">
                      Send Secure Invite
                    </button>
                  </form>
                )}

                {collabSubView === 'manage' && (
                  <div className="space-y-3">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 border border-slate-50 rounded-2xl">
                        <div className="flex items-center space-x-3">
                          <img src={member.avatar} className="w-8 h-8 rounded-lg" alt="" />
                          <span className="text-sm font-bold text-slate-700">{member.name}</span>
                        </div>
                        <button 
                          onClick={() => cycleRole(member.id)}
                          className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-tighter hover:bg-blue-100 transition-colors"
                        >
                          {member.role} 🔄
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {collabSubView === 'list' && (
                <div className="p-6 bg-slate-50 flex space-x-3">
                  <button 
                    onClick={() => setCollabSubView('invite')}
                    className="flex-1 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Invite Member
                  </button>
                  <button 
                    onClick={() => setCollabSubView('manage')}
                    className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all"
                  >
                    Manage Roles
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Admin Profile & Security Modal */}
        {showAdminProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAdminProfile(false)}></div>
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10 animate-in zoom-in duration-300">
              <div className="relative h-40 bg-slate-900 p-8 flex items-end">
                <div className="absolute top-4 left-4 flex space-x-2">
                   {(adminSubView === 'security' || adminSubView === 'password-update') && (
                     <button 
                      onClick={() => setAdminSubView(adminSubView === 'password-update' ? 'security' : 'profile')} 
                      className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl transition-all text-xs font-bold"
                     >
                       ← Back
                     </button>
                   )}
                </div>
                <div className="absolute top-4 right-4">
                   <button onClick={() => setShowAdminProfile(false)} className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-xl transition-all">✕</button>
                </div>
                <div className="flex items-center space-x-6 relative z-10 -mb-12">
                   <img 
                    src={currentUser.avatar} 
                    className="w-24 h-24 rounded-3xl border-4 border-white shadow-xl object-cover" 
                    alt={currentUser.name} 
                   />
                   <div className="pb-4">
                     <h3 className="text-2xl font-black text-white leading-tight">{currentUser.name}</h3>
                     <p className="text-blue-400 font-bold uppercase tracking-widest text-xs">{currentUser.role} • RevGenius</p>
                   </div>
                </div>
              </div>
              
              <div className="pt-16 px-8 pb-8 space-y-8 min-h-[440px]">
                 {adminSubView === 'profile' && (
                   <>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-slate-50 p-4 rounded-2xl text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Accounts</p>
                        <p className="text-xl font-black text-slate-800">24</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Closed</p>
                        <p className="text-xl font-black text-slate-800">$1.2M</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Quota</p>
                        <p className="text-xl font-black text-emerald-600">114%</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Workspace Preferences</h4>
                      <div className="flex items-center justify-between p-2">
                        <div>
                          <p className="text-sm font-bold text-slate-800">Email Smart Alerts</p>
                          <p className="text-xs text-slate-500">Receive AI-curated summaries weekly</p>
                        </div>
                        <button 
                          onClick={() => setAdminPrefs({...adminPrefs, emailAlerts: !adminPrefs.emailAlerts})}
                          className={`w-12 h-6 rounded-full transition-all relative ${adminPrefs.emailAlerts ? 'bg-blue-600' : 'bg-slate-200'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${adminPrefs.emailAlerts ? 'left-7' : 'left-1'}`}></div>
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-2">
                        <div>
                          <p className="text-sm font-bold text-slate-800">AI Sales Co-Pilot</p>
                          <p className="text-xs text-slate-500">Real-time suggestions during calls</p>
                        </div>
                        <button 
                          onClick={() => setAdminPrefs({...adminPrefs, aiSuggestions: !adminPrefs.aiSuggestions})}
                          className={`w-12 h-6 rounded-full transition-all relative ${adminPrefs.aiSuggestions ? 'bg-blue-600' : 'bg-slate-200'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${adminPrefs.aiSuggestions ? 'left-7' : 'left-1'}`}></div>
                        </button>
                      </div>
                    </div>

                    <div className="pt-4 flex space-x-3">
                        <button 
                          onClick={() => setAdminSubView('security')}
                          className="flex-1 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all"
                        >
                          Security Settings
                        </button>
                        <button 
                          onClick={handleLogout}
                          className="px-6 py-3 bg-red-50 text-red-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-100 transition-all"
                        >
                          Logout
                        </button>
                    </div>
                   </>
                 )}

                 {adminSubView === 'security' && (
                   <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                      <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Security & Identity</h4>
                      <div className="space-y-5">
                         <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                           <div className="flex items-center space-x-4">
                             <span className="text-2xl">📱</span>
                             <div>
                               <p className="text-sm font-bold text-slate-800">Two-Factor Auth</p>
                               <p className="text-[10px] text-slate-500 font-medium">Extra layer for login security</p>
                             </div>
                           </div>
                           <button 
                            onClick={() => setAdminPrefs({...adminPrefs, twoFactor: !adminPrefs.twoFactor})}
                            className={`w-12 h-6 rounded-full transition-all relative ${adminPrefs.twoFactor ? 'bg-blue-600' : 'bg-slate-300'}`}
                           >
                             <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${adminPrefs.twoFactor ? 'left-7' : 'left-1'}`}></div>
                           </button>
                         </div>

                         <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                           <div className="flex items-center space-x-4">
                             <span className="text-2xl">🔑</span>
                             <div>
                               <p className="text-sm font-bold text-slate-800">Public API Access</p>
                               <p className="text-[10px] text-slate-500 font-medium">Control third-party integrations</p>
                             </div>
                           </div>
                           <button 
                            onClick={() => setAdminPrefs({...adminPrefs, apiAccess: !adminPrefs.apiAccess})}
                            className={`w-12 h-6 rounded-full transition-all relative ${adminPrefs.apiAccess ? 'bg-blue-600' : 'bg-slate-300'}`}
                           >
                             <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${adminPrefs.apiAccess ? 'left-7' : 'left-1'}`}></div>
                           </button>
                         </div>

                         <div className="p-4 border border-slate-100 rounded-2xl space-y-3">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Sessions</p>
                           <div className="flex items-center justify-between">
                             <div className="flex items-center space-x-3">
                               <span className="text-xs">📍</span>
                               <span className="text-xs font-bold text-slate-700">San Francisco, CA (Current)</span>
                             </div>
                             <span className="text-[10px] font-black text-emerald-500">SECURE</span>
                           </div>
                           <div className="flex items-center justify-between">
                             <div className="flex items-center space-x-3 text-slate-400">
                               <span className="text-xs">📍</span>
                               <span className="text-xs">New York, NY (Feb 24)</span>
                             </div>
                             <button className="text-[10px] font-black text-blue-600 hover:underline">REVOKE</button>
                           </div>
                         </div>
                      </div>

                      <div className="pt-4">
                        <button 
                          onClick={() => setAdminSubView('password-update')}
                          className="w-full py-3 border-2 border-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
                        >
                          Update Password
                        </button>
                      </div>
                   </div>
                 )}

                 {adminSubView === 'password-update' && (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                      <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Change Account Password</h4>
                      
                      {passwordSuccess ? (
                        <div className="py-12 flex flex-col items-center justify-center space-y-4 animate-in zoom-in">
                          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl">
                            ✓
                          </div>
                          <p className="text-slate-800 font-bold">Password Updated Successfully</p>
                          <p className="text-xs text-slate-500">Redirecting to security panel...</p>
                        </div>
                      ) : (
                        <form onSubmit={handlePasswordSubmit} className="space-y-5">
                          <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Old Password</label>
                            <input 
                              required
                              type="password"
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                              placeholder="••••••••"
                              value={passwordForm.old}
                              onChange={e => setPasswordForm({...passwordForm, old: e.target.value})}
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">New Password</label>
                            <input 
                              required
                              type="password"
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                              placeholder="Min. 8 characters"
                              value={passwordForm.new}
                              onChange={e => setPasswordForm({...passwordForm, new: e.target.value})}
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Confirm New Password</label>
                            <input 
                              required
                              type="password"
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                              placeholder="Must match new password"
                              value={passwordForm.confirm}
                              onChange={e => setPasswordForm({...passwordForm, confirm: e.target.value})}
                            />
                          </div>
                          <div className="pt-4 flex space-x-3">
                            <button 
                              type="button"
                              onClick={() => setAdminSubView('security')}
                              className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                            >
                              Cancel
                            </button>
                            <button 
                              type="submit"
                              className="flex-1 py-3 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all"
                            >
                              Save Changes
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                 )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
