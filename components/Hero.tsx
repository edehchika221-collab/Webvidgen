import React from 'react';
import { Sparkles, Link as LinkIcon, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface HeroProps {
    urlInput: string;
    setUrlInput: (url: string) => void;
    handleGenerate: () => void;
    isProcessing: boolean;
    isApiKeyReady: boolean;
    children?: React.ReactNode; // For ConfigPanel
}

export const Hero: React.FC<HeroProps> = ({
    urlInput,
    setUrlInput,
    handleGenerate,
    isProcessing,
    isApiKeyReady,
    children
}) => {
    return (
        <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-8 border border-indigo-100 dark:border-indigo-800/30 shadow-sm">
                <Sparkles size={12} />
                Powered by Gemini Veo
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 leading-tight tracking-tight">
                Turn Any Website <br className="hidden md:block" /> Into a Video
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                Paste a URL and let our AI analyze the content to generate a high-quality preview video with optional narration.
            </p>

            {/* Input Area */}
            <div className="relative max-w-xl mx-auto flex flex-col gap-4">
                <div className="relative flex items-center">
                    <Input
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="https://your-website.com"
                        disabled={isProcessing}
                        icon={<LinkIcon size={20} />}
                        className="!py-4 !pl-12 !text-lg !rounded-2xl shadow-xl border-slate-200 dark:border-slate-700"
                    />

                    <div className="absolute right-2 top-2 bottom-2">
                        <Button
                            onClick={handleGenerate}
                            disabled={isProcessing}
                            isLoading={isProcessing}
                            size="lg"
                            className="h-full !rounded-xl !px-6 shadow-none hover:shadow-md"
                            icon={!isProcessing ? <ArrowRight size={18} /> : undefined}
                        >
                            {isProcessing ? 'Processing' : 'Generate'}
                        </Button>
                    </div>
                </div>

                {!isApiKeyReady && (
                    <div className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-500 text-sm bg-amber-50 dark:bg-amber-900/10 p-2 rounded-lg border border-amber-100 dark:border-amber-900/20">
                        <AlertCircle size={14} />
                        <span>Paid API Key required for Veo generation.</span>
                    </div>
                )}
            </div>

            {children}
        </div>
    );
};
