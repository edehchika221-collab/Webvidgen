import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="border-t border-slate-200 dark:border-slate-800 py-8 text-center text-slate-500 text-sm mt-auto bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm">
            <p className="flex items-center justify-center gap-2">
                &copy; {new Date().getFullYear()} WebVidGen.
                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                Powered by Google Gemini Veo
            </p>
        </footer>
    );
};
