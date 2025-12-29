import { PropsWithChildren } from 'react';

interface CardProps extends PropsWithChildren {
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

interface CardHeaderProps extends PropsWithChildren {
    title?: string;
    subtitle?: string;
    action?: React.ReactNode;
}

/**
 * Card Component
 * 
 * Base card wrapper with consistent styling.
 */
export function Card({ children, className = '', padding = 'md' }: CardProps) {
    const paddingStyles = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    return (
        <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${paddingStyles[padding]} ${className}`}>
            {children}
        </div>
    );
}

/**
 * Card Header Component
 * 
 * Header section with title, subtitle, and optional action.
 */
export function CardHeader({ title, subtitle, action, children }: CardHeaderProps) {
    if (children) {
        return (
            <div className="flex items-center justify-between mb-4">
                {children}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between mb-4">
            <div>
                {title && <h2 className="text-lg font-semibold text-gray-900">{title}</h2>}
                {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}

/**
 * Card Body Component
 * 
 * Content section of the card.
 */
export function CardBody({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
    return (
        <div className={className}>
            {children}
        </div>
    );
}
