import { TextareaHTMLAttributes } from 'react';

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    description?: string;
}

export default function FormTextarea({ label, error, description, className = '', id, ...props }: FormTextareaProps) {
    const textareaId = id || props.name || Math.random().toString(36).substr(2, 9);
    
    return (
        <div className={className}>
            {label && (
                <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {label} {props.required && <span className="text-red-500">*</span>}
                </label>
            )}
            
            <textarea
                id={textareaId}
                className={`w-full px-4 py-2 bg-white dark:bg-[#1a2744] border rounded-lg focus:ring-2 focus:ring-primary-500 transition-shadow ${
                    error 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-[#1e3a5f] focus:border-primary-500'
                } text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
                {...props}
            />
            
            {description && !error && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
            )}
            
            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
}
