import React from 'react';
import { Mic, Globe } from 'lucide-react';
import { Card } from './ui/Card';
import { VoiceOption, LanguageOption, VOICE_OPTIONS, LANGUAGE_OPTIONS } from '../types';

interface ConfigPanelProps {
    aspectRatio: '16:9' | '9:16';
    setAspectRatio: (ratio: '16:9' | '9:16') => void;
    enableVoiceover: boolean;
    setEnableVoiceover: (enable: boolean) => void;
    selectedVoice: VoiceOption;
    setSelectedVoice: (voice: VoiceOption) => void;
    selectedLanguage: LanguageOption;
    setSelectedLanguage: (lang: LanguageOption) => void;
    isProcessing: boolean;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
    aspectRatio,
    setAspectRatio,
    enableVoiceover,
    setEnableVoiceover,
    selectedVoice,
    setSelectedVoice,
    selectedLanguage,
    setSelectedLanguage,
    isProcessing
}) => {
    return (
        <div className="flex flex-col md:flex-row justify-center gap-4 mt-8 items-stretch animate-fade-in-up delay-100">
            {/* Aspect Ratio */}
            <Card className="flex items-center gap-3 p-2 pr-3" glass>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-bold px-2 uppercase tracking-wider">Size</span>
                <div className="flex bg-slate-100 dark:bg-slate-700/50 p-1 rounded-lg">
                    {(['16:9', '9:16'] as const).map((ratio) => (
                        <button
                            key={ratio}
                            onClick={() => setAspectRatio(ratio)}
                            disabled={isProcessing}
                            className={`
                px-3 py-1.5 text-xs rounded-md transition-all duration-200 font-medium
                ${aspectRatio === ratio
                                    ? 'bg-white dark:bg-slate-600 shadow-sm text-indigo-600 dark:text-indigo-400'
                                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}
              `}
                        >
                            {ratio}
                        </button>
                    ))}
                </div>
            </Card>

            {/* Voiceover Config */}
            <Card className="flex flex-col sm:flex-row items-center gap-3 p-2" glass>
                <div className="flex items-center gap-3 border-r border-slate-200 dark:border-slate-700/50 pr-4 pl-2 h-full">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <Mic size={12} /> Voiceover
                    </span>

                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={enableVoiceover}
                            onChange={(e) => setEnableVoiceover(e.target.checked)}
                            disabled={isProcessing}
                        />
                        <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                    </label>
                </div>

                {enableVoiceover && (
                    <div className="flex gap-2 animate-fade-in pr-1">
                        {/* Voice Selector */}
                        <select
                            value={selectedVoice}
                            onChange={(e) => setSelectedVoice(e.target.value as VoiceOption)}
                            disabled={isProcessing}
                            className="text-xs bg-slate-100 dark:bg-slate-700/50 border-none rounded-lg py-1.5 pl-2 pr-6 focus:ring-1 focus:ring-indigo-500 cursor-pointer text-slate-700 dark:text-slate-200 font-medium"
                            title="Select Voice Style"
                        >
                            {VOICE_OPTIONS.map(v => (
                                <option key={v} value={v}>{v}</option>
                            ))}
                        </select>

                        {/* Language Selector */}
                        <div className="relative">
                            <select
                                value={selectedLanguage}
                                onChange={(e) => setSelectedLanguage(e.target.value as LanguageOption)}
                                disabled={isProcessing}
                                className="text-xs bg-slate-100 dark:bg-slate-700/50 border-none rounded-lg py-1.5 pl-7 pr-6 focus:ring-1 focus:ring-indigo-500 cursor-pointer appearance-none text-slate-700 dark:text-slate-200 font-medium"
                                title="Select Language"
                            >
                                {LANGUAGE_OPTIONS.map(l => (
                                    <option key={l} value={l}>{l}</option>
                                ))}
                            </select>
                            <Globe size={10} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};
