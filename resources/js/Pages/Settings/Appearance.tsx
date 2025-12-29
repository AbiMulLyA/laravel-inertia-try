import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { PageHeader, Card } from '@/Components';
import { useTheme } from '@/Contexts/ThemeContext';
import { Sun, Moon, Monitor, Check } from 'lucide-react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeOption {
    value: Theme;
    label: string;
    description: string;
    icon: React.ElementType;
}

const themeOptions: ThemeOption[] = [
    {
        value: 'light',
        label: 'Light',
        description: 'Classic light theme with bright backgrounds',
        icon: Sun,
    },
    {
        value: 'dark',
        label: 'Dark',
        description: 'Easy on the eyes with dark backgrounds',
        icon: Moon,
    },
    {
        value: 'system',
        label: 'System',
        description: 'Automatically match your system preference',
        icon: Monitor,
    },
];

interface ColorInfo {
    name: string;
    label: string;
    hex: string;
    description: string;
}

const colorPalette: ColorInfo[] = [
    {
        name: 'Primary',
        label: 'Blue',
        hex: '#2563EB',
        description: 'Main actions and active states',
    },
    {
        name: 'Secondary',
        label: 'Green',
        hex: '#16A34A',
        description: 'Success states and positive indicators',
    },
    {
        name: 'Accent',
        label: 'Gold',
        hex: '#F59E0B',
        description: 'Highlights and warnings',
    },
];

/**
 * Settings Appearance Page
 * 
 * Theme selection with color palette info.
 */
export default function SettingsAppearance() {
    const { theme, setTheme } = useTheme();

    return (
        <AppLayout>
            <Head title="Appearance Settings" />

            <div className="space-y-6 max-w-3xl">
                {/* Header */}
                <PageHeader 
                    title="Appearance" 
                    subtitle="Customize how the application looks"
                />

                {/* Theme Selection */}
                <Card>
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-theme-primary mb-2">Theme</h3>
                        <p className="text-sm text-theme-secondary mb-6">
                            Select your preferred color scheme for the application.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {themeOptions.map((option) => {
                                const isSelected = theme === option.value;
                                const Icon = option.icon;

                                return (
                                    <button
                                        key={option.value}
                                        onClick={() => setTheme(option.value)}
                                        className={`
                                            relative p-4 rounded-xl border-2 text-left transition-all duration-200
                                            ${isSelected 
                                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                            }
                                        `}
                                    >
                                        {/* Selected indicator */}
                                        {isSelected && (
                                            <div className="absolute top-3 right-3 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                                                <Check className="w-3 h-3 text-white" />
                                            </div>
                                        )}

                                        {/* Icon */}
                                        <div className={`
                                            w-10 h-10 rounded-lg flex items-center justify-center mb-3
                                            ${isSelected 
                                                ? 'bg-primary-100 dark:bg-primary-800' 
                                                : 'bg-gray-100 dark:bg-gray-800'
                                            }
                                        `}>
                                            <Icon className={`w-5 h-5 ${isSelected ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                                        </div>

                                        {/* Label */}
                                        <h4 className={`font-medium ${isSelected ? 'text-primary-700 dark:text-primary-300' : 'text-theme-primary'}`}>
                                            {option.label}
                                        </h4>
                                        <p className="text-sm text-theme-secondary mt-1">
                                            {option.description}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </Card>

                {/* Color Palette */}
                <Card>
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-theme-primary mb-2">Color Palette</h3>
                        <p className="text-sm text-theme-secondary mb-6">
                            Inspired by Kabupaten Tasikmalaya brand colors.
                        </p>

                        <div className="space-y-4">
                            {colorPalette.map((color) => (
                                <div 
                                    key={color.name}
                                    className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
                                >
                                    <div 
                                        className="w-12 h-12 rounded-xl flex-shrink-0"
                                        style={{ backgroundColor: color.hex }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-medium text-theme-primary">{color.name}</h4>
                                            <span className="text-xs text-theme-muted">({color.label})</span>
                                        </div>
                                        <p className="text-sm text-theme-secondary mt-0.5">{color.description}</p>
                                    </div>
                                    <div className="text-right">
                                        <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono text-theme-primary">
                                            {color.hex}
                                        </code>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
