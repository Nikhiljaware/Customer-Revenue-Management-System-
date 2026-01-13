
import React, { useState, useEffect, useCallback } from 'react';
import { generateRevenueInsights, generateGrowthProjection } from '../services/geminiService';
import { MOCK_REVENUE } from '../constants';
import { Customer } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AIInsightsProps {
  customers: Customer[];
}

interface Insight {
  id: string;
  title: string;
  description: string;
  status?: 'idle' | 'applying' | 'applied';
}

interface ProjectionData {
  id: string;
  timestamp: string;
  projection: { month: string; revenue: number }[];
  summary: string;
  targetRevenue: number;
}

const AIInsights: React.FC<AIInsightsProps> = ({ customers }) => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Projection States
  const [isProjecting, setIsProjecting] = useState(false);
  const [projectionResult, setProjectionResult] = useState<ProjectionData | null>(null);
  const [projectionLoading, setProjectionLoading] = useState(false);
  
  // Saved Strategies State
  const [savedStrategies, setSavedStrategies] = useState<ProjectionData[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const loadInsights = useCallback(async () => {
    setLoading(true);
    try {
      const data = await generateRevenueInsights(customers, MOCK_REVENUE);
      const mappedData = (data || []).map((item: any, idx: number) => ({
        ...item,
        id: `insight-${idx}-${Date.now()}`,
        status: 'idle'
      }));
      setInsights(mappedData);
    } catch (error) {
      console.error("Failed to refresh insights:", error);
    } finally {
      setLoading(false);
    }
  }, [customers]);

  useEffect(() => {
    loadInsights();
  }, [loadInsights]);

  const handleDismiss = (id: string) => {
    setInsights(prev => prev.filter(insight => insight.id !== id));
  };

  const handleApply = (id: string) => {
    setInsights(prev => prev.map(insight => 
      insight.id === id ? { ...insight, status: 'applying' } : insight
    ));

    setTimeout(() => {
      setInsights(prev => prev.map(insight => 
        insight.id === id ? { ...insight, status: 'applied' } : insight
      ));
      
      setTimeout(() => {
        setInsights(prev => prev.filter(insight => insight.id !== id));
      }, 1500);
    }, 1000);
  };

  const handleRunProjection = async () => {
    setIsProjecting(true);
    setProjectionLoading(true);
    
    try {
      const result = await generateGrowthProjection(customers, MOCK_REVENUE);
      setProjectionResult({
        ...result,
        id: `proj-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        targetRevenue: result.projection[11].revenue
      });
    } catch (error) {
      console.error("Projection failed", error);
    } finally {
      setProjectionLoading(false);
    }
  };

  const handleSaveStrategy = () => {
    if (!projectionResult) return;
    
    setIsSaving(true);
    
    // Simulate API persistence
    setTimeout(() => {
      setSavedStrategies(prev => [projectionResult, ...prev]);
      setIsSaving(false);
      setShowSaveSuccess(true);
      
      // Auto-close success message and modal
      setTimeout(() => {
        setShowSaveSuccess(false);
        setIsProjecting(false);
      }, 2000);
    }, 1200);
  };

  const deleteSavedStrategy = (id: string) => {
    setSavedStrategies(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-12 max-w-4xl mx-auto pb-20">
      <header className="text-center relative">
        <div className="inline-block px-4 py-1.5 mb-3 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
          Powered by Gemini AI
        </div>
        <div className="flex items-center justify-center space-x-4">
          <h2 className="text-4xl font-black text-slate-900">Intelligence Hub</h2>
          <button 
            onClick={loadInsights}
            disabled={loading}
            className={`p-2 rounded-full hover:bg-slate-100 transition-all text-slate-400 hover:text-blue-600 ${loading ? 'animate-spin' : ''}`}
            title="Refresh Insights"
          >
            🔄
          </button>
        </div>
        <p className="text-slate-500 mt-2 text-lg">Real-time analysis based on {customers.length} accounts.</p>
      </header>

      {/* Suggested Actions */}
      <section className="space-y-6">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Immediate Opportunities</h3>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-slate-500 font-medium animate-pulse">Analyzing accounts...</p>
          </div>
        ) : insights.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-300 text-center animate-in fade-in zoom-in">
            <span className="text-5xl mb-4 block">✅</span>
            <h3 className="text-xl font-bold text-slate-800 mb-2">All Caught Up</h3>
            <p className="text-slate-500">Revenue streams are optimized.</p>
            <button 
              onClick={loadInsights}
              className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all active:scale-95"
            >
              Refresh Data
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {insights.map((insight, idx) => (
              <div 
                key={insight.id} 
                className={`bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all relative overflow-hidden group animate-in slide-in-from-bottom-4 duration-300 ${insight.status === 'applied' ? 'opacity-50 scale-95 border-emerald-200 bg-emerald-50/20' : ''}`}
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <span className="text-6xl">💡</span>
                </div>
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center">
                    <span className="mr-3 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-blue-500/30">
                      {idx + 1}
                    </span>
                    {insight.title}
                  </h3>
                  {insight.status === 'applied' && (
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest animate-in fade-in zoom-in">
                      Strategy Applied
                    </span>
                  )}
                </div>
                <p className="text-slate-600 leading-relaxed text-lg">{insight.description}</p>
                <div className="mt-6 flex items-center space-x-4">
                  {insight.status === 'idle' && (
                    <>
                      <button onClick={() => handleApply(insight.id)} className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-md active:scale-95">Apply Strategy</button>
                      <button onClick={() => handleDismiss(insight.id)} className="px-4 py-2 bg-slate-50 text-slate-500 rounded-xl font-bold text-sm hover:bg-slate-100 hover:text-slate-700 transition-all active:scale-95 border border-slate-100">Dismiss</button>
                    </>
                  )}
                  {insight.status === 'applying' && (
                    <div className="flex items-center space-x-2 text-blue-600 font-bold text-sm">
                      <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                      <span>Initializing workflow...</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Main Feature Banner */}
      <div className="bg-slate-900 text-white p-10 rounded-[32px] relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600 opacity-20 rounded-full blur-[100px] -mr-40 -mt-40"></div>
         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
           <div className="max-w-md">
             <h3 className="text-3xl font-black mb-4 tracking-tight">Revenue Forecasting</h3>
             <p className="text-slate-300 text-lg leading-relaxed mb-6">
               Harness Gemini 3.0 to model your 12-month trajectory with predictive variance mapping.
             </p>
             <button 
              onClick={handleRunProjection}
              className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl active:scale-[0.98]"
             >
               Run Growth Projection
             </button>
           </div>
           <div className="hidden md:block">
              <span className="text-8xl filter drop-shadow-2xl">📊</span>
           </div>
         </div>
      </div>

      {/* Saved Strategies Library */}
      {savedStrategies.length > 0 && (
        <section className="space-y-6 animate-in fade-in duration-500">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Saved Strategy Library</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedStrategies.map((strategy) => (
              <div key={strategy.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center group">
                <div>
                  <p className="text-xs font-bold text-blue-600 mb-1">{strategy.timestamp}</p>
                  <h4 className="font-bold text-slate-800">Target: ${strategy.targetRevenue.toLocaleString()}</h4>
                </div>
                <button 
                  onClick={() => deleteSavedStrategy(strategy.id)}
                  className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projection Modal */}
      {isProjecting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl" onClick={() => !projectionLoading && setIsProjecting(false)}></div>
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-3xl overflow-hidden relative z-10 animate-in zoom-in duration-300">
            {projectionLoading ? (
              <div className="p-20 text-center space-y-6">
                <div className="relative w-24 h-24 mx-auto">
                   <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
                   <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <h3 className="text-2xl font-black text-slate-900">Consulting Gemini...</h3>
                <p className="text-slate-500 max-w-xs mx-auto font-medium">Modeling revenue variances and economic growth markers.</p>
              </div>
            ) : projectionResult && (
              <div className="flex flex-col h-[85vh] md:h-auto">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                   <div>
                     <h3 className="text-2xl font-black text-slate-900">Growth Forecast</h3>
                     <p className="text-slate-500 text-sm font-medium">12-Month Predictive Model</p>
                   </div>
                   <button onClick={() => setIsProjecting(false)} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm">✕</button>
                </div>
                
                <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="md:col-span-2 bg-slate-50 rounded-3xl p-6 h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={projectionResult.projection}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="month" tick={{fontSize: 10}} />
                            <YAxis tick={{fontSize: 10}} />
                            <Tooltip />
                            <Area type="monotone" dataKey="revenue" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.1} strokeWidth={3} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-4">
                        <div className="p-6 bg-blue-600 rounded-3xl text-white shadow-xl shadow-blue-500/20">
                           <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Target Revenue</p>
                           <p className="text-3xl font-black">${projectionResult.targetRevenue.toLocaleString()}</p>
                        </div>
                        <div className="p-6 bg-white border border-slate-200 rounded-3xl">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Strategy Confidence</p>
                           <p className="text-2xl font-black text-slate-800">92.4%</p>
                        </div>
                      </div>
                   </div>

                   <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                     <h4 className="text-blue-800 font-black text-xs uppercase tracking-widest mb-2 flex items-center">
                       <span className="mr-2">✨</span> Gemini Executive Summary
                     </h4>
                     <p className="text-blue-900 leading-relaxed font-medium">
                       {projectionResult.summary}
                     </p>
                   </div>
                </div>

                <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex flex-col md:flex-row gap-4">
                  <button 
                    onClick={handleSaveStrategy}
                    disabled={isSaving || showSaveSuccess}
                    className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl disabled:opacity-50"
                  >
                    {isSaving ? 'Processing...' : showSaveSuccess ? 'Strategy Saved! ✓' : 'Add to Strategic Library'}
                  </button>
                  <button 
                    onClick={() => setIsProjecting(false)}
                    className="flex-1 py-4 border-2 border-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all"
                  >
                    Close Analysis
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
