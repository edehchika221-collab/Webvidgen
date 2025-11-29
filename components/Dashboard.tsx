import React from 'react';
import { Trash2, Play, AlertCircle, Clock, ExternalLink, Mic, Sparkles } from 'lucide-react';
import { GeneratedVideo } from '../types';

interface DashboardProps {
  videos: GeneratedVideo[];
  onDelete: (id: string) => void;
  onPlay: (video: GeneratedVideo) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ videos, onDelete, onPlay }) => {
  if (videos.length === 0) return null;

  // Sort by newest first
  const sortedVideos = [...videos].sort((a, b) => b.timestamp - a.timestamp);

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-20 px-4 animate-fade-in pb-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Clock size={24} className="text-indigo-500" />
          Video Library
          <span className="text-sm font-normal text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full ml-2">
            {videos.length}
          </span>
        </h2>
      </div>
      
      <div className="grid gap-4">
        {sortedVideos.map((video) => (
          <div 
            key={video.id}
            className="group flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-4 mb-4 md:mb-0 overflow-hidden w-full md:w-auto flex-1 mr-4">
              <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0 text-indigo-600 dark:text-indigo-400 font-bold text-xs mt-1 border border-indigo-200 dark:border-indigo-800">
                {video.aspectRatio}
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex items-center gap-2">
                    <a 
                        href={video.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-semibold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 truncate max-w-xs md:max-w-md flex items-center gap-1 group/link transition-colors"
                        title="Open website in new tab"
                    >
                        {video.url}
                        <ExternalLink size={12} className="opacity-0 group-hover/link:opacity-100 transition-opacity text-slate-400" />
                    </a>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(video.timestamp).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      {formatDuration(video.duration || 15)}
                    </span>
                </div>
                
                {/* Details Section */}
                <div className="flex flex-col gap-2 w-full md:max-w-lg">
                    {video.promptUsed && (
                        <div className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/30 p-2 rounded border border-slate-100 dark:border-slate-700/50">
                            <span className="font-semibold text-indigo-500/80 dark:text-indigo-400/80 block mb-0.5 text-[10px] uppercase tracking-wider flex items-center gap-1">
                                <Sparkles size={10} /> Style Prompt
                            </span>
                            <p className="line-clamp-2 leading-relaxed" title={video.promptUsed}>{video.promptUsed}</p>
                        </div>
                    )}
                    
                    {video.script && (
                         <div className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/30 p-2 rounded border border-slate-100 dark:border-slate-700/50">
                            <span className="font-semibold text-pink-500/80 dark:text-pink-400/80 block mb-0.5 text-[10px] uppercase tracking-wider flex items-center gap-1">
                                <Mic size={10} /> Script
                            </span>
                            <p className="line-clamp-2 leading-relaxed italic" title={video.script}>"{video.script}"</p>
                        </div>
                    )}
                </div>

              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 border-slate-100 dark:border-slate-700 pt-3 md:pt-0 shrink-0 self-start md:self-center">
              {!video.videoUrl ? (
                <div className="flex items-center gap-2 mr-2" title="Video link expired">
                   <span className="text-xs text-slate-400 flex items-center gap-1">
                    <AlertCircle size={12} /> Link Expired
                  </span>
                </div>
              ) : (
                <button 
                  onClick={() => onPlay(video)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors whitespace-nowrap"
                >
                  <Play size={14} /> Play
                </button>
              )}
              
              <button 
                onClick={() => onDelete(video.id)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Delete from history"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};