import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    ChevronLeft,
    ChevronRight,
    X,
    Database,
    Settings,
    FileText,
    Palette,
    User,
    Users,
    Shield,
    Key,
    LogOut,
    ChevronUp
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import NavItem, { type NavigationItem } from './NavItem';

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
    mobileOpen: boolean;
    onMobileClose: () => void;
}

interface PageProps {
    auth: {
        user: {
            name: string;
            email: string;
        };
    };
    [key: string]: unknown;
}

/**
 * Navigation Configuration
 */
const navigation: NavigationItem[] = [
    { 
        name: 'Dashboard', 
        href: '/dashboard', 
        icon: LayoutDashboard 
    },
    {
        name: 'Master Data',
        icon: Database,
        children: [
            { name: 'Categories', href: '/categories' },
            { name: 'Projects', href: '/projects' },
            { name: 'Tasks', href: '/tasks' },
        ]
    },
    {
        name: 'Reports',
        icon: FileText,
        children: [
            {
                name: 'Financial',
                children: [
                    { name: 'Budget Report', href: '/reports/budget' },
                    { name: 'Spending Report', href: '/reports/spending' },
                ]
            },
            {
                name: 'Progress',
                children: [
                    { name: 'Project Progress', href: '/reports/project-progress' },
                    { name: 'Task Progress', href: '/reports/task-progress' },
                ]
            },
        ]
    },
    {
        name: 'Settings',
        icon: Settings,
        children: [
            {
                name: 'User Management',
                icon: Users,
                children: [
                    { name: 'Users', href: '/settings/users', icon: User },
                    { name: 'Roles', href: '/settings/roles', icon: Shield },
                    { name: 'Permissions', href: '/settings/permissions', icon: Key },
                ]
            },
            { name: 'Appearance', href: '/settings/appearance', icon: Palette },
        ]
    },
];

/**
 * Sidebar Component
 * 
 * Modern sidebar with:
 * - Collapse toggle at top
 * - User profile dropdown at bottom (Invoo style)
 */
export default function Sidebar({ 
    collapsed, 
    onToggle, 
    mobileOpen, 
    onMobileClose 
}: SidebarProps) {
    const { auth } = usePage<PageProps>().props;
    const user = auth?.user;
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    // Get user initials
    const initials = user?.name
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'U';

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            {/* Mobile backdrop */}
            {mobileOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden animate-fade-in"
                    onClick={onMobileClose}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 bg-theme-primary
                transform transition-all duration-300 ease-in-out flex flex-col
                lg:translate-x-0
                ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                ${collapsed ? 'w-[72px]' : 'w-64'}
            `}>
                {/* Collapse Toggle at Top (desktop) */}
                <div className="hidden lg:flex items-center justify-end px-3 py-2">
                    <button
                        onClick={onToggle}
                        className="p-2 text-theme-muted hover:text-theme-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        {collapsed ? (
                            <ChevronRight className="w-4 h-4" />
                        ) : (
                            <ChevronLeft className="w-4 h-4" />
                        )}
                    </button>
                </div>

                {/* Logo Header */}
                <div className="flex items-center justify-between px-4 pb-4">
                    <Link 
                        href="/dashboard" 
                        className="flex items-center gap-3"
                    >
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-sm">KM</span>
                        </div>
                        {!collapsed && (
                            <div>
                                <span className="font-bold text-theme-primary">Kominfo</span>
                                <span className="block text-xs text-theme-muted">Admin Panel</span>
                            </div>
                        )}
                    </Link>
                    
                    {/* Mobile close button */}
                    <button 
                        className="lg:hidden p-2 text-theme-muted hover:text-theme-primary rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={onMobileClose}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 space-y-1 overflow-y-auto hide-scrollbar">
                    {navigation.map((item, index) => (
                        <NavItem 
                            key={`${item.name}-${index}`} 
                            item={item}
                            collapsed={collapsed}
                        />
                    ))}
                </nav>

                {/* User Profile Section with Dropdown */}
                <div className="p-3" ref={profileRef}>
                    <div className="relative">
                        {/* Profile Dropdown Menu */}
                        {profileOpen && !collapsed && (
                            <div className="absolute bottom-full left-0 right-0 mb-2 bg-theme-primary rounded-xl shadow-lg border border-theme overflow-hidden animate-slide-up">
                                <Link
                                    href="/profile"
                                    className="flex items-center gap-3 px-4 py-3 text-sm text-theme-secondary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    onClick={() => setProfileOpen(false)}
                                >
                                    <User className="w-4 h-4" />
                                    <span>Profile</span>
                                </Link>
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                    onClick={() => setProfileOpen(false)}
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Logout</span>
                                </Link>
                            </div>
                        )}

                        {/* User Avatar Card - Clickable */}
                        <button
                            onClick={() => !collapsed && setProfileOpen(!profileOpen)}
                            className={`
                                w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50
                                hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors
                                ${collapsed ? 'justify-center' : ''}
                            `}
                        >
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-semibold text-sm">{initials}</span>
                            </div>
                            {!collapsed && (
                                <>
                                    <div className="flex-1 min-w-0 text-left">
                                        <p className="text-sm font-medium text-theme-primary truncate">
                                            {user?.name}
                                        </p>
                                        <p className="text-xs text-theme-muted truncate">
                                            {user?.email}
                                        </p>
                                    </div>
                                    <ChevronUp className={`w-4 h-4 text-theme-muted transition-transform ${profileOpen ? '' : 'rotate-180'}`} />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
