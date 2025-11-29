import React from 'react';
import { Video, Sun, Moon, Key } from 'lucide-react';
import { Button } from './ui/Button';

interface HeaderProps {
    darkMode: boolean;
    setDarkMode: (value: boolean) => void;
    isApiKeyReady: boolean;
    onConnectKey: () => void;
    onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
    darkMode,
    setDarkMode,
    isApiKeyReady,
    onConnectKey,
    onReset
}) => {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-all duration-300">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={onReset}
                >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/30 transition-all duration-300 group-hover:scale-105">
                        <Video size={18} className="text-white" />
                    </div>
                    <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
                        WebVidGen
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200"
                        aria-label="Toggle Dark Mode"
                    >
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {!isApiKeyReady && (
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={onConnectKey}
                            icon={<Key size={14} />}
                        >
                            Connect API Key
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
};
