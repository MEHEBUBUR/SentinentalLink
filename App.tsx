import React, { useState } from 'react';
import { ShieldCheck, Lock, Globe, History, ChevronRight, Zap } from 'lucide-react';
import UrlInput from './components/UrlInput';
import AnalysisResultCard from './components/AnalysisResultCard';
import ThreatTicker from './components/ThreatTicker';
import { analyzeUrlWithGemini } from './services/geminiService';
import { AnalysisResult, HistoryItem } from './types';

function App() {
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [viewHistory, setViewHistory] = useState(false);

  const handleAnalyze = async (url: string) => {
    setIsLoading(true);
    setCurrentResult(null);
    setViewHistory(false);

    try {
      const result = await analyzeUrlWithGemini(url);
      setCurrentResult(result);
      
      // Add to history
      setHistory(prev => [
        { ...result, id: crypto.randomUUID() },
        ...prev
      ].slice(0, 10)); // Keep last 10
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentResult(null);
  };

  return (
    <div className="min-h-screen bg-brand-950 text-slate-200 font-sans flex flex-col selection:bg-brand-accent selection:text-white overflow-x-hidden">
      
      {/* Background Layers */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Cyber Grid */}
        <div className="absolute inset-0 cyber-grid opacity-30"></div>
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand-accent/10 rounded-full blur-[120px] -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[100px] translate-y-1/3"></div>
      </div>

      {/* Navigation Bar */}
      <header className="relative z-20 border-b border-white/5 bg-brand-950/70 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setCurrentResult(null)}>
            <div className="w-9 h-9 bg-gradient-to-br from-brand-accent to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-brand-accent/20 group-hover:scale-105 transition-transform duration-300">
              <ShieldCheck className="text-white w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold tracking-tight text-white leading-none">SentinelLink</h1>
              <span className="text-[9px] text-brand-400 uppercase tracking-[0.2em] font-bold mt-0.5">Enterprise Intelligence</span>
            </div>
          </div>
          
          <button 
            onClick={() => setViewHistory(!viewHistory)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-900/50 hover:bg-brand-800 text-slate-400 hover:text-white border border-white/5 hover:border-white/10 transition-all text-sm font-medium"
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">Scan History</span>
          </button>
        </div>
      </header>

      {/* Global Threat Ticker */}
      <ThreatTicker />

      {/* Main Content Area */}
      <main className="relative z-10 flex-grow flex flex-col px-4 sm:px-6 lg:px-8 py-12">
        
        {viewHistory ? (
           <div className="max-w-5xl mx-auto w-full animate-fade-in">
              <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Scan History</h2>
                  <p className="text-sm text-slate-400">Recent analysis reports and safety scores.</p>
                </div>
                <button 
                  onClick={() => setViewHistory(false)}
                  className="px-4 py-2 text-sm text-white bg-brand-accent hover:bg-brand-accentHover rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg shadow-brand-accent/20"
                >
                  New Scan <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="glass-panel rounded-xl overflow-hidden shadow-2xl">
                {history.length === 0 ? (
                  <div className="p-16 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-brand-900/50 rounded-full flex items-center justify-center mb-6">
                      <History className="w-8 h-8 text-brand-600" />
                    </div>
                    <h3 className="text-white font-medium text-lg mb-2">No scans yet</h3>
                    <p className="text-brand-400 max-w-sm">Your recent URL analysis history will appear here once you perform a scan.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                      <thead className="bg-brand-900/50 text-slate-200 font-semibold border-b border-white/5">
                        <tr>
                          <th className="px-6 py-4">Time</th>
                          <th className="px-6 py-4">Analyzed Link</th>
                          <th className="px-6 py-4">Verdict</th>
                          <th className="px-6 py-4 text-right">Risk Score</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {history.map((item) => (
                          <tr key={item.id} className="hover:bg-brand-800/30 transition-colors">
                            <td className="px-6 py-4 font-mono text-xs text-brand-500">{new Date(item.analyzedAt).toLocaleTimeString()}</td>
                            <td className="px-6 py-4 max-w-[200px] sm:max-w-md truncate text-slate-300 font-medium">{item.url}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold tracking-wide
                                ${item.riskLevel === 'SAFE' ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20' : 
                                  item.riskLevel === 'SUSPICIOUS' ? 'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20' : 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20'}`}>
                                {item.riskLevel}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className="font-mono text-white font-bold">{item.riskScore}</span>
                              <span className="text-slate-600 text-xs ml-1">/100</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
           </div>
        ) : (
          <>
            {!currentResult ? (
              <div className="flex-grow flex flex-col items-center justify-center -mt-6">
                <div className="text-center mb-12 max-w-4xl mx-auto space-y-8 animate-fade-in">
                  
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-900/40 border border-brand-700/50 backdrop-blur-sm text-xs font-medium text-brand-accent shadow-[0_0_15px_rgba(59,130,246,0.1)] mb-4">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent"></span>
                    </span>
                    <span className="tracking-wide">AI-POWERED THREAT INTELLIGENCE v3.0</span>
                  </div>
                  
                  <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1]">
                    Verify Links with <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                      Precision AI
                    </span>
                  </h2>
                  <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
                    Instantly analyze URLs for phishing, malware, and brand impersonation using advanced heuristic scanning and Gemini models.
                  </p>
                </div>

                <div className="w-full max-w-2xl animate-fade-in" style={{animationDelay: '0.1s'}}>
                  <UrlInput onAnalyze={handleAnalyze} isLoading={isLoading} />
                </div>

                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl animate-fade-in" style={{animationDelay: '0.2s'}}>
                   
                   {/* Feature 1 */}
                   <div className="group p-8 rounded-2xl glass-panel hover:bg-brand-900/60 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-500/20 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-[50px] transition-opacity group-hover:opacity-100 opacity-0"></div>
                      <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                        <Lock className="w-6 h-6 text-emerald-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">Deep Analysis</h3>
                      <p className="text-slate-400 leading-relaxed">Advanced heuristic scanning checks for hidden redirects, obfuscated code, and zero-day threats.</p>
                   </div>
                   
                   {/* Feature 2 */}
                   <div className="group p-8 rounded-2xl glass-panel hover:bg-brand-900/60 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-500/20 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-[50px] transition-opacity group-hover:opacity-100 opacity-0"></div>
                      <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                        <Globe className="w-6 h-6 text-blue-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">Global Intelligence</h3>
                      <p className="text-slate-400 leading-relaxed">Cross-referenced against a global database of known phishing sites and malicious domains.</p>
                   </div>

                   {/* Feature 3 */}
                   <div className="group p-8 rounded-2xl glass-panel hover:bg-brand-900/60 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/20 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-[50px] transition-opacity group-hover:opacity-100 opacity-0"></div>
                      <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors">
                        <Zap className="w-6 h-6 text-indigo-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">Real-time AI</h3>
                      <p className="text-slate-400 leading-relaxed">Powered by Google Gemini to understand context, identify scams, and explain threats in plain English.</p>
                   </div>

                </div>
              </div>
            ) : (
              <AnalysisResultCard result={currentResult} onReset={handleReset} />
            )}
          </>
        )}

      </main>

      {/* Professional Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-brand-950 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center text-center">
          
          <div className="flex items-center gap-2 mb-6 opacity-75">
            <div className="w-6 h-6 bg-brand-accent/20 rounded flex items-center justify-center">
              <ShieldCheck className="text-brand-accent w-4 h-4" />
            </div>
            <span className="text-brand-100 font-bold tracking-tight">SentinelLink</span>
          </div>

          <div className="mb-8 max-w-md mx-auto">
             <p className="text-slate-400 text-sm">
                Developing the next generation of web security tools for a safer internet experience.
             </p>
          </div>

          <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-brand-800 to-transparent my-6"></div>

          <div className="flex flex-col items-center gap-4">
             <div className="flex flex-col sm:flex-row items-center gap-2 text-sm text-slate-500">
                <span>Created by</span>
                <span className="text-white font-medium">Mehebubur Rahman</span>
                <span className="hidden sm:inline text-brand-700">&</span>
                <span className="text-white font-medium">Rudradev Choudhury</span>
             </div>
             <a 
                href="https://barpeta.kvs.ac.in/en/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-brand-500 hover:text-brand-400 transition-colors flex items-center gap-1.5 hover:underline"
              >
                PM SHRI Kendriya Vidyalaya, Barpeta
                <ChevronRight className="w-3 h-3" />
              </a>
             <p className="text-brand-800 text-[10px] mt-2">
                © {new Date().getFullYear()} SentinelLink. All rights reserved.
             </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;