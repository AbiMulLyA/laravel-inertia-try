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
 * - Tasikmalaya color variants
 */
export default function StatsCard({ 
    title, 
    value, 
    icon: Icon, 
    color = 'primary',
    subtitle 
}: StatsCardProps) {
    const colorStyles: Record<ColorVariant, { accent: string; iconBg: string; iconText: string }> = {
        primary: {
            accent: 'bg-primary-500',
            iconBg: 'bg-primary-50',
            iconText: 'text-primary-600',
        },
        secondary: {
            accent: 'bg-secondary-500',
            iconBg: 'bg-secondary-50',
            iconText: 'text-secondary-600',
        },
        accent: {
            accent: 'bg-accent-500',
            iconBg: 'bg-accent-50',
            iconText: 'text-accent-600',
        },
        cyan: {
            accent: 'bg-cyan-500',
            iconBg: 'bg-cyan-50',
            iconText: 'text-cyan-600',
        },
        purple: {
            accent: 'bg-purple-500',
            iconBg: 'bg-purple-50',
            iconText: 'text-purple-600',
        },
    };

    const styles = colorStyles[color];

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
            {/* Accent bar */}
            <div className={`h-1 ${styles.accent}`} />
            
            <div className="p-5">
                <div className="flex items-start justify-between">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${styles.iconBg}`}>
                        <Icon className={`w-6 h-6 ${styles.iconText}`} />
                    </div>
                </div>
                
                {/* Value and Title */}
                <div className="mt-4">
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    <p className="text-sm text-gray-500 mt-1">{title}</p>
                    {subtitle && (
                        <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
