import { HTMLAttributes } from 'react';

interface FormCardProps extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export default function FormCard({ children, className = '', ...props }: FormCardProps) {
    return (
        <div 
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
