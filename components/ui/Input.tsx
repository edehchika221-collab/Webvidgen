import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({
    icon,
    label,
    error,
    className = '',
    ...props
}) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                {icon && (
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                        {icon}
                    </div>
                )}
                <input
                    className={`
            w-full bg-white dark:bg-slate-800 
            border border-slate-200 dark:border-slate-700 
            rounded-xl py-3 ${icon ? 'pl-12' : 'pl-4'} pr-4
            text-slate-900 dark:text-white placeholder:text-slate-400
            shadow-sm transition-all duration-200
            focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:outline-none
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' : ''}
            ${className}
          `}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1.5 ml-1 text-xs text-red-500 font-medium animate-fade-in">
                    {error}
                </p>
            )}
        </div>
    );
};
