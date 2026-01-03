import React from 'react';
import { AlertTriangle } from 'lucide-react';

const threats = [
  "SUSPICIOUS ACTIVITY: secure-login-verify.com analyzed (Score: 85)",
  "MALWARE BLOCKED: drive-update-x86.exe detected in traffic",
  "PHISHING: amaz0n-support-center.net flagged (Score: 92)",
  "SCAM ALERT: crypto-doubler-giveaway.xyz identified",
  "IMPERSONATION: account-security-meta.com (Score: 88)",
  "NETWORK THREAT: 192.168.x.x malicious callback blocked",
  "DATA EXFILTRATION: cloud-storage-verify.info blocked",
  "FRAUD: cheap-iphone-deal-today.top (Score: 95)"
];

const ThreatTicker: React.FC = () => {
  return (
    <div className="bg-brand-950/80 border-b border-brand-800 h-8 overflow-hidden relative z-10 backdrop-blur-md flex items-center">
      {/* Gradient fade effect on sides */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-brand-950 to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-brand-950 to-transparent z-20 pointer-events-none" />
      
      {/* Static Label */}
      <div className="flex items-center gap-2 px-4 border-r border-brand-800 z-30 bg-brand-950 h-full shadow-[5px_0_15px_-5px_rgba(0,0,0,0.5)]">
         <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
         </div>
         <span className="text-[10px] font-bold tracking-wider text-red-500 uppercase whitespace-nowrap hidden sm:block">Live Threats</span>
         <span className="text-[10px] font-bold tracking-wider text-red-500 uppercase whitespace-nowrap sm:hidden">Live</span>
      </div>

      {/* Scrolling Ticker */}
      <div className="animate-ticker flex items-center">
        {/* Tripled content to ensure smooth looping for CSS translate */}
        {[...threats, ...threats, ...threats].map((threat, i) => (
          <div key={i} className="flex items-center gap-2 px-8 border-r border-brand-800/30 last:border-0">
            <AlertTriangle className="w-3 h-3 text-brand-600" />
            <span className="text-xs font-mono text-slate-400 whitespace-nowrap">{threat}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThreatTicker;