import React, { useEffect, useState } from 'react';
import { Terminal, CheckCircle, Loader2 } from 'lucide-react';

interface LoadingTerminalProps {
  url: string;
  step: 'analyzing' | 'generating' | 'completed';
}

export const LoadingTerminal: React.FC<LoadingTerminalProps> = ({ url, step }) => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    setLogs([]); // Reset on new url
    
    const addLog = (msg: string, delay: number) => {
      setTimeout(() => {
        setLogs(prev => [...prev, msg]);
      }, delay);
    };

    if (step === 'analyzing') {
      addLog(`> Connecting to ${url}...`, 100);
      addLog(`> Fetching metadata...`, 800);
      addLog(`> Extracting color palette...`, 1500);
      addLog(`> Capturing layout structure...`, 2200);
    } 
    
    if (step === 'generating') {
      // Keep previous logs if possible, but for simplicity here we assume a flow
      addLog(`> Initializing Google Veo (v3.1)...`, 100);
      addLog(`> Constructing prompt from metadata...`, 1000);
      addLog(`> Rendering video frames... (this may take a minute)`, 2000);
    }

  }, [step, url]);

  return (
    <div className="w-full max-w-2xl mx-auto bg-slate-900 rounded-lg overflow-hidden font-mono text-sm shadow-2xl border border-slate-700">
      <div className="bg-slate-800 px-4 py-2 flex items-center gap-2 border-b border-slate-700">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="ml-4 text-slate-400 text-xs flex items-center gap-1">
          <Terminal size={12} />
          webvidgen-cli
        </div>
      </div>
      <div className="p-4 h-64 overflow-y-auto space-y-2">
        {logs.map((log, i) => (
          <div key={i} className="text-green-400 animate-fade-in">
            {log}
          </div>
        ))}
        {step === 'analyzing' && (
           <div className="flex items-center gap-2 text-indigo-400">
             <Loader2 size={14} className="animate-spin" />
             <span>Analyzing page content...</span>
           </div>
        )}
         {step === 'generating' && (
           <div className="flex items-center gap-2 text-pink-400">
             <Loader2 size={14} className="animate-spin" />
             <span>Generating video with Veo...</span>
           </div>
        )}
      </div>
    </div>
  );
};