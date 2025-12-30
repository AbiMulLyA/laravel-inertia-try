import React from 'react';

interface FormSectionProps {
    title?: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
}

export default function FormSection({ title, description, children, className = '' }: FormSectionProps) {
    return (
        <div className={`space-y-4 ${className}`}>
            {(title || description) && (
                <div className="mb-4">
                    {title && (
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
                    )}
                    {description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
                    )}
                </div>
            )}
            <div className="grid grid-cols-1 gap-6">
                {children}
            </div>
        </div>
    );
}
