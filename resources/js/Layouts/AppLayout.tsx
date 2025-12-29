import { usePage } from '@inertiajs/react';
import { PropsWithChildren, useState, useEffect } from 'react';
import { Sidebar } from '@/Components';
import { Menu } from 'lucide-react';

interface User {
    name: string;
    email: string;
}

interface PageProps {
    auth: {
        user: User;
    };
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

/**
 * AppLayout Component
 * 
 * Main application layout with:
 * - Collapsible sidebar with tree navigation
 * - No header bar - content goes full to top
 * - Flash message display
 * - Dark mode support
 */
export default function AppLayout({ children }: PropsWithChildren) {
    const { flash } = usePage<PageProps>().props;
    
    // Sidebar states
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('sidebar-collapsed') === 'true';
        }
        return false;
    });
    const [mobileOpen, setMobileOpen] = useState(false);

    // Persist sidebar state
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('sidebar-collapsed', String(sidebarCollapsed));
        }
    }, [sidebarCollapsed]);

    return (
        <div className="min-h-screen bg-theme-secondary transition-colors duration-300">
            {/* Sidebar */}
            <Sidebar
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                mobileOpen={mobileOpen}
                onMobileClose={() => setMobileOpen(false)}
            />

            {/* Main content - Full height, no header */}
            <div className={`min-h-screen transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-[72px]' : 'lg:pl-64'}`}>
                {/* Mobile menu button - fixed at top */}
                <div className="lg:hidden sticky top-0 z-30 p-4">
                    <button 
                        className="p-2 text-theme-muted hover:text-theme-primary rounded-lg bg-theme-primary shadow-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => setMobileOpen(true)}
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                </div>

                {/* Flash messages */}
                <div className="px-4 lg:px-6">
                    {flash?.success && (
                        <div className="mb-4 p-4 bg-secondary-50 dark:bg-secondary-900/30 border border-secondary-200 dark:border-secondary-800 text-secondary-700 dark:text-secondary-300 rounded-xl flex items-start gap-3 animate-slide-down">
                            <div className="w-5 h-5 bg-secondary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p>{flash.success}</p>
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl flex items-start gap-3 animate-slide-down">
                            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <p>{flash.error}</p>
                        </div>
                    )}
                </div>

                {/* Page content - starts from top */}
                <main className="p-4 lg:p-6 lg:pt-4">
                    {children}
                </main>
            </div>
        </div>
    );
}
