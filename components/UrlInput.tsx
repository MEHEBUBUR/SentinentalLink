import React, { useState } from 'react';
import { Search, Globe, AlertTriangle } from 'lucide-react';

interface UrlInputProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

const UrlInput: React.FC<UrlInputProps> = ({ onAnalyze, isLoading }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const validateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Please enter a link to check.');
      return;
    }

    let formattedUrl = url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    try {
      new URL(formattedUrl);
      onAnalyze(formattedUrl);
    } catch (err) {
      setError('The link does not look right. Please check the format.');
    }
  };

  return (
    <div className="w-full relative z-20">
      <form onSubmit={validateAndSubmit} className="relative group">
        
        {/* Glow effect behind the input */}
        <div className="absolute -inset-1 bg-gradient-to-r from-brand-accent to-indigo-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
        
        <div className="relative flex items-center bg-brand-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl transition-all duration-300 group-hover:border-brand-accent/30 group-hover:bg-brand-900/90">
            <div className="pl-4 pr-3 text-slate-500 group-hover:text-brand-accent transition-colors duration-300">
                <Globe className="h-6 w-6" />
            </div>
            
            <input
                type="text"
                className="flex-grow bg-transparent text-white placeholder-slate-500 py-4 px-2 text-lg focus:outline-none font-light"
                placeholder="Paste a URL to scan (e.g., google.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
            />
            
            <button
                type="submit"
                disabled={isLoading}
                className="ml-2 px-8 py-4 bg-gradient-to-r from-brand-accent to-indigo-600 hover:from-brand-accentHover hover:to-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-brand-accent/25 hover:shadow-brand-accent/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
            >
                {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <>
                    Scan <Search className="w-4 h-4 ml-2" />
                    </>
                )}
            </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 flex items-center justify-center gap-2 text-red-400 text-sm font-medium animate-fade-in bg-red-500/10 py-2 px-4 rounded-lg border border-red-500/20 inline-block">
          <AlertTriangle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default UrlInput;