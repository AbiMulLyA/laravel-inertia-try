import { type LucideIcon } from 'lucide-react';

type ColorVariant = 'primary' | 'secondary' | 'accent' | 'cyan' | 'purple';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    color?: ColorVariant;
    subtitle?: string;
}

/**
 * StatsCard Component
 * 
 * Modern stat card with:
 * - Colored left accent bar (Filament style)
 * - Icon with matching background
 * - Dark mode support
 */
export default function StatsCard({ 
    title, 
    value, 
    icon: Icon, 
    color = 'primary',
    subtitle 
}: StatsCardProps) {
    const colorStyles: Record<ColorVariant, { 
        accent: string; 
        iconBg: string; 
        iconBgDark: string;
        iconText: string; 
        iconTextDark: string;
    }> = {
        primary: {
            accent: 'bg-primary-500',
            iconBg: 'bg-primary-50',
            iconBgDark: 'dark:bg-primary-500/20',
            iconText: 'text-primary-600',
            iconTextDark: 'dark:text-primary-400',
        },
        secondary: {
            accent: 'bg-secondary-500',
            iconBg: 'bg-secondary-50',
            iconBgDark: 'dark:bg-secondary-500/20',
            iconText: 'text-secondary-600',
            iconTextDark: 'dark:text-secondary-400',
        },
        accent: {
            accent: 'bg-accent-500',
            iconBg: 'bg-accent-50',
            iconBgDark: 'dark:bg-accent-500/20',
            iconText: 'text-accent-600',
            iconTextDark: 'dark:text-accent-400',
        },
        cyan: {
            accent: 'bg-cyan-500',
            iconBg: 'bg-cyan-50',
            iconBgDark: 'dark:bg-cyan-500/20',
            iconText: 'text-cyan-600',
            iconTextDark: 'dark:text-cyan-400',
        },
        purple: {
            accent: 'bg-purple-500',
            iconBg: 'bg-purple-50',
            iconBgDark: 'dark:bg-purple-500/20',
            iconText: 'text-purple-600',
            iconTextDark: 'dark:text-purple-400',
        },
    };

    const styles = colorStyles[color];

    return (
        <div className="bg-theme-card rounded-xl border border-theme overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
            {/* Accent bar */}
            <div className={`h-1 ${styles.accent}`} />
            
            <div className="p-5">
                <div className="flex items-start justify-between">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${styles.iconBg} ${styles.iconBgDark}`}>
                        <Icon className={`w-6 h-6 ${styles.iconText} ${styles.iconTextDark}`} />
                    </div>
                </div>
                
                {/* Value and Title */}
                <div className="mt-4">
                    <p className="text-2xl font-bold text-theme-primary">{value}</p>
                    <p className="text-sm text-theme-secondary mt-1">{title}</p>
                    {subtitle && (
                        <p className="text-xs text-theme-muted mt-0.5">{subtitle}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

