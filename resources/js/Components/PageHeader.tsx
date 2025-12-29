import { Link } from '@inertiajs/react';
import { Plus, type LucideIcon } from 'lucide-react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    action?: {
        label: string;
        href: string;
        icon?: LucideIcon;
    };
    children?: React.ReactNode;
}

/**
 * PageHeader Component
 * 
 * Consistent page header with title, subtitle, and optional action button.
 */
export default function PageHeader({ 
    title, 
    subtitle, 
    action,
    children 
}: PageHeaderProps) {
    const ActionIcon = action?.icon || Plus;

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                {subtitle && (
                    <p className="text-gray-500 mt-1">{subtitle}</p>
                )}
            </div>
            
            <div className="flex items-center gap-3">
                {children}
                {action && (
                    <Link
                        href={action.href}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm"
                    >
                        <ActionIcon className="w-4 h-4" />
                        {action.label}
                    </Link>
                )}
            </div>
        </div>
    );
}
