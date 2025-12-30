import { InputHTMLAttributes } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    description?: string;
}

export default function FormInput({ label, error, description, className = '', id, ...props }: FormInputProps) {
    const inputId = id || props.name || Math.random().toString(36).substr(2, 9);
    
    return (
        <div className={className}>
            {label && (
                <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {label} {props.required && <span className="text-red-500">*</span>}
                </label>
            )}
            
            <input
                id={inputId}
                className={`w-full px-4 py-2.5 bg-white dark:bg-[#1a2744] border rounded-xl focus:ring-4 transition-all duration-200 ${
                    error 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100 dark:focus:ring-red-900/30' 
                        : 'border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:ring-primary-100 dark:focus:ring-primary-900/30'
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
