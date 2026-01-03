import React from 'react';
import { AnalysisResult, RiskLevel } from '../types';
import RiskMeter from './RiskMeter';
import { ShieldCheck, ShieldAlert, ShieldX, FileSearch, Terminal, ArrowLeft, Share2, Download } from 'lucide-react';

interface AnalysisResultCardProps {
  result: AnalysisResult;
  onReset: () => void;
}

const AnalysisResultCard: React.FC<AnalysisResultCardProps> = ({ result, onReset }) => {
  
  const getSeverityConfig = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.SAFE:
        return {
          icon: <ShieldCheck className="w-8 h-8 text-emerald-400" />,
          color: "text-emerald-400",
          borderColor: "border-emerald-500/30",
          shadowColor: "shadow-emerald-500/20",
          bgColor: "bg-emerald-500/5",
          label: "VERIFIED SAFE"
        };
      case RiskLevel.SUSPICIOUS:
        return {
          icon: <ShieldAlert className="w-8 h-8 text-amber-400" />,
          color: "text-amber-400",
          borderColor: "border-amber-500/30",
          shadowColor: "shadow-amber-500/20",
          bgColor: "bg-amber-500/5",
          label: "SUSPICIOUS ACTIVITY"
        };
      case RiskLevel.MALICIOUS:
        return {
          icon: <ShieldX className="w-8 h-8 text-red-500" />,
          color: "text-red-500",
          borderColor: "border-red-500/30",
          shadowColor: "shadow-red-500/20",
          bgColor: "bg-red-500/5",
          label: "MALICIOUS THREAT"
        };
      default:
        return {
          icon: <FileSearch className="w-8 h-8 text-slate-400" />,
          color: "text-slate-400",
          borderColor: "border-slate-500/30",
          shadowColor: "shadow-slate-500/20",
          bgColor: "bg-slate-500/5",
          label: "UNCERTAIN STATUS"
        };
    }
  };

  const config = getSeverityConfig(result.riskLevel);

  return (
    <div className="w-full max-w-6xl mx-auto animate-pop-in pb-10">
      
      {/* Top Bar Actions */}
      <div className="mb-8 flex items-center justify-between opacity-0 animate-fade-in" style={{ animationDelay: '150ms' }}>
        <button 
          onClick={onReset}
          className="group flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors bg-brand-900/50 hover:bg-brand-800 px-4 py-2 rounded-lg border border-white/5"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Check Another Link</span>
        </button>
        <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-mono hidden sm:inline-block">ID: {crypto.randomUUID().split('-')[0].toUpperCase()}</span>
            <button className="p-2 text-slate-400 hover:text-white bg-brand-900/50 rounded-lg hover:bg-brand-800 transition-colors border border-white/5">
                <Share2 className="w-4 h-4" />
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Main Verdict (4 cols) */}
        <div 
          className={`col-span-1 lg:col-span-4 rounded-2xl border ${config.borderColor} ${config.bgColor} backdrop-blur-md p-8 flex flex-col items-center text-center relative overflow-hidden shadow-2xl ${config.shadowColor} opacity-0 animate-fade-in`}
          style={{ animationDelay: '300ms' }}
        >
          {/* Decorative background glow */}
          <div className={`absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-current to-transparent opacity-10 ${config.color} blur-xl pointer-events-none`}></div>
          
          <div className="relative mb-6 p-4 bg-brand-950 rounded-full border border-brand-800 shadow-xl">
            {config.icon}
          </div>
          
          <h2 className={`text-2xl font-black tracking-tight ${config.color} mb-2 uppercase`}>{config.label}</h2>
          <div className="w-full bg-brand-950/50 rounded-lg p-3 border border-brand-800/50 mb-8">
            <p className="text-slate-300 text-xs font-mono break-all">{result.url}</p>
          </div>
          
          <div className="w-48 h-48 relative">
             <RiskMeter score={result.riskScore} level={result.riskLevel} />
          </div>
          
          <div className="mt-auto w-full pt-6 border-t border-brand-800/30">
            <div className="flex flex-col gap-1">
               <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Threat Classification</span>
               <span className="text-white font-bold text-lg">{result.threatType}</span>
            </div>
          </div>
        </div>

        {/* Right Col: Intelligence Details (8 cols) */}
        <div className="col-span-1 lg:col-span-8 flex flex-col gap-6">
          
          {/* Executive Summary Card */}
          <div 
            className="bg-brand-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-xl opacity-0 animate-fade-in"
            style={{ animationDelay: '450ms' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-brand-accent/10 rounded-lg border border-brand-accent/20">
                <FileSearch className="w-5 h-5 text-brand-accent" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-wide">Executive Summary</h3>
            </div>
            <p className="text-slate-300 leading-relaxed text-base font-light border-l-2 border-brand-700 pl-4">
              {result.explanation}
            </p>
          </div>

          {/* Technical Indicators Card */}
          <div 
            className="bg-brand-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex-grow shadow-xl opacity-0 animate-fade-in"
            style={{ animationDelay: '600ms' }}
          >
             <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-brand-500/10 rounded-lg border border-brand-500/20">
                <Terminal className="w-5 h-5 text-brand-400" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-wide">Technical Indicators</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {result.technicalFlags.length > 0 ? (
                result.technicalFlags.map((flag, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-brand-950/50 border border-brand-800/60 hover:border-brand-700 transition-colors">
                    <div className={`mt-1.5 w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] flex-shrink-0 ${result.riskLevel === RiskLevel.SAFE ? 'bg-emerald-500 text-emerald-500' : 'bg-red-500 text-red-500'}`} />
                    <span className="text-sm text-slate-300 font-medium leading-relaxed">{flag}</span>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-slate-500 text-sm italic py-4 text-center border border-dashed border-brand-800 rounded-xl">
                    No specific technical flags raised by the scanning engine.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnalysisResultCard;