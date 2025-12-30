import { SelectHTMLAttributes } from 'react';

interface Option {
    value: string | number;
    label: string;
}

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    description?: string;
    options?: Option[];
    placeholder?: string;
}

export default function FormSelect({ 
    label, 
    error, 
    description, 
    options = [], 
    placeholder = 'Select an option', 
    className = '', 
    id, 
    children, 
    ...props 
}: FormSelectProps) {
    const selectId = id || props.name || Math.random().toString(36).substr(2, 9);
    
    return (
        <div className={className}>
            {label && (
                <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {label} {props.required && <span className="text-red-500">*</span>}
                </label>
            )}
            
            <select
                id={selectId}
                className={`w-full px-4 py-2 bg-white dark:bg-[#1a2744] border rounded-lg focus:ring-2 focus:ring-primary-500 transition-shadow ${
                    error 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-[#1e3a5f] focus:border-primary-500'
                } text-gray-900 dark:text-white`}
                {...props}
            >
                <option value="">{placeholder}</option>
                {options.length > 0 ? (
                    options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))
                ) : (
                    children
                )}
            </select>
            
            {description && !error && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
            )}
            
            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
}
