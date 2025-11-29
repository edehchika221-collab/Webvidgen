import React from 'react';
import { Sparkles, X, Play } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface PromptEditorProps {
    isOpen: boolean;
    prompt: string;
    onPromptChange: (value: string) => void;
    onConfirm: () => void;
    onCancel: () => void;
    isGenerating: boolean;
}

export const PromptEditor: React.FC<PromptEditorProps> = ({
    isOpen,
    prompt,
    onPromptChange,
    onConfirm,
    onCancel,
    isGenerating
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
            <Card className="w-full max-w-2xl bg-white dark:bg-slate-900 shadow-2xl border-slate-200 dark:border-slate-700 overflow-hidden animate-scale-in">
                <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold">
                        <Sparkles size={18} />
                        <h3>Review AI Prompt</h3>
                    </div>
                    <button
                        onClick={onCancel}
                        className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        Our AI analyzed your website and created this prompt for the video generation.
                        You can edit it to adjust the style or focus.
                    </p>

                    <div className="relative">
                        <textarea
                            value={prompt}
                            onChange={(e) => onPromptChange(e.target.value)}
                            className="w-full h-40 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none font-mono text-sm text-slate-700 dark:text-slate-300 leading-relaxed"
                            placeholder="Enter your video prompt here..."
                            disabled={isGenerating}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                    <Button
                        variant="ghost"
                        onClick={onCancel}
                        disabled={isGenerating}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        isLoading={isGenerating}
                        icon={<Play size={16} className="fill-current" />}
                    >
                        Generate Video
                    </Button>
                </div>
            </Card>
        </div>
    );
};
