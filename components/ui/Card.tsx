import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    glass?: boolean;
    hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    glass = false,
    hover = false
}) => {
    const baseStyles = "rounded-2xl border transition-all duration-300";

    const styles = glass
        ? "bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl"
        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg";

    const hoverStyles = hover
        ? "hover:-translate-y-1 hover:shadow-2xl hover:border-indigo-500/30 dark:hover:border-indigo-500/30"
        : "";

    return (
        <div className={`${baseStyles} ${styles} ${hoverStyles} ${className}`}>
            {children}
        </div>
    );
};
