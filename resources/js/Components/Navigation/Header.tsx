import { Menu } from 'lucide-react';

interface HeaderProps {
    onMenuClick: () => void;
}

/**
 * Header Component
 * 
 * Minimal top header with:
 * - Mobile menu toggle button
 * - Clean design without borders (Invoo style)
 */
export default function Header({ onMenuClick }: HeaderProps) {
    return (
        <header className="sticky top-0 z-30 h-16 bg-theme-secondary transition-colors">
            <div className="h-full px-4 flex items-center">
                {/* Mobile menu button */}
                <button 
                    className="lg:hidden p-2 text-theme-muted hover:text-theme-primary rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    onClick={onMenuClick}
                >
                    <Menu className="w-5 h-5" />
                </button>

                {/* Spacer - can add breadcrumbs or search here later */}
                <div className="flex-1" />
            </div>
        </header>
    );
}
